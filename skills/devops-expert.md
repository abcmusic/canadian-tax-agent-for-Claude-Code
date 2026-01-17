---
name: devops-expert
description: DevOps practices and tooling expertise. Provides CI/CD pipelines, infrastructure as code, container orchestration, monitoring and logging, DevOps culture, and automation strategies. Use when implementing DevOps practices and tooling.
version: 1.0.0
tags: [devops, cicd, kubernetes, docker, infrastructure, automation]
category: domain-expert
author: Claude
last_updated: 2025-01-10
dependencies: []
---

# DevOps Expert Skill

## Overview

This skill provides comprehensive DevOps expertise covering modern practices, tooling, and methodologies for building scalable, reliable, and automated infrastructure and deployment pipelines.

## Core Competencies

### 1. CI/CD Pipelines

#### GitLab CI/CD

**Pipeline Structure:**
```yaml
# .gitlab-ci.yml
stages:
  - build
  - test
  - security
  - deploy
  - monitor

variables:
  DOCKER_DRIVER: overlay2
  DOCKER_TLS_CERTDIR: "/certs"
  ROLLOUT_RESOURCE_TYPE: deployment

# Build stage
build:
  stage: build
  image: docker:20.10.16
  services:
    - docker:20.10.16-dind
  script:
    - docker login -u $CI_REGISTRY_USER -p $CI_REGISTRY_PASSWORD $CI_REGISTRY
    - docker build --cache-from $CI_REGISTRY_IMAGE:latest -t $CI_REGISTRY_IMAGE:$CI_COMMIT_SHA .
    - docker tag $CI_REGISTRY_IMAGE:$CI_COMMIT_SHA $CI_REGISTRY_IMAGE:latest
    - docker push $CI_REGISTRY_IMAGE:$CI_COMMIT_SHA
    - docker push $CI_REGISTRY_IMAGE:latest
  only:
    - branches
    - tags

# Unit tests
unit-test:
  stage: test
  image: node:18-alpine
  script:
    - npm ci
    - npm run test:unit -- --coverage
    - npm run test:integration
  coverage: '/All files[^|]*\|[^|]*\s+([\d\.]+)/'
  artifacts:
    reports:
      coverage_report:
        coverage_format: cobertura
        path: coverage/cobertura-coverage.xml
    paths:
      - coverage/

# Security scanning
security-scan:
  stage: security
  image: aquasec/trivy:latest
  script:
    - trivy image --severity HIGH,CRITICAL --exit-code 1 $CI_REGISTRY_IMAGE:$CI_COMMIT_SHA
    - trivy fs --security-checks vuln,config --exit-code 0 .
  allow_failure: false

# Deploy to staging
deploy-staging:
  stage: deploy
  image: bitnami/kubectl:latest
  script:
    - kubectl config use-context staging
    - kubectl set image deployment/$CI_PROJECT_NAME $CI_PROJECT_NAME=$CI_REGISTRY_IMAGE:$CI_COMMIT_SHA
    - kubectl rollout status deployment/$CI_PROJECT_NAME
  environment:
    name: staging
    url: https://staging.example.com
    on_stop: stop-staging
  only:
    - develop

# Deploy to production
deploy-production:
  stage: deploy
  image: bitnami/kubectl:latest
  script:
    - kubectl config use-context production
    - kubectl set image deployment/$CI_PROJECT_NAME $CI_PROJECT_NAME=$CI_REGISTRY_IMAGE:$CI_COMMIT_SHA
    - kubectl rollout status deployment/$CI_PROJECT_NAME
  environment:
    name: production
    url: https://example.com
  only:
    - main
  when: manual

# Rollback production
rollback-production:
  stage: deploy
  image: bitnami/kubectl:latest
  script:
    - kubectl config use-context production
    - kubectl rollout undo deployment/$CI_PROJECT_NAME
    - kubectl rollout status deployment/$CI_PROJECT_NAME
  environment:
    name: production
    action: rollback
  only:
    - main
  when: manual

# Monitor deployment
monitor:
  stage: monitor
  image: curlimages/curl:latest
  script:
    - |
      response=$(curl -s -o /dev/null -w "%{http_code}" https://example.com/health)
      if [ $response -ne 200 ]; then
        echo "Health check failed with status $response"
        exit 1
      fi
    - echo "Application is healthy"
  only:
    - main
```

#### GitHub Actions

**Advanced Workflow:**
```yaml
# .github/workflows/ci-cd.yml
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]
  workflow_dispatch:
    inputs:
      environment:
        description: 'Deployment environment'
        required: true
        type: choice
        options:
          - staging
          - production

env:
  REGISTRY: ghcr.io
  IMAGE_NAME: ${{ github.repository }}

jobs:
  # Build and test
  build:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      packages: write
    outputs:
      image-tag: ${{ steps.meta.outputs.tags }}
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3

      - name: Log in to Container Registry
        uses: docker/login-action@v3
        with:
          registry: ${{ env.REGISTRY }}
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}

      - name: Extract metadata
        id: meta
        uses: docker/metadata-action@v5
        with:
          images: ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}
          tags: |
            type=ref,event=branch
            type=ref,event=pr
            type=semver,pattern={{version}}
            type=semver,pattern={{major}}.{{minor}}
            type=sha,prefix={{branch}}-

      - name: Build and push image
        uses: docker/build-push-action@v5
        with:
          context: .
          push: true
          tags: ${{ steps.meta.outputs.tags }}
          labels: ${{ steps.meta.outputs.labels }}
          cache-from: type=gha
          cache-to: type=gha,mode=max
          build-args: |
            BUILD_DATE=${{ github.event.head_commit.timestamp }}
            VCS_REF=${{ github.sha }}

  # Security scanning
  security:
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Run Trivy vulnerability scanner
        uses: aquasecurity/trivy-action@master
        with:
          image-ref: ${{ needs.build.outputs.image-tag }}
          format: 'sarif'
          output: 'trivy-results.sarif'
          severity: 'CRITICAL,HIGH'

      - name: Upload Trivy results to GitHub Security
        uses: github/codeql-action/upload-sarif@v2
        with:
          sarif_file: 'trivy-results.sarif'

      - name: SAST scan
        uses: github/super-linter@v5
        env:
          DEFAULT_BRANCH: main
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          VALIDATE_ALL_CODEBASE: false

  # Integration tests
  integration-tests:
    runs-on: ubuntu-latest
    needs: build
    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_PASSWORD: test
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
      redis:
        image: redis:7-alpine
        options: >-
          --health-cmd "redis-cli ping"
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Set up Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run integration tests
        run: npm run test:integration
        env:
          DATABASE_URL: postgresql://postgres:test@postgres:5432/test
          REDIS_URL: redis://redis:6379

      - name: Upload coverage reports
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage/coverage-final.json
          flags: integration

  # Deploy to staging
  deploy-staging:
    runs-on: ubuntu-latest
    needs: [build, security, integration-tests]
    if: github.ref == 'refs/heads/develop'
    environment:
      name: staging
      url: https://staging.example.com
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v4
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: us-east-1

      - name: Deploy to EKS
        run: |
          aws eks update-kubeconfig --name staging-cluster --region us-east-1
          kubectl set image deployment/app app=${{ needs.build.outputs.image-tag }}
          kubectl rollout status deployment/app

      - name: Run smoke tests
        run: |
          npm run test:smoke -- --env staging

  # Deploy to production
  deploy-production:
    runs-on: ubuntu-latest
    needs: [build, security, integration-tests]
    if: github.ref == 'refs/heads/main'
    environment:
      name: production
      url: https://example.com
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v4
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: us-east-1

      - name: Blue-Green Deployment
        run: |
          aws eks update-kubeconfig --name production-cluster --region us-east-1

          # Deploy green version
          kubectl apply -f k8s/green-deployment.yaml
          kubectl set image deployment/app-green app=${{ needs.build.outputs.image-tag }}
          kubectl rollout status deployment/app-green

          # Run smoke tests on green
          kubectl port-forward service/app-green 8080:80 &
          npm run test:smoke -- --env http://localhost:8080

          # Switch traffic to green
          kubectl patch service app -p '{"spec":{"selector":{"version":"green"}}}'

          # Monitor for 5 minutes
          sleep 300

          # If successful, remove blue deployment
          kubectl delete deployment app-blue

      - name: Create release
        uses: actions/create-release@v1
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        with:
          tag_name: v${{ github.run_number }}
          release_name: Release v${{ github.run_number }}
          draft: false
          prerelease: false
```

