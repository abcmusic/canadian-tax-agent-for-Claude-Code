# RabbitMQ Expert Skill

## Purpose
Master RabbitMQ message broker for building reliable, scalable, and high-performance distributed systems with production-grade clustering, performance tuning, and high availability patterns.

## When to Use
- Asynchronous messaging and task queues
- Microservices communication
- Event-driven architectures
- Decoupling application components
- Load balancing and work distribution
- Reliable message delivery requirements
- Stream processing and pub/sub patterns

## Key Capabilities

### Message Broker Fundamentals
- **Exchanges**: Route messages to queues (Direct, Topic, Fanout, Headers)
- **Queues**: Store messages until consumed
- **Bindings**: Rules connecting exchanges to queues
- **Messages**: Data with routing key and properties
- **Producers**: Applications that send messages
- **Consumers**: Applications that receive messages

### Exchange Types

#### Direct Exchange
- Routes messages to queues with exact routing key match
- Use for point-to-point messaging

#### Topic Exchange
- Routes messages based on routing key patterns
- Use for pub/sub with selective filtering
- Wildcards: `*` (one word), `#` (zero or more words)

#### Fanout Exchange
- Routes messages to all bound queues
- Ignores routing keys
- Use for broadcasting messages

#### Headers Exchange
- Routes based on message header attributes
- Use for complex routing logic

### Queue Types (RabbitMQ 3.13+)

#### Quorum Queues (Recommended for Production)
- Replicated queue type using Raft consensus
- High reliability and fault tolerance
- Better data safety guarantees
- Stable latency and throughput
- **Default choice for production workloads**

#### Classic Queues
- Legacy queue type
- Still supported but not recommended for new deployments

#### Stream Queues
- Append-only log for high throughput
- Message replay capability
- Best for event streaming

### Clustering & High Availability
- Multi-node clusters for scalability
- Quorum queues replicate across nodes
- Automatic leader election
- Three-node minimum recommended for production
- Distribute across Availability Zones for fault tolerance

## Best Practices

### 1. Use Quorum Queues for Production
```javascript
// Node.js example with amqplib
await channel.assertQueue('tasks', {
  durable: true,
  arguments: {
    'x-queue-type': 'quorum',
    'x-quorum-initial-group-size': 3 // Replica count
  }
});
```

### 2. Durable Messages and Queues
```javascript
// Ensure queues survive broker restarts
await channel.assertQueue('important-tasks', {
  durable: true
});

// Persist messages to disk
channel.sendToQueue('important-tasks', Buffer.from(message), {
  persistent: true
});
```

### 3. Publisher Confirms for Reliability
```javascript
// Enable publisher confirms
await channel.confirmSelect();

// Send message and wait for confirmation
await channel.publish(
  exchange,
  routingKey,
  Buffer.from(message),
  { persistent: true }
);

// Or use callbacks
channel.publish(exchange, routingKey, buffer, {}, (err, ok) => {
  if (err) {
    console.error('Message not confirmed:', err);
  }
});
```

### 4. Consumer Acknowledgments
```javascript
// Manual acknowledgments for reliability
channel.consume('tasks', async (msg) => {
  try {
    await processMessage(msg.content);
    channel.ack(msg); // Acknowledge after successful processing
  } catch (error) {
    channel.nack(msg, false, true); // Requeue on failure
  }
}, { noAck: false }); // Disable auto-ack
```

### 5. Prefetch Count for Load Balancing
```javascript
// Limit unacknowledged messages per consumer
// Prevents consumer from being overwhelmed
channel.prefetch(10); // Process max 10 messages at a time

channel.consume('tasks', async (msg) => {
  await processMessage(msg.content);
  channel.ack(msg);
});
```

