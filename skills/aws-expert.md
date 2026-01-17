---
name: aws-expert
description: AWS cloud services expertise. Provides AWS architecture patterns, EC2, S3, RDS, Lambda, CloudFormation, security best practices, and cost optimization basics. Use when working with AWS infrastructure and services.
version: 1.0.0
tags: [aws, cloud, infrastructure, serverless, devops]
category: domain-expert
---

# AWS Expert Skill

Expert knowledge in Amazon Web Services (AWS) cloud platform, covering architecture patterns, core services, infrastructure as code, security, and cost optimization.

---

## AWS Services Overview

### Compute Services
- **EC2 (Elastic Compute Cloud)**: Virtual servers in the cloud
- **Lambda**: Serverless compute for event-driven applications
- **ECS/EKS**: Container orchestration services
- **Elastic Beanstalk**: Platform as a Service (PaaS)
- **Lightsail**: Simplified virtual private servers
- **Batch**: Batch computing jobs
- **Fargate**: Serverless containers

### Storage Services
- **S3 (Simple Storage Service)**: Object storage
- **EBS (Elastic Block Store)**: Block storage for EC2
- **EFS (Elastic File System)**: Managed file storage
- **Glacier**: Low-cost archival storage
- **Storage Gateway**: Hybrid cloud storage
- **FSx**: Managed file systems (Windows, Lustre)

### Database Services
- **RDS (Relational Database Service)**: Managed SQL databases
- **DynamoDB**: NoSQL key-value database
- **Aurora**: MySQL/PostgreSQL compatible relational database
- **ElastiCache**: In-memory caching (Redis, Memcached)
- **DocumentDB**: MongoDB-compatible document database
- **Neptune**: Graph database
- **Redshift**: Data warehouse
- **QLDB**: Ledger database

### Networking Services
- **VPC (Virtual Private Cloud)**: Isolated network environment
- **CloudFront**: Content delivery network (CDN)
- **Route 53**: DNS and domain registration
- **Direct Connect**: Dedicated network connection
- **API Gateway**: RESTful and WebSocket APIs
- **ELB (Elastic Load Balancing)**: Application/Network/Classic load balancers
- **Transit Gateway**: Connect VPCs and on-premises networks

### Serverless Services
- **Lambda**: Function as a Service (FaaS)
- **API Gateway**: Serverless API management
- **Step Functions**: Serverless workflow orchestration
- **EventBridge**: Event bus service
- **SQS (Simple Queue Service)**: Message queuing
- **SNS (Simple Notification Service)**: Pub/sub messaging
- **AppSync**: Managed GraphQL service

### Developer Tools
- **CodeCommit**: Source control
- **CodeBuild**: Build and test service
- **CodeDeploy**: Deployment automation
- **CodePipeline**: Continuous delivery
- **Cloud9**: Cloud IDE
- **X-Ray**: Distributed tracing
- **CloudFormation**: Infrastructure as Code
- **CDK (Cloud Development Kit)**: Infrastructure as Code using programming languages

### Management & Governance
- **CloudWatch**: Monitoring and observability
- **CloudTrail**: Audit logging
- **Config**: Resource inventory and compliance
- **Systems Manager**: Operational management
- **Organizations**: Multi-account management
- **Control Tower**: AWS account factory
- **Service Catalog**: IT service catalog

---

## Architecture Patterns

### High Availability Architecture

**Pattern: Multi-AZ Web Application**

```
┌─────────────────────────────────────────────────────────────┐
│                    Route 53 (DNS)                           │
└──────────────────────┬──────────────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────────────┐
│              CloudFront (CDN)                               │
└──────────────────────┬──────────────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────────────┐
│          Application Load Balancer                          │
└─────────┬──────────────────────────────────┬────────────────┘
          │                                  │
┌─────────▼─────────┐              ┌─────────▼─────────┐
│   AZ-1a           │              │   AZ-1b           │
│  ┌─────────────┐  │              │  ┌─────────────┐  │
│  │   EC2       │  │              │  │   EC2       │  │
│  │ Web Server  │  │              │  │ Web Server  │  │
│  └──────┬──────┘  │              │  └──────┬──────┘  │
│         │         │              │         │         │
│  ┌──────▼──────┐  │              │  ┌──────▼──────┐  │
│  │   EC2       │  │              │  │   EC2       │  │
│  │ App Server  │  │              │  │ App Server  │  │
│  └──────┬──────┘  │              │  └──────┬──────┘  │
└─────────┼─────────┘              └─────────┼─────────┘
          │                                  │
          └─────────┬──────────────────┬─────┘
                    │                  │
          ┌─────────▼─────────┐ ┌─────▼─────────┐
          │  RDS Primary      │ │  RDS Standby  │
          │  (AZ-1a)          │ │  (AZ-1b)      │
          └───────────────────┘ └───────────────┘
```

**Key Features:**
- Multi-AZ deployment for fault tolerance
- Auto Scaling groups for elasticity
- Application Load Balancer for traffic distribution
- RDS Multi-AZ for database high availability
- CloudFront for global content delivery
- Route 53 for DNS with health checks

### Serverless Architecture

**Pattern: Event-Driven Serverless Application**

```
┌──────────────────────────────────────────────────────────────┐
│                  API Gateway (REST/WebSocket)                │
└─────────────────────┬────────────────────────────────────────┘
                      │
         ┌────────────┼────────────┐
         │            │            │
┌────────▼────┐ ┌────▼─────┐ ┌───▼──────┐
│  Lambda     │ │  Lambda  │ │ Lambda   │
│  Auth       │ │  CRUD    │ │ Process  │
└────────┬────┘ └────┬─────┘ └───┬──────┘
         │           │            │
         │     ┌─────▼─────┐      │
         │     │ DynamoDB  │      │
         │     │  Table    │      │
         │     └───────────┘      │
         │                        │
         └────────┬───────────────┘
                  │
         ┌────────▼────────┐
         │   EventBridge   │
         │   Event Bus     │
         └────┬───────┬────┘
              │       │
      ┌───────▼──┐ ┌──▼────────┐
      │ Lambda   │ │  Lambda   │
      │ Email    │ │  Analytics│
      └──────────┘ └───────────┘
           │             │
      ┌────▼─────┐ ┌────▼──────┐
      │   SES    │ │   S3      │
      └──────────┘ └───────────┘
```

**Key Features:**
- API Gateway for serverless API endpoints
- Lambda functions for business logic
- DynamoDB for NoSQL database
- EventBridge for event routing
- SES for email notifications
- S3 for data storage
- Pay-per-use pricing model
- Auto-scaling built-in

### Microservices Architecture

**Pattern: Container-Based Microservices**

```
┌──────────────────────────────────────────────────────────────┐
│                Route 53 (DNS + Routing)                      │
└─────────────────────┬────────────────────────────────────────┘
                      │
┌─────────────────────▼────────────────────────────────────────┐
│          Application Load Balancer (ALB)                     │
└──────┬──────────────┬────────────────┬──────────────────┬────┘
       │              │                │                  │
┌──────▼───────┐ ┌───▼────────┐ ┌────▼──────┐ ┌────────▼─────┐
│  ECS Service │ │ ECS Service│ │ECS Service│ │ ECS Service  │
│  (User Svc)  │ │ (Order Svc)│ │(Cart Svc) │ │(Payment Svc) │
│              │ │            │ │           │ │              │
│ ┌──────────┐ │ │┌──────────┐│ │┌─────────┐│ │┌────────────┐│
│ │Container │ │ ││Container ││ ││Container││ ││Container   ││
│ │Container │ │ ││Container ││ ││Container││ ││Container   ││
│ └──────────┘ │ │└──────────┘│ │└─────────┘│ │└────────────┘│
└──────┬───────┘ └─────┬──────┘ └─────┬─────┘ └──────┬───────┘
       │               │              │               │
       │        ┌──────▼──────────────▼───────────────▼──┐
       │        │     Amazon ElastiCache (Redis)         │
       │        └────────────────────────────────────────┘
       │
┌──────▼────────────────────────────────────────────────┐
│              Service Mesh (App Mesh)                  │
│  - Service Discovery                                  │
│  - Load Balancing                                     │
│  - Circuit Breaking                                   │
└───────────────────────────────────────────────────────┘
       │
┌──────▼───────┐ ┌─────────────┐ ┌──────────────┐
│  RDS (Users) │ │RDS (Orders) │ │RDS (Payments)│
└──────────────┘ └─────────────┘ └──────────────┘
```

