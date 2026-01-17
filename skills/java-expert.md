---
name: java-expert
description: Java language and ecosystem expertise. Provides Java language features, collections, streams, concurrency, performance optimization, design patterns, and testing strategies. Use when working with Java development.
version: 1.0.0
tags: [java, jvm, programming, collections, concurrency]
category: domain-expert
author: Claude
created: 2025-01-10
updated: 2025-01-10
---

# Java Expert Skill

## Overview

This skill provides comprehensive expertise in Java development, covering modern language features (Java 8-21), collections framework, streams API, concurrency patterns, performance optimization, design patterns, and testing strategies. Use this skill when working on Java projects, optimizing code, or implementing enterprise-grade solutions.

---

## Java Language Features

### Modern Java Features (Java 8-21)

#### Lambda Expressions & Functional Interfaces (Java 8)
```java
// Functional interface
@FunctionalInterface
interface Calculator {
    int calculate(int a, int b);
}

// Lambda expression
Calculator add = (a, b) -> a + b;
Calculator multiply = (a, b) -> a * b;

// Method reference
List<String> names = Arrays.asList("Alice", "Bob", "Charlie");
names.forEach(System.out::println);

// Built-in functional interfaces
Predicate<String> isEmpty = String::isEmpty;
Function<String, Integer> length = String::length;
Consumer<String> print = System.out::println;
Supplier<LocalDateTime> now = LocalDateTime::now;
```

#### Records (Java 14+)
```java
// Traditional class
public class PersonOld {
    private final String name;
    private final int age;

    public PersonOld(String name, int age) {
        this.name = name;
        this.age = age;
    }

    // Getters, equals, hashCode, toString...
}

// Record (auto-generates constructor, getters, equals, hashCode, toString)
public record Person(String name, int age) {
    // Compact constructor for validation
    public Person {
        if (age < 0) {
            throw new IllegalArgumentException("Age cannot be negative");
        }
    }

    // Additional methods
    public boolean isAdult() {
        return age >= 18;
    }
}

// Usage
Person person = new Person("Alice", 30);
String name = person.name(); // Auto-generated accessor
```

#### Sealed Classes (Java 17+)
```java
// Sealed class hierarchy
public sealed interface Shape
    permits Circle, Rectangle, Triangle {
    double area();
}

public final class Circle implements Shape {
    private final double radius;

    public Circle(double radius) {
        this.radius = radius;
    }

    @Override
    public double area() {
        return Math.PI * radius * radius;
    }
}

public final class Rectangle implements Shape {
    private final double width, height;

    public Rectangle(double width, double height) {
        this.width = width;
        this.height = height;
    }

    @Override
    public double area() {
        return width * height;
    }
}

public non-sealed class Triangle implements Shape {
    // Can be extended
    private final double base, height;

    public Triangle(double base, double height) {
        this.base = base;
        this.height = height;
    }

    @Override
    public double area() {
        return 0.5 * base * height;
    }
}
```

#### Pattern Matching (Java 16+)
```java
// Pattern matching for instanceof
public String describe(Object obj) {
    if (obj instanceof String s) {
        return "String of length " + s.length();
    } else if (obj instanceof Integer i) {
        return "Integer: " + i;
    }
    return "Unknown type";
}

// Pattern matching in switch (Java 21)
public String describeShape(Shape shape) {
    return switch (shape) {
        case Circle c -> "Circle with radius " + c.radius();
        case Rectangle r -> "Rectangle " + r.width() + "x" + r.height();
        case Triangle t -> "Triangle with base " + t.base();
        case null -> "No shape";
    };
}

// Guard patterns
public String classify(Object obj) {
    return switch (obj) {
        case String s when s.isEmpty() -> "Empty string";
        case String s when s.length() < 10 -> "Short string";
        case String s -> "Long string: " + s;
        case Integer i when i < 0 -> "Negative number";
        case Integer i -> "Positive number: " + i;
        default -> "Unknown";
    };
}
```

#### Text Blocks (Java 15+)
```java
// Old way
String json = "{\n" +
              "  \"name\": \"Alice\",\n" +
              "  \"age\": 30\n" +
              "}";

// Text blocks
String jsonBlock = """
    {
      "name": "Alice",
      "age": 30
    }
    """;

// SQL query
String query = """
    SELECT u.name, u.email, o.total
    FROM users u
    JOIN orders o ON u.id = o.user_id
    WHERE o.status = 'COMPLETED'
    ORDER BY o.created_at DESC
    """;
```

#### Virtual Threads (Java 21)
```java
// Traditional thread
Thread traditionalThread = new Thread(() -> {
    System.out.println("Traditional thread");
});
traditionalThread.start();

// Virtual thread (lightweight, millions possible)
Thread virtualThread = Thread.ofVirtual().start(() -> {
    System.out.println("Virtual thread");
});

// ExecutorService with virtual threads
try (var executor = Executors.newVirtualThreadPerTaskExecutor()) {
    // Submit 10,000 tasks (no problem with virtual threads)
    for (int i = 0; i < 10_000; i++) {
        int taskId = i;
        executor.submit(() -> {
            // Simulate I/O-bound work
            Thread.sleep(Duration.ofSeconds(1));
            System.out.println("Task " + taskId + " completed");
            return null;
        });
    }
}

// Structured concurrency (Java 21 Preview)
try (var scope = new StructuredTaskScope.ShutdownOnFailure()) {
    Future<String> user = scope.fork(() -> fetchUser(userId));
    Future<List<Order>> orders = scope.fork(() -> fetchOrders(userId));

    scope.join();           // Wait for both
    scope.throwIfFailed();  // Throw if either failed

    return new UserProfile(user.resultNow(), orders.resultNow());
}
```

---

## Collections Framework

### Collection Hierarchy
```
Collection (interface)
├── List (interface)
│   ├── ArrayList (class)
│   ├── LinkedList (class)
│   └── Vector (class)
│       └── Stack (class)
├── Set (interface)
│   ├── HashSet (class)
│   ├── LinkedHashSet (class)
│   └── TreeSet (class)
└── Queue (interface)
    ├── PriorityQueue (class)
    ├── LinkedList (class)
    └── Deque (interface)
        └── ArrayDeque (class)

Map (interface)
├── HashMap (class)
├── LinkedHashMap (class)
├── TreeMap (class)
└── Hashtable (class)
    └── Properties (class)
```