#### Jenkins Pipeline

**Declarative Pipeline:**
```groovy
// Jenkinsfile
pipeline {
    agent {
        kubernetes {
            yaml '''
apiVersion: v1
kind: Pod
spec:
  containers:
  - name: docker
    image: docker:20.10
    command: ['cat']
    tty: true
    volumeMounts:
    - name: docker-sock
      mountPath: /var/run/docker.sock
  - name: kubectl
    image: bitnami/kubectl:latest
    command: ['cat']
    tty: true
  - name: terraform
    image: hashicorp/terraform:latest
    command: ['cat']
    tty: true
  volumes:
  - name: docker-sock
    hostPath:
      path: /var/run/docker.sock
'''
        }
    }

    options {
        buildDiscarder(logRotator(numToKeepStr: '10'))
        disableConcurrentBuilds()
        timeout(time: 1, unit: 'HOURS')
        timestamps()
    }

    environment {
        DOCKER_REGISTRY = 'registry.example.com'
        IMAGE_NAME = "${DOCKER_REGISTRY}/${env.JOB_NAME}"
        IMAGE_TAG = "${env.BUILD_NUMBER}-${env.GIT_COMMIT.take(7)}"
        KUBECONFIG = credentials('kubeconfig')
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
                script {
                    env.GIT_COMMIT_MSG = sh(
                        script: 'git log -1 --pretty=%B',
                        returnStdout: true
                    ).trim()
                }
            }
        }

        stage('Build') {
            steps {
                container('docker') {
                    script {
                        docker.withRegistry("https://${DOCKER_REGISTRY}", 'docker-registry-credentials') {
                            def customImage = docker.build(
                                "${IMAGE_NAME}:${IMAGE_TAG}",
                                "--cache-from ${IMAGE_NAME}:latest ."
                            )
                            customImage.push()
                            customImage.push('latest')
                        }
                    }
                }
            }
        }

        stage('Test') {
            parallel {
                stage('Unit Tests') {
                    steps {
                        sh 'npm ci'
                        sh 'npm run test:unit -- --coverage'
                        publishHTML([
                            reportDir: 'coverage',
                            reportFiles: 'index.html',
                            reportName: 'Coverage Report'
                        ])
                    }
                }

                stage('Integration Tests') {
                    steps {
                        sh 'npm run test:integration'
                    }
                }

                stage('Security Scan') {
                    steps {
                        container('docker') {
                            sh """
                                trivy image --severity HIGH,CRITICAL \
                                    --exit-code 1 \
                                    ${IMAGE_NAME}:${IMAGE_TAG}
                            """
                        }
                    }
                }
            }
        }

        stage('Deploy to Staging') {
            when {
                branch 'develop'
            }
            steps {
                container('kubectl') {
                    sh """
                        kubectl config use-context staging
                        kubectl set image deployment/app \
                            app=${IMAGE_NAME}:${IMAGE_TAG}
                        kubectl rollout status deployment/app
                    """
                }
            }
        }

        stage('Deploy to Production') {
            when {
                branch 'main'
            }
            steps {
                input message: 'Deploy to production?', ok: 'Deploy'
                container('kubectl') {
                    sh """
                        kubectl config use-context production
                        kubectl set image deployment/app \
                            app=${IMAGE_NAME}:${IMAGE_TAG}
                        kubectl rollout status deployment/app
                    """
                }
            }
        }

        stage('Smoke Tests') {
            when {
                anyOf {
                    branch 'develop'
                    branch 'main'
                }
            }
            steps {
                sh 'npm run test:smoke'
            }
        }
    }

    post {
        success {
            slackSend(
                color: 'good',
                message: "Build ${env.BUILD_NUMBER} succeeded: ${env.GIT_COMMIT_MSG}"
            )
        }
        failure {
            slackSend(
                color: 'danger',
                message: "Build ${env.BUILD_NUMBER} failed: ${env.BUILD_URL}"
            )
        }
        always {
            cleanWs()
        }
    }
}
```

### 2. Infrastructure as Code

#### Terraform Configuration

