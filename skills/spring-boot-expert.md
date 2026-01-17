---
name: spring-boot-expert
description: Spring Boot framework expertise. Provides Spring Boot architecture, auto-configuration, REST APIs, data access, security, Actuator, profiles, and testing. Use when working with Spring Boot applications.
version: 1.0.0
tags:
  - spring-boot
  - java
  - rest-api
  - spring
  - framework
category: domain-expert
dependencies: []
priority: 70
context_threshold: 0.7
auto_load: false
estimated_tokens: 8000
---

# Spring Boot Expert Skill

Expert guidance for Spring Boot framework development, covering architecture, REST APIs, data access, security, monitoring, configuration, testing, and production-grade best practices.

## Table of Contents

1. [Spring Boot Architecture](#spring-boot-architecture)
2. [REST API Development](#rest-api-development)
3. [Data Access with Spring Data JPA](#data-access-with-spring-data-jpa)
4. [Security](#security)
5. [Actuator & Monitoring](#actuator--monitoring)
6. [Configuration Management](#configuration-management)
7. [Testing](#testing)
8. [Best Practices](#best-practices)
9. [Practical Examples](#practical-examples)

---

## Spring Boot Architecture

### Core Concepts

**Auto-Configuration**
- Spring Boot automatically configures beans based on classpath dependencies
- Uses `@ConditionalOnClass`, `@ConditionalOnMissingBean`, `@ConditionalOnProperty`
- Located in `spring-boot-autoconfigure` JAR
- Can be customized or disabled via `exclude` attribute

**Starters**
- Opinionated dependency descriptors
- `spring-boot-starter-web`: Web applications (Spring MVC, Tomcat)
- `spring-boot-starter-data-jpa`: JPA with Hibernate
- `spring-boot-starter-security`: Spring Security
- `spring-boot-starter-actuator`: Production-ready features
- `spring-boot-starter-test`: Testing libraries (JUnit, Mockito, AssertJ)

**Component Scanning**
```java
@SpringBootApplication
// Equivalent to:
// @Configuration
// @EnableAutoConfiguration
// @ComponentScan(basePackages = "com.example")
public class Application {
    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }
}
```

**Dependency Injection**
```java
// Constructor injection (recommended)
@Service
public class UserService {
    private final UserRepository userRepository;
    private final EmailService emailService;

    public UserService(UserRepository userRepository,
                      EmailService emailService) {
        this.userRepository = userRepository;
        this.emailService = emailService;
    }
}

// Field injection (not recommended - harder to test)
@Service
public class OrderService {
    @Autowired
    private OrderRepository orderRepository; // Avoid this
}
```

**Bean Scopes**
- `@Singleton` (default): Single instance per Spring container
- `@Prototype`: New instance per request
- `@RequestScope`: HTTP request lifecycle (web apps)
- `@SessionScope`: HTTP session lifecycle

**Application Events**
```java
@Component
public class ApplicationStartupListener {

    @EventListener(ApplicationReadyEvent.class)
    public void onApplicationReady() {
        // Execute after application fully started
        System.out.println("Application is ready!");
    }

    @EventListener(ContextRefreshedEvent.class)
    public void onContextRefreshed() {
        // Execute when ApplicationContext initialized
    }
}
```

### Project Structure

```
src/main/java/com/example/myapp/
├── MyAppApplication.java          # Main class
├── config/                        # Configuration classes
│   ├── SecurityConfig.java
│   ├── DataSourceConfig.java
│   └── AsyncConfig.java
├── controller/                    # REST controllers
│   ├── UserController.java
│   └── ProductController.java
├── service/                       # Business logic
│   ├── UserService.java
│   └── ProductService.java
├── repository/                    # Data access
│   ├── UserRepository.java
│   └── ProductRepository.java
├── model/                         # Domain entities
│   ├── User.java
│   └── Product.java
├── dto/                          # Data transfer objects
│   ├── UserRequest.java
│   ├── UserResponse.java
│   └── ErrorResponse.java
├── exception/                     # Custom exceptions
│   ├── ResourceNotFoundException.java
│   └── GlobalExceptionHandler.java
└── util/                         # Utilities
    └── DateUtils.java

src/main/resources/
├── application.yml               # Main config
├── application-dev.yml           # Dev profile
├── application-prod.yml          # Prod profile
├── db/migration/                 # Flyway migrations
│   └── V1__initial_schema.sql
└── static/                       # Static resources
```

---

## REST API Development

### RestController Basics

```java
@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
@Validated
public class UserController {

    private final UserService userService;

    @GetMapping
    public ResponseEntity<Page<UserResponse>> getAllUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id,desc") String[] sort) {

        Pageable pageable = PageRequest.of(page, size,
            Sort.by(parseSortParams(sort)));
        Page<UserResponse> users = userService.findAll(pageable);
        return ResponseEntity.ok(users);
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserResponse> getUserById(
            @PathVariable @Positive Long id) {
        return userService.findById(id)
            .map(ResponseEntity::ok)
            .orElseThrow(() -> new ResourceNotFoundException(
                "User not found with id: " + id));
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ResponseEntity<UserResponse> createUser(
            @Valid @RequestBody UserRequest request) {
        UserResponse user = userService.create(request);
        URI location = ServletUriComponentsBuilder
            .fromCurrentRequest()
            .path("/{id}")
            .buildAndExpand(user.getId())
            .toUri();
        return ResponseEntity.created(location).body(user);
    }

    @PutMapping("/{id}")
    public ResponseEntity<UserResponse> updateUser(
            @PathVariable Long id,
            @Valid @RequestBody UserRequest request) {
        UserResponse updated = userService.update(id, request);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        userService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
```

### Request/Response DTOs with Validation

```java
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserRequest {

    @NotBlank(message = "Username is required")
    @Size(min = 3, max = 50, message = "Username must be 3-50 characters")
    @Pattern(regexp = "^[a-zA-Z0-9_-]+$",
             message = "Username can only contain alphanumeric characters, dash and underscore")
    private String username;

    @NotBlank(message = "Email is required")
    @Email(message = "Email must be valid")
    private String email;

    @NotBlank(message = "Password is required")
    @Size(min = 8, message = "Password must be at least 8 characters")
    @Pattern(regexp = "^(?=.*[A-Z])(?=.*[a-z])(?=.*\\d).*$",
             message = "Password must contain uppercase, lowercase, and digit")
    private String password;

    @NotNull(message = "Age is required")
    @Min(value = 18, message = "Age must be at least 18")
    @Max(value = 120, message = "Age must not exceed 120")
    private Integer age;

    @NotEmpty(message = "At least one role is required")
    private Set<String> roles;
}

@Data
@Builder
public class UserResponse {
    private Long id;
    private String username;
    private String email;
    private Integer age;
    private Set<String> roles;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
```

### Global Exception Handling

```java
@RestControllerAdvice
@Slf4j
public class GlobalExceptionHandler {

    @ExceptionHandler(ResourceNotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public ErrorResponse handleResourceNotFound(
            ResourceNotFoundException ex, WebRequest request) {
        log.error("Resource not found: {}", ex.getMessage());
        return ErrorResponse.builder()
            .timestamp(LocalDateTime.now())
            .status(HttpStatus.NOT_FOUND.value())
            .error("Not Found")
            .message(ex.getMessage())
            .path(((ServletWebRequest) request).getRequest().getRequestURI())
            .build();
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ErrorResponse handleValidationErrors(
            MethodArgumentNotValidException ex, WebRequest request) {

        Map<String, String> errors = ex.getBindingResult()
            .getFieldErrors()
            .stream()
            .collect(Collectors.toMap(
                FieldError::getField,
                error -> error.getDefaultMessage() != null
                    ? error.getDefaultMessage()
                    : "Invalid value"
            ));

        return ErrorResponse.builder()
            .timestamp(LocalDateTime.now())
            .status(HttpStatus.BAD_REQUEST.value())
            .error("Validation Failed")
            .message("Input validation failed")
            .validationErrors(errors)
            .path(((ServletWebRequest) request).getRequest().getRequestURI())
            .build();
    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    @ResponseStatus(HttpStatus.CONFLICT)
    public ErrorResponse handleDataIntegrityViolation(
            DataIntegrityViolationException ex, WebRequest request) {
        log.error("Data integrity violation: {}", ex.getMessage());
        return ErrorResponse.builder()
            .timestamp(LocalDateTime.now())
            .status(HttpStatus.CONFLICT.value())
            .error("Data Conflict")
            .message("Data integrity constraint violated")
            .path(((ServletWebRequest) request).getRequest().getRequestURI())
            .build();
    }

    @ExceptionHandler(Exception.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    public ErrorResponse handleGlobalException(
            Exception ex, WebRequest request) {
        log.error("Unexpected error: ", ex);
        return ErrorResponse.builder()
            .timestamp(LocalDateTime.now())
            .status(HttpStatus.INTERNAL_SERVER_ERROR.value())
            .error("Internal Server Error")
            .message("An unexpected error occurred")
            .path(((ServletWebRequest) request).getRequest().getRequestURI())
            .build();
    }
}

@Data
@Builder
public class ErrorResponse {
    private LocalDateTime timestamp;
    private int status;
    private String error;
    private String message;
    private String path;
    private Map<String, String> validationErrors;
}
```

### HATEOAS (Hypermedia)

```java
@RestController
@RequestMapping("/api/v1/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @GetMapping("/{id}")
    public EntityModel<OrderResponse> getOrder(@PathVariable Long id) {
        OrderResponse order = orderService.findById(id);

        return EntityModel.of(order,
            linkTo(methodOn(OrderController.class).getOrder(id))
                .withSelfRel(),
            linkTo(methodOn(OrderController.class).getAllOrders())
                .withRel("orders"),
            linkTo(methodOn(OrderController.class).cancelOrder(id))
                .withRel("cancel"),
            linkTo(methodOn(UserController.class)
                .getUserById(order.getUserId()))
                .withRel("user")
        );
    }

    @GetMapping
    public CollectionModel<EntityModel<OrderResponse>> getAllOrders() {
        List<EntityModel<OrderResponse>> orders = orderService.findAll()
            .stream()
            .map(order -> EntityModel.of(order,
                linkTo(methodOn(OrderController.class)
                    .getOrder(order.getId())).withSelfRel()))
            .collect(Collectors.toList());

        return CollectionModel.of(orders,
            linkTo(methodOn(OrderController.class).getAllOrders())
                .withSelfRel());
    }
}
```

### Content Negotiation

```java
@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void configureContentNegotiation(
            ContentNegotiationConfigurer configurer) {
        configurer
            .favorParameter(true)
            .parameterName("mediaType")
            .defaultContentType(MediaType.APPLICATION_JSON)
            .mediaType("json", MediaType.APPLICATION_JSON)
            .mediaType("xml", MediaType.APPLICATION_XML);
    }
}

// Controller supports both JSON and XML
@GetMapping(produces = {
    MediaType.APPLICATION_JSON_VALUE,
    MediaType.APPLICATION_XML_VALUE
})
public ResponseEntity<UserResponse> getUser(@PathVariable Long id) {
    return ResponseEntity.ok(userService.findById(id));
}
```

---

## Data Access with Spring Data JPA

### Entity Mapping

```java
@Entity
@Table(name = "users", indexes = {
    @Index(name = "idx_username", columnList = "username"),
    @Index(name = "idx_email", columnList = "email")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EntityListeners(AuditingEntityListener.class)
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 50)
    private String username;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private Integer age;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "user_roles",
                    joinColumns = @JoinColumn(name = "user_id"))
    @Column(name = "role")
    private Set<String> roles = new HashSet<>();

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL,
               orphanRemoval = true)
    private List<Order> orders = new ArrayList<>();

    @CreatedDate
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(nullable = false)
    private LocalDateTime updatedAt;

    @Version
    private Long version; // Optimistic locking

    // Helper methods for bidirectional relationship
    public void addOrder(Order order) {
        orders.add(order);
        order.setUser(this);
    }

    public void removeOrder(Order order) {
        orders.remove(order);
        order.setUser(null);
    }
}

@Entity
@Table(name = "orders")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private BigDecimal totalAmount;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private OrderStatus status;

    @CreatedDate
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;
}
```

### Repository Interfaces

```java
@Repository
public interface UserRepository extends JpaRepository<User, Long>,
                                       JpaSpecificationExecutor<User> {

    // Query method keywords
    Optional<User> findByUsername(String username);
    Optional<User> findByEmail(String email);
    List<User> findByAgeGreaterThan(Integer age);
    List<User> findByRolesContaining(String role);

    // @Query with JPQL
    @Query("SELECT u FROM User u WHERE u.age BETWEEN :minAge AND :maxAge")
    List<User> findByAgeRange(@Param("minAge") Integer minAge,
                             @Param("maxAge") Integer maxAge);

    // Native query
    @Query(value = "SELECT * FROM users u WHERE u.created_at > :date",
           nativeQuery = true)
    List<User> findRecentUsers(@Param("date") LocalDateTime date);

    // Projection
    @Query("SELECT new com.example.dto.UserSummary(u.id, u.username, u.email) " +
           "FROM User u WHERE u.id = :id")
    Optional<UserSummary> findUserSummaryById(@Param("id") Long id);

    // Modifying query
    @Modifying
    @Query("UPDATE User u SET u.age = :age WHERE u.id = :id")
    int updateAge(@Param("id") Long id, @Param("age") Integer age);

    // Custom method with Specification
    default Page<User> findByDynamicCriteria(
            String username, Integer minAge, Pageable pageable) {
        return findAll((root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            if (username != null) {
                predicates.add(cb.like(root.get("username"),
                    "%" + username + "%"));
            }
            if (minAge != null) {
                predicates.add(cb.greaterThanOrEqualTo(
                    root.get("age"), minAge));
            }
            return cb.and(predicates.toArray(new Predicate[0]));
        }, pageable);
    }
}
```

### Service Layer with Transactions

```java
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
@Slf4j
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final UserMapper userMapper; // MapStruct mapper

    public Page<UserResponse> findAll(Pageable pageable) {
        return userRepository.findAll(pageable)
            .map(userMapper::toResponse);
    }

    public Optional<UserResponse> findById(Long id) {
        return userRepository.findById(id)
            .map(userMapper::toResponse);
    }

    @Transactional
    public UserResponse create(UserRequest request) {
        log.info("Creating user: {}", request.getUsername());

        // Check if username exists
        if (userRepository.findByUsername(request.getUsername()).isPresent()) {
            throw new DuplicateResourceException(
                "Username already exists: " + request.getUsername());
        }

        // Check if email exists
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new DuplicateResourceException(
                "Email already exists: " + request.getEmail());
        }

        User user = userMapper.toEntity(request);
        user.setPassword(passwordEncoder.encode(request.getPassword()));

        User saved = userRepository.save(user);
        log.info("User created successfully: {}", saved.getId());

        return userMapper.toResponse(saved);
    }

    @Transactional
    public UserResponse update(Long id, UserRequest request) {
        log.info("Updating user: {}", id);

        User user = userRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException(
                "User not found: " + id));

        // Update fields
        user.setEmail(request.getEmail());
        user.setAge(request.getAge());
        user.setRoles(request.getRoles());

        User updated = userRepository.save(user);
        log.info("User updated successfully: {}", updated.getId());

        return userMapper.toResponse(updated);
    }

    @Transactional
    public void delete(Long id) {
        log.info("Deleting user: {}", id);

        if (!userRepository.existsById(id)) {
            throw new ResourceNotFoundException("User not found: " + id);
        }

        userRepository.deleteById(id);
        log.info("User deleted successfully: {}", id);
    }

    // Complex transaction with multiple operations
    @Transactional
    public void transferOrders(Long fromUserId, Long toUserId) {
        User fromUser = userRepository.findById(fromUserId)
            .orElseThrow(() -> new ResourceNotFoundException(
                "Source user not found"));
        User toUser = userRepository.findById(toUserId)
            .orElseThrow(() -> new ResourceNotFoundException(
                "Target user not found"));

        List<Order> orders = new ArrayList<>(fromUser.getOrders());
        orders.forEach(order -> {
            fromUser.removeOrder(order);
            toUser.addOrder(order);
        });

        userRepository.save(fromUser);
        userRepository.save(toUser);
    }
}
```

### Custom Repository Implementation

```java
public interface CustomUserRepository {
    List<User> findByComplexCriteria(UserSearchCriteria criteria);
}

@Repository
@RequiredArgsConstructor
public class CustomUserRepositoryImpl implements CustomUserRepository {

    private final EntityManager entityManager;

    @Override
    public List<User> findByComplexCriteria(UserSearchCriteria criteria) {
        CriteriaBuilder cb = entityManager.getCriteriaBuilder();
        CriteriaQuery<User> query = cb.createQuery(User.class);
        Root<User> user = query.from(User.class);

        List<Predicate> predicates = new ArrayList<>();

        if (criteria.getUsername() != null) {
            predicates.add(cb.like(user.get("username"),
                "%" + criteria.getUsername() + "%"));
        }

        if (criteria.getMinAge() != null) {
            predicates.add(cb.greaterThanOrEqualTo(
                user.get("age"), criteria.getMinAge()));
        }

        if (criteria.getRoles() != null && !criteria.getRoles().isEmpty()) {
            Join<User, String> rolesJoin = user.join("roles");
            predicates.add(rolesJoin.in(criteria.getRoles()));
        }

        query.where(predicates.toArray(new Predicate[0]));

        return entityManager.createQuery(query).getResultList();
    }
}

// Extend both JpaRepository and custom interface
public interface UserRepository extends JpaRepository<User, Long>,
                                       CustomUserRepository {
    // Standard methods...
}
```

---

## Security

### Basic Security Configuration

```java
@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthFilter;
    private final AuthenticationProvider authenticationProvider;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http)
            throws Exception {
        return http
            .csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(auth -> auth
                .requestMatchers(
                    "/api/v1/auth/**",
                    "/actuator/health",
                    "/v3/api-docs/**",
                    "/swagger-ui/**"
                ).permitAll()
                .requestMatchers("/api/v1/admin/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.GET, "/api/v1/users/**")
                    .hasAnyRole("USER", "ADMIN")
                .requestMatchers(HttpMethod.POST, "/api/v1/users/**")
                    .hasRole("ADMIN")
                .anyRequest().authenticated()
            )
            .sessionManagement(session -> session
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            )
            .authenticationProvider(authenticationProvider)
            .addFilterBefore(jwtAuthFilter,
                UsernamePasswordAuthenticationFilter.class)
            .build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(12);
    }

    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public AuthenticationProvider authenticationProvider(
            UserDetailsService userDetailsService) {
        DaoAuthenticationProvider provider =
            new DaoAuthenticationProvider();
        provider.setUserDetailsService(userDetailsService);
        provider.setPasswordEncoder(passwordEncoder());
        return provider;
    }
}
```

### JWT Authentication

```java
@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain) throws ServletException, IOException {

        final String authHeader = request.getHeader("Authorization");

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        final String jwt = authHeader.substring(7);
        final String username = jwtService.extractUsername(jwt);

        if (username != null &&
            SecurityContextHolder.getContext().getAuthentication() == null) {

            UserDetails userDetails =
                userDetailsService.loadUserByUsername(username);

            if (jwtService.isTokenValid(jwt, userDetails)) {
                UsernamePasswordAuthenticationToken authToken =
                    new UsernamePasswordAuthenticationToken(
                        userDetails,
                        null,
                        userDetails.getAuthorities()
                    );

                authToken.setDetails(
                    new WebAuthenticationDetailsSource()
                        .buildDetails(request)
                );

                SecurityContextHolder.getContext()
                    .setAuthentication(authToken);
            }
        }

        filterChain.doFilter(request, response);
    }
}

@Service
public class JwtService {

    @Value("${jwt.secret}")
    private String secretKey;

    @Value("${jwt.expiration}")
    private long jwtExpiration;

    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    public <T> T extractClaim(String token,
                              Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    public String generateToken(UserDetails userDetails) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("roles", userDetails.getAuthorities());
        return generateToken(claims, userDetails);
    }

    public String generateToken(Map<String, Object> extraClaims,
                               UserDetails userDetails) {
        return Jwts.builder()
            .setClaims(extraClaims)
            .setSubject(userDetails.getUsername())
            .setIssuedAt(new Date(System.currentTimeMillis()))
            .setExpiration(new Date(System.currentTimeMillis() + jwtExpiration))
            .signWith(getSignInKey(), SignatureAlgorithm.HS256)
            .compact();
    }

    public boolean isTokenValid(String token, UserDetails userDetails) {
        final String username = extractUsername(token);
        return (username.equals(userDetails.getUsername()))
            && !isTokenExpired(token);
    }

    private boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    private Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    private Claims extractAllClaims(String token) {
        return Jwts.parserBuilder()
            .setSigningKey(getSignInKey())
            .build()
            .parseClaimsJws(token)
            .getBody();
    }

    private Key getSignInKey() {
        byte[] keyBytes = Decoders.BASE64.decode(secretKey);
        return Keys.hmacShaKeyFor(keyBytes);
    }
}
```

### Method Security

```java
@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;

    @PreAuthorize("hasRole('ADMIN')")
    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    @PreAuthorize("hasRole('USER') and #userId == authentication.principal.id")
    public List<Order> getUserOrders(Long userId) {
        return orderRepository.findByUserId(userId);
    }

    @PostAuthorize("returnObject.userId == authentication.principal.id")
    public Order getOrder(Long orderId) {
        return orderRepository.findById(orderId)
            .orElseThrow(() -> new ResourceNotFoundException(
                "Order not found"));
    }

    @PreAuthorize("@orderSecurityService.canCancelOrder(#orderId)")
    public void cancelOrder(Long orderId) {
        Order order = orderRepository.findById(orderId)
            .orElseThrow(() -> new ResourceNotFoundException(
                "Order not found"));
        order.setStatus(OrderStatus.CANCELLED);
        orderRepository.save(order);
    }
}

@Service
public class OrderSecurityService {

    @Autowired
    private OrderRepository orderRepository;

    public boolean canCancelOrder(Long orderId) {
        Authentication auth = SecurityContextHolder.getContext()
            .getAuthentication();

        if (auth == null) {
            return false;
        }

        Order order = orderRepository.findById(orderId).orElse(null);
        if (order == null) {
            return false;
        }

        UserDetails user = (UserDetails) auth.getPrincipal();
        return order.getUser().getUsername().equals(user.getUsername())
            || auth.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
    }
}
```

### OAuth2 Resource Server

```java
@Configuration
public class OAuth2ResourceServerConfig {

    @Bean
    public SecurityFilterChain oauth2FilterChain(HttpSecurity http)
            throws Exception {
        return http
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/public/**").permitAll()
                .anyRequest().authenticated()
            )
            .oauth2ResourceServer(oauth2 -> oauth2
                .jwt(jwt -> jwt
                    .jwtAuthenticationConverter(jwtAuthenticationConverter())
                )
            )
            .build();
    }

    @Bean
    public JwtAuthenticationConverter jwtAuthenticationConverter() {
        JwtGrantedAuthoritiesConverter grantedAuthoritiesConverter =
            new JwtGrantedAuthoritiesConverter();
        grantedAuthoritiesConverter.setAuthoritiesClaimName("roles");
        grantedAuthoritiesConverter.setAuthorityPrefix("ROLE_");

        JwtAuthenticationConverter converter =
            new JwtAuthenticationConverter();
        converter.setJwtGrantedAuthoritiesConverter(
            grantedAuthoritiesConverter);
        return converter;
    }
}
```

---

## Actuator & Monitoring

### Configuration

```yaml
# application.yml
management:
  endpoints:
    web:
      exposure:
        include: health,info,metrics,prometheus,loggers,env
      base-path: /actuator
  endpoint:
    health:
      show-details: when-authorized
      probes:
        enabled: true
  metrics:
    export:
      prometheus:
        enabled: true
    tags:
      application: ${spring.application.name}
      environment: ${spring.profiles.active}
  health:
    diskspace:
      threshold: 10GB
    db:
      enabled: true
```

### Custom Health Indicators

```java
@Component
public class CustomHealthIndicator implements HealthIndicator {

    @Autowired
    private ExternalService externalService;

    @Override
    public Health health() {
        try {
            boolean isHealthy = externalService.ping();

            if (isHealthy) {
                return Health.up()
                    .withDetail("service", "external-api")
                    .withDetail("status", "reachable")
                    .withDetail("responseTime", "120ms")
                    .build();
            } else {
                return Health.down()
                    .withDetail("service", "external-api")
                    .withDetail("status", "unreachable")
                    .build();
            }
        } catch (Exception e) {
            return Health.down()
                .withDetail("service", "external-api")
                .withDetail("error", e.getMessage())
                .build();
        }
    }
}

@Component
public class DatabaseHealthIndicator extends AbstractHealthIndicator {

    @Autowired
    private DataSource dataSource;

    @Override
    protected void doHealthCheck(Health.Builder builder) throws Exception {
        try (Connection conn = dataSource.getConnection();
             Statement stmt = conn.createStatement();
             ResultSet rs = stmt.executeQuery("SELECT 1")) {

            if (rs.next()) {
                builder.up()
                    .withDetail("database", "PostgreSQL")
                    .withDetail("validationQuery", "SELECT 1");
            } else {
                builder.down()
                    .withDetail("error", "Validation query failed");
            }
        }
    }
}
```

### Custom Metrics

```java
@Component
@RequiredArgsConstructor
public class OrderMetrics {

    private final MeterRegistry meterRegistry;
    private final Counter orderCreatedCounter;
    private final Timer orderProcessingTimer;

    @PostConstruct
    public void init() {
        // Counter
        Metrics.counter("orders.created",
            "type", "standard").increment();

        // Gauge
        Metrics.gauge("orders.pending",
            orderRepository,
            repo -> repo.countByStatus(OrderStatus.PENDING));

        // Timer
        orderProcessingTimer = Timer.builder("orders.processing.time")
            .description("Time to process orders")
            .tag("service", "order")
            .register(meterRegistry);
    }

    public void recordOrderCreated(String orderType) {
        meterRegistry.counter("orders.created",
            "type", orderType).increment();
    }

    public void recordOrderProcessing(Runnable task) {
        orderProcessingTimer.record(task);
    }

    public <T> T recordOrderProcessing(Supplier<T> task) {
        return orderProcessingTimer.record(task);
    }
}

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderMetrics orderMetrics;

    @Transactional
    public Order createOrder(OrderRequest request) {
        return orderMetrics.recordOrderProcessing(() -> {
            Order order = // ... create order
            orderMetrics.recordOrderCreated(order.getType());
            return order;
        });
    }
}
```

### Custom Endpoints

```java
@Component
@Endpoint(id = "features")
public class FeaturesEndpoint {

    private final Map<String, Feature> features = new ConcurrentHashMap<>();

    @ReadOperation
    public Map<String, Feature> features() {
        return features;
    }

    @ReadOperation
    public Feature feature(@Selector String name) {
        return features.get(name);
    }

    @WriteOperation
    public void configureFeature(@Selector String name,
                                 boolean enabled) {
        features.put(name, new Feature(enabled));
    }

    @DeleteOperation
    public void deleteFeature(@Selector String name) {
        features.remove(name);
    }

    public static class Feature {
        private boolean enabled;

        public Feature(boolean enabled) {
            this.enabled = enabled;
        }

        public boolean isEnabled() {
            return enabled;
        }

        public void setEnabled(boolean enabled) {
            this.enabled = enabled;
        }
    }
}
```

---

## Configuration Management

### Application Properties

```yaml
# application.yml (base configuration)
spring:
  application:
    name: my-app

  datasource:
    url: jdbc:postgresql://localhost:5432/mydb
    username: ${DB_USERNAME}
    driver-class-name: org.postgresql.Driver

  jpa:
    hibernate:
      ddl-auto: validate
    show-sql: false
    properties:
      hibernate:
        format_sql: true
        dialect: org.hibernate.dialect.PostgreSQLDialect

  flyway:
    enabled: true
    baseline-on-migrate: true
    locations: classpath:db/migration

server:
  port: 8080
  compression:
    enabled: true
  error:
    include-message: always
    include-binding-errors: always

logging:
  level:
    root: INFO
    com.example: DEBUG
  pattern:
    console: "%d{yyyy-MM-dd HH:mm:ss} - %msg%n"
    file: "%d{yyyy-MM-dd HH:mm:ss} [%thread] %-5level %logger{36} - %msg%n"

---
# application-dev.yml
spring:
  config:
    activate:
      on-profile: dev

  datasource:
    url: jdbc:postgresql://localhost:5432/mydb_dev
    password: ${DB_PASSWORD:dev_password}

  jpa:
    show-sql: true
    hibernate:
      ddl-auto: update

logging:
  level:
    com.example: DEBUG
    org.hibernate.SQL: DEBUG

---
# application-prod.yml
spring:
  config:
    activate:
      on-profile: prod

  datasource:
    url: ${DATABASE_URL}
    password: ${DB_PASSWORD}
    hikari:
      maximum-pool-size: 20
      minimum-idle: 5

  jpa:
    hibernate:
      ddl-auto: validate
    show-sql: false

logging:
  level:
    root: WARN
    com.example: INFO
```

### Type-Safe Configuration Properties

```java
@Configuration
@ConfigurationProperties(prefix = "app")
@Validated
@Data
public class AppProperties {

    @NotNull
    private String name;

    @NotNull
    private Security security = new Security();

    @NotNull
    private Cors cors = new Cors();

    @Data
    public static class Security {
        @NotBlank
        private String jwtSecret;

        @Positive
        private long jwtExpiration = 86400000; // 24 hours

        @NotEmpty
        private List<String> allowedOrigins;
    }

    @Data
    public static class Cors {
        @NotEmpty
        private List<String> allowedOrigins;

        @NotEmpty
        private List<String> allowedMethods = Arrays.asList(
            "GET", "POST", "PUT", "DELETE", "OPTIONS"
        );

        @NotEmpty
        private List<String> allowedHeaders = Arrays.asList("*");

        private boolean allowCredentials = true;

        @Positive
        private long maxAge = 3600;
    }
}

// Usage in configuration
@Configuration
@RequiredArgsConstructor
public class CorsConfig {

    private final AppProperties appProperties;

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                AppProperties.Cors cors = appProperties.getCors();
                registry.addMapping("/api/**")
                    .allowedOrigins(cors.getAllowedOrigins()
                        .toArray(new String[0]))
                    .allowedMethods(cors.getAllowedMethods()
                        .toArray(new String[0]))
                    .allowedHeaders(cors.getAllowedHeaders()
                        .toArray(new String[0]))
                    .allowCredentials(cors.isAllowCredentials())
                    .maxAge(cors.getMaxAge());
            }
        };
    }
}
```

### Environment-Specific Beans

```java
@Configuration
public class DataSourceConfig {

    @Bean
    @Profile("dev")
    public DataSource devDataSource() {
        return DataSourceBuilder.create()
            .url("jdbc:h2:mem:testdb")
            .driverClassName("org.h2.Driver")
            .username("sa")
            .password("")
            .build();
    }

    @Bean
    @Profile("prod")
    public DataSource prodDataSource(
            @Value("${spring.datasource.url}") String url,
            @Value("${spring.datasource.username}") String username,
            @Value("${spring.datasource.password}") String password) {

        HikariConfig config = new HikariConfig();
        config.setJdbcUrl(url);
        config.setUsername(username);
        config.setPassword(password);
        config.setMaximumPoolSize(20);
        config.setMinimumIdle(5);
        config.setConnectionTimeout(30000);
        config.setIdleTimeout(600000);
        config.setMaxLifetime(1800000);

        return new HikariDataSource(config);
    }
}
```

---

## Testing

### Unit Tests

```java
@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private UserMapper userMapper;

    @InjectMocks
    private UserService userService;

    @Test
    @DisplayName("Should create user successfully")
    void shouldCreateUserSuccessfully() {
        // Given
        UserRequest request = UserRequest.builder()
            .username("testuser")
            .email("test@example.com")
            .password("Password123")
            .age(25)
            .roles(Set.of("USER"))
            .build();

        User user = User.builder()
            .id(1L)
            .username("testuser")
            .email("test@example.com")
            .build();

        UserResponse expectedResponse = UserResponse.builder()
            .id(1L)
            .username("testuser")
            .email("test@example.com")
            .build();

        when(userRepository.findByUsername("testuser"))
            .thenReturn(Optional.empty());
        when(userRepository.findByEmail("test@example.com"))
            .thenReturn(Optional.empty());
        when(userMapper.toEntity(request)).thenReturn(user);
        when(passwordEncoder.encode("Password123"))
            .thenReturn("encoded_password");
        when(userRepository.save(any(User.class))).thenReturn(user);
        when(userMapper.toResponse(user)).thenReturn(expectedResponse);

        // When
        UserResponse result = userService.create(request);

        // Then
        assertThat(result).isNotNull();
        assertThat(result.getUsername()).isEqualTo("testuser");
        assertThat(result.getEmail()).isEqualTo("test@example.com");

        verify(userRepository).findByUsername("testuser");
        verify(userRepository).findByEmail("test@example.com");
        verify(userRepository).save(any(User.class));
        verify(passwordEncoder).encode("Password123");
    }

    @Test
    @DisplayName("Should throw exception when username already exists")
    void shouldThrowExceptionWhenUsernameExists() {
        // Given
        UserRequest request = UserRequest.builder()
            .username("existinguser")
            .email("test@example.com")
            .build();

        when(userRepository.findByUsername("existinguser"))
            .thenReturn(Optional.of(new User()));

        // When & Then
        assertThatThrownBy(() -> userService.create(request))
            .isInstanceOf(DuplicateResourceException.class)
            .hasMessageContaining("Username already exists");

        verify(userRepository).findByUsername("existinguser");
        verify(userRepository, never()).save(any());
    }
}
```

### Controller Tests with MockMvc

```java
@WebMvcTest(UserController.class)
class UserControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private UserService userService;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    @DisplayName("GET /api/v1/users/{id} - Success")
    void shouldGetUserById() throws Exception {
        // Given
        Long userId = 1L;
        UserResponse response = UserResponse.builder()
            .id(userId)
            .username("testuser")
            .email("test@example.com")
            .age(25)
            .build();

        when(userService.findById(userId))
            .thenReturn(Optional.of(response));

        // When & Then
        mockMvc.perform(get("/api/v1/users/{id}", userId)
                .contentType(MediaType.APPLICATION_JSON))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.id").value(userId))
            .andExpect(jsonPath("$.username").value("testuser"))
            .andExpect(jsonPath("$.email").value("test@example.com"))
            .andDo(print());

        verify(userService).findById(userId);
    }

    @Test
    @DisplayName("POST /api/v1/users - Success")
    void shouldCreateUser() throws Exception {
        // Given
        UserRequest request = UserRequest.builder()
            .username("newuser")
            .email("new@example.com")
            .password("Password123")
            .age(30)
            .roles(Set.of("USER"))
            .build();

        UserResponse response = UserResponse.builder()
            .id(1L)
            .username("newuser")
            .email("new@example.com")
            .age(30)
            .build();

        when(userService.create(any(UserRequest.class)))
            .thenReturn(response);

        // When & Then
        mockMvc.perform(post("/api/v1/users")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isCreated())
            .andExpect(header().exists("Location"))
            .andExpect(jsonPath("$.id").value(1))
            .andExpect(jsonPath("$.username").value("newuser"))
            .andDo(print());

        verify(userService).create(any(UserRequest.class));
    }

    @Test
    @DisplayName("POST /api/v1/users - Validation Failure")
    void shouldReturnBadRequestForInvalidInput() throws Exception {
        // Given
        UserRequest invalidRequest = UserRequest.builder()
            .username("ab") // Too short
            .email("invalid-email") // Invalid format
            .password("weak") // Too short
            .age(15) // Below minimum
            .build();

        // When & Then
        mockMvc.perform(post("/api/v1/users")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(invalidRequest)))
            .andExpect(status().isBadRequest())
            .andExpect(jsonPath("$.error").value("Validation Failed"))
            .andExpect(jsonPath("$.validationErrors").exists())
            .andDo(print());

        verify(userService, never()).create(any());
    }
}
```

### Repository Tests with @DataJpaTest

```java
@DataJpaTest
@AutoConfigureTestDatabase(replace = Replace.NONE)
class UserRepositoryTest {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TestEntityManager entityManager;

    @Test
    @DisplayName("Should find user by username")
    void shouldFindUserByUsername() {
        // Given
        User user = User.builder()
            .username("testuser")
            .email("test@example.com")
            .password("password")
            .age(25)
            .build();
        entityManager.persistAndFlush(user);

        // When
        Optional<User> found = userRepository.findByUsername("testuser");

        // Then
        assertThat(found).isPresent();
        assertThat(found.get().getUsername()).isEqualTo("testuser");
        assertThat(found.get().getEmail()).isEqualTo("test@example.com");
    }

    @Test
    @DisplayName("Should find users by age range")
    void shouldFindUsersByAgeRange() {
        // Given
        entityManager.persist(User.builder()
            .username("user1").email("user1@test.com")
            .password("pass").age(20).build());
        entityManager.persist(User.builder()
            .username("user2").email("user2@test.com")
            .password("pass").age(30).build());
        entityManager.persist(User.builder()
            .username("user3").email("user3@test.com")
            .password("pass").age(40).build());
        entityManager.flush();

        // When
        List<User> users = userRepository.findByAgeRange(25, 35);

        // Then
        assertThat(users).hasSize(1);
        assertThat(users.get(0).getUsername()).isEqualTo("user2");
    }
}
```

### Integration Tests with TestContainers

```java
@SpringBootTest(webEnvironment = WebEnvironment.RANDOM_PORT)
@Testcontainers
class UserIntegrationTest {

    @Container
    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>(
        "postgres:15-alpine")
        .withDatabaseName("testdb")
        .withUsername("test")
        .withPassword("test");

    @DynamicPropertySource
    static void configureProperties(DynamicPropertyRegistry registry) {
        registry.add("spring.datasource.url", postgres::getJdbcUrl);
        registry.add("spring.datasource.username", postgres::getUsername);
        registry.add("spring.datasource.password", postgres::getPassword);
    }

    @Autowired
    private TestRestTemplate restTemplate;

    @Autowired
    private UserRepository userRepository;

    @BeforeEach
    void setUp() {
        userRepository.deleteAll();
    }

    @Test
    @DisplayName("Should create and retrieve user")
    void shouldCreateAndRetrieveUser() {
        // Given
        UserRequest request = UserRequest.builder()
            .username("integrationuser")
            .email("integration@test.com")
            .password("Password123")
            .age(28)
            .roles(Set.of("USER"))
            .build();

        // When - Create user
        ResponseEntity<UserResponse> createResponse = restTemplate
            .postForEntity("/api/v1/users", request, UserResponse.class);

        // Then - Verify creation
        assertThat(createResponse.getStatusCode())
            .isEqualTo(HttpStatus.CREATED);
        assertThat(createResponse.getBody()).isNotNull();
        Long userId = createResponse.getBody().getId();

        // When - Retrieve user
        ResponseEntity<UserResponse> getResponse = restTemplate
            .getForEntity("/api/v1/users/" + userId, UserResponse.class);

        // Then - Verify retrieval
        assertThat(getResponse.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(getResponse.getBody()).isNotNull();
        assertThat(getResponse.getBody().getUsername())
            .isEqualTo("integrationuser");
        assertThat(getResponse.getBody().getEmail())
            .isEqualTo("integration@test.com");
    }
}
```

---

## Best Practices

### Project Structure Best Practices

1. **Layered Architecture**
   - Controller: HTTP handling only
   - Service: Business logic
   - Repository: Data access
   - DTOs: Request/Response objects separate from entities

2. **Dependency Injection**
   - Use constructor injection (recommended)
   - Avoid field injection
   - Use `@RequiredArgsConstructor` from Lombok

3. **Exception Handling**
   - Global exception handler with `@RestControllerAdvice`
   - Custom exceptions for business logic
   - Proper HTTP status codes
   - Consistent error response format

### Performance Best Practices

```java
// 1. Use pagination for large datasets
@GetMapping
public Page<UserResponse> getUsers(Pageable pageable) {
    return userService.findAll(pageable);
}

// 2. Use projections to fetch only needed fields
public interface UserSummary {
    Long getId();
    String getUsername();
    String getEmail();
}

@Query("SELECT u.id as id, u.username as username, u.email as email " +
       "FROM User u")
List<UserSummary> findAllSummaries();

// 3. Optimize queries with @EntityGraph to avoid N+1
@EntityGraph(attributePaths = {"orders", "roles"})
Optional<User> findWithOrdersById(Long id);

// 4. Use caching for frequently accessed data
@Service
public class UserService {

    @Cacheable(value = "users", key = "#id")
    public UserResponse findById(Long id) {
        return userRepository.findById(id)
            .map(userMapper::toResponse)
            .orElseThrow(() -> new ResourceNotFoundException(
                "User not found"));
    }

    @CacheEvict(value = "users", key = "#id")
    public void delete(Long id) {
        userRepository.deleteById(id);
    }

    @CachePut(value = "users", key = "#result.id")
    public UserResponse update(Long id, UserRequest request) {
        // Update logic
    }
}

// 5. Use async processing for long-running tasks
@Service
public class EmailService {

    @Async
    public CompletableFuture<Void> sendWelcomeEmail(String email) {
        // Send email asynchronously
        return CompletableFuture.completedFuture(null);
    }
}
```

### Logging Best Practices

```java
@Service
@Slf4j
public class UserService {

    public UserResponse create(UserRequest request) {
        // Log at appropriate levels
        log.info("Creating user: {}", request.getUsername());
        log.debug("User details: {}", request);

        try {
            // Business logic
            User saved = userRepository.save(user);
            log.info("User created successfully: id={}", saved.getId());
            return userMapper.toResponse(saved);

        } catch (DataIntegrityViolationException e) {
            log.error("Failed to create user: {}", e.getMessage());
            throw new DuplicateResourceException("User already exists");
        } catch (Exception e) {
            log.error("Unexpected error creating user", e);
            throw e;
        }
    }
}

// Structured logging with MDC (Mapped Diagnostic Context)
@Component
public class LoggingFilter extends OncePerRequestFilter {

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                   HttpServletResponse response,
                                   FilterChain filterChain)
            throws ServletException, IOException {

        String requestId = UUID.randomUUID().toString();
        MDC.put("requestId", requestId);
        MDC.put("method", request.getMethod());
        MDC.put("path", request.getRequestURI());

        try {
            filterChain.doFilter(request, response);
        } finally {
            MDC.clear();
        }
    }
}
```

### Error Handling Best Practices

```java
// Custom exception hierarchy
public class BusinessException extends RuntimeException {
    public BusinessException(String message) {
        super(message);
    }
}

public class ResourceNotFoundException extends BusinessException {
    public ResourceNotFoundException(String message) {
        super(message);
    }
}

public class DuplicateResourceException extends BusinessException {
    public DuplicateResourceException(String message) {
        super(message);
    }
}

// Global exception handler
@RestControllerAdvice
@Slf4j
public class GlobalExceptionHandler {

    @ExceptionHandler(BusinessException.class)
    public ResponseEntity<ErrorResponse> handleBusinessException(
            BusinessException ex, WebRequest request) {

        HttpStatus status = determineStatus(ex);
        log.error("Business exception: {}", ex.getMessage());

        return new ResponseEntity<>(
            ErrorResponse.builder()
                .timestamp(LocalDateTime.now())
                .status(status.value())
                .error(status.getReasonPhrase())
                .message(ex.getMessage())
                .path(getRequestPath(request))
                .build(),
            status
        );
    }

    private HttpStatus determineStatus(BusinessException ex) {
        if (ex instanceof ResourceNotFoundException) {
            return HttpStatus.NOT_FOUND;
        } else if (ex instanceof DuplicateResourceException) {
            return HttpStatus.CONFLICT;
        }
        return HttpStatus.BAD_REQUEST;
    }
}
```

---

## Practical Examples

### Example 1: Complete REST API with Validation

```java
// Entity
@Entity
@Table(name = "products")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String description;

    @Column(nullable = false)
    private BigDecimal price;

    @Column(nullable = false)
    private Integer stock;

    @Enumerated(EnumType.STRING)
    private ProductCategory category;

    @CreatedDate
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;
}

// Request DTO
@Data
@Builder
public class ProductRequest {

    @NotBlank(message = "Product name is required")
    @Size(min = 3, max = 100)
    private String name;

    @NotBlank(message = "Description is required")
    @Size(max = 500)
    private String description;

    @NotNull(message = "Price is required")
    @DecimalMin(value = "0.01", message = "Price must be greater than 0")
    private BigDecimal price;

    @NotNull(message = "Stock is required")
    @Min(value = 0, message = "Stock cannot be negative")
    private Integer stock;

    @NotNull(message = "Category is required")
    private ProductCategory category;
}

// Response DTO
@Data
@Builder
public class ProductResponse {
    private Long id;
    private String name;
    private String description;
    private BigDecimal price;
    private Integer stock;
    private ProductCategory category;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}

// Repository
@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    List<Product> findByCategory(ProductCategory category);

    @Query("SELECT p FROM Product p WHERE p.stock < :threshold")
    List<Product> findLowStockProducts(@Param("threshold") Integer threshold);

    Page<Product> findByNameContainingIgnoreCase(String name, Pageable pageable);
}

// Service
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
@Slf4j
public class ProductService {

    private final ProductRepository productRepository;
    private final ProductMapper productMapper;

    public Page<ProductResponse> findAll(Pageable pageable) {
        return productRepository.findAll(pageable)
            .map(productMapper::toResponse);
    }

    public ProductResponse findById(Long id) {
        return productRepository.findById(id)
            .map(productMapper::toResponse)
            .orElseThrow(() -> new ResourceNotFoundException(
                "Product not found: " + id));
    }

    @Transactional
    public ProductResponse create(ProductRequest request) {
        log.info("Creating product: {}", request.getName());

        Product product = productMapper.toEntity(request);
        Product saved = productRepository.save(product);

        log.info("Product created: id={}", saved.getId());
        return productMapper.toResponse(saved);
    }

    @Transactional
    public ProductResponse update(Long id, ProductRequest request) {
        log.info("Updating product: {}", id);

        Product product = productRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException(
                "Product not found: " + id));

        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setPrice(request.getPrice());
        product.setStock(request.getStock());
        product.setCategory(request.getCategory());

        Product updated = productRepository.save(product);
        log.info("Product updated: id={}", updated.getId());

        return productMapper.toResponse(updated);
    }

    @Transactional
    public void delete(Long id) {
        log.info("Deleting product: {}", id);

        if (!productRepository.existsById(id)) {
            throw new ResourceNotFoundException("Product not found: " + id);
        }

        productRepository.deleteById(id);
        log.info("Product deleted: {}", id);
    }
}

// Controller
@RestController
@RequestMapping("/api/v1/products")
@RequiredArgsConstructor
@Validated
public class ProductController {

    private final ProductService productService;

    @GetMapping
    public ResponseEntity<Page<ProductResponse>> getAllProducts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "id,desc") String[] sort) {

        Pageable pageable = PageRequest.of(page, size,
            Sort.by(parseSortParams(sort)));
        Page<ProductResponse> products = productService.findAll(pageable);
        return ResponseEntity.ok(products);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductResponse> getProductById(
            @PathVariable @Positive Long id) {
        ProductResponse product = productService.findById(id);
        return ResponseEntity.ok(product);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ResponseEntity<ProductResponse> createProduct(
            @Valid @RequestBody ProductRequest request) {
        ProductResponse product = productService.create(request);
        URI location = ServletUriComponentsBuilder
            .fromCurrentRequest()
            .path("/{id}")
            .buildAndExpand(product.getId())
            .toUri();
        return ResponseEntity.created(location).body(product);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProductResponse> updateProduct(
            @PathVariable Long id,
            @Valid @RequestBody ProductRequest request) {
        ProductResponse updated = productService.update(id, request);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        productService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
```

### Example 2: Async Processing with CompletableFuture

```java
@Configuration
@EnableAsync
public class AsyncConfig {

    @Bean(name = "taskExecutor")
    public Executor taskExecutor() {
        ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
        executor.setCorePoolSize(5);
        executor.setMaxPoolSize(10);
        executor.setQueueCapacity(100);
        executor.setThreadNamePrefix("async-");
        executor.initialize();
        return executor;
    }
}

@Service
@Slf4j
public class NotificationService {

    @Async("taskExecutor")
    public CompletableFuture<Void> sendEmail(String to, String subject,
                                            String body) {
        log.info("Sending email to: {}", to);

        try {
            // Simulate email sending
            Thread.sleep(2000);
            log.info("Email sent successfully to: {}", to);
            return CompletableFuture.completedFuture(null);
        } catch (Exception e) {
            log.error("Failed to send email: {}", e.getMessage());
            return CompletableFuture.failedFuture(e);
        }
    }

    @Async("taskExecutor")
    public CompletableFuture<Void> sendSMS(String to, String message) {
        log.info("Sending SMS to: {}", to);

        try {
            // Simulate SMS sending
            Thread.sleep(1000);
            log.info("SMS sent successfully to: {}", to);
            return CompletableFuture.completedFuture(null);
        } catch (Exception e) {
            log.error("Failed to send SMS: {}", e.getMessage());
            return CompletableFuture.failedFuture(e);
        }
    }
}

@Service
@RequiredArgsConstructor
@Slf4j
public class OrderService {

    private final OrderRepository orderRepository;
    private final NotificationService notificationService;

    @Transactional
    public Order createOrder(OrderRequest request) {
        Order order = orderRepository.save(buildOrder(request));

        // Send notifications asynchronously
        CompletableFuture<Void> emailFuture =
            notificationService.sendEmail(
                request.getEmail(),
                "Order Confirmation",
                "Your order #" + order.getId() + " has been placed"
            );

        CompletableFuture<Void> smsFuture =
            notificationService.sendSMS(
                request.getPhone(),
                "Order placed: #" + order.getId()
            );

        // Wait for both to complete (optional)
        CompletableFuture.allOf(emailFuture, smsFuture)
            .thenRun(() -> log.info("All notifications sent for order: {}",
                order.getId()))
            .exceptionally(ex -> {
                log.error("Failed to send notifications: {}", ex.getMessage());
                return null;
            });

        return order;
    }
}
```

### Example 3: Scheduled Tasks & Batch Processing

```java
@Configuration
@EnableScheduling
public class SchedulingConfig {

    @Bean
    public TaskScheduler taskScheduler() {
        ThreadPoolTaskScheduler scheduler = new ThreadPoolTaskScheduler();
        scheduler.setPoolSize(5);
        scheduler.setThreadNamePrefix("scheduled-");
        scheduler.initialize();
        return scheduler;
    }
}

@Component
@RequiredArgsConstructor
@Slf4j
public class ScheduledTasks {

    private final OrderRepository orderRepository;
    private final EmailService emailService;

    // Run every day at 2 AM
    @Scheduled(cron = "0 0 2 * * *")
    public void cleanupOldOrders() {
        log.info("Starting cleanup of old orders");

        LocalDateTime cutoffDate = LocalDateTime.now().minusDays(90);
        List<Order> oldOrders = orderRepository
            .findByCreatedAtBeforeAndStatus(
                cutoffDate, OrderStatus.COMPLETED);

        log.info("Found {} old orders to archive", oldOrders.size());

        oldOrders.forEach(order -> {
            // Archive order
            archiveOrder(order);
            orderRepository.delete(order);
        });

        log.info("Cleanup completed");
    }

    // Run every hour
    @Scheduled(fixedRate = 3600000)
    public void sendPendingReminders() {
        log.info("Checking for pending order reminders");

        LocalDateTime reminderThreshold =
            LocalDateTime.now().minusHours(24);

        List<Order> pendingOrders = orderRepository
            .findByStatusAndCreatedAtBefore(
                OrderStatus.PENDING, reminderThreshold);

        pendingOrders.forEach(order -> {
            emailService.sendOrderReminder(order);
            log.info("Reminder sent for order: {}", order.getId());
        });
    }

    // Run every 5 minutes with initial delay of 1 minute
    @Scheduled(fixedDelay = 300000, initialDelay = 60000)
    public void updateInventory() {
        log.info("Updating inventory cache");
        // Update logic
    }
}
```

---

## Summary

This Spring Boot Expert skill provides:

1. **Architecture Fundamentals**: Auto-configuration, dependency injection, component scanning
2. **REST API Development**: Controllers, validation, exception handling, HATEOAS
3. **Data Access**: JPA entities, repositories, query methods, transactions
4. **Security**: JWT authentication, method security, OAuth2 resource server
5. **Monitoring**: Actuator endpoints, custom metrics, health indicators
6. **Configuration**: Type-safe properties, profiles, environment-specific beans
7. **Testing**: Unit tests, integration tests, MockMvc, TestContainers
8. **Best Practices**: Project structure, performance, logging, error handling

**When to Use This Skill:**
- Building RESTful APIs with Spring Boot
- Implementing authentication and authorization
- Configuring Spring Data JPA repositories
- Setting up monitoring and health checks
- Writing comprehensive tests
- Following Spring Boot best practices

**Key Patterns:**
- Layered architecture (Controller → Service → Repository)
- Constructor-based dependency injection
- DTO pattern for request/response
- Global exception handling
- Async processing with `@Async`
- Scheduled tasks with `@Scheduled`
- Type-safe configuration properties

This skill covers Spring Boot 3.x patterns with Java 17+ features, production-ready configurations, and industry best practices.