### Performance Characteristics

| Collection | Add | Remove | Get | Contains | Notes |
|------------|-----|--------|-----|----------|-------|
| ArrayList | O(1) amortized | O(n) | O(1) | O(n) | Best for random access |
| LinkedList | O(1) | O(1) at ends | O(n) | O(n) | Best for frequent insertions |
| HashSet | O(1) | O(1) | N/A | O(1) | No duplicates, no order |
| TreeSet | O(log n) | O(log n) | N/A | O(log n) | Sorted, no duplicates |
| HashMap | O(1) | O(1) | O(1) | O(1) | Fast lookup, no order |
| TreeMap | O(log n) | O(log n) | O(log n) | O(log n) | Sorted keys |
| LinkedHashMap | O(1) | O(1) | O(1) | O(1) | Maintains insertion order |

### Practical Collection Examples

```java
// ArrayList: Best for random access, iteration
List<String> names = new ArrayList<>();
names.add("Alice");
names.add("Bob");
names.get(0); // O(1) access
names.remove(0); // O(n) - shifts elements

// LinkedList: Best for frequent insertions/deletions at ends
Deque<Task> taskQueue = new LinkedList<>();
taskQueue.addFirst(new Task("urgent")); // O(1)
taskQueue.addLast(new Task("normal"));  // O(1)
Task next = taskQueue.pollFirst();       // O(1)

// HashSet: Fast contains, no duplicates
Set<String> uniqueEmails = new HashSet<>();
uniqueEmails.add("alice@example.com");
boolean exists = uniqueEmails.contains("alice@example.com"); // O(1)

// TreeSet: Sorted unique elements
Set<Integer> sortedScores = new TreeSet<>();
sortedScores.add(85);
sortedScores.add(92);
sortedScores.add(78);
// Automatically sorted: [78, 85, 92]

// HashMap: Fast key-value lookup
Map<String, User> userCache = new HashMap<>();
userCache.put("alice123", new User("Alice"));
User user = userCache.get("alice123"); // O(1)

// TreeMap: Sorted keys
Map<LocalDate, List<Event>> eventsByDate = new TreeMap<>();
eventsByDate.put(LocalDate.now(), List.of(new Event("Meeting")));
// Keys automatically sorted by date

// LinkedHashMap: Maintains insertion order
Map<String, String> config = new LinkedHashMap<>();
config.put("host", "localhost");
config.put("port", "8080");
// Iteration preserves insertion order

// ConcurrentHashMap: Thread-safe without full locking
Map<String, AtomicInteger> counters = new ConcurrentHashMap<>();
counters.computeIfAbsent("requests", k -> new AtomicInteger()).incrementAndGet();
```

### Advanced Collection Operations

```java
// Immutable collections (Java 9+)
List<String> immutableList = List.of("a", "b", "c");
Set<Integer> immutableSet = Set.of(1, 2, 3);
Map<String, Integer> immutableMap = Map.of("one", 1, "two", 2);

// Collection copying
List<String> copy = List.copyOf(originalList); // Immutable copy
List<String> mutableCopy = new ArrayList<>(originalList); // Mutable copy

// Null-safe operations
List<String> list = new ArrayList<>();
list.add(null); // Allowed in ArrayList
// List.of(null); // Throws NullPointerException

Set<String> set = new HashSet<>();
set.add(null); // Allowed (one null)
// Set.of(null); // Throws NullPointerException

// Custom sorting
List<Person> people = new ArrayList<>();
people.sort(Comparator.comparing(Person::age)
    .thenComparing(Person::name));

// Reverse order
people.sort(Comparator.comparing(Person::age).reversed());

// Null-safe comparator
people.sort(Comparator.comparing(Person::name,
    Comparator.nullsLast(String::compareTo)));
```

---

## Streams API

### Stream Operations Overview

**Intermediate Operations** (lazy, return Stream):
- `filter()`, `map()`, `flatMap()`
- `distinct()`, `sorted()`, `peek()`
- `limit()`, `skip()`

**Terminal Operations** (eager, return result):
- `forEach()`, `collect()`, `reduce()`
- `count()`, `anyMatch()`, `allMatch()`, `noneMatch()`
- `findFirst()`, `findAny()`, `min()`, `max()`

### Common Stream Patterns

```java
List<Order> orders = getOrders();

// Filter and map
List<String> customerNames = orders.stream()
    .filter(order -> order.getTotal() > 100)
    .map(Order::getCustomerName)
    .distinct()
    .sorted()
    .collect(Collectors.toList());

// FlatMap for nested structures
List<Product> allProducts = orders.stream()
    .flatMap(order -> order.getItems().stream())
    .map(OrderItem::getProduct)
    .distinct()
    .collect(Collectors.toList());

// Group by
Map<String, List<Order>> ordersByCustomer = orders.stream()
    .collect(Collectors.groupingBy(Order::getCustomerName));

// Partition by condition
Map<Boolean, List<Order>> highValueOrders = orders.stream()
    .collect(Collectors.partitioningBy(order -> order.getTotal() > 1000));

// Sum, average, statistics
double totalRevenue = orders.stream()
    .mapToDouble(Order::getTotal)
    .sum();

OptionalDouble avgOrderValue = orders.stream()
    .mapToDouble(Order::getTotal)
    .average();

DoubleSummaryStatistics stats = orders.stream()
    .mapToDouble(Order::getTotal)
    .summaryStatistics();
// stats.getCount(), stats.getSum(), stats.getAverage(), stats.getMin(), stats.getMax()

// Reduce for custom aggregation
Optional<Order> largestOrder = orders.stream()
    .reduce((o1, o2) -> o1.getTotal() > o2.getTotal() ? o1 : o2);

// Joining strings
String customerList = orders.stream()
    .map(Order::getCustomerName)
    .distinct()
    .collect(Collectors.joining(", ", "Customers: ", "."));
// Result: "Customers: Alice, Bob, Charlie."
```