**AWS Infrastructure:**
```hcl
# main.tf
terraform {
  required_version = ">= 1.5.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }

  backend "s3" {
    bucket         = "terraform-state-prod"
    key            = "infrastructure/terraform.tfstate"
    region         = "us-east-1"
    encrypt        = true
    dynamodb_table = "terraform-locks"
  }
}

provider "aws" {
  region = var.aws_region

  default_tags {
    tags = {
      Environment = var.environment
      Project     = var.project_name
      ManagedBy   = "Terraform"
      CostCenter  = var.cost_center
    }
  }
}

# VPC Module
module "vpc" {
  source  = "terraform-aws-modules/vpc/aws"
  version = "~> 5.0"

  name = "${var.project_name}-vpc"
  cidr = var.vpc_cidr

  azs             = var.availability_zones
  private_subnets = var.private_subnet_cidrs
  public_subnets  = var.public_subnet_cidrs

  enable_nat_gateway = true
  enable_vpn_gateway = false
  single_nat_gateway = var.environment != "production"

  enable_dns_hostnames = true
  enable_dns_support   = true

  # VPC Flow Logs
  enable_flow_log                      = true
  create_flow_log_cloudwatch_iam_role  = true
  create_flow_log_cloudwatch_log_group = true

  tags = {
    Terraform = "true"
  }
}

# EKS Cluster
module "eks" {
  source  = "terraform-aws-modules/eks/aws"
  version = "~> 19.0"

  cluster_name    = "${var.project_name}-cluster"
  cluster_version = "1.28"

  vpc_id     = module.vpc.vpc_id
  subnet_ids = module.vpc.private_subnets

  cluster_endpoint_public_access = true
  cluster_endpoint_private_access = true

  cluster_addons = {
    coredns = {
      most_recent = true
    }
    kube-proxy = {
      most_recent = true
    }
    vpc-cni = {
      most_recent = true
    }
    aws-ebs-csi-driver = {
      most_recent = true
    }
  }

  # Managed Node Groups
  eks_managed_node_groups = {
    general = {
      min_size     = 2
      max_size     = 10
      desired_size = 3

      instance_types = ["t3.large"]
      capacity_type  = "ON_DEMAND"

      labels = {
        role = "general"
      }

      taints = []
    }

    spot = {
      min_size     = 1
      max_size     = 5
      desired_size = 2

      instance_types = ["t3.large", "t3a.large"]
      capacity_type  = "SPOT"

      labels = {
        role = "spot"
      }

      taints = [{
        key    = "spot"
        value  = "true"
        effect = "NoSchedule"
      }]
    }
  }

  # Cluster security group rules
  cluster_security_group_additional_rules = {
    ingress_nodes_ephemeral_ports_tcp = {
      description                = "Nodes on ephemeral ports"
      protocol                   = "tcp"
      from_port                  = 1025
      to_port                    = 65535
      type                       = "ingress"
      source_node_security_group = true
    }
  }

  # aws-auth ConfigMap
  manage_aws_auth_configmap = true

  aws_auth_roles = [
    {
      rolearn  = "arn:aws:iam::${data.aws_caller_identity.current.account_id}:role/DevOpsRole"
      username = "devops"
      groups   = ["system:masters"]
    },
  ]
}

# RDS Database
module "rds" {
  source  = "terraform-aws-modules/rds/aws"
  version = "~> 6.0"

  identifier = "${var.project_name}-db"

  engine               = "postgres"
  engine_version       = "15.4"
  family               = "postgres15"
  major_engine_version = "15"
  instance_class       = var.db_instance_class

  allocated_storage     = 100
  max_allocated_storage = 500
  storage_encrypted     = true

  db_name  = var.db_name
  username = var.db_username
  port     = 5432

  multi_az               = var.environment == "production"
  db_subnet_group_name   = module.vpc.database_subnet_group_name
  vpc_security_group_ids = [module.security_group_rds.security_group_id]

  maintenance_window      = "Mon:00:00-Mon:03:00"
  backup_window           = "03:00-06:00"
  backup_retention_period = var.environment == "production" ? 30 : 7

  enabled_cloudwatch_logs_exports = ["postgresql", "upgrade"]
  create_cloudwatch_log_group     = true

  deletion_protection = var.environment == "production"
  skip_final_snapshot = var.environment != "production"
  final_snapshot_identifier_prefix = "${var.project_name}-final"

  performance_insights_enabled    = true
  performance_insights_retention_period = 7
  create_monitoring_role          = true
  monitoring_interval             = 60

  parameters = [
    {
      name  = "autovacuum"
      value = "1"
    },
    {
      name  = "client_encoding"
      value = "utf8"
    }
  ]
}

# ElastiCache Redis
module "elasticache" {
  source  = "terraform-aws-modules/elasticache/aws"
  version = "~> 1.0"

  replication_group_id       = "${var.project_name}-redis"
  replication_group_description = "Redis cluster for ${var.project_name}"

  engine_version = "7.0"
  node_type      = var.redis_node_type

  num_cache_clusters         = var.environment == "production" ? 3 : 1
  automatic_failover_enabled = var.environment == "production"

  subnet_ids         = module.vpc.elasticache_subnet_ids
  security_group_ids = [module.security_group_redis.security_group_id]

  at_rest_encryption_enabled = true
  transit_encryption_enabled = true
  auth_token                 = var.redis_auth_token

  snapshot_retention_limit = var.environment == "production" ? 7 : 1
  snapshot_window          = "03:00-05:00"
  maintenance_window       = "sun:05:00-sun:07:00"

  parameter_group_family = "redis7"
  parameters = [
    {
      name  = "maxmemory-policy"
      value = "allkeys-lru"
    }
  ]
}

# S3 Buckets
module "s3_assets" {
  source  = "terraform-aws-modules/s3-bucket/aws"
  version = "~> 3.0"

  bucket = "${var.project_name}-assets-${var.environment}"

  versioning = {
    enabled = true
  }

  server_side_encryption_configuration = {
    rule = {
      apply_server_side_encryption_by_default = {
        sse_algorithm = "AES256"
      }
    }
  }

  lifecycle_rule = [
    {
      id      = "archive-old-versions"
      enabled = true

      noncurrent_version_transition = [
        {
          days          = 30
          storage_class = "STANDARD_IA"
        },
        {
          days          = 90
          storage_class = "GLACIER"
        }
      ]

      noncurrent_version_expiration = {
        days = 365
      }
    }
  ]

  cors_rule = [
    {
      allowed_methods = ["GET", "HEAD"]
      allowed_origins = ["https://${var.domain_name}"]
      allowed_headers = ["*"]
      expose_headers  = ["ETag"]
      max_age_seconds = 3000
    }
  ]
}

# CloudFront Distribution
module "cloudfront" {
  source  = "terraform-aws-modules/cloudfront/aws"
  version = "~> 3.0"

  aliases = ["cdn.${var.domain_name}"]

  comment             = "${var.project_name} CDN"
  enabled             = true
  is_ipv6_enabled     = true
  price_class         = "PriceClass_All"
  retain_on_delete    = false
  wait_for_deployment = true

  origin = {
    s3 = {
      domain_name = module.s3_assets.s3_bucket_bucket_regional_domain_name
      origin_access_control = "s3"
    }
  }

  default_cache_behavior = {
    target_origin_id       = "s3"
    viewer_protocol_policy = "redirect-to-https"
    allowed_methods        = ["GET", "HEAD", "OPTIONS"]
    cached_methods         = ["GET", "HEAD"]
    compress               = true

    cache_policy_id          = data.aws_cloudfront_cache_policy.managed_caching_optimized.id
    origin_request_policy_id = data.aws_cloudfront_origin_request_policy.managed_cors_s3.id
  }

  viewer_certificate = {
    acm_certificate_arn = module.acm.acm_certificate_arn
    ssl_support_method  = "sni-only"
  }

  geo_restriction = {
    restriction_type = "none"
  }
}

# Outputs
output "eks_cluster_endpoint" {
  description = "Endpoint for EKS control plane"
  value       = module.eks.cluster_endpoint
}

output "rds_endpoint" {
  description = "RDS instance endpoint"
  value       = module.rds.db_instance_endpoint
  sensitive   = true
}

output "redis_endpoint" {
  description = "Redis cluster endpoint"
  value       = module.elasticache.configuration_endpoint_address
  sensitive   = true
}
```