**Key Features:**
- ECS/EKS for container orchestration
- Application Load Balancer with path-based routing
- Service mesh for inter-service communication
- Separate databases per service (database per service pattern)
- ElastiCache for shared caching
- CloudWatch for centralized logging

### Multi-Region Active-Active

**Pattern: Global Application with Active-Active Deployment**

```
┌─────────────────────────────────────────────────────────────┐
│          Route 53 (Geolocation/Latency Routing)             │
└──────────┬──────────────────────────────────┬───────────────┘
           │                                  │
┌──────────▼──────────┐            ┌──────────▼──────────┐
│   US-EAST-1         │            │   EU-WEST-1         │
│                     │            │                     │
│  ┌──────────────┐   │            │  ┌──────────────┐   │
│  │ CloudFront   │   │            │  │ CloudFront   │   │
│  └──────┬───────┘   │            │  └──────┬───────┘   │
│         │           │            │         │           │
│  ┌──────▼───────┐   │            │  ┌──────▼───────┐   │
│  │     ALB      │   │            │  │     ALB      │   │
│  └──────┬───────┘   │            │  └──────┬───────┘   │
│         │           │            │         │           │
│  ┌──────▼───────┐   │            │  ┌──────▼───────┐   │
│  │ EC2 AutoScale│   │            │  │ EC2 AutoScale│   │
│  └──────┬───────┘   │            │  └──────┬───────┘   │
│         │           │            │         │           │
│  ┌──────▼───────┐   │  Replica   │  ┌──────▼───────┐   │
│  │  Aurora      │◄──┼────────────┼──►  Aurora      │   │
│  │  Primary     │   │            │  │  Primary     │   │
│  └──────────────┘   │            │  └──────────────┘   │
│                     │            │                     │
│  ┌──────────────┐   │ Replication│  ┌──────────────┐   │
│  │  S3 Bucket   │◄──┼────────────┼──►  S3 Bucket   │   │
│  │  (CRR)       │   │            │  │  (CRR)       │   │
│  └──────────────┘   │            │  └──────────────┘   │
└─────────────────────┘            └─────────────────────┘
```

**Key Features:**
- Multi-region deployment for global reach
- Route 53 geolocation/latency-based routing
- Aurora Global Database for multi-region replication
- S3 Cross-Region Replication (CRR)
- CloudFront edge locations
- Active-active configuration for both regions
- DynamoDB Global Tables for globally distributed data

---

## Core Services Deep Dive

### EC2 (Elastic Compute Cloud)

**Instance Types:**
- **General Purpose (T3, M6)**: Balanced compute, memory, networking
- **Compute Optimized (C6)**: High-performance processors
- **Memory Optimized (R6, X2)**: Large datasets in memory
- **Storage Optimized (I3, D3)**: High sequential read/write
- **Accelerated Computing (P4, G5)**: GPU instances for ML/graphics

**Pricing Models:**
- **On-Demand**: Pay by the hour/second
- **Reserved Instances**: 1-3 year commitment (up to 75% discount)
- **Spot Instances**: Bid on spare capacity (up to 90% discount)
- **Savings Plans**: Flexible pricing model (up to 72% discount)
- **Dedicated Hosts**: Physical servers dedicated to your use

**Best Practices:**
```bash
# Launch EC2 instance with user data
aws ec2 run-instances \
  --image-id ami-0c55b159cbfafe1f0 \
  --instance-type t3.micro \
  --key-name MyKeyPair \
  --security-group-ids sg-0123456789abcdef0 \
  --subnet-id subnet-0123456789abcdef0 \
  --user-data file://user-data.sh \
  --tag-specifications 'ResourceType=instance,Tags=[{Key=Name,Value=WebServer}]' \
  --iam-instance-profile Name=MyInstanceProfile
```

**Auto Scaling Configuration:**
```yaml
# Auto Scaling Group with Target Tracking
Resources:
  AutoScalingGroup:
    Type: AWS::AutoScaling::AutoScalingGroup
    Properties:
      MinSize: 2
      MaxSize: 10
      DesiredCapacity: 4
      VPCZoneIdentifier:
        - subnet-0123456789abcdef0
        - subnet-0123456789abcdef1
      LaunchTemplate:
        LaunchTemplateId: !Ref LaunchTemplate
        Version: !GetAtt LaunchTemplate.LatestVersionNumber
      TargetGroupARNs:
        - !Ref TargetGroup
      HealthCheckType: ELB
      HealthCheckGracePeriod: 300
      Tags:
        - Key: Name
          Value: WebServer-ASG
          PropagateAtLaunch: true

  ScalingPolicy:
    Type: AWS::AutoScaling::ScalingPolicy
    Properties:
      AutoScalingGroupName: !Ref AutoScalingGroup
      PolicyType: TargetTrackingScaling
      TargetTrackingConfiguration:
        PredefinedMetricSpecification:
          PredefinedMetricType: ASGAverageCPUUtilization
        TargetValue: 70.0
```

### S3 (Simple Storage Service)

**Storage Classes:**
- **S3 Standard**: Frequently accessed data
- **S3 Intelligent-Tiering**: Automatic cost optimization
- **S3 Standard-IA**: Infrequent access
- **S3 One Zone-IA**: Single AZ, infrequent access
- **S3 Glacier Instant Retrieval**: Archive with instant access
- **S3 Glacier Flexible Retrieval**: Archive with 1-5 minute retrieval
- **S3 Glacier Deep Archive**: Lowest cost, 12 hour retrieval

**Lifecycle Policies:**
```json
{
  "Rules": [
    {
      "Id": "MoveToGlacier",
      "Status": "Enabled",
      "Prefix": "logs/",
      "Transitions": [
        {
          "Days": 30,
          "StorageClass": "STANDARD_IA"
        },
        {
          "Days": 90,
          "StorageClass": "GLACIER"
        },
        {
          "Days": 365,
          "StorageClass": "DEEP_ARCHIVE"
        }
      ],
      "Expiration": {
        "Days": 730
      }
    }
  ]
}
```