### Advanced Collectors

```java
// Custom collector
Collector<Order, ?, Map<String, Double>> revenueByCustomer =
    Collectors.groupingBy(
        Order::getCustomerName,
        Collectors.summingDouble(Order::getTotal)
    );

Map<String, Double> revenue = orders.stream()
    .collect(revenueByCustomer);

// Nested grouping
Map<String, Map<String, List<Order>>> ordersByCustomerAndStatus =
    orders.stream()
        .collect(Collectors.groupingBy(
            Order::getCustomerName,
            Collectors.groupingBy(Order::getStatus)
        ));

// Downstream collectors
Map<String, Long> orderCountByCustomer = orders.stream()
    .collect(Collectors.groupingBy(
        Order::getCustomerName,
        Collectors.counting()
    ));

Map<String, Optional<Order>> largestOrderByCustomer = orders.stream()
    .collect(Collectors.groupingBy(
        Order::getCustomerName,
        Collectors.maxBy(Comparator.comparing(Order::getTotal))
    ));

// Custom collector with Collector.of()
Collector<Order, ?, Set<String>> uniqueProductNames =
    Collector.of(
        HashSet::new,                               // Supplier
        (set, order) -> order.getItems().stream()   // Accumulator
            .map(item -> item.getProduct().getName())
            .forEach(set::add),
        (set1, set2) -> {                           // Combiner
            set1.addAll(set2);
            return set1;
        },
        Collector.Characteristics.UNORDERED         // Characteristics
    );
```

### Parallel Streams

```java
// Parallel processing
long count = orders.parallelStream()
    .filter(order -> order.getTotal() > 100)
    .count();

// When to use parallel streams:
// ✓ Large datasets (>10,000 elements)
// ✓ CPU-intensive operations
// ✓ Stateless operations
// ✗ Small datasets (overhead > benefit)
// ✗ I/O operations (blocking)
// ✗ Stateful operations (order matters)

// Sequential vs parallel performance
long startTime = System.nanoTime();

// Sequential
long sequentialSum = IntStream.rangeClosed(1, 1_000_000)
    .sum();

long sequentialTime = System.nanoTime() - startTime;

startTime = System.nanoTime();

// Parallel (may be faster for CPU-intensive work)
long parallelSum = IntStream.rangeClosed(1, 1_000_000)
    .parallel()
    .sum();

long parallelTime = System.nanoTime() - startTime;

// Force sequential processing
orders.parallelStream()
    .sequential()  // Back to sequential
    .forEach(System.out::println);
```

### Stream Best Practices

```java
// ✓ Good: Pure functions (no side effects)
List<String> upperNames = names.stream()
    .map(String::toUpperCase)
    .collect(Collectors.toList());

// ✗ Bad: Side effects in stream operations
List<String> processed = new ArrayList<>();
names.stream()
    .forEach(processed::add); // Use collect() instead!

// ✓ Good: Use collect() for accumulation
List<String> processed = names.stream()
    .collect(Collectors.toList());

// ✓ Good: Short-circuit operations
boolean hasHighValue = orders.stream()
    .anyMatch(order -> order.getTotal() > 10000); // Stops at first match

// ✗ Bad: Full stream processing when not needed
boolean hasHighValue = orders.stream()
    .filter(order -> order.getTotal() > 10000)
    .count() > 0; // Processes entire stream

// ✓ Good: Reuse streams by storing source
Supplier<Stream<Order>> streamSupplier = () -> orders.stream();
long count = streamSupplier.get().count();
double total = streamSupplier.get().mapToDouble(Order::getTotal).sum();

// ✗ Bad: Reusing consumed stream
Stream<Order> stream = orders.stream();
long count = stream.count();
// double total = stream.mapToDouble(Order::getTotal).sum(); // IllegalStateException!
```

---

## Concurrency

### Thread Basics

```java
// Creating threads
Thread thread1 = new Thread(() -> {
    System.out.println("Thread 1 running");
});

Thread thread2 = new Thread(new Runnable() {
    @Override
    public void run() {
        System.out.println("Thread 2 running");
    }
});

thread1.start(); // Start execution
thread2.start();

// Wait for completion
thread1.join();
thread2.join();

// Thread states: NEW → RUNNABLE → BLOCKED/WAITING/TIMED_WAITING → TERMINATED
```

### ExecutorService

```java
// Fixed thread pool
ExecutorService executor = Executors.newFixedThreadPool(10);

// Submit tasks
Future<String> future = executor.submit(() -> {
    Thread.sleep(1000);
    return "Task result";
});

// Get result (blocking)
String result = future.get(); // Waits up to completion
String resultWithTimeout = future.get(5, TimeUnit.SECONDS); // Timeout

// Submit multiple tasks
List<Callable<Integer>> tasks = Arrays.asList(
    () -> computePrime(100),
    () -> computePrime(200),
    () -> computePrime(300)
);

List<Future<Integer>> futures = executor.invokeAll(tasks);

// Process results
for (Future<Integer> f : futures) {
    Integer prime = f.get();
    System.out.println("Prime: " + prime);
}

// Shutdown
executor.shutdown(); // No new tasks accepted
executor.awaitTermination(1, TimeUnit.MINUTES); // Wait for completion
// executor.shutdownNow(); // Interrupt running tasks
```

### CompletableFuture