**Variables:**
```hcl
# variables.tf
variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "us-east-1"
}

variable "environment" {
  description = "Environment name"
  type        = string
  validation {
    condition     = contains(["development", "staging", "production"], var.environment)
    error_message = "Environment must be development, staging, or production."
  }
}

variable "project_name" {
  description = "Project name"
  type        = string
}

variable "vpc_cidr" {
  description = "VPC CIDR block"
  type        = string
  default     = "10.0.0.0/16"
}

variable "availability_zones" {
  description = "List of availability zones"
  type        = list(string)
  default     = ["us-east-1a", "us-east-1b", "us-east-1c"]
}

variable "private_subnet_cidrs" {
  description = "Private subnet CIDR blocks"
  type        = list(string)
  default     = ["10.0.1.0/24", "10.0.2.0/24", "10.0.3.0/24"]
}

variable "public_subnet_cidrs" {
  description = "Public subnet CIDR blocks"
  type        = list(string)
  default     = ["10.0.101.0/24", "10.0.102.0/24", "10.0.103.0/24"]
}

variable "db_instance_class" {
  description = "RDS instance class"
  type        = string
  default     = "db.t3.medium"
}

variable "redis_node_type" {
  description = "ElastiCache node type"
  type        = string
  default     = "cache.t3.medium"
}
```

#### Ansible Playbooks

**Application Deployment:**
```yaml
# playbooks/deploy-application.yml
---
- name: Deploy Application
  hosts: application_servers
  become: true
  vars:
    app_name: myapp
    app_version: "{{ lookup('env', 'APP_VERSION') | default('latest', true) }}"
    app_user: appuser
    app_dir: /opt/{{ app_name }}
    deploy_dir: "{{ app_dir }}/releases/{{ app_version }}"
    current_dir: "{{ app_dir }}/current"
    shared_dir: "{{ app_dir }}/shared"

  pre_tasks:
    - name: Verify prerequisites
      assert:
        that:
          - app_version is defined
          - app_version != ""
        fail_msg: "APP_VERSION must be set"

    - name: Create application directories
      file:
        path: "{{ item }}"
        state: directory
        owner: "{{ app_user }}"
        group: "{{ app_user }}"
        mode: '0755'
      loop:
        - "{{ app_dir }}"
        - "{{ app_dir }}/releases"
        - "{{ shared_dir }}"
        - "{{ shared_dir }}/config"
        - "{{ shared_dir }}/logs"
        - "{{ shared_dir }}/uploads"

  tasks:
    - name: Download application artifact
      get_url:
        url: "https://artifacts.example.com/{{ app_name }}/{{ app_version }}.tar.gz"
        dest: "/tmp/{{ app_name }}-{{ app_version }}.tar.gz"
        checksum: "sha256:{{ lookup('url', 'https://artifacts.example.com/{{ app_name }}/{{ app_version }}.sha256') }}"

    - name: Extract application
      unarchive:
        src: "/tmp/{{ app_name }}-{{ app_version }}.tar.gz"
        dest: "{{ deploy_dir }}"
        remote_src: true
        owner: "{{ app_user }}"
        group: "{{ app_user }}"

    - name: Link shared directories
      file:
        src: "{{ shared_dir }}/{{ item }}"
        dest: "{{ deploy_dir }}/{{ item }}"
        state: link
        owner: "{{ app_user }}"
        group: "{{ app_user }}"
      loop:
        - config
        - logs
        - uploads

    - name: Install dependencies
      command: npm ci --production
      args:
        chdir: "{{ deploy_dir }}"
      environment:
        NODE_ENV: production

    - name: Run database migrations
      command: npm run migrate
      args:
        chdir: "{{ deploy_dir }}"
      environment:
        NODE_ENV: production
      run_once: true

    - name: Warm up application cache
      command: npm run cache:warm
      args:
        chdir: "{{ deploy_dir }}"
      environment:
        NODE_ENV: production

    - name: Health check before deployment
      uri:
        url: "http://localhost:3000/health"
        status_code: 200
      register: health_check
      retries: 3
      delay: 5

    - name: Update current symlink
      file:
        src: "{{ deploy_dir }}"
        dest: "{{ current_dir }}"
        state: link
        owner: "{{ app_user }}"
        group: "{{ app_user }}"

    - name: Reload application service
      systemd:
        name: "{{ app_name }}"
        state: reloaded
        daemon_reload: true

    - name: Wait for application to be ready
      uri:
        url: "http://localhost:3000/health"
        status_code: 200
      register: health_check
      retries: 10
      delay: 3
      until: health_check.status == 200

    - name: Run smoke tests
      command: npm run test:smoke
      args:
        chdir: "{{ current_dir }}"
      environment:
        NODE_ENV: production

  post_tasks:
    - name: Clean up old releases
      shell: |
        cd {{ app_dir }}/releases
        ls -t | tail -n +6 | xargs -r rm -rf
      args:
        executable: /bin/bash

    - name: Notify deployment success
      uri:
        url: "https://hooks.slack.com/services/YOUR/WEBHOOK/URL"
        method: POST
        body_format: json
        body:
          text: "Deployment of {{ app_name }} version {{ app_version }} completed successfully"
        status_code: 200

  handlers:
    - name: Restart application
      systemd:
        name: "{{ app_name }}"
        state: restarted
```

### 3. Container Orchestration

#### Kubernetes Manifests