### 6. Connection Management
```javascript
// Reuse connections, create multiple channels
const connection = await amqp.connect('amqp://localhost');

// Connection is expensive - create once
// Channels are lightweight - create per thread/operation
const channel1 = await connection.createChannel();
const channel2 = await connection.createChannel();

// Handle connection errors
connection.on('error', (err) => {
  console.error('Connection error:', err);
  // Implement reconnection logic
});

connection.on('close', () => {
  console.log('Connection closed');
  // Attempt reconnect
});
```

### 7. Topic Exchange Patterns
```javascript
// Declare topic exchange
await channel.assertExchange('logs', 'topic', { durable: true });

// Publisher sends with routing keys
channel.publish('logs', 'error.payment', Buffer.from('Payment error'));
channel.publish('logs', 'info.user.login', Buffer.from('User login'));

// Consumer binds with patterns
await channel.assertQueue('error-logs', { durable: true });
await channel.bindQueue('error-logs', 'logs', 'error.*');

await channel.assertQueue('all-logs', { durable: true });
await channel.bindQueue('all-logs', 'logs', '#'); // All messages
```

### 8. Work Queue Pattern
```javascript
// Producer: Distribute tasks
const queue = 'tasks';
await channel.assertQueue(queue, {
  durable: true,
  arguments: { 'x-queue-type': 'quorum' }
});

for (let i = 0; i < 100; i++) {
  channel.sendToQueue(queue, Buffer.from(`Task ${i}`), {
    persistent: true
  });
}

// Multiple consumers: Load balanced automatically
channel.prefetch(1); // Fair dispatch
channel.consume(queue, async (msg) => {
  console.log('Processing:', msg.content.toString());
  await doWork();
  channel.ack(msg);
}, { noAck: false });
```

### 9. RPC Pattern
```javascript
// Client: Request-reply pattern
const correlationId = generateUuid();
const replyQueue = await channel.assertQueue('', { exclusive: true });

channel.sendToQueue('rpc_queue', Buffer.from('request'), {
  correlationId,
  replyTo: replyQueue.queue
});

channel.consume(replyQueue.queue, (msg) => {
  if (msg.properties.correlationId === correlationId) {
    console.log('Reply:', msg.content.toString());
  }
}, { noAck: true });

// Server: Process and reply
channel.consume('rpc_queue', async (msg) => {
  const result = await processRequest(msg.content);

  channel.sendToQueue(msg.properties.replyTo, Buffer.from(result), {
    correlationId: msg.properties.correlationId
  });

  channel.ack(msg);
});
```

### 10. Dead Letter Exchange (DLX)
```javascript
// Setup DLX for failed messages
await channel.assertExchange('dlx', 'direct', { durable: true });
await channel.assertQueue('failed-tasks', { durable: true });
await channel.bindQueue('failed-tasks', 'dlx', '');

// Main queue with DLX configuration
await channel.assertQueue('tasks', {
  durable: true,
  arguments: {
    'x-dead-letter-exchange': 'dlx',
    'x-message-ttl': 60000, // Messages expire after 60s
    'x-max-length': 10000 // Max queue length
  }
});
```

## Performance Tuning

### 1. Keep Queues Short
- Target queue length: **0 for optimal performance**
- Long queues increase memory usage and latency
- Scale consumers if queues grow consistently

### 2. Use Multiple Queues
- Queue performance limited to one CPU core
- Split workload across multiple queues
- Better parallelization and throughput

### 3. Data Locality
- Connect producers to nodes where queue leaders run
- Reduces network overhead
- Quorum queues can serve reads from replicas

### 4. Disable Auto-Ack for Speed
```javascript
// Fastest throughput (no reliability)
channel.consume(queue, processMessage, { noAck: true });

// Production: Balance speed and reliability
channel.prefetch(100); // Higher prefetch for throughput
channel.consume(queue, async (msg) => {
  await processMessage(msg.content);
  channel.ack(msg);
}, { noAck: false });
```