```java
// Async computation
CompletableFuture<String> future = CompletableFuture.supplyAsync(() -> {
    // Runs in ForkJoinPool.commonPool()
    return fetchDataFromAPI();
});

// Chain operations
CompletableFuture<String> result = future
    .thenApply(data -> data.toUpperCase())         // Transform result
    .thenApply(data -> data + " processed")
    .thenAccept(System.out::println);              // Consume result

// Combine multiple futures
CompletableFuture<User> userFuture = CompletableFuture.supplyAsync(() -> fetchUser(userId));
CompletableFuture<List<Order>> ordersFuture = CompletableFuture.supplyAsync(() -> fetchOrders(userId));

CompletableFuture<UserProfile> profileFuture = userFuture
    .thenCombine(ordersFuture, (user, orders) -> new UserProfile(user, orders));

// Wait for all
CompletableFuture<Void> allOf = CompletableFuture.allOf(
    future1, future2, future3
);
allOf.join(); // Wait for all to complete

// Wait for any
CompletableFuture<Object> anyOf = CompletableFuture.anyOf(
    future1, future2, future3
);
Object firstResult = anyOf.join(); // First to complete

// Error handling
CompletableFuture<String> safeResult = future
    .exceptionally(ex -> {
        log.error("Error occurred", ex);
        return "Default value";
    })
    .thenApply(data -> data.toUpperCase());

// Or handle both success and error
future.handle((result, ex) -> {
    if (ex != null) {
        return "Error: " + ex.getMessage();
    }
    return result;
});

// Timeout
CompletableFuture<String> withTimeout = future
    .orTimeout(5, TimeUnit.SECONDS)  // Fail after 5 seconds
    .completeOnTimeout("Default", 10, TimeUnit.SECONDS); // Default after 10 seconds
```

### Synchronization

```java
// Synchronized method
public class Counter {
    private int count = 0;

    public synchronized void increment() {
        count++;
    }

    public synchronized int getCount() {
        return count;
    }
}

// Synchronized block (more granular)
public void updateBalance(double amount) {
    synchronized (this) {
        balance += amount;
    }
}

// ReentrantLock (more flexible)
private final Lock lock = new ReentrantLock();

public void safeMethods() {
    lock.lock();
    try {
        // Critical section
        balance += amount;
    } finally {
        lock.unlock(); // Always unlock in finally
    }
}

// Try lock with timeout
if (lock.tryLock(1, TimeUnit.SECONDS)) {
    try {
        // Got lock
    } finally {
        lock.unlock();
    }
} else {
    // Couldn't acquire lock
}

// ReadWriteLock for read-heavy scenarios
private final ReadWriteLock rwLock = new ReentrantReadWriteLock();

public Data read() {
    rwLock.readLock().lock();
    try {
        return data; // Multiple readers allowed
    } finally {
        rwLock.readLock().unlock();
    }
}

public void write(Data newData) {
    rwLock.writeLock().lock();
    try {
        data = newData; // Exclusive write
    } finally {
        rwLock.writeLock().unlock();
    }
}
```

### Concurrent Collections

```java
// ConcurrentHashMap: Thread-safe without full locking
Map<String, Integer> concurrentMap = new ConcurrentHashMap<>();
concurrentMap.put("key", 1);
concurrentMap.computeIfAbsent("key", k -> expensiveComputation(k));
concurrentMap.merge("key", 1, Integer::sum); // Atomic increment

// CopyOnWriteArrayList: Iteration never throws ConcurrentModificationException
List<String> cowList = new CopyOnWriteArrayList<>();
cowList.add("item");
// Good for read-heavy scenarios, writes are expensive

// BlockingQueue: Producer-consumer pattern
BlockingQueue<Task> queue = new LinkedBlockingQueue<>(100);

// Producer
queue.put(new Task()); // Blocks if queue full

// Consumer
Task task = queue.take(); // Blocks if queue empty

// Timeout versions
boolean added = queue.offer(new Task(), 1, TimeUnit.SECONDS);
Task task = queue.poll(1, TimeUnit.SECONDS);

// ConcurrentSkipListMap: Concurrent sorted map
NavigableMap<Integer, String> skipListMap = new ConcurrentSkipListMap<>();
skipListMap.put(1, "one");
skipListMap.put(2, "two");
```

### Atomic Variables

```java
// AtomicInteger: Lock-free thread-safe counter
AtomicInteger counter = new AtomicInteger(0);
counter.incrementAndGet(); // Atomic ++count
counter.getAndIncrement(); // Atomic count++
counter.addAndGet(5);      // Atomic count += 5
counter.compareAndSet(5, 10); // CAS operation

// AtomicReference: Lock-free reference updates
AtomicReference<User> currentUser = new AtomicReference<>(initialUser);
currentUser.set(newUser);
User old = currentUser.getAndSet(newUser);
currentUser.compareAndSet(expectedUser, newUser);

// AtomicLong for IDs
AtomicLong idGenerator = new AtomicLong(0);
long nextId = idGenerator.incrementAndGet();

// LongAdder: Better performance for high contention
LongAdder adder = new LongAdder();
adder.increment();
adder.add(5);
long total = adder.sum();
```

### Virtual Threads (Java 21)

```java
// Create virtual thread
Thread vThread = Thread.ofVirtual().start(() -> {
    System.out.println("Virtual thread");
});

// Virtual thread per task executor
try (var executor = Executors.newVirtualThreadPerTaskExecutor()) {
    // Can handle millions of tasks efficiently
    for (int i = 0; i < 1_000_000; i++) {
        executor.submit(() -> {
            // I/O-bound work benefits most
            fetchFromDatabase();
        });
    }
} // Auto-shutdown

// Structured concurrency (Preview)
try (var scope = new StructuredTaskScope.ShutdownOnFailure()) {
    Future<User> userFuture = scope.fork(() -> fetchUser(id));
    Future<Orders> ordersFuture = scope.fork(() -> fetchOrders(id));

    scope.join();           // Wait for both
    scope.throwIfFailed();  // Propagate failures

    User user = userFuture.resultNow();
    Orders orders = ordersFuture.resultNow();
}

// When to use virtual threads:
// ✓ I/O-bound operations (network, database, files)
// ✓ High concurrency (thousands/millions of tasks)
// ✓ Blocking operations that benefit from more threads
// ✗ CPU-bound tasks (use platform threads or parallel streams)
// ✗ Need thread-local storage with high memory overhead
```

---

## Performance Optimization

### JVM Tuning

```bash
# Heap size
java -Xms2g -Xmx4g MyApp  # Initial 2GB, max 4GB

# Garbage collection
java -XX:+UseG1GC MyApp                    # G1 GC (default in Java 9+)
java -XX:+UseZGC MyApp                     # ZGC (low latency)
java -XX:+UseShenandoahGC MyApp            # Shenandoah (low pause)

# GC logging
java -Xlog:gc*:file=gc.log MyApp

# Performance monitoring
java -XX:+FlightRecorder \
     -XX:StartFlightRecording=duration=60s,filename=recording.jfr \
     MyApp
```