**Complete Application Stack:**
```yaml
# k8s/namespace.yaml
apiVersion: v1
kind: Namespace
metadata:
  name: myapp
  labels:
    name: myapp
    environment: production

---
# k8s/configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: app-config
  namespace: myapp
data:
  NODE_ENV: "production"
  LOG_LEVEL: "info"
  PORT: "3000"
  DATABASE_POOL_MIN: "2"
  DATABASE_POOL_MAX: "10"
  REDIS_DB: "0"

---
# k8s/secret.yaml
apiVersion: v1
kind: Secret
metadata:
  name: app-secrets
  namespace: myapp
type: Opaque
stringData:
  database-url: postgresql://user:password@postgres:5432/myapp
  redis-url: redis://:password@redis:6379
  jwt-secret: your-jwt-secret-here
  api-key: your-api-key-here

---
# k8s/deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: app
  namespace: myapp
  labels:
    app: myapp
    version: v1
spec:
  replicas: 3
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1
      maxUnavailable: 0
  selector:
    matchLabels:
      app: myapp
  template:
    metadata:
      labels:
        app: myapp
        version: v1
      annotations:
        prometheus.io/scrape: "true"
        prometheus.io/port: "3000"
        prometheus.io/path: "/metrics"
    spec:
      serviceAccountName: app
      securityContext:
        runAsNonRoot: true
        runAsUser: 1000
        fsGroup: 1000

      initContainers:
        - name: wait-for-db
          image: busybox:1.35
          command: ['sh', '-c']
          args:
            - |
              until nc -z postgres 5432; do
                echo "Waiting for database..."
                sleep 2
              done
              echo "Database is ready"

      containers:
        - name: app
          image: registry.example.com/myapp:latest
          imagePullPolicy: Always
          ports:
            - name: http
              containerPort: 3000
              protocol: TCP

          envFrom:
            - configMapRef:
                name: app-config
            - secretRef:
                name: app-secrets

          livenessProbe:
            httpGet:
              path: /health
              port: http
            initialDelaySeconds: 30
            periodSeconds: 10
            timeoutSeconds: 5
            failureThreshold: 3

          readinessProbe:
            httpGet:
              path: /ready
              port: http
            initialDelaySeconds: 10
            periodSeconds: 5
            timeoutSeconds: 3
            failureThreshold: 3

          startupProbe:
            httpGet:
              path: /health
              port: http
            initialDelaySeconds: 0
            periodSeconds: 10
            timeoutSeconds: 3
            failureThreshold: 30

          resources:
            requests:
              memory: "256Mi"
              cpu: "250m"
            limits:
              memory: "512Mi"
              cpu: "500m"

          volumeMounts:
            - name: tmp
              mountPath: /tmp
            - name: cache
              mountPath: /app/.cache

          securityContext:
            allowPrivilegeEscalation: false
            readOnlyRootFilesystem: true
            capabilities:
              drop:
                - ALL

      volumes:
        - name: tmp
          emptyDir: {}
        - name: cache
          emptyDir: {}

      affinity:
        podAntiAffinity:
          preferredDuringSchedulingIgnoredDuringExecution:
            - weight: 100
              podAffinityTerm:
                labelSelector:
                  matchExpressions:
                    - key: app
                      operator: In
                      values:
                        - myapp
                topologyKey: kubernetes.io/hostname

---
# k8s/service.yaml
apiVersion: v1
kind: Service
metadata:
  name: app
  namespace: myapp
  labels:
    app: myapp
spec:
  type: ClusterIP
  ports:
    - port: 80
      targetPort: http
      protocol: TCP
      name: http
  selector:
    app: myapp

---
# k8s/ingress.yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: app
  namespace: myapp
  annotations:
    kubernetes.io/ingress.class: nginx
    cert-manager.io/cluster-issuer: letsencrypt-prod
    nginx.ingress.kubernetes.io/rate-limit: "100"
    nginx.ingress.kubernetes.io/ssl-redirect: "true"
    nginx.ingress.kubernetes.io/force-ssl-redirect: "true"
spec:
  tls:
    - hosts:
        - example.com
        - www.example.com
      secretName: app-tls
  rules:
    - host: example.com
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: app
                port:
                  number: 80

---
# k8s/hpa.yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: app
  namespace: myapp
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: app
  minReplicas: 3
  maxReplicas: 10
  metrics:
    - type: Resource
      resource:
        name: cpu
        target:
          type: Utilization
          averageUtilization: 70
    - type: Resource
      resource:
        name: memory
        target:
          type: Utilization
          averageUtilization: 80
  behavior:
    scaleDown:
      stabilizationWindowSeconds: 300
      policies:
        - type: Percent
          value: 50
          periodSeconds: 60
    scaleUp:
      stabilizationWindowSeconds: 0
      policies:
        - type: Percent
          value: 100
          periodSeconds: 15
        - type: Pods
          value: 2
          periodSeconds: 15
      selectPolicy: Max

---
# k8s/pdb.yaml
apiVersion: policy/v1
kind: PodDisruptionBudget
metadata:
  name: app
  namespace: myapp
spec:
  minAvailable: 2
  selector:
    matchLabels:
      app: myapp

---
# k8s/networkpolicy.yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: app
  namespace: myapp
spec:
  podSelector:
    matchLabels:
      app: myapp
  policyTypes:
    - Ingress
    - Egress
  ingress:
    - from:
        - namespaceSelector:
            matchLabels:
              name: ingress-nginx
      ports:
        - protocol: TCP
          port: 3000
  egress:
    - to:
        - podSelector:
            matchLabels:
              app: postgres
      ports:
        - protocol: TCP
          port: 5432
    - to:
        - podSelector:
            matchLabels:
              app: redis
      ports:
        - protocol: TCP
          port: 6379
    - to:
        - namespaceSelector: {}
      ports:
        - protocol: TCP
          port: 53
        - protocol: UDP
          port: 53
```

### 4. Monitoring & Logging

#### Prometheus Configuration

**Monitoring Stack:**
```yaml
# prometheus/prometheus.yml
global:
  scrape_interval: 15s
  evaluation_interval: 15s
  external_labels:
    cluster: 'production'
    environment: 'production'

alerting:
  alertmanagers:
    - static_configs:
        - targets:
            - alertmanager:9093

rule_files:
  - '/etc/prometheus/rules/*.yml'

scrape_configs:
  # Kubernetes API server
  - job_name: 'kubernetes-apiservers'
    kubernetes_sd_configs:
      - role: endpoints
    scheme: https
    tls_config:
      ca_file: /var/run/secrets/kubernetes.io/serviceaccount/ca.crt
    bearer_token_file: /var/run/secrets/kubernetes.io/serviceaccount/token
    relabel_configs:
      - source_labels: [__meta_kubernetes_namespace, __meta_kubernetes_service_name, __meta_kubernetes_endpoint_port_name]
        action: keep
        regex: default;kubernetes;https

  # Kubernetes nodes
  - job_name: 'kubernetes-nodes'
    kubernetes_sd_configs:
      - role: node
    scheme: https
    tls_config:
      ca_file: /var/run/secrets/kubernetes.io/serviceaccount/ca.crt
    bearer_token_file: /var/run/secrets/kubernetes.io/serviceaccount/token
    relabel_configs:
      - action: labelmap
        regex: __meta_kubernetes_node_label_(.+)

  # Kubernetes pods
  - job_name: 'kubernetes-pods'
    kubernetes_sd_configs:
      - role: pod
    relabel_configs:
      - source_labels: [__meta_kubernetes_pod_annotation_prometheus_io_scrape]
        action: keep
        regex: true
      - source_labels: [__meta_kubernetes_pod_annotation_prometheus_io_path]
        action: replace
        target_label: __metrics_path__
        regex: (.+)
      - source_labels: [__address__, __meta_kubernetes_pod_annotation_prometheus_io_port]
        action: replace
        regex: ([^:]+)(?::\d+)?;(\d+)
        replacement: $1:$2
        target_label: __address__
      - action: labelmap
        regex: __meta_kubernetes_pod_label_(.+)
      - source_labels: [__meta_kubernetes_namespace]
        action: replace
        target_label: kubernetes_namespace
      - source_labels: [__meta_kubernetes_pod_name]
        action: replace
        target_label: kubernetes_pod_name

  # Application metrics
  - job_name: 'application'
    static_configs:
      - targets:
          - 'app:3000'
    metric_relabel_configs:
      - source_labels: [__name__]
        regex: 'go_.*'
        action: drop

# prometheus/rules/alerts.yml
groups:
  - name: application
    interval: 30s
    rules:
      - alert: HighErrorRate
        expr: |
          rate(http_requests_total{status=~"5.."}[5m]) /
          rate(http_requests_total[5m]) > 0.05
        for: 5m
        labels:
          severity: critical
        annotations:
          summary: "High error rate detected"
          description: "Error rate is {{ $value | humanizePercentage }} for {{ $labels.instance }}"

      - alert: HighLatency
        expr: |
          histogram_quantile(0.95,
            rate(http_request_duration_seconds_bucket[5m])
          ) > 1
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "High latency detected"
          description: "95th percentile latency is {{ $value }}s for {{ $labels.instance }}"

      - alert: PodCrashLooping
        expr: |
          rate(kube_pod_container_status_restarts_total[15m]) > 0
        for: 5m
        labels:
          severity: critical
        annotations:
          summary: "Pod is crash looping"
          description: "Pod {{ $labels.namespace }}/{{ $labels.pod }} is restarting"

      - alert: PodNotReady
        expr: |
          sum by (namespace, pod) (
            kube_pod_status_phase{phase=~"Pending|Unknown|Failed"}
          ) > 0
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "Pod not ready"
          description: "Pod {{ $labels.namespace }}/{{ $labels.pod }} is in {{ $labels.phase }} state"

      - alert: HighMemoryUsage
        expr: |
          container_memory_usage_bytes{pod=~"app-.*"} /
          container_spec_memory_limit_bytes{pod=~"app-.*"} > 0.9
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "High memory usage"
          description: "Memory usage is {{ $value | humanizePercentage }} for {{ $labels.pod }}"
```