### 5. Lazy Queues for Large Backlogs
```javascript
// Messages stored on disk immediately
await channel.assertQueue('large-backlog', {
  durable: true,
  arguments: {
    'x-queue-mode': 'lazy' // Minimize RAM usage
  }
});
```

### 6. Optimize Connection Pool
```javascript
// Increase file handles on server
// Linux: ulimit -n 65535

// Connection pooling pattern
class RabbitMQPool {
  constructor(size = 10) {
    this.connections = [];
    this.size = size;
  }

  async getConnection() {
    if (this.connections.length < this.size) {
      const conn = await amqp.connect('amqp://localhost');
      this.connections.push(conn);
      return conn;
    }
    return this.connections[
      Math.floor(Math.random() * this.connections.length)
    ];
  }
}
```

## Clustering Configuration

### Three-Node Cluster Setup
```bash
# Node 1
rabbitmq-server -detached

# Node 2 & 3 join cluster
rabbitmqctl stop_app
rabbitmqctl join_cluster rabbit@node1
rabbitmqctl start_app

# Verify cluster
rabbitmqctl cluster_status
```

### Load Balancing
```javascript
// Connect through load balancer
const connection = await amqp.connect({
  protocol: 'amqp',
  hostname: 'rabbitmq-loadbalancer.example.com',
  port: 5672,
  // Connection will be distributed across nodes
});
```

### High Availability Policies
```bash
# Set quorum queue policy
rabbitmqctl set_policy ha-quorum \
  "^quorum\." \
  '{"queue-type":"quorum"}' \
  --apply-to queues
```

## Monitoring & Observability

### Key Metrics
- Queue length and growth rate
- Message rates (publish, deliver, ack)
- Consumer count and utilization
- Memory and disk usage
- Connection count
- Network throughput

### Management Plugin
```bash
# Enable management plugin
rabbitmq-plugins enable rabbitmq_management

# Access UI at http://localhost:15672
# Default credentials: guest/guest
```

### Health Checks
```javascript
// Basic health check
const connection = await amqp.connect('amqp://localhost');
await connection.createChannel();
connection.close();
```

## Security Best Practices

### 1. Use Dedicated Users
```bash
# Create user with specific permissions
rabbitmqctl add_user myapp secretpassword
rabbitmqctl set_permissions -p / myapp ".*" ".*" ".*"

# Remove guest user in production
rabbitmqctl delete_user guest
```

### 2. Enable TLS
```javascript
const connection = await amqp.connect({
  protocol: 'amqps',
  hostname: 'rabbitmq.example.com',
  port: 5671,
  ca: [fs.readFileSync('ca.pem')],
  cert: fs.readFileSync('cert.pem'),
  key: fs.readFileSync('key.pem')
});
```

### 3. Virtual Hosts for Isolation
```bash
# Create virtual host
rabbitmqctl add_vhost production

# Connect to specific vhost
amqp.connect('amqp://user:pass@localhost/production')
```

## Common Patterns

### Event Bus
```javascript
// Fanout exchange for event broadcasting
await channel.assertExchange('events', 'fanout', { durable: true });

// Publishers
channel.publish('events', '', Buffer.from(JSON.stringify({
  type: 'user.created',
  data: { userId: 123 }
})));

// Multiple subscribers
const q1 = await channel.assertQueue('', { exclusive: true });
await channel.bindQueue(q1.queue, 'events', '');
channel.consume(q1.queue, handleEvent);
```

### Delayed Messages
```bash
# Enable delayed message plugin
rabbitmq-plugins enable rabbitmq_delayed_message_exchange
```

```javascript
await channel.assertExchange('delayed', 'x-delayed-message', {
  durable: true,
  arguments: { 'x-delayed-type': 'direct' }
});

channel.publish('delayed', 'route', Buffer.from('msg'), {
  headers: { 'x-delay': 5000 } // 5 second delay
});
```