### Memory Management Best Practices

```java
// ✓ Use StringBuilder for concatenation in loops
StringBuilder sb = new StringBuilder();
for (String s : strings) {
    sb.append(s);
}
String result = sb.toString();

// ✗ String concatenation in loop (creates many objects)
String result = "";
for (String s : strings) {
    result += s; // Bad!
}

// ✓ Use try-with-resources
try (FileInputStream fis = new FileInputStream("file.txt");
     BufferedInputStream bis = new BufferedInputStream(fis)) {
    // Auto-closed
}

// ✓ Lazy initialization for expensive objects
private volatile ExpensiveObject instance;

public ExpensiveObject getInstance() {
    if (instance == null) {
        synchronized (this) {
            if (instance == null) {
                instance = new ExpensiveObject();
            }
        }
    }
    return instance;
}

// ✓ Object pooling for frequently created objects
ObjectPool<DatabaseConnection> pool = new GenericObjectPool<>(
    new DatabaseConnectionFactory()
);
DatabaseConnection conn = pool.borrowObject();
try {
    // Use connection
} finally {
    pool.returnObject(conn);
}

// ✓ Weak/Soft references for caches
Map<String, SoftReference<LargeObject>> cache = new HashMap<>();

LargeObject obj = cache.computeIfAbsent(key, k ->
    new SoftReference<>(loadLargeObject(k))
).get();

if (obj == null) {
    // GC reclaimed it, reload
    obj = loadLargeObject(key);
    cache.put(key, new SoftReference<>(obj));
}
```

### Profiling

```java
// Microbenchmarking with JMH
@BenchmarkMode(Mode.AverageTime)
@OutputTimeUnit(TimeUnit.NANOSECONDS)
@State(Scope.Thread)
public class MyBenchmark {

    private List<Integer> list;

    @Setup
    public void setup() {
        list = IntStream.range(0, 1000)
            .boxed()
            .collect(Collectors.toList());
    }

    @Benchmark
    public int streamSum() {
        return list.stream()
            .mapToInt(Integer::intValue)
            .sum();
    }

    @Benchmark
    public int loopSum() {
        int sum = 0;
        for (Integer i : list) {
            sum += i;
        }
        return sum;
    }
}

// Run: mvn clean install && java -jar target/benchmarks.jar
```

### Caching Strategies

```java
// Caffeine cache (high-performance)
LoadingCache<String, User> userCache = Caffeine.newBuilder()
    .maximumSize(10_000)
    .expireAfterWrite(10, TimeUnit.MINUTES)
    .refreshAfterWrite(5, TimeUnit.MINUTES)
    .recordStats()
    .build(key -> loadUserFromDatabase(key));

User user = userCache.get("user123");

// Guava cache
LoadingCache<String, String> cache = CacheBuilder.newBuilder()
    .maximumSize(1000)
    .expireAfterWrite(10, TimeUnit.MINUTES)
    .build(new CacheLoader<String, String>() {
        @Override
        public String load(String key) {
            return fetchData(key);
        }
    });

// @Cacheable annotation (Spring)
@Cacheable(value = "users", key = "#id")
public User getUserById(String id) {
    return userRepository.findById(id);
}

@CacheEvict(value = "users", key = "#user.id")
public void updateUser(User user) {
    userRepository.save(user);
}
```

---

## Design Patterns in Java

### Creational Patterns

```java
// Singleton (thread-safe, lazy initialization)
public class DatabaseConnection {
    private static volatile DatabaseConnection instance;

    private DatabaseConnection() {}

    public static DatabaseConnection getInstance() {
        if (instance == null) {
            synchronized (DatabaseConnection.class) {
                if (instance == null) {
                    instance = new DatabaseConnection();
                }
            }
        }
        return instance;
    }
}

// Enum singleton (best practice)
public enum Configuration {
    INSTANCE;

    private Properties properties = new Properties();

    public String getProperty(String key) {
        return properties.getProperty(key);
    }
}

// Builder pattern
public class User {
    private final String username;
    private final String email;
    private final String firstName;
    private final String lastName;
    private final LocalDate birthDate;

    private User(Builder builder) {
        this.username = builder.username;
        this.email = builder.email;
        this.firstName = builder.firstName;
        this.lastName = builder.lastName;
        this.birthDate = builder.birthDate;
    }

    public static class Builder {
        private final String username;  // Required
        private final String email;     // Required
        private String firstName;
        private String lastName;
        private LocalDate birthDate;

        public Builder(String username, String email) {
            this.username = username;
            this.email = email;
        }

        public Builder firstName(String firstName) {
            this.firstName = firstName;
            return this;
        }

        public Builder lastName(String lastName) {
            this.lastName = lastName;
            return this;
        }

        public Builder birthDate(LocalDate birthDate) {
            this.birthDate = birthDate;
            return this;
        }

        public User build() {
            return new User(this);
        }
    }
}

// Usage
User user = new User.Builder("alice123", "alice@example.com")
    .firstName("Alice")
    .lastName("Smith")
    .birthDate(LocalDate.of(1990, 1, 1))
    .build();

// Factory Method
public interface PaymentProcessor {
    void processPayment(double amount);
}

public class PaymentProcessorFactory {
    public static PaymentProcessor create(String type) {
        return switch (type.toLowerCase()) {
            case "credit" -> new CreditCardProcessor();
            case "paypal" -> new PayPalProcessor();
            case "crypto" -> new CryptoProcessor();
            default -> throw new IllegalArgumentException("Unknown type: " + type);
        };
    }
}
```

### Structural Patterns