#### ELK Stack Configuration

**Logging Pipeline:**
```yaml
# filebeat/filebeat.yml
filebeat.inputs:
  - type: container
    paths:
      - '/var/lib/docker/containers/*/*.log'
    processors:
      - add_kubernetes_metadata:
          host: ${NODE_NAME}
          matchers:
            - logs_path:
                logs_path: "/var/lib/docker/containers/"

      - decode_json_fields:
          fields: ["message"]
          target: "json"
          overwrite_keys: true

      - drop_fields:
          fields: ["host", "agent", "ecs", "input", "log"]

processors:
  - add_cloud_metadata: ~
  - add_docker_metadata: ~
  - add_host_metadata: ~

output.logstash:
  hosts: ["logstash:5044"]
  ssl.certificate_authorities: ["/etc/pki/ca.crt"]

# logstash/pipeline.conf
input {
  beats {
    port => 5044
    ssl => true
    ssl_certificate => "/etc/pki/logstash.crt"
    ssl_key => "/etc/pki/logstash.key"
    ssl_certificate_authorities => ["/etc/pki/ca.crt"]
  }
}

filter {
  # Parse application logs
  if [kubernetes][container][name] == "app" {
    json {
      source => "message"
      target => "parsed"
    }

    mutate {
      add_field => {
        "log_level" => "%{[parsed][level]}"
        "log_message" => "%{[parsed][message]}"
        "request_id" => "%{[parsed][requestId]}"
      }
    }

    # Extract HTTP metrics
    if [parsed][req] {
      mutate {
        add_field => {
          "http_method" => "%{[parsed][req][method]}"
          "http_url" => "%{[parsed][req][url]}"
          "http_status" => "%{[parsed][res][statusCode]}"
          "response_time" => "%{[parsed][responseTime]}"
        }
      }
    }

    # Extract user context
    if [parsed][user] {
      mutate {
        add_field => {
          "user_id" => "%{[parsed][user][id]}"
          "user_email" => "%{[parsed][user][email]}"
        }
      }
    }
  }

  # Add GeoIP data
  if [parsed][req][ip] {
    geoip {
      source => "[parsed][req][ip]"
      target => "geoip"
    }
  }

  # Clean up
  mutate {
    remove_field => ["parsed", "message"]
  }
}

output {
  elasticsearch {
    hosts => ["elasticsearch:9200"]
    index => "logs-%{[kubernetes][namespace]}-%{+YYYY.MM.dd}"
    ssl => true
    ssl_certificate_verification => true
    cacert => "/etc/pki/ca.crt"
    user => "logstash"
    password => "${LOGSTASH_PASSWORD}"
  }
}
```

### 5. DevOps Culture & Best Practices

#### GitOps Workflow

**ArgoCD Application:**
```yaml
# argocd/application.yaml
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: myapp
  namespace: argocd
spec:
  project: default

  source:
    repoURL: https://github.com/example/myapp-manifests
    targetRevision: HEAD
    path: k8s/overlays/production

    kustomize:
      namePrefix: prod-
      nameSuffix: -v1
      commonLabels:
        environment: production
      commonAnnotations:
        managed-by: argocd

  destination:
    server: https://kubernetes.default.svc
    namespace: myapp

  syncPolicy:
    automated:
      prune: true
      selfHeal: true
      allowEmpty: false

    syncOptions:
      - CreateNamespace=true
      - PrunePropagationPolicy=foreground
      - PruneLast=true

    retry:
      limit: 5
      backoff:
        duration: 5s
        factor: 2
        maxDuration: 3m

  revisionHistoryLimit: 10

  ignoreDifferences:
    - group: apps
      kind: Deployment
      jsonPointers:
        - /spec/replicas
```

#### Deployment Strategies

**Blue-Green Deployment:**
```yaml
# k8s/blue-green/deployment-blue.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: app-blue
  labels:
    app: myapp
    version: blue
spec:
  replicas: 3
  selector:
    matchLabels:
      app: myapp
      version: blue
  template:
    metadata:
      labels:
        app: myapp
        version: blue
    spec:
      containers:
        - name: app
          image: registry.example.com/myapp:blue
          ports:
            - containerPort: 3000

---
# k8s/blue-green/deployment-green.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: app-green
  labels:
    app: myapp
    version: green
spec:
  replicas: 3
  selector:
    matchLabels:
      app: myapp
      version: green
  template:
    metadata:
      labels:
        app: myapp
        version: green
    spec:
      containers:
        - name: app
          image: registry.example.com/myapp:green
          ports:
            - containerPort: 3000

---
# k8s/blue-green/service.yaml
apiVersion: v1
kind: Service
metadata:
  name: app
spec:
  selector:
    app: myapp
    version: blue  # Switch to 'green' for deployment
  ports:
    - port: 80
      targetPort: 3000
```