### Priority Queues
```javascript
await channel.assertQueue('priority-tasks', {
  durable: true,
  arguments: {
    'x-max-priority': 10
  }
});

// Send with priority
channel.sendToQueue('priority-tasks', Buffer.from('urgent'), {
  priority: 9
});
```

## Pitfalls to Avoid

### 1. Don't Use Classic Queues for New Projects
```javascript
// Bad: Classic queue
await channel.assertQueue('tasks', { durable: true });

// Good: Quorum queue
await channel.assertQueue('tasks', {
  durable: true,
  arguments: { 'x-queue-type': 'quorum' }
});
```

### 2. Don't Cluster Over WAN
- High latency breaks clustering assumptions
- Use federation or shovel for WAN
- Keep clusters in same datacenter/region

### 3. Don't Use Auto-Ack in Production
```javascript
// Bad: Message loss on failure
channel.consume(queue, processMessage, { noAck: true });

// Good: Reliable processing
channel.consume(queue, async (msg) => {
  try {
    await processMessage(msg.content);
    channel.ack(msg);
  } catch (error) {
    channel.nack(msg, false, true);
  }
}, { noAck: false });
```

### 4. Don't Forget Connection Pooling
```javascript
// Bad: New connection per message
for (let i = 0; i < 1000; i++) {
  const conn = await amqp.connect('amqp://localhost');
  const channel = await conn.createChannel();
  channel.sendToQueue(queue, Buffer.from(`msg ${i}`));
  await conn.close();
}

// Good: Reuse connection
const conn = await amqp.connect('amqp://localhost');
const channel = await conn.createChannel();
for (let i = 0; i < 1000; i++) {
  channel.sendToQueue(queue, Buffer.from(`msg ${i}`));
}
```

### 5. Don't Enable Detailed Stats in Production
```bash
# Bad: Severe performance impact
rabbitmqctl set_vm_memory_high_watermark 0.4
rabbitmq.conf: management.rates_mode = detailed

# Good: Basic or none
management.rates_mode = basic
```

### 6. Don't Ignore Resource Limits
```bash
# Set file descriptor limit
ulimit -n 65535

# Monitor memory usage
rabbitmqctl status
```

## Production Checklist

- [ ] Use quorum queues for important data
- [ ] Enable publisher confirms
- [ ] Use manual acknowledgments
- [ ] Configure connection recovery
- [ ] Set appropriate prefetch count
- [ ] Enable clustering (3+ nodes)
- [ ] Distribute across availability zones
- [ ] Monitor queue lengths
- [ ] Set up dead letter exchanges
- [ ] Configure resource limits
- [ ] Use TLS for connections
- [ ] Remove default guest user
- [ ] Keep RabbitMQ and Erlang up-to-date
- [ ] Implement health checks
- [ ] Set up monitoring and alerts

## Tools & Resources

- **Management UI**: Web-based monitoring and management
- **rabbitmqctl**: Command-line administration
- **Prometheus Plugin**: Metrics export
- **Client Libraries**: amqplib (Node.js), pika (Python), Bunny (Ruby)

## References

- [RabbitMQ Best Practices - CloudAMQP Part 1](https://www.cloudamqp.com/blog/part1-rabbitmq-best-practice.html)
- [RabbitMQ Best Practices for High Performance - CloudAMQP Part 2](https://www.cloudamqp.com/blog/part2-rabbitmq-best-practice-for-high-performance.html)
- [Production Deployment Guidelines](https://www.rabbitmq.com/docs/production-checklist)
- [Scaling RabbitMQ Best Practices](https://scalegrid.io/blog/scaling-rabbitmq/)
- [RabbitMQ Performance Tuning](https://widhianbramantya.com/rabbitmq/rabbitmq-performance-tuning-optimizing-throughput-and-latency/)
- [RabbitMQ Clustering Guide](https://www.rabbitmq.com/docs/clustering)

---

**Last Updated**: December 2025
**Skill Level**: Expert
**Category**: Backend Development / Message Broker