```java
// Adapter pattern
interface MediaPlayer {
    void play(String filename);
}

interface AdvancedMediaPlayer {
    void playVlc(String filename);
    void playMp4(String filename);
}

class VlcPlayer implements AdvancedMediaPlayer {
    public void playVlc(String filename) {
        System.out.println("Playing VLC: " + filename);
    }
    public void playMp4(String filename) {}
}

class MediaAdapter implements MediaPlayer {
    AdvancedMediaPlayer advancedPlayer;

    public MediaAdapter(String audioType) {
        if (audioType.equalsIgnoreCase("vlc")) {
            advancedPlayer = new VlcPlayer();
        }
    }

    public void play(String filename) {
        advancedPlayer.playVlc(filename);
    }
}

// Decorator pattern
interface Coffee {
    double cost();
    String description();
}

class SimpleCoffee implements Coffee {
    public double cost() { return 2.0; }
    public String description() { return "Simple coffee"; }
}

abstract class CoffeeDecorator implements Coffee {
    protected Coffee coffee;

    public CoffeeDecorator(Coffee coffee) {
        this.coffee = coffee;
    }
}

class MilkDecorator extends CoffeeDecorator {
    public MilkDecorator(Coffee coffee) {
        super(coffee);
    }

    public double cost() {
        return coffee.cost() + 0.5;
    }

    public String description() {
        return coffee.description() + ", milk";
    }
}

// Usage
Coffee coffee = new SimpleCoffee();
coffee = new MilkDecorator(coffee);
coffee = new SugarDecorator(coffee);
System.out.println(coffee.description() + " = $" + coffee.cost());
```

### Behavioral Patterns

```java
// Strategy pattern
interface PaymentStrategy {
    void pay(double amount);
}

class CreditCardPayment implements PaymentStrategy {
    private String cardNumber;

    public void pay(double amount) {
        System.out.println("Paid $" + amount + " with credit card");
    }
}

class PayPalPayment implements PaymentStrategy {
    private String email;

    public void pay(double amount) {
        System.out.println("Paid $" + amount + " with PayPal");
    }
}

class ShoppingCart {
    private PaymentStrategy paymentStrategy;

    public void setPaymentStrategy(PaymentStrategy strategy) {
        this.paymentStrategy = strategy;
    }

    public void checkout(double amount) {
        paymentStrategy.pay(amount);
    }
}

// Observer pattern
interface Observer {
    void update(String event);
}

class Subject {
    private List<Observer> observers = new ArrayList<>();

    public void attach(Observer observer) {
        observers.add(observer);
    }

    public void notifyObservers(String event) {
        for (Observer observer : observers) {
            observer.update(event);
        }
    }
}

class EmailNotifier implements Observer {
    public void update(String event) {
        System.out.println("Email sent: " + event);
    }
}

// Command pattern
interface Command {
    void execute();
    void undo();
}

class TextEditor {
    private StringBuilder text = new StringBuilder();

    public void append(String str) {
        text.append(str);
    }

    public void delete(int length) {
        text.delete(text.length() - length, text.length());
    }
}

class AppendCommand implements Command {
    private TextEditor editor;
    private String text;

    public AppendCommand(TextEditor editor, String text) {
        this.editor = editor;
        this.text = text;
    }

    public void execute() {
        editor.append(text);
    }

    public void undo() {
        editor.delete(text.length());
    }
}
```

---

## Testing Strategies

### JUnit 5 Basics

```java
@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private UserService userService;

    @BeforeEach
    void setUp() {
        // Setup before each test
    }

    @Test
    @DisplayName("Should create user successfully")
    void testCreateUser() {
        // Arrange
        User user = new User("alice", "alice@example.com");
        when(userRepository.save(any(User.class))).thenReturn(user);

        // Act
        User created = userService.createUser(user);

        // Assert
        assertNotNull(created);
        assertEquals("alice", created.getUsername());
        verify(userRepository).save(user);
    }

    @Test
    void testFindUserById() {
        // Given
        String userId = "123";
        User user = new User("alice", "alice@example.com");
        when(userRepository.findById(userId)).thenReturn(Optional.of(user));

        // When
        Optional<User> found = userService.findById(userId);

        // Then
        assertTrue(found.isPresent());
        assertEquals("alice", found.get().getUsername());
    }

    @Test
    void testUserNotFound() {
        // Given
        when(userRepository.findById(anyString())).thenReturn(Optional.empty());

        // Then
        assertThrows(UserNotFoundException.class, () -> {
            userService.findById("999");
        });
    }

    @ParameterizedTest
    @ValueSource(strings = {"", " ", "   "})
    void testInvalidUsername(String username) {
        assertThrows(IllegalArgumentException.class, () -> {
            new User(username, "test@example.com");
        });
    }

    @ParameterizedTest
    @CsvSource({
        "alice, alice@example.com, true",
        "bob, invalid-email, false",
        ", test@example.com, false"
    })
    void testUserValidation(String username, String email, boolean expected) {
        boolean isValid = UserValidator.validate(username, email);
        assertEquals(expected, isValid);
    }
}
```

### Mockito Advanced

```java
class OrderServiceTest {

    @Mock
    private PaymentService paymentService;

    @Spy
    private OrderRepository orderRepository = new InMemoryOrderRepository();

    @Captor
    private ArgumentCaptor<Order> orderCaptor;

    @InjectMocks
    private OrderService orderService;

    @Test
    void testProcessOrder() {
        // Stubbing
        when(paymentService.process(any(Payment.class)))
            .thenReturn(PaymentResult.success());

        // Action
        Order order = new Order("ORDER-123", 100.0);
        orderService.processOrder(order);

        // Capture and verify
        verify(orderRepository).save(orderCaptor.capture());
        Order savedOrder = orderCaptor.getValue();
        assertEquals("ORDER-123", savedOrder.getId());
        assertEquals(OrderStatus.COMPLETED, savedOrder.getStatus());
    }

    @Test
    void testPaymentFailure() {
        // Stubbing with exception
        when(paymentService.process(any(Payment.class)))
            .thenThrow(new PaymentException("Insufficient funds"));

        // Verify exception handling
        Order order = new Order("ORDER-456", 100.0);
        assertThrows(OrderProcessingException.class, () -> {
            orderService.processOrder(order);
        });

        // Verify rollback
        verify(orderRepository).updateStatus(order.getId(), OrderStatus.FAILED);
    }

    @Test
    void testMultipleInvocations() {
        when(paymentService.process(any()))
            .thenReturn(PaymentResult.pending())
            .thenReturn(PaymentResult.success());

        // First call returns pending
        PaymentResult result1 = paymentService.process(new Payment());
        assertEquals(PaymentStatus.PENDING, result1.getStatus());

        // Second call returns success
        PaymentResult result2 = paymentService.process(new Payment());
        assertEquals(PaymentStatus.SUCCESS, result2.getStatus());
    }

    @Test
    void testVerifyInOrder() {
        InOrder inOrder = inOrder(orderRepository, paymentService);

        Order order = new Order("ORDER-789", 50.0);
        orderService.processOrder(order);

        inOrder.verify(orderRepository).save(any(Order.class));
        inOrder.verify(paymentService).process(any(Payment.class));
        inOrder.verify(orderRepository).updateStatus(anyString(), eq(OrderStatus.COMPLETED));
    }
}
```