**Canary Deployment (Istio):**
```yaml
# istio/virtual-service.yaml
apiVersion: networking.istio.io/v1beta1
kind: VirtualService
metadata:
  name: app
spec:
  hosts:
    - app.example.com
  http:
    - match:
        - headers:
            canary:
              exact: "true"
      route:
        - destination:
            host: app
            subset: canary
    - route:
        - destination:
            host: app
            subset: stable
          weight: 90
        - destination:
            host: app
            subset: canary
          weight: 10

---
# istio/destination-rule.yaml
apiVersion: networking.istio.io/v1beta1
kind: DestinationRule
metadata:
  name: app
spec:
  host: app
  subsets:
    - name: stable
      labels:
        version: v1
    - name: canary
      labels:
        version: v2
```

#### Disaster Recovery

**Backup Strategy:**
```bash
#!/bin/bash
# scripts/backup-production.sh

set -euo pipefail

BACKUP_DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups/${BACKUP_DATE}"
S3_BUCKET="s3://production-backups"

echo "Starting production backup: ${BACKUP_DATE}"

# Create backup directory
mkdir -p "${BACKUP_DIR}"

# Backup Kubernetes resources
echo "Backing up Kubernetes resources..."
kubectl get all --all-namespaces -o yaml > "${BACKUP_DIR}/k8s-resources.yaml"
kubectl get configmaps --all-namespaces -o yaml > "${BACKUP_DIR}/k8s-configmaps.yaml"
kubectl get secrets --all-namespaces -o yaml > "${BACKUP_DIR}/k8s-secrets.yaml"

# Backup etcd (if direct access)
echo "Backing up etcd..."
ETCDCTL_API=3 etcdctl snapshot save "${BACKUP_DIR}/etcd-snapshot.db" \
  --endpoints=https://127.0.0.1:2379 \
  --cacert=/etc/kubernetes/pki/etcd/ca.crt \
  --cert=/etc/kubernetes/pki/etcd/server.crt \
  --key=/etc/kubernetes/pki/etcd/server.key

# Backup databases
echo "Backing up databases..."
pg_dump -h postgres.example.com -U admin myapp | gzip > "${BACKUP_DIR}/database.sql.gz"

# Backup Redis
echo "Backing up Redis..."
redis-cli --rdb "${BACKUP_DIR}/redis-dump.rdb"

# Upload to S3
echo "Uploading to S3..."
aws s3 sync "${BACKUP_DIR}" "${S3_BUCKET}/${BACKUP_DATE}" \
  --storage-class STANDARD_IA \
  --sse AES256

# Cleanup old backups (keep last 30 days)
echo "Cleaning up old backups..."
find /backups -type d -mtime +30 -exec rm -rf {} +

echo "Backup completed: ${BACKUP_DATE}"
```

## Practical Examples

### Example 1: Complete CI/CD Pipeline with GitOps

**Scenario:** Deploy a microservices application with automated testing, security scanning, and GitOps deployment.

**Solution:**
```yaml
# .github/workflows/microservices-pipeline.yml
name: Microservices CI/CD

on:
  push:
    branches: [main, develop]

jobs:
  build-and-test:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        service: [api, frontend, worker]
    steps:
      - uses: actions/checkout@v4

      - name: Build ${{ matrix.service }}
        run: |
          cd services/${{ matrix.service }}
          docker build -t ${{ matrix.service }}:${{ github.sha }} .

      - name: Test ${{ matrix.service }}
        run: |
          cd services/${{ matrix.service }}
          npm test

      - name: Security scan
        uses: aquasecurity/trivy-action@master
        with:
          image-ref: ${{ matrix.service }}:${{ github.sha }}
          severity: 'CRITICAL,HIGH'

  deploy:
    needs: build-and-test
    runs-on: ubuntu-latest
    steps:
      - name: Update manifests repository
        run: |
          git clone https://${{ secrets.GIT_TOKEN }}@github.com/org/manifests.git
          cd manifests

          # Update image tags
          kustomize edit set image \
            api=registry.example.com/api:${{ github.sha }} \
            frontend=registry.example.com/frontend:${{ github.sha }} \
            worker=registry.example.com/worker:${{ github.sha }}

          git commit -am "Update to ${{ github.sha }}"
          git push

      - name: Wait for ArgoCD sync
        run: |
          argocd app wait myapp --timeout 600
```

### Example 2: Multi-Cloud Infrastructure

**Scenario:** Deploy infrastructure across AWS and GCP with Terraform.

**Solution:**
```hcl
# terraform/main.tf
terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
    google = {
      source  = "hashicorp/google"
      version = "~> 5.0"
    }
  }
}

# AWS Resources
provider "aws" {
  region = "us-east-1"
}

module "aws_cluster" {
  source = "./modules/aws-eks"

  cluster_name = "production-aws"
  vpc_cidr     = "10.0.0.0/16"
}

# GCP Resources
provider "google" {
  project = "my-project"
  region  = "us-central1"
}

module "gcp_cluster" {
  source = "./modules/gcp-gke"

  cluster_name = "production-gcp"
  network_cidr = "10.1.0.0/16"
}

# Multi-cloud load balancer
resource "aws_route53_record" "global_lb" {
  zone_id = var.route53_zone_id
  name    = "api.example.com"
  type    = "A"

  weighted_routing_policy {
    weight = 50
  }

  set_identifier = "aws-cluster"
  alias {
    name                   = module.aws_cluster.load_balancer_dns
    zone_id                = module.aws_cluster.load_balancer_zone_id
    evaluate_target_health = true
  }
}

resource "aws_route53_record" "global_lb_gcp" {
  zone_id = var.route53_zone_id
  name    = "api.example.com"
  type    = "A"

  weighted_routing_policy {
    weight = 50
  }

  set_identifier = "gcp-cluster"
  alias {
    name                   = module.gcp_cluster.load_balancer_ip
    zone_id                = var.route53_zone_id
    evaluate_target_health = true
  }
}
```

### Example 3: Observability Stack

**Scenario:** Complete monitoring, logging, and tracing setup.