**Bucket Policy Example:**
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::my-bucket/public/*"
    },
    {
      "Sid": "DenyInsecureTransport",
      "Effect": "Deny",
      "Principal": "*",
      "Action": "s3:*",
      "Resource": [
        "arn:aws:s3:::my-bucket",
        "arn:aws:s3:::my-bucket/*"
      ],
      "Condition": {
        "Bool": {
          "aws:SecureTransport": "false"
        }
      }
    }
  ]
}
```

**S3 Best Practices:**
- Enable versioning for critical data
- Use S3 encryption (SSE-S3, SSE-KMS, SSE-C)
- Implement lifecycle policies for cost optimization
- Enable CloudTrail logging for audit
- Use S3 Transfer Acceleration for global uploads
- Implement cross-region replication for disaster recovery
- Use S3 Object Lock for compliance (WORM)

### RDS (Relational Database Service)

**Supported Engines:**
- MySQL, PostgreSQL, MariaDB, Oracle, SQL Server, Aurora

**Multi-AZ Deployment:**
```yaml
Resources:
  Database:
    Type: AWS::RDS::DBInstance
    Properties:
      DBInstanceIdentifier: production-db
      DBInstanceClass: db.r6g.xlarge
      Engine: postgres
      EngineVersion: '14.6'
      MasterUsername: admin
      MasterUserPassword: !Ref DBPassword
      AllocatedStorage: 100
      StorageType: gp3
      StorageEncrypted: true
      MultiAZ: true
      PubliclyAccessible: false
      VPCSecurityGroups:
        - !Ref DBSecurityGroup
      DBSubnetGroupName: !Ref DBSubnetGroup
      BackupRetentionPeriod: 7
      PreferredBackupWindow: "03:00-04:00"
      PreferredMaintenanceWindow: "mon:04:00-mon:05:00"
      EnableCloudwatchLogsExports:
        - postgresql
      DeletionProtection: true
      Tags:
        - Key: Environment
          Value: Production
```

**Read Replica Configuration:**
```bash
# Create read replica
aws rds create-db-instance-read-replica \
  --db-instance-identifier production-db-replica-1 \
  --source-db-instance-identifier production-db \
  --db-instance-class db.r6g.large \
  --availability-zone us-east-1b \
  --publicly-accessible false
```

**Aurora Cluster:**
```yaml
Resources:
  AuroraCluster:
    Type: AWS::RDS::DBCluster
    Properties:
      Engine: aurora-postgresql
      EngineVersion: '14.6'
      MasterUsername: admin
      MasterUserPassword: !Ref DBPassword
      DatabaseName: myapp
      DBSubnetGroupName: !Ref DBSubnetGroup
      VpcSecurityGroupIds:
        - !Ref DBSecurityGroup
      BackupRetentionPeriod: 7
      PreferredBackupWindow: "03:00-04:00"
      StorageEncrypted: true
      EnableCloudwatchLogsExports:
        - postgresql

  AuroraInstance1:
    Type: AWS::RDS::DBInstance
    Properties:
      Engine: aurora-postgresql
      DBClusterIdentifier: !Ref AuroraCluster
      DBInstanceClass: db.r6g.large
      PubliclyAccessible: false

  AuroraInstance2:
    Type: AWS::RDS::DBInstance
    Properties:
      Engine: aurora-postgresql
      DBClusterIdentifier: !Ref AuroraCluster
      DBInstanceClass: db.r6g.large
      PubliclyAccessible: false
```

**RDS Best Practices:**
- Enable automated backups (1-35 days retention)
- Use Multi-AZ for production workloads
- Implement read replicas for read-heavy workloads
- Enable encryption at rest (KMS)
- Use IAM database authentication
- Monitor with Enhanced Monitoring and Performance Insights
- Use parameter groups for custom configurations
- Implement automated snapshots before major changes

### Lambda (Serverless Compute)

**Function Configuration:**
```python
# Lambda function example
import json
import boto3
import os

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table(os.environ['TABLE_NAME'])

def lambda_handler(event, context):
    # Parse input
    body = json.loads(event['body'])

    # Process request
    try:
        response = table.put_item(
            Item={
                'id': body['id'],
                'data': body['data'],
                'timestamp': context.request_time_epoch
            }
        )

        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({
                'message': 'Success',
                'id': body['id']
            })
        }
    except Exception as e:
        return {
            'statusCode': 500,
            'body': json.dumps({
                'error': str(e)
            })
        }
```

**Lambda with CloudFormation:**
```yaml
Resources:
  LambdaFunction:
    Type: AWS::Lambda::Function
    Properties:
      FunctionName: ProcessDataFunction
      Runtime: python3.11
      Handler: index.lambda_handler
      Role: !GetAtt LambdaExecutionRole.Arn
      Code:
        ZipFile: |
          import json
          def lambda_handler(event, context):
              return {
                  'statusCode': 200,
                  'body': json.dumps('Hello from Lambda!')
              }
      Environment:
        Variables:
          TABLE_NAME: !Ref DynamoDBTable
          BUCKET_NAME: !Ref S3Bucket
      MemorySize: 512
      Timeout: 30
      ReservedConcurrentExecutions: 10
      Layers:
        - !Ref LambdaLayer
      VpcConfig:
        SecurityGroupIds:
          - !Ref LambdaSecurityGroup
        SubnetIds:
          - !Ref PrivateSubnet1
          - !Ref PrivateSubnet2

  LambdaExecutionRole:
    Type: AWS::IAM::Role
    Properties:
      AssumeRolePolicyDocument:
        Version: '2012-10-17'
        Statement:
          - Effect: Allow
            Principal:
              Service: lambda.amazonaws.com
            Action: sts:AssumeRole
      ManagedPolicyArns:
        - arn:aws:iam::aws:policy/service-role/AWSLambdaVPCAccessExecutionRole
      Policies:
        - PolicyName: LambdaPolicy
          PolicyDocument:
            Version: '2012-10-17'
            Statement:
              - Effect: Allow
                Action:
                  - dynamodb:PutItem
                  - dynamodb:GetItem
                  - dynamodb:UpdateItem
                Resource: !GetAtt DynamoDBTable.Arn
              - Effect: Allow
                Action:
                  - s3:GetObject
                  - s3:PutObject
                Resource: !Sub '${S3Bucket.Arn}/*'
```

**Lambda Best Practices:**
- Keep functions small and single-purpose
- Use environment variables for configuration
- Implement proper error handling and retries
- Set appropriate memory and timeout values
- Use Lambda Layers for shared dependencies
- Enable X-Ray tracing for debugging
- Use reserved concurrency for critical functions
- Implement dead letter queues for failed events
- Use VPC only when necessary (adds cold start time)

### VPC (Virtual Private Cloud)

**VPC Architecture:**
```yaml
Resources:
  VPC:
    Type: AWS::EC2::VPC
    Properties:
      CidrBlock: 10.0.0.0/16
      EnableDnsHostnames: true
      EnableDnsSupport: true
      Tags:
        - Key: Name
          Value: Production-VPC

  # Public Subnets
  PublicSubnet1:
    Type: AWS::EC2::Subnet
    Properties:
      VpcId: !Ref VPC
      CidrBlock: 10.0.1.0/24
      AvailabilityZone: !Select [0, !GetAZs '']
      MapPublicIpOnLaunch: true
      Tags:
        - Key: Name
          Value: Public-Subnet-1

  PublicSubnet2:
    Type: AWS::EC2::Subnet
    Properties:
      VpcId: !Ref VPC
      CidrBlock: 10.0.2.0/24
      AvailabilityZone: !Select [1, !GetAZs '']
      MapPublicIpOnLaunch: true
      Tags:
        - Key: Name
          Value: Public-Subnet-2

  # Private Subnets
  PrivateSubnet1:
    Type: AWS::EC2::Subnet
    Properties:
      VpcId: !Ref VPC
      CidrBlock: 10.0.11.0/24
      AvailabilityZone: !Select [0, !GetAZs '']
      Tags:
        - Key: Name
          Value: Private-Subnet-1

  PrivateSubnet2:
    Type: AWS::EC2::Subnet
    Properties:
      VpcId: !Ref VPC
      CidrBlock: 10.0.12.0/24
      AvailabilityZone: !Select [1, !GetAZs '']
      Tags:
        - Key: Name
          Value: Private-Subnet-2

  # Internet Gateway
  InternetGateway:
    Type: AWS::EC2::InternetGateway

  AttachGateway:
    Type: AWS::EC2::VPCGatewayAttachment
    Properties:
      VpcId: !Ref VPC
      InternetGatewayId: !Ref InternetGateway

  # NAT Gateway
  NATGateway:
    Type: AWS::EC2::NatGateway
    Properties:
      AllocationId: !GetAtt NATGatewayEIP.AllocationId
      SubnetId: !Ref PublicSubnet1

  NATGatewayEIP:
    Type: AWS::EC2::EIP
    Properties:
      Domain: vpc

  # Route Tables
  PublicRouteTable:
    Type: AWS::EC2::RouteTable
    Properties:
      VpcId: !Ref VPC

  PublicRoute:
    Type: AWS::EC2::Route
    Properties:
      RouteTableId: !Ref PublicRouteTable
      DestinationCidrBlock: 0.0.0.0/0
      GatewayId: !Ref InternetGateway

  PrivateRouteTable:
    Type: AWS::EC2::RouteTable
    Properties:
      VpcId: !Ref VPC

  PrivateRoute:
    Type: AWS::EC2::Route
    Properties:
      RouteTableId: !Ref PrivateRouteTable
      DestinationCidrBlock: 0.0.0.0/0
      NatGatewayId: !Ref NATGateway
```

**Security Groups:**
```yaml
Resources:
  WebServerSecurityGroup:
    Type: AWS::EC2::SecurityGroup
    Properties:
      GroupDescription: Security group for web servers
      VpcId: !Ref VPC
      SecurityGroupIngress:
        - IpProtocol: tcp
          FromPort: 80
          ToPort: 80
          SourceSecurityGroupId: !Ref ALBSecurityGroup
        - IpProtocol: tcp
          FromPort: 443
          ToPort: 443
          SourceSecurityGroupId: !Ref ALBSecurityGroup
      SecurityGroupEgress:
        - IpProtocol: -1
          CidrIp: 0.0.0.0/0

  DatabaseSecurityGroup:
    Type: AWS::EC2::SecurityGroup
    Properties:
      GroupDescription: Security group for database
      VpcId: !Ref VPC
      SecurityGroupIngress:
        - IpProtocol: tcp
          FromPort: 5432
          ToPort: 5432
          SourceSecurityGroupId: !Ref WebServerSecurityGroup
```

---

## Infrastructure as Code

### CloudFormation

**Complete Stack Example:**
```yaml
AWSTemplateFormatVersion: '2010-09-09'
Description: 'Three-tier web application stack'

Parameters:
  KeyName:
    Type: AWS::EC2::KeyPair::KeyName
    Description: EC2 key pair for SSH access

  DBPassword:
    Type: String
    NoEcho: true
    MinLength: 8
    Description: Database password

Mappings:
  RegionMap:
    us-east-1:
      AMI: ami-0c55b159cbfafe1f0
    us-west-2:
      AMI: ami-0d1cd67c26f5fca19

Resources:
  # VPC and Networking (as shown above)

  # Application Load Balancer
  ApplicationLoadBalancer:
    Type: AWS::ElasticLoadBalancingV2::LoadBalancer
    Properties:
      Subnets:
        - !Ref PublicSubnet1
        - !Ref PublicSubnet2
      SecurityGroups:
        - !Ref ALBSecurityGroup
      Tags:
        - Key: Name
          Value: Production-ALB

  # Target Group
  TargetGroup:
    Type: AWS::ElasticLoadBalancingV2::TargetGroup
    Properties:
      HealthCheckPath: /health
      HealthCheckProtocol: HTTP
      Port: 80
      Protocol: HTTP
      VpcId: !Ref VPC
      TargetType: instance
      HealthCheckIntervalSeconds: 30
      HealthCheckTimeoutSeconds: 5
      HealthyThresholdCount: 2
      UnhealthyThresholdCount: 3

  # Listener
  Listener:
    Type: AWS::ElasticLoadBalancingV2::Listener
    Properties:
      DefaultActions:
        - Type: forward
          TargetGroupArn: !Ref TargetGroup
      LoadBalancerArn: !Ref ApplicationLoadBalancer
      Port: 80
      Protocol: HTTP

  # Launch Template
  LaunchTemplate:
    Type: AWS::EC2::LaunchTemplate
    Properties:
      LaunchTemplateData:
        ImageId: !FindInMap [RegionMap, !Ref 'AWS::Region', AMI]
        InstanceType: t3.medium
        KeyName: !Ref KeyName
        SecurityGroupIds:
          - !Ref WebServerSecurityGroup
        IamInstanceProfile:
          Arn: !GetAtt InstanceProfile.Arn
        UserData:
          Fn::Base64: !Sub |
            #!/bin/bash
            yum update -y
            yum install -y httpd
            systemctl start httpd
            systemctl enable httpd
            echo "<h1>Hello from $(hostname -f)</h1>" > /var/www/html/index.html

  # Auto Scaling Group
  AutoScalingGroup:
    Type: AWS::AutoScaling::AutoScalingGroup
    Properties:
      MinSize: 2
      MaxSize: 6
      DesiredCapacity: 2
      LaunchTemplate:
        LaunchTemplateId: !Ref LaunchTemplate
        Version: !GetAtt LaunchTemplate.LatestVersionNumber
      VPCZoneIdentifier:
        - !Ref PrivateSubnet1
        - !Ref PrivateSubnet2
      TargetGroupARNs:
        - !Ref TargetGroup
      HealthCheckType: ELB
      HealthCheckGracePeriod: 300

  # RDS Database
  DBSubnetGroup:
    Type: AWS::RDS::DBSubnetGroup
    Properties:
      DBSubnetGroupDescription: Subnet group for RDS
      SubnetIds:
        - !Ref PrivateSubnet1
        - !Ref PrivateSubnet2

  Database:
    Type: AWS::RDS::DBInstance
    Properties:
      DBInstanceIdentifier: production-db
      Engine: postgres
      EngineVersion: '14.6'
      DBInstanceClass: db.t3.medium
      AllocatedStorage: 100
      MasterUsername: admin
      MasterUserPassword: !Ref DBPassword
      MultiAZ: true
      DBSubnetGroupName: !Ref DBSubnetGroup
      VPCSecurityGroups:
        - !Ref DatabaseSecurityGroup

Outputs:
  LoadBalancerDNS:
    Description: DNS name of the load balancer
    Value: !GetAtt ApplicationLoadBalancer.DNSName
    Export:
      Name: !Sub '${AWS::StackName}-LoadBalancerDNS'

  DatabaseEndpoint:
    Description: Database endpoint
    Value: !GetAtt Database.Endpoint.Address
    Export:
      Name: !Sub '${AWS::StackName}-DBEndpoint'
```

### AWS CDK (Cloud Development Kit)

**TypeScript Example:**
```typescript
import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as elbv2 from 'aws-cdk-lib/aws-elasticloadbalancingv2';
import * as rds from 'aws-cdk-lib/aws-rds';

export class MyAppStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // VPC
    const vpc = new ec2.Vpc(this, 'VPC', {
      maxAzs: 2,
      natGateways: 1,
      subnetConfiguration: [
        {
          cidrMask: 24,
          name: 'Public',
          subnetType: ec2.SubnetType.PUBLIC,
        },
        {
          cidrMask: 24,
          name: 'Private',
          subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS,
        },
      ],
    });

    // ECS Cluster
    const cluster = new ecs.Cluster(this, 'Cluster', {
      vpc,
      containerInsights: true,
    });

    // Fargate Service
    const taskDefinition = new ecs.FargateTaskDefinition(this, 'TaskDef', {
      memoryLimitMiB: 512,
      cpu: 256,
    });

    taskDefinition.addContainer('WebContainer', {
      image: ecs.ContainerImage.fromRegistry('nginx:latest'),
      portMappings: [{ containerPort: 80 }],
      logging: ecs.LogDrivers.awsLogs({ streamPrefix: 'MyApp' }),
    });

    const service = new ecs.FargateService(this, 'Service', {
      cluster,
      taskDefinition,
      desiredCount: 2,
    });

    // Application Load Balancer
    const lb = new elbv2.ApplicationLoadBalancer(this, 'LB', {
      vpc,
      internetFacing: true,
    });

    const listener = lb.addListener('Listener', {
      port: 80,
    });

    listener.addTargets('ECS', {
      port: 80,
      targets: [service],
      healthCheck: {
        path: '/health',
        interval: cdk.Duration.seconds(30),
      },
    });

    // RDS Database
    const database = new rds.DatabaseInstance(this, 'Database', {
      engine: rds.DatabaseInstanceEngine.postgres({
        version: rds.PostgresEngineVersion.VER_14_6,
      }),
      vpc,
      vpcSubnets: {
        subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS,
      },
      multiAz: true,
      allocatedStorage: 100,
      instanceType: ec2.InstanceType.of(
        ec2.InstanceClass.T3,
        ec2.InstanceSize.MEDIUM
      ),
      deletionProtection: true,
    });

    // Allow ECS to access RDS
    database.connections.allowFrom(service, ec2.Port.tcp(5432));

    // Outputs
    new cdk.CfnOutput(this, 'LoadBalancerDNS', {
      value: lb.loadBalancerDnsName,
    });
  }
}
```

---

## Security Best Practices

### IAM (Identity and Access Management)

**Principle of Least Privilege:**
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:GetObject",
        "s3:PutObject"
      ],
      "Resource": "arn:aws:s3:::my-app-bucket/uploads/*"
    },
    {
      "Effect": "Allow",
      "Action": [
        "dynamodb:GetItem",
        "dynamodb:PutItem",
        "dynamodb:UpdateItem"
      ],
      "Resource": "arn:aws:dynamodb:us-east-1:123456789012:table/Users",
      "Condition": {
        "ForAllValues:StringEquals": {
          "dynamodb:LeadingKeys": ["${aws:username}"]
        }
      }
    }
  ]
}
```

**IAM Roles for EC2:**
```yaml
Resources:
  EC2Role:
    Type: AWS::IAM::Role
    Properties:
      AssumeRolePolicyDocument:
        Version: '2012-10-17'
        Statement:
          - Effect: Allow
            Principal:
              Service: ec2.amazonaws.com
            Action: sts:AssumeRole
      ManagedPolicyArns:
        - arn:aws:iam::aws:policy/CloudWatchAgentServerPolicy
      Policies:
        - PolicyName: AppPermissions
          PolicyDocument:
            Version: '2012-10-17'
            Statement:
              - Effect: Allow
                Action:
                  - s3:GetObject
                Resource: arn:aws:s3:::config-bucket/*
              - Effect: Allow
                Action:
                  - secretsmanager:GetSecretValue
                Resource: arn:aws:secretsmanager:*:*:secret:app/*

  InstanceProfile:
    Type: AWS::IAM::InstanceProfile
    Properties:
      Roles:
        - !Ref EC2Role
```

### Encryption

**S3 Encryption:**
```yaml
Resources:
  EncryptedBucket:
    Type: AWS::S3::Bucket
    Properties:
      BucketEncryption:
        ServerSideEncryptionConfiguration:
          - ServerSideEncryptionByDefault:
              SSEAlgorithm: aws:kms
              KMSMasterKeyID: !Ref KMSKey
            BucketKeyEnabled: true
      PublicAccessBlockConfiguration:
        BlockPublicAcls: true
        BlockPublicPolicy: true
        IgnorePublicAcls: true
        RestrictPublicBuckets: true

  KMSKey:
    Type: AWS::KMS::Key
    Properties:
      Description: KMS key for S3 encryption
      KeyPolicy:
        Version: '2012-10-17'
        Statement:
          - Sid: Enable IAM User Permissions
            Effect: Allow
            Principal:
              AWS: !Sub 'arn:aws:iam::${AWS::AccountId}:root'
            Action: kms:*
            Resource: '*'
          - Sid: Allow S3 to use the key
            Effect: Allow
            Principal:
              Service: s3.amazonaws.com
            Action:
              - kms:Decrypt
              - kms:GenerateDataKey
            Resource: '*'
```

**Secrets Manager:**
```python
import boto3
import json

# Create Secrets Manager client
client = boto3.client('secretsmanager')

# Store secret
response = client.create_secret(
    Name='prod/database/credentials',
    Description='Production database credentials',
    SecretString=json.dumps({
        'username': 'admin',
        'password': 'SecurePassword123!',
        'host': 'db.example.com',
        'port': 5432
    }),
    KmsKeyId='alias/aws/secretsmanager'
)

# Retrieve secret
def get_secret():
    response = client.get_secret_value(
        SecretId='prod/database/credentials'
    )
    secret = json.loads(response['SecretString'])
    return secret

# Rotate secret
def rotate_secret():
    client.rotate_secret(
        SecretId='prod/database/credentials',
        RotationLambdaARN='arn:aws:lambda:us-east-1:123456789012:function:RotateSecret'
    )
```

### Network Security

**Security Group Best Practices:**
```yaml
Resources:
  # Application Load Balancer Security Group
  ALBSecurityGroup:
    Type: AWS::EC2::SecurityGroup
    Properties:
      GroupDescription: ALB security group
      VpcId: !Ref VPC
      SecurityGroupIngress:
        - IpProtocol: tcp
          FromPort: 443
          ToPort: 443
          CidrIp: 0.0.0.0/0
          Description: HTTPS from internet
        - IpProtocol: tcp
          FromPort: 80
          ToPort: 80
          CidrIp: 0.0.0.0/0
          Description: HTTP from internet (redirect to HTTPS)

  # Web Server Security Group
  WebServerSecurityGroup:
    Type: AWS::EC2::SecurityGroup
    Properties:
      GroupDescription: Web server security group
      VpcId: !Ref VPC
      SecurityGroupIngress:
        - IpProtocol: tcp
          FromPort: 80
          ToPort: 80
          SourceSecurityGroupId: !Ref ALBSecurityGroup
          Description: HTTP from ALB only

  # Database Security Group
  DatabaseSecurityGroup:
    Type: AWS::EC2::SecurityGroup
    Properties:
      GroupDescription: Database security group
      VpcId: !Ref VPC
      SecurityGroupIngress:
        - IpProtocol: tcp
          FromPort: 5432
          ToPort: 5432
          SourceSecurityGroupId: !Ref WebServerSecurityGroup
          Description: PostgreSQL from web servers only

  # No outbound rules needed (default allows all)
```

**VPC Flow Logs:**
```yaml
Resources:
  FlowLogRole:
    Type: AWS::IAM::Role
    Properties:
      AssumeRolePolicyDocument:
        Version: '2012-10-17'
        Statement:
          - Effect: Allow
            Principal:
              Service: vpc-flow-logs.amazonaws.com
            Action: sts:AssumeRole
      Policies:
        - PolicyName: CloudWatchLogPolicy
          PolicyDocument:
            Version: '2012-10-17'
            Statement:
              - Effect: Allow
                Action:
                  - logs:CreateLogGroup
                  - logs:CreateLogStream
                  - logs:PutLogEvents
                  - logs:DescribeLogGroups
                  - logs:DescribeLogStreams
                Resource: '*'

  VPCFlowLog:
    Type: AWS::EC2::FlowLog
    Properties:
      ResourceType: VPC
      ResourceId: !Ref VPC
      TrafficType: ALL
      LogDestinationType: cloud-watch-logs
      LogGroupName: /aws/vpc/flowlogs
      DeliverLogsPermissionArn: !GetAtt FlowLogRole.Arn
```

---

## Cost Optimization Basics

### Right-Sizing

**EC2 Instance Analysis:**
```bash
# Get CloudWatch metrics for right-sizing
aws cloudwatch get-metric-statistics \
  --namespace AWS/EC2 \
  --metric-name CPUUtilization \
  --dimensions Name=InstanceId,Value=i-1234567890abcdef0 \
  --start-time 2024-01-01T00:00:00Z \
  --end-time 2024-01-31T23:59:59Z \
  --period 3600 \
  --statistics Average

# Use AWS Compute Optimizer
aws compute-optimizer get-ec2-instance-recommendations \
  --instance-arns arn:aws:ec2:us-east-1:123456789012:instance/i-1234567890abcdef0
```

### Reserved Instances and Savings Plans

**Recommendations:**
```bash
# Get RI recommendations
aws ce get-reservation-purchase-recommendation \
  --service EC2 \
  --lookback-period-in-days SIXTY_DAYS \
  --term-in-years ONE_YEAR \
  --payment-option PARTIAL_UPFRONT

# Get Savings Plans recommendations
aws ce get-savings-plans-purchase-recommendation \
  --savings-plans-type COMPUTE_SP \
  --term-in-years ONE_YEAR \
  --payment-option PARTIAL_UPFRONT \
  --lookback-period-in-days SIXTY_DAYS
```

### Cost Allocation Tags

**Tagging Strategy:**
```yaml
# Standard tags for all resources
Tags:
  - Key: Environment
    Value: Production
  - Key: Application
    Value: WebApp
  - Key: CostCenter
    Value: Engineering
  - Key: Owner
    Value: team@example.com
  - Key: Project
    Value: CustomerPortal
  - Key: ManagedBy
    Value: CloudFormation
```

### Budget Alerts

**AWS Budgets:**
```yaml
Resources:
  MonthlyBudget:
    Type: AWS::Budgets::Budget
    Properties:
      Budget:
        BudgetName: Monthly-Cost-Budget
        BudgetLimit:
          Amount: 1000
          Unit: USD
        TimeUnit: MONTHLY
        BudgetType: COST
        CostFilters:
          TagKeyValue:
            - Key: Environment
              Values:
                - Production
      NotificationsWithSubscribers:
        - Notification:
            NotificationType: ACTUAL
            ComparisonOperator: GREATER_THAN
            Threshold: 80
          Subscribers:
            - SubscriptionType: EMAIL
              Address: billing@example.com
        - Notification:
            NotificationType: FORECASTED
            ComparisonOperator: GREATER_THAN
            Threshold: 100
          Subscribers:
            - SubscriptionType: EMAIL
              Address: billing@example.com
```

### Cost Optimization Techniques

**1. Use Spot Instances:**
```yaml
Resources:
  SpotFleet:
    Type: AWS::EC2::SpotFleet
    Properties:
      SpotFleetRequestConfigData:
        IamFleetRole: !GetAtt SpotFleetRole.Arn
        TargetCapacity: 10
        SpotPrice: '0.05'
        LaunchSpecifications:
          - ImageId: ami-0c55b159cbfafe1f0
            InstanceType: t3.medium
            KeyName: !Ref KeyName
            SubnetId: !Ref PrivateSubnet1
```

**2. S3 Lifecycle Policies:**
Already covered in S3 section above

**3. Auto Scaling:**
Already covered in EC2 section above

**4. Lambda Cost Optimization:**
```python
# Use appropriate memory size (CPU scales with memory)
# Monitor duration and optimize code
# Use provisioned concurrency only when needed

import json
import time

def lambda_handler(event, context):
    # Reuse connections outside handler
    # Use environment variables for config
    # Minimize cold starts

    start_time = time.time()

    # Your logic here
    result = process_data(event)

    execution_time = (time.time() - start_time) * 1000
    print(f"Execution time: {execution_time}ms")

    return {
        'statusCode': 200,
        'body': json.dumps(result)
    }
```

---

## Monitoring & Logging

### CloudWatch

**Custom Metrics:**
```python
import boto3
from datetime import datetime

cloudwatch = boto3.client('cloudwatch')

# Put custom metric
cloudwatch.put_metric_data(
    Namespace='MyApp',
    MetricData=[
        {
            'MetricName': 'OrdersProcessed',
            'Dimensions': [
                {
                    'Name': 'Environment',
                    'Value': 'Production'
                },
            ],
            'Value': 100,
            'Unit': 'Count',
            'Timestamp': datetime.utcnow()
        },
    ]
)
```

**CloudWatch Alarms:**
```yaml
Resources:
  HighCPUAlarm:
    Type: AWS::CloudWatch::Alarm
    Properties:
      AlarmName: High-CPU-Utilization
      AlarmDescription: Trigger when CPU exceeds 80%
      MetricName: CPUUtilization
      Namespace: AWS/EC2
      Statistic: Average
      Period: 300
      EvaluationPeriods: 2
      Threshold: 80
      ComparisonOperator: GreaterThanThreshold
      Dimensions:
        - Name: AutoScalingGroupName
          Value: !Ref AutoScalingGroup
      AlarmActions:
        - !Ref SNSTopic
      TreatMissingData: notBreaching

  ErrorRateAlarm:
    Type: AWS::CloudWatch::Alarm
    Properties:
      AlarmName: High-Error-Rate
      AlarmDescription: Trigger when error rate exceeds 5%
      MetricName: 5XXError
      Namespace: AWS/ApplicationELB
      Statistic: Sum
      Period: 60
      EvaluationPeriods: 2
      Threshold: 10
      ComparisonOperator: GreaterThanThreshold
      Dimensions:
        - Name: LoadBalancer
          Value: !GetAtt ApplicationLoadBalancer.LoadBalancerFullName
      AlarmActions:
        - !Ref SNSTopic
```

**CloudWatch Logs Insights:**
```sql
-- Find errors in Lambda logs
fields @timestamp, @message
| filter @message like /ERROR/
| sort @timestamp desc
| limit 20

-- Analyze API Gateway latency
fields @timestamp, @duration
| stats avg(@duration), max(@duration), min(@duration) by bin(5m)

-- Count requests by status code
fields @timestamp, status
| stats count() by status
| sort count() desc
```

### X-Ray

**Instrument Lambda:**
```python
import boto3
from aws_xray_sdk.core import xray_recorder
from aws_xray_sdk.core import patch_all

# Patch all supported libraries
patch_all()

@xray_recorder.capture('process_order')
def process_order(order_id):
    # This function will be traced
    dynamodb = boto3.resource('dynamodb')
    table = dynamodb.Table('Orders')

    with xray_recorder.in_subsegment('get_order') as subsegment:
        subsegment.put_annotation('order_id', order_id)
        response = table.get_item(Key={'id': order_id})

    return response['Item']

def lambda_handler(event, context):
    order = process_order(event['orderId'])
    return {
        'statusCode': 200,
        'body': json.dumps(order)
    }
```

### CloudTrail

**Enable CloudTrail:**
```yaml
Resources:
  Trail:
    Type: AWS::CloudTrail::Trail
    Properties:
      TrailName: OrganizationTrail
      S3BucketName: !Ref TrailBucket
      IncludeGlobalServiceEvents: true
      IsLogging: true
      IsMultiRegionTrail: true
      EventSelectors:
        - ReadWriteType: All
          IncludeManagementEvents: true
          DataResources:
            - Type: AWS::S3::Object
              Values:
                - !Sub '${SensitiveBucket.Arn}/*'
            - Type: AWS::Lambda::Function
              Values:
                - !Sub 'arn:aws:lambda:*:${AWS::AccountId}:function/*'
      InsightSelectors:
        - InsightType: ApiCallRateInsight

  TrailBucket:
    Type: AWS::S3::Bucket
    Properties:
      BucketEncryption:
        ServerSideEncryptionConfiguration:
          - ServerSideEncryptionByDefault:
              SSEAlgorithm: AES256
      PublicAccessBlockConfiguration:
        BlockPublicAcls: true
        BlockPublicPolicy: true
        IgnorePublicAcls: true
        RestrictPublicBuckets: true
```

---

## Best Practices

### Well-Architected Framework

**Five Pillars:**

1. **Operational Excellence**
   - Perform operations as code
   - Make frequent, small, reversible changes
   - Refine operations procedures frequently
   - Anticipate failure
   - Learn from operational failures

2. **Security**
   - Implement strong identity foundation
   - Enable traceability
   - Apply security at all layers
   - Automate security best practices
   - Protect data in transit and at rest
   - Keep people away from data
   - Prepare for security events

3. **Reliability**
   - Automatically recover from failure
   - Test recovery procedures
   - Scale horizontally for resilience
   - Stop guessing capacity
   - Manage change through automation

4. **Performance Efficiency**
   - Democratize advanced technologies
   - Go global in minutes
   - Use serverless architectures
   - Experiment more often
   - Consider mechanical sympathy

5. **Cost Optimization**
   - Implement cloud financial management
   - Adopt consumption model
   - Measure overall efficiency
   - Stop spending on undifferentiated heavy lifting
   - Analyze and attribute expenditure

### Deployment Strategies

**Blue/Green Deployment:**
```yaml
Resources:
  # Blue Environment
  BlueTargetGroup:
    Type: AWS::ElasticLoadBalancingV2::TargetGroup
    Properties:
      Name: Blue-TargetGroup
      VpcId: !Ref VPC
      Port: 80
      Protocol: HTTP

  # Green Environment
  GreenTargetGroup:
    Type: AWS::ElasticLoadBalancingV2::TargetGroup
    Properties:
      Name: Green-TargetGroup
      VpcId: !Ref VPC
      Port: 80
      Protocol: HTTP

  # Listener with weighted routing
  Listener:
    Type: AWS::ElasticLoadBalancingV2::Listener
    Properties:
      DefaultActions:
        - Type: forward
          ForwardConfig:
            TargetGroups:
              - TargetGroupArn: !Ref BlueTargetGroup
                Weight: 90
              - TargetGroupArn: !Ref GreenTargetGroup
                Weight: 10
      LoadBalancerArn: !Ref LoadBalancer
      Port: 80
      Protocol: HTTP
```

**Canary Deployment:**
```yaml
# Using CodeDeploy
Resources:
  DeploymentConfig:
    Type: AWS::CodeDeploy::DeploymentConfig
    Properties:
      DeploymentConfigName: Canary10Percent5Minutes
      MinimumHealthyHosts:
        Type: HOST_COUNT
        Value: 1
      TrafficRoutingConfig:
        Type: TimeBasedCanary
        TimeBasedCanary:
          CanaryPercentage: 10
          CanaryInterval: 5
```

### Disaster Recovery

**Backup Strategy:**
```yaml
Resources:
  BackupVault:
    Type: AWS::Backup::BackupVault
    Properties:
      BackupVaultName: ProductionBackupVault
      EncryptionKeyArn: !GetAtt BackupKey.Arn

  BackupPlan:
    Type: AWS::Backup::BackupPlan
    Properties:
      BackupPlan:
        BackupPlanName: DailyBackups
        BackupPlanRule:
          - RuleName: DailyBackup
            TargetBackupVault: !Ref BackupVault
            ScheduleExpression: cron(0 5 ? * * *)
            StartWindowMinutes: 60
            CompletionWindowMinutes: 120
            Lifecycle:
              DeleteAfterDays: 30
              MoveToColdStorageAfterDays: 7

  BackupSelection:
    Type: AWS::Backup::BackupSelection
    Properties:
      BackupPlanId: !Ref BackupPlan
      BackupSelection:
        SelectionName: ProductionResources
        IamRoleArn: !GetAtt BackupRole.Arn
        Resources:
          - !Sub 'arn:aws:ec2:*:${AWS::AccountId}:instance/*'
          - !Sub 'arn:aws:rds:*:${AWS::AccountId}:db:*'
        ListOfTags:
          - ConditionType: STRINGEQUALS
            ConditionKey: Environment
            ConditionValue: Production
```

---

## Practical Examples

### Example 1: Serverless REST API

**Architecture:**
```
API Gateway → Lambda → DynamoDB
     ↓
CloudWatch Logs
```

**CloudFormation Template:**
```yaml
AWSTemplateFormatVersion: '2010-09-09'
Transform: AWS::Serverless-2016-10-31
Description: Serverless REST API

Resources:
  # DynamoDB Table
  Table:
    Type: AWS::DynamoDB::Table
    Properties:
      TableName: Users
      BillingMode: PAY_PER_REQUEST
      AttributeDefinitions:
        - AttributeName: userId
          AttributeType: S
      KeySchema:
        - AttributeName: userId
          KeyType: HASH
      StreamSpecification:
        StreamViewType: NEW_AND_OLD_IMAGES

  # Lambda Function
  ApiFunction:
    Type: AWS::Serverless::Function
    Properties:
      CodeUri: ./src
      Handler: index.handler
      Runtime: python3.11
      Environment:
        Variables:
          TABLE_NAME: !Ref Table
      Policies:
        - DynamoDBCrudPolicy:
            TableName: !Ref Table
      Events:
        GetUser:
          Type: Api
          Properties:
            Path: /users/{userId}
            Method: GET
        CreateUser:
          Type: Api
          Properties:
            Path: /users
            Method: POST
        UpdateUser:
          Type: Api
          Properties:
            Path: /users/{userId}
            Method: PUT
        DeleteUser:
          Type: Api
          Properties:
            Path: /users/{userId}
            Method: DELETE

Outputs:
  ApiUrl:
    Description: API Gateway endpoint URL
    Value: !Sub 'https://${ServerlessRestApi}.execute-api.${AWS::Region}.amazonaws.com/Prod/'
```

**Lambda Handler:**
```python
import json
import boto3
import os
from decimal import Decimal

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table(os.environ['TABLE_NAME'])

class DecimalEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, Decimal):
            return float(obj)
        return super(DecimalEncoder, self).default(obj)

def handler(event, context):
    http_method = event['httpMethod']
    path = event['path']

    try:
        if http_method == 'GET':
            user_id = event['pathParameters']['userId']
            response = table.get_item(Key={'userId': user_id})
            return {
                'statusCode': 200,
                'body': json.dumps(response.get('Item'), cls=DecimalEncoder),
                'headers': {'Content-Type': 'application/json'}
            }

        elif http_method == 'POST':
            body = json.loads(event['body'])
            table.put_item(Item=body)
            return {
                'statusCode': 201,
                'body': json.dumps({'message': 'User created'}),
                'headers': {'Content-Type': 'application/json'}
            }

        elif http_method == 'PUT':
            user_id = event['pathParameters']['userId']
            body = json.loads(event['body'])
            table.update_item(
                Key={'userId': user_id},
                UpdateExpression='SET #name = :name, email = :email',
                ExpressionAttributeNames={'#name': 'name'},
                ExpressionAttributeValues={
                    ':name': body['name'],
                    ':email': body['email']
                }
            )
            return {
                'statusCode': 200,
                'body': json.dumps({'message': 'User updated'}),
                'headers': {'Content-Type': 'application/json'}
            }

        elif http_method == 'DELETE':
            user_id = event['pathParameters']['userId']
            table.delete_item(Key={'userId': user_id})
            return {
                'statusCode': 200,
                'body': json.dumps({'message': 'User deleted'}),
                'headers': {'Content-Type': 'application/json'}
            }

    except Exception as e:
        return {
            'statusCode': 500,
            'body': json.dumps({'error': str(e)}),
            'headers': {'Content-Type': 'application/json'}
        }
```

### Example 2: Static Website Hosting

**Architecture:**
```
S3 Bucket → CloudFront → Route 53
     ↓
CloudWatch Metrics
```

**CloudFormation Template:**
```yaml
AWSTemplateFormatVersion: '2010-09-09'
Description: Static website hosting with CloudFront

Parameters:
  DomainName:
    Type: String
    Description: Domain name for the website

Resources:
  # S3 Bucket
  WebsiteBucket:
    Type: AWS::S3::Bucket
    Properties:
      BucketName: !Ref DomainName
      WebsiteConfiguration:
        IndexDocument: index.html
        ErrorDocument: error.html
      PublicAccessBlockConfiguration:
        BlockPublicAcls: false
        BlockPublicPolicy: false
        IgnorePublicAcls: false
        RestrictPublicBuckets: false

  # Bucket Policy
  BucketPolicy:
    Type: AWS::S3::BucketPolicy
    Properties:
      Bucket: !Ref WebsiteBucket
      PolicyDocument:
        Statement:
          - Effect: Allow
            Principal:
              Service: cloudfront.amazonaws.com
            Action: s3:GetObject
            Resource: !Sub '${WebsiteBucket.Arn}/*'
            Condition:
              StringEquals:
                AWS:SourceArn: !Sub 'arn:aws:cloudfront::${AWS::AccountId}:distribution/${CloudFrontDistribution}'

  # CloudFront Origin Access Control
  OriginAccessControl:
    Type: AWS::CloudFront::OriginAccessControl
    Properties:
      OriginAccessControlConfig:
        Name: !Sub '${DomainName}-OAC'
        OriginAccessControlOriginType: s3
        SigningBehavior: always
        SigningProtocol: sigv4

  # CloudFront Distribution
  CloudFrontDistribution:
    Type: AWS::CloudFront::Distribution
    Properties:
      DistributionConfig:
        Enabled: true
        DefaultRootObject: index.html
        Origins:
          - Id: S3Origin
            DomainName: !GetAtt WebsiteBucket.RegionalDomainName
            OriginAccessControlId: !Ref OriginAccessControl
            S3OriginConfig: {}
        DefaultCacheBehavior:
          TargetOriginId: S3Origin
          ViewerProtocolPolicy: redirect-to-https
          AllowedMethods:
            - GET
            - HEAD
            - OPTIONS
          CachedMethods:
            - GET
            - HEAD
          ForwardedValues:
            QueryString: false
            Cookies:
              Forward: none
          Compress: true
          MinTTL: 0
          DefaultTTL: 86400
          MaxTTL: 31536000
        CustomErrorResponses:
          - ErrorCode: 403
            ResponseCode: 200
            ResponsePagePath: /index.html
          - ErrorCode: 404
            ResponseCode: 200
            ResponsePagePath: /index.html
        Aliases:
          - !Ref DomainName
        ViewerCertificate:
          AcmCertificateArn: !Ref Certificate
          SslSupportMethod: sni-only
          MinimumProtocolVersion: TLSv1.2_2021

  # ACM Certificate
  Certificate:
    Type: AWS::CertificateManager::Certificate
    Properties:
      DomainName: !Ref DomainName
      ValidationMethod: DNS

  # Route 53 Record
  DNSRecord:
    Type: AWS::Route53::RecordSet
    Properties:
      HostedZoneName: !Sub '${DomainName}.'
      Name: !Ref DomainName
      Type: A
      AliasTarget:
        DNSName: !GetAtt CloudFrontDistribution.DomainName
        HostedZoneId: Z2FDTNDATAQYW2 # CloudFront hosted zone ID

Outputs:
  WebsiteURL:
    Value: !Sub 'https://${DomainName}'
  CloudFrontURL:
    Value: !GetAtt CloudFrontDistribution.DomainName
  BucketName:
    Value: !Ref WebsiteBucket
```

### Example 3: CI/CD Pipeline

**Architecture:**
```
CodeCommit → CodeBuild → CodeDeploy → EC2/ECS
      ↓
   CloudWatch Events
```

**CodePipeline Configuration:**
```yaml
Resources:
  Pipeline:
    Type: AWS::CodePipeline::Pipeline
    Properties:
      Name: MyAppPipeline
      RoleArn: !GetAtt PipelineRole.Arn
      ArtifactStore:
        Type: S3
        Location: !Ref ArtifactBucket
      Stages:
        # Source Stage
        - Name: Source
          Actions:
            - Name: SourceAction
              ActionTypeId:
                Category: Source
                Owner: AWS
                Provider: CodeCommit
                Version: 1
              Configuration:
                RepositoryName: !Ref Repository
                BranchName: main
              OutputArtifacts:
                - Name: SourceOutput

        # Build Stage
        - Name: Build
          Actions:
            - Name: BuildAction
              ActionTypeId:
                Category: Build
                Owner: AWS
                Provider: CodeBuild
                Version: 1
              Configuration:
                ProjectName: !Ref BuildProject
              InputArtifacts:
                - Name: SourceOutput
              OutputArtifacts:
                - Name: BuildOutput

        # Deploy Stage
        - Name: Deploy
          Actions:
            - Name: DeployAction
              ActionTypeId:
                Category: Deploy
                Owner: AWS
                Provider: CodeDeploy
                Version: 1
              Configuration:
                ApplicationName: !Ref DeploymentApplication
                DeploymentGroupName: !Ref DeploymentGroup
              InputArtifacts:
                - Name: BuildOutput

  BuildProject:
    Type: AWS::CodeBuild::Project
    Properties:
      Name: MyAppBuild
      ServiceRole: !GetAtt BuildRole.Arn
      Artifacts:
        Type: CODEPIPELINE
      Environment:
        Type: LINUX_CONTAINER
        ComputeType: BUILD_GENERAL1_SMALL
        Image: aws/codebuild/standard:7.0
        EnvironmentVariables:
          - Name: AWS_ACCOUNT_ID
            Value: !Ref AWS::AccountId
      Source:
        Type: CODEPIPELINE
        BuildSpec: |
          version: 0.2
          phases:
            pre_build:
              commands:
                - echo Logging in to Amazon ECR...
                - aws ecr get-login-password --region $AWS_DEFAULT_REGION | docker login --username AWS --password-stdin $AWS_ACCOUNT_ID.dkr.ecr.$AWS_DEFAULT_REGION.amazonaws.com
            build:
              commands:
                - echo Build started on `date`
                - echo Building the Docker image...
                - docker build -t myapp:latest .
                - docker tag myapp:latest $AWS_ACCOUNT_ID.dkr.ecr.$AWS_DEFAULT_REGION.amazonaws.com/myapp:latest
            post_build:
              commands:
                - echo Build completed on `date`
                - echo Pushing the Docker image...
                - docker push $AWS_ACCOUNT_ID.dkr.ecr.$AWS_DEFAULT_REGION.amazonaws.com/myapp:latest
          artifacts:
            files:
              - '**/*'
```

---

## Summary

This AWS Expert skill provides comprehensive knowledge of:

1. **Core Services**: EC2, S3, RDS, Lambda, VPC, and more
2. **Architecture Patterns**: High availability, serverless, microservices, multi-region
3. **Infrastructure as Code**: CloudFormation and CDK
4. **Security**: IAM, encryption, network security, secrets management
5. **Cost Optimization**: Right-sizing, reserved instances, tagging, budgets
6. **Monitoring**: CloudWatch, X-Ray, CloudTrail
7. **Best Practices**: Well-Architected Framework, deployment strategies, disaster recovery

**Key Takeaways:**
- Design for failure and high availability
- Automate everything with IaC
- Implement security at every layer
- Monitor and optimize costs continuously
- Follow Well-Architected Framework principles
- Use managed services when possible
- Implement proper tagging strategy
- Enable comprehensive logging and monitoring

**Next Steps:**
1. Review AWS Well-Architected Framework whitepapers
2. Get AWS certifications (Solutions Architect, Developer, SysOps)
3. Practice with hands-on labs
4. Build production-ready architectures
5. Stay updated with new AWS services and features