### TestContainers for Integration Tests

```java
@Testcontainers
@SpringBootTest
class DatabaseIntegrationTest {

    @Container
    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:15")
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
    private UserRepository userRepository;

    @Test
    void testSaveAndFind() {
        User user = new User("alice", "alice@example.com");
        userRepository.save(user);

        Optional<User> found = userRepository.findByUsername("alice");
        assertTrue(found.isPresent());
        assertEquals("alice@example.com", found.get().getEmail());
    }
}

// Multiple containers
@Testcontainers
class MicroserviceIntegrationTest {

    @Container
    static Network network = Network.newNetwork();

    @Container
    static GenericContainer<?> redis = new GenericContainer<>("redis:7")
        .withNetwork(network)
        .withNetworkAliases("redis")
        .withExposedPorts(6379);

    @Container
    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:15")
        .withNetwork(network)
        .withNetworkAliases("postgres");

    @Container
    static GenericContainer<?> app = new GenericContainer<>("myapp:latest")
        .withNetwork(network)
        .withEnv("REDIS_HOST", "redis")
        .withEnv("DB_HOST", "postgres")
        .dependsOn(redis, postgres);
}
```

### AssertJ for Fluent Assertions

```java
class AssertJExamples {

    @Test
    void testFluentAssertions() {
        User user = new User("alice", "alice@example.com");

        // Object assertions
        assertThat(user)
            .isNotNull()
            .extracting(User::getUsername, User::getEmail)
            .containsExactly("alice", "alice@example.com");

        // Collection assertions
        List<User> users = Arrays.asList(
            new User("alice", "alice@example.com"),
            new User("bob", "bob@example.com")
        );

        assertThat(users)
            .hasSize(2)
            .extracting(User::getUsername)
            .containsExactly("alice", "bob");

        // Exception assertions
        assertThatThrownBy(() -> {
            throw new IllegalArgumentException("Invalid input");
        })
            .isInstanceOf(IllegalArgumentException.class)
            .hasMessage("Invalid input")
            .hasNoCause();

        // Optional assertions
        Optional<User> optionalUser = userService.findById("123");
        assertThat(optionalUser)
            .isPresent()
            .get()
            .extracting(User::getUsername)
            .isEqualTo("alice");

        // Custom assertions
        assertThat(user.getAge())
            .isGreaterThan(18)
            .isLessThan(100);
    }
}
```

---

## Best Practices

### Exception Handling

```java
// ✓ Specific exceptions
public User findUser(String id) throws UserNotFoundException {
    return userRepository.findById(id)
        .orElseThrow(() -> new UserNotFoundException("User not found: " + id));
}

// ✓ Custom exception hierarchy
public class BusinessException extends RuntimeException {
    public BusinessException(String message) {
        super(message);
    }
}

public class UserNotFoundException extends BusinessException {
    public UserNotFoundException(String message) {
        super(message);
    }
}

// ✓ Try-with-resources
try (BufferedReader reader = new BufferedReader(new FileReader("file.txt"))) {
    String line = reader.readLine();
} catch (IOException e) {
    log.error("Error reading file", e);
    throw new FileProcessingException("Failed to read file", e);
}

// ✗ Catching generic Exception
try {
    riskyOperation();
} catch (Exception e) { // Too broad!
    log.error("Error", e);
}

// ✓ Proper exception chaining
catch (SQLException e) {
    throw new DataAccessException("Database error", e); // Preserve cause
}

// ✗ Swallowing exceptions
catch (IOException e) {
    // Silent failure - bad!
}
```

### Resource Management

```java
// ✓ AutoCloseable for custom resources
public class DatabaseConnection implements AutoCloseable {
    private Connection connection;

    public DatabaseConnection(String url) throws SQLException {
        this.connection = DriverManager.getConnection(url);
    }

    @Override
    public void close() throws SQLException {
        if (connection != null && !connection.isClosed()) {
            connection.close();
        }
    }
}

// Usage
try (DatabaseConnection db = new DatabaseConnection(url)) {
    // Use connection
} // Auto-closed

// ✓ Multiple resources
try (FileInputStream fis = new FileInputStream("input.txt");
     FileOutputStream fos = new FileOutputStream("output.txt")) {
    // Use both streams
} // Both auto-closed in reverse order
```

### Coding Standards

```java
// ✓ Immutable objects
public final class Money {
    private final BigDecimal amount;
    private final Currency currency;

    public Money(BigDecimal amount, Currency currency) {
        this.amount = amount;
        this.currency = currency;
    }

    public Money add(Money other) {
        if (!currency.equals(other.currency)) {
            throw new IllegalArgumentException("Currency mismatch");
        }
        return new Money(amount.add(other.amount), currency);
    }
}

// ✓ Defensive copying
public class Order {
    private final List<Item> items;

    public Order(List<Item> items) {
        this.items = new ArrayList<>(items); // Copy to prevent external modification
    }

    public List<Item> getItems() {
        return Collections.unmodifiableList(items); // Return unmodifiable view
    }
}

// ✓ Null safety with Optional
public Optional<User> findUser(String id) {
    return Optional.ofNullable(userMap.get(id));
}

// Usage
findUser("123").ifPresent(user -> {
    System.out.println("Found: " + user);
});

String username = findUser("123")
    .map(User::getUsername)
    .orElse("Unknown");

// ✓ Use EnumSet for flags
EnumSet<Permission> permissions = EnumSet.of(
    Permission.READ,
    Permission.WRITE
);

// ✓ Avoid magic numbers
private static final int MAX_RETRIES = 3;
private static final long TIMEOUT_MS = 5000L;
```