**Solution:**
```yaml
# k8s/observability/kustomization.yaml
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization

resources:
  # Prometheus
  - prometheus/namespace.yaml
  - prometheus/prometheus.yaml
  - prometheus/alertmanager.yaml
  - prometheus/grafana.yaml

  # Loki (Logging)
  - loki/loki.yaml
  - loki/promtail.yaml

  # Tempo (Tracing)
  - tempo/tempo.yaml

  # OpenTelemetry Collector
  - otel/collector.yaml

---
# otel/collector.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: otel-collector-config
data:
  otel-collector-config.yaml: |
    receivers:
      otlp:
        protocols:
          grpc:
            endpoint: 0.0.0.0:4317
          http:
            endpoint: 0.0.0.0:4318

      prometheus:
        config:
          scrape_configs:
            - job_name: 'applications'
              kubernetes_sd_configs:
                - role: pod

    processors:
      batch:
        timeout: 10s
        send_batch_size: 1024

      memory_limiter:
        check_interval: 1s
        limit_mib: 512

      attributes:
        actions:
          - key: environment
            value: production
            action: upsert

    exporters:
      prometheus:
        endpoint: "0.0.0.0:8889"

      loki:
        endpoint: http://loki:3100/loki/api/v1/push

      tempo:
        endpoint: tempo:4317
        tls:
          insecure: true

    service:
      pipelines:
        traces:
          receivers: [otlp]
          processors: [memory_limiter, batch, attributes]
          exporters: [tempo]

        metrics:
          receivers: [otlp, prometheus]
          processors: [memory_limiter, batch, attributes]
          exporters: [prometheus]

        logs:
          receivers: [otlp]
          processors: [memory_limiter, batch, attributes]
          exporters: [loki]
```

### Example 4: Security & Compliance

**Scenario:** Implement DevSecOps practices with automated security scanning and compliance checks.

**Solution:**
```yaml
# .gitlab-ci.yml
stages:
  - security
  - compliance
  - deploy

sast:
  stage: security
  image: returntocorp/semgrep:latest
  script:
    - semgrep --config=auto --json -o sast-report.json
  artifacts:
    reports:
      sast: sast-report.json

dependency-scan:
  stage: security
  image: aquasec/trivy:latest
  script:
    - trivy fs --format json -o dependency-report.json .
  artifacts:
    reports:
      dependency_scanning: dependency-report.json

container-scan:
  stage: security
  image: aquasec/trivy:latest
  script:
    - trivy image --severity HIGH,CRITICAL --exit-code 1 $CI_REGISTRY_IMAGE:$CI_COMMIT_SHA

secrets-detection:
  stage: security
  image: trufflesecurity/trufflehog:latest
  script:
    - trufflehog git file://. --json > secrets-report.json
  allow_failure: false

policy-compliance:
  stage: compliance
  image: openpolicyagent/conftest:latest
  script:
    - conftest test k8s/*.yaml --policy rego-policies/
  artifacts:
    reports:
      compliance: compliance-report.json

deploy-production:
  stage: deploy
  dependencies:
    - sast
    - dependency-scan
    - container-scan
    - secrets-detection
    - policy-compliance
  script:
    - kubectl apply -f k8s/
  only:
    - main
  when: manual
```

### Example 5: Incident Response Automation

**Scenario:** Automated incident detection and response workflow.

**Solution:**
```python
# scripts/incident-response.py
import os
import requests
from datetime import datetime
from kubernetes import client, config

class IncidentResponder:
    def __init__(self):
        config.load_incluster_config()
        self.v1 = client.CoreV1Api()
        self.apps_v1 = client.AppsV1Api()
        self.slack_webhook = os.getenv('SLACK_WEBHOOK_URL')

    def detect_pod_failures(self, namespace='production'):
        """Detect failing pods"""
        pods = self.v1.list_namespaced_pod(namespace)
        failing_pods = []

        for pod in pods.items:
            if pod.status.phase in ['Failed', 'Unknown']:
                failing_pods.append({
                    'name': pod.metadata.name,
                    'namespace': pod.metadata.namespace,
                    'phase': pod.status.phase,
                    'reason': pod.status.reason,
                    'message': pod.status.message
                })

        return failing_pods

    def auto_restart_deployment(self, deployment_name, namespace):
        """Automatically restart deployment"""
        now = datetime.utcnow()

        # Annotate deployment to trigger restart
        body = {
            'spec': {
                'template': {
                    'metadata': {
                        'annotations': {
                            'kubectl.kubernetes.io/restartedAt': now.isoformat()
                        }
                    }
                }
            }
        }

        self.apps_v1.patch_namespaced_deployment(
            deployment_name,
            namespace,
            body
        )

        return f"Restarted {deployment_name} in {namespace}"

    def scale_deployment(self, deployment_name, namespace, replicas):
        """Scale deployment"""
        body = {'spec': {'replicas': replicas}}

        self.apps_v1.patch_namespaced_deployment_scale(
            deployment_name,
            namespace,
            body
        )

        return f"Scaled {deployment_name} to {replicas} replicas"

    def notify_slack(self, message, severity='info'):
        """Send Slack notification"""
        colors = {
            'info': '#36a64f',
            'warning': '#ff9900',
            'critical': '#ff0000'
        }

        payload = {
            'attachments': [{
                'color': colors.get(severity, '#808080'),
                'title': 'Incident Alert',
                'text': message,
                'footer': 'Automated Incident Response',
                'ts': int(datetime.now().timestamp())
            }]
        }

        requests.post(self.slack_webhook, json=payload)

    def handle_incident(self):
        """Main incident handling workflow"""
        failing_pods = self.detect_pod_failures()

        if failing_pods:
            message = f"Detected {len(failing_pods)} failing pods:\n"

            for pod in failing_pods:
                message += f"- {pod['name']}: {pod['reason']}\n"

                # Auto-remediation
                deployment_name = pod['name'].rsplit('-', 2)[0]

                # Restart deployment
                self.auto_restart_deployment(
                    deployment_name,
                    pod['namespace']
                )

                message += f"  → Automatically restarted {deployment_name}\n"

            self.notify_slack(message, severity='warning')

        return failing_pods

if __name__ == '__main__':
    responder = IncidentResponder()
    responder.handle_incident()
```

## Best Practices Summary

### 1. CI/CD Pipelines
- Implement automated testing at all stages
- Use security scanning in every pipeline
- Practice trunk-based development
- Keep pipelines fast (<10 minutes)
- Implement proper rollback mechanisms

### 2. Infrastructure as Code
- Version control all infrastructure
- Use modules for reusability
- Implement state locking
- Practice immutable infrastructure
- Document all resources

### 3. Container Orchestration
- Use resource limits and requests
- Implement health checks
- Use pod disruption budgets
- Practice GitOps for deployments
- Implement network policies

### 4. Monitoring & Observability
- Implement the three pillars: metrics, logs, traces
- Use distributed tracing
- Set up proper alerting
- Create meaningful dashboards
- Practice SRE principles

### 5. Security & Compliance
- Shift security left
- Automate security scanning
- Implement least privilege
- Use secrets management
- Practice compliance as code

## When to Use This Skill

Use the DevOps Expert skill when:
- Implementing CI/CD pipelines
- Setting up infrastructure as code
- Deploying to Kubernetes
- Implementing monitoring and logging
- Establishing DevOps practices
- Automating deployment workflows
- Implementing security scanning
- Setting up disaster recovery
- Optimizing deployment strategies
- Building observability stacks

## Related Skills

- `cloud-architect` - Cloud platform expertise
- `security-expert` - Security best practices
- `performance-optimizer` - Performance tuning
- `database-expert` - Database operations
- `system-architect` - System design patterns