---

## Practical Example: E-Commerce Order Service

```java
// Domain model with records
public record Product(String id, String name, BigDecimal price) {}

public record OrderItem(Product product, int quantity) {
    public BigDecimal totalPrice() {
        return product.price().multiply(BigDecimal.valueOf(quantity));
    }
}

public record Order(
    String id,
    String customerId,
    List<OrderItem> items,
    OrderStatus status,
    LocalDateTime createdAt
) {
    public BigDecimal total() {
        return items.stream()
            .map(OrderItem::totalPrice)
            .reduce(BigDecimal.ZERO, BigDecimal::add);
    }
}

public enum OrderStatus {
    PENDING, PROCESSING, COMPLETED, CANCELLED
}

// Service layer with CompletableFuture
@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final PaymentService paymentService;
    private final InventoryService inventoryService;
    private final NotificationService notificationService;

    public CompletableFuture<Order> processOrder(Order order) {
        return CompletableFuture.supplyAsync(() -> {
            // Step 1: Validate inventory
            return validateInventory(order);
        })
        .thenCompose(validOrder -> {
            // Step 2: Process payment
            return processPayment(validOrder);
        })
        .thenCompose(paidOrder -> {
            // Step 3: Update inventory
            return updateInventory(paidOrder);
        })
        .thenApply(completedOrder -> {
            // Step 4: Save order
            return orderRepository.save(completedOrder);
        })
        .thenApply(savedOrder -> {
            // Step 5: Send notification (async, don't wait)
            notificationService.sendOrderConfirmation(savedOrder);
            return savedOrder;
        })
        .exceptionally(ex -> {
            log.error("Order processing failed", ex);
            return handleFailure(order, ex);
        });
    }

    private Order validateInventory(Order order) {
        boolean available = order.items().stream()
            .allMatch(item -> inventoryService.checkAvailability(
                item.product().id(),
                item.quantity()
            ));

        if (!available) {
            throw new InsufficientInventoryException("Items not available");
        }

        return order;
    }

    private CompletableFuture<Order> processPayment(Order order) {
        return paymentService.processAsync(order.customerId(), order.total())
            .thenApply(result -> {
                if (!result.isSuccess()) {
                    throw new PaymentFailedException("Payment failed");
                }
                return new Order(
                    order.id(),
                    order.customerId(),
                    order.items(),
                    OrderStatus.PROCESSING,
                    order.createdAt()
                );
            });
    }

    private CompletableFuture<Order> updateInventory(Order order) {
        List<CompletableFuture<Void>> updates = order.items().stream()
            .map(item -> inventoryService.reserveAsync(
                item.product().id(),
                item.quantity()
            ))
            .toList();

        return CompletableFuture.allOf(updates.toArray(new CompletableFuture[0]))
            .thenApply(v -> new Order(
                order.id(),
                order.customerId(),
                order.items(),
                OrderStatus.COMPLETED,
                order.createdAt()
            ));
    }

    private Order handleFailure(Order order, Throwable ex) {
        Order failedOrder = new Order(
            order.id(),
            order.customerId(),
            order.items(),
            OrderStatus.CANCELLED,
            order.createdAt()
        );
        orderRepository.save(failedOrder);
        notificationService.sendOrderFailure(failedOrder, ex.getMessage());
        return failedOrder;
    }
}

// Testing
@ExtendWith(MockitoExtension.class)
class OrderServiceTest {

    @Mock private OrderRepository orderRepository;
    @Mock private PaymentService paymentService;
    @Mock private InventoryService inventoryService;
    @Mock private NotificationService notificationService;

    @InjectMocks private OrderService orderService;

    @Test
    void testSuccessfulOrderProcessing() throws Exception {
        // Arrange
        Product product = new Product("P1", "Laptop", new BigDecimal("999.99"));
        OrderItem item = new OrderItem(product, 1);
        Order order = new Order(
            "O1",
            "C1",
            List.of(item),
            OrderStatus.PENDING,
            LocalDateTime.now()
        );

        when(inventoryService.checkAvailability(anyString(), anyInt()))
            .thenReturn(true);
        when(paymentService.processAsync(anyString(), any(BigDecimal.class)))
            .thenReturn(CompletableFuture.completedFuture(PaymentResult.success()));
        when(inventoryService.reserveAsync(anyString(), anyInt()))
            .thenReturn(CompletableFuture.completedFuture(null));
        when(orderRepository.save(any(Order.class)))
            .thenAnswer(inv -> inv.getArgument(0));

        // Act
        CompletableFuture<Order> future = orderService.processOrder(order);
        Order result = future.get(5, TimeUnit.SECONDS);

        // Assert
        assertThat(result.status()).isEqualTo(OrderStatus.COMPLETED);
        verify(notificationService).sendOrderConfirmation(any(Order.class));
    }
}
```

---

## Summary

This skill provides comprehensive Java expertise covering:

1. **Modern Language Features**: Lambda, Records, Sealed Classes, Pattern Matching, Virtual Threads
2. **Collections Framework**: Performance characteristics, best practices, concurrent collections
3. **Streams API**: Operations, collectors, parallel streams, optimization
4. **Concurrency**: Threads, ExecutorService, CompletableFuture, synchronization, virtual threads
5. **Performance**: JVM tuning, memory management, profiling, caching
6. **Design Patterns**: Creational, structural, behavioral patterns in Java
7. **Testing**: JUnit 5, Mockito, TestContainers, AssertJ
8. **Best Practices**: Exception handling, resource management, coding standards

Use this skill for:
- Java development guidance
- Performance optimization
- Concurrency problem solving
- Design pattern selection
- Testing strategy
- Code review and best practices

**Total Size**: ~28KB
