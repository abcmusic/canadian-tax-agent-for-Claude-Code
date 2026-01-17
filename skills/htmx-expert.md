---
name: htmx-expert
description: htmx library expertise. Provides htmx attributes, AJAX patterns, server interaction, progressive enhancement, accessibility, and integration with backend frameworks. Use when working with htmx for dynamic web applications.
version: 1.0.0
tags:
  - htmx
  - hypermedia
  - ajax
  - progressive-enhancement
  - accessibility
category: domain-expert
---

# htmx Expert Skill

Expert knowledge of htmx - the library that allows you to access modern browser features directly from HTML, using attributes instead of JavaScript.

## htmx Fundamentals

### Core Philosophy

htmx extends HTML with attributes that enable:
- AJAX requests directly from HTML
- CSS Transitions for smooth UX
- WebSockets and Server-Sent Events
- Progressive enhancement with graceful degradation

**Key Principle**: Hypermedia as the engine of application state (HATEOAS)

### Core Attributes

**Request Attributes**:
```html
<!-- Make AJAX requests -->
hx-get="/users"           <!-- GET request -->
hx-post="/users"          <!-- POST request -->
hx-put="/users/1"         <!-- PUT request -->
hx-patch="/users/1"       <!-- PATCH request -->
hx-delete="/users/1"      <!-- DELETE request -->
```

**Trigger Attributes**:
```html
<!-- Control when requests fire -->
hx-trigger="click"                    <!-- Default for buttons -->
hx-trigger="change"                   <!-- Default for inputs -->
hx-trigger="submit"                   <!-- Default for forms -->
hx-trigger="load"                     <!-- On element load -->
hx-trigger="revealed"                 <!-- When scrolled into view -->
hx-trigger="every 2s"                 <!-- Polling -->
hx-trigger="click once"               <!-- Only once -->
hx-trigger="click changed"            <!-- Only if value changed -->
hx-trigger="click delay:500ms"        <!-- Debounce -->
hx-trigger="click throttle:500ms"     <!-- Throttle -->
hx-trigger="mouseenter, mouseleave"   <!-- Multiple triggers -->
```

**Target Attributes**:
```html
<!-- Control where response goes -->
hx-target="#result"              <!-- CSS selector -->
hx-target="this"                 <!-- Replace triggering element -->
hx-target="closest div"          <!-- Closest matching parent -->
hx-target="next .message"        <!-- Next sibling matching selector -->
hx-target="previous .message"    <!-- Previous sibling -->
hx-target="find .content"        <!-- Find within element -->
```

**Swap Attributes**:
```html
<!-- Control how content is swapped -->
hx-swap="innerHTML"              <!-- Replace inner content (default) -->
hx-swap="outerHTML"              <!-- Replace entire element -->
hx-swap="beforebegin"            <!-- Insert before element -->
hx-swap="afterbegin"             <!-- Insert as first child -->
hx-swap="beforeend"              <!-- Insert as last child -->
hx-swap="afterend"               <!-- Insert after element -->
hx-swap="delete"                 <!-- Delete element -->
hx-swap="none"                   <!-- Don't swap, just trigger events -->

<!-- Swap modifiers -->
hx-swap="innerHTML swap:500ms"           <!-- Delay swap -->
hx-swap="innerHTML settle:500ms"         <!-- Delay settle -->
hx-swap="innerHTML transition:true"      <!-- Enable transitions -->
hx-swap="innerHTML show:top"             <!-- Scroll to top -->
hx-swap="innerHTML show:#target:top"     <!-- Scroll target to top -->
hx-swap="innerHTML focus-scroll:true"    <!-- Preserve focus scroll -->
```

### HTML Responses

htmx expects HTML fragments from the server:

```html
<!-- Server returns pure HTML -->
<div class="user-card">
  <h3>John Doe</h3>
  <p>Software Engineer</p>
  <button hx-delete="/users/1"
          hx-target="closest .user-card"
          hx-swap="outerHTML swap:300ms">
    Delete
  </button>
</div>
```

**Response can include htmx attributes** for continued interactivity.

## AJAX Patterns

### Basic AJAX Requests

**Simple GET Request**:
```html
<button hx-get="/api/data"
        hx-target="#result">
  Load Data
</button>

<div id="result">
  <!-- Content will be inserted here -->
</div>
```

**Form Submission**:
```html
<form hx-post="/api/users"
      hx-target="#user-list"
      hx-swap="beforeend">
  <input name="name" placeholder="Name" required>
  <input name="email" type="email" placeholder="Email" required>
  <button type="submit">Add User</button>
</form>

<div id="user-list">
  <!-- New users will be appended here -->
</div>
```

**Delete with Confirmation**:
```html
<button hx-delete="/api/users/1"
        hx-confirm="Are you sure you want to delete this user?"
        hx-target="closest .user-card"
        hx-swap="outerHTML swap:300ms">
  Delete User
</button>
```

### Advanced Trigger Patterns

**Active Search**:
```html
<input type="search"
       name="query"
       hx-get="/search"
       hx-trigger="input changed delay:500ms, search"
       hx-target="#search-results"
       placeholder="Search users...">

<div id="search-results">
  <!-- Results appear here as you type -->
</div>
```

**Load More / Infinite Scroll**:
```html
<div id="content">
  <!-- Initial content -->
  <div class="item">Item 1</div>
  <div class="item">Item 2</div>

  <!-- Load more trigger -->
  <div hx-get="/api/items?page=2"
       hx-trigger="revealed"
       hx-swap="afterend">
    <span class="loading">Loading more...</span>
  </div>
</div>
```

**Polling**:
```html
<!-- Poll every 2 seconds -->
<div hx-get="/api/status"
     hx-trigger="every 2s"
     hx-target="this"
     hx-swap="innerHTML">
  Checking status...
</div>

<!-- Stop polling on specific event -->
<div hx-get="/api/job-status"
     hx-trigger="every 1s"
     hx-target="this"
     class="job-status"
     hx-swap="innerHTML"
     _="on htmx:afterOnLoad
        if event.detail.xhr.responseText contains 'complete'
          halt the event">
  Checking job status...
</div>
```

**Dependent Inputs**:
```html
<select name="country"
        hx-get="/api/states"
        hx-target="#state-select"
        hx-indicator=".state-loading">
  <option value="us">United States</option>
  <option value="ca">Canada</option>
</select>

<span class="state-loading htmx-indicator">Loading...</span>

<select id="state-select" name="state">
  <option>Select a country first</option>
</select>
```

### Request Configuration

**Include Additional Data**:
```html
<!-- Include values from other elements -->
<input name="query" id="search-input">
<button hx-post="/search"
        hx-include="#search-input, [name='filters']">
  Search
</button>

<!-- Include parent form -->
<button hx-post="/submit"
        hx-include="closest form">
  Submit
</button>
```

**Custom Headers**:
```html
<button hx-post="/api/data"
        hx-headers='{"X-Custom-Header": "value"}'>
  Submit
</button>

<!-- Or use JavaScript -->
<button hx-post="/api/data"
        hx-headers='js:{Authorization: "Bearer " + getToken()}'>
  Submit
</button>
```

**Request Parameters**:
```html
<!-- Add query parameters -->
<button hx-get="/search"
        hx-params="query, filter"
        hx-vals='{"source": "button"}'>
  Search
</button>

<!-- Exclude parameters -->
<form hx-post="/submit"
      hx-params="* -password">
  <!-- All params except password -->
</form>
```

## Server Interaction

### Request Headers

htmx automatically sends headers with every request:

```
HX-Request: true                    <!-- Indicates htmx request -->
HX-Target: result                   <!-- ID of target element -->
HX-Trigger-Name: search-btn         <!-- Name of triggered element -->
HX-Trigger: search-btn              <!-- ID of triggered element -->
HX-Current-URL: /page               <!-- Current URL -->
HX-Prompt: user input               <!-- Value from hx-prompt -->
```

**Server-side detection**:
```javascript
// Express.js example
app.get('/data', (req, res) => {
  const isHtmx = req.headers['hx-request'] === 'true';

  if (isHtmx) {
    // Return HTML fragment
    res.send('<div>HTMX Content</div>');
  } else {
    // Return full page
    res.render('full-page');
  }
});
```

### Response Headers

**HX-Trigger**: Trigger client-side events
```
HX-Trigger: userAdded
HX-Trigger: {"showMessage": "User created successfully"}
HX-Trigger: {"event1": "value1", "event2": "value2"}
```

**HX-Location**: Client-side redirect
```
HX-Location: /new-page
HX-Location: {"path": "/new-page", "target": "#main"}
```

**HX-Redirect**: Full page redirect
```
HX-Redirect: /login
```

**HX-Refresh**: Refresh the page
```
HX-Refresh: true
```

**HX-Push-Url**: Update browser URL
```
HX-Push-Url: /new-url
HX-Push-Url: false  <!-- Prevent URL update -->
```

**HX-Retarget**: Change target element
```
HX-Retarget: #different-element
```

**HX-Reswap**: Change swap strategy
```
HX-Reswap: beforeend
```

**Example Server Response**:
```javascript
// Express.js
app.post('/users', (req, res) => {
  const user = createUser(req.body);

  res.set('HX-Trigger', JSON.stringify({
    userCreated: { id: user.id, name: user.name }
  }));

  res.send(`
    <div class="user-card" id="user-${user.id}">
      <h3>${user.name}</h3>
      <button hx-delete="/users/${user.id}"
              hx-target="closest .user-card">
        Delete
      </button>
    </div>
  `);
});
```

### Out-of-Band Updates

Update multiple parts of the page with a single response:

```html
<!-- Main response target -->
<div id="main-content">
  <!-- This gets updated normally -->
</div>

<!-- Out-of-band target -->
<div id="notifications">
  <!-- This can also be updated -->
</div>
```

**Server response**:
```html
<!-- Normal content -->
<div>Updated main content</div>

<!-- Out-of-band update -->
<div id="notifications" hx-swap-oob="true">
  <div class="notification">New message!</div>
</div>

<!-- Multiple out-of-band updates -->
<div id="sidebar" hx-swap-oob="true">Sidebar content</div>
<div id="header" hx-swap-oob="beforeend">New header item</div>
```

**Selective Out-of-Band**:
```html
<!-- Only swap if element exists -->
<div id="notifications" hx-swap-oob="true">
  New notification
</div>

<!-- Different swap strategies -->
<div id="alerts" hx-swap-oob="beforeend">New alert</div>
<div id="errors" hx-swap-oob="afterbegin">New error</div>
<div id="old-message" hx-swap-oob="delete"></div>
```

## Progressive Enhancement

### Graceful Degradation

**Design for No-JS First**:
```html
<!-- Works without JavaScript -->
<form action="/search" method="GET">
  <input name="q" type="search">
  <button type="submit">Search</button>
</form>

<!-- Enhanced with htmx -->
<form action="/search" method="GET"
      hx-get="/search"
      hx-target="#results"
      hx-push-url="true">
  <input name="q" type="search">
  <button type="submit">Search</button>
</form>
```

**Server handles both**:
```javascript
app.get('/search', (req, res) => {
  const results = search(req.query.q);

  if (req.headers['hx-request']) {
    // Return fragment for htmx
    res.render('search-results', { results });
  } else {
    // Return full page for regular form submission
    res.render('search-page', { results });
  }
});
```

### Boost Existing Links and Forms

**hx-boost**: Convert regular links/forms to AJAX:
```html
<!-- Enable for entire section -->
<div hx-boost="true">
  <a href="/page1">Page 1</a>  <!-- AJAX request -->
  <a href="/page2">Page 2</a>  <!-- AJAX request -->

  <!-- Opt-out specific links -->
  <a href="/download.pdf" hx-boost="false">Download PDF</a>
</div>

<!-- Enable globally -->
<body hx-boost="true">
  <!-- All links and forms are boosted -->
</body>
```

**Benefits**:
- Progressively enhances existing HTML
- Maintains server-side routing
- Works without JavaScript
- Preserves browser history

### Accessibility Best Practices

**Loading States**:
```html
<button hx-get="/data"
        hx-target="#result"
        aria-busy="false">
  Load Data
  <span class="htmx-indicator" aria-hidden="true">
    Loading...
  </span>
</button>

<style>
  .htmx-request [aria-busy="false"] {
    display: none;
  }
  .htmx-request .htmx-indicator {
    display: inline;
  }
</style>
```

**ARIA Live Regions**:
```html
<!-- Announce dynamic updates to screen readers -->
<div id="results"
     role="region"
     aria-live="polite"
     aria-label="Search results">
  <!-- Updated content announced automatically -->
</div>

<!-- For urgent updates -->
<div id="errors"
     role="alert"
     aria-live="assertive">
  <!-- Interrupts screen reader -->
</div>
```

**Focus Management**:
```html
<!-- Preserve focus after swap -->
<button hx-get="/data"
        hx-target="#content"
        hx-swap="innerHTML settle:100ms"
        _="on htmx:afterSwap wait 100ms then send focus to #first-input">
  Load Form
</button>

<!-- Auto-focus on new content -->
<div hx-get="/modal"
     hx-target="#modal-container"
     hx-swap="innerHTML"
     _="on htmx:afterSwap send focus to first <button/>">
  Open Modal
</div>
```

**Keyboard Navigation**:
```html
<!-- Ensure all interactive elements are keyboard accessible -->
<div class="list-item"
     tabindex="0"
     role="button"
     hx-get="/details/1"
     hx-target="#details"
     _="on keydown[key is 'Enter' or key is 'Space']
        trigger click">
  Item 1
</div>
```

## Advanced Features

### History Support

**Push State**:
```html
<!-- Update URL without page reload -->
<a hx-get="/page2"
   hx-target="#content"
   hx-push-url="true">
  Page 2
</a>

<!-- Custom URL -->
<a hx-get="/api/page2"
   hx-target="#content"
   hx-push-url="/page2">
  Page 2
</a>
```

**Handle Back/Forward**:
```html
<div id="content"
     hx-history-elt
     hx-get="/current-page"
     hx-trigger="load">
  <!-- Content restored on back/forward -->
</div>
```

**History Configuration**:
```javascript
// Configure history behavior
htmx.config.historyCacheSize = 20;  // Cache last 20 pages
htmx.config.historyEnabled = true;   // Enable history
htmx.config.refreshOnHistoryMiss = true;  // Refresh on cache miss
```

### WebSockets

**Connect to WebSocket**:
```html
<div hx-ws="connect:/ws">
  <!-- WebSocket connection established -->

  <form hx-ws="send:submit">
    <input name="message">
    <button type="submit">Send</button>
  </form>

  <!-- Messages received here -->
  <div id="messages"></div>
</div>
```

**Server-side (Node.js)**:
```javascript
const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', (ws) => {
  ws.on('message', (message) => {
    // Send HTML fragment
    ws.send(`
      <div class="message" hx-swap-oob="beforeend:#messages">
        ${message}
      </div>
    `);
  });
});
```

### Server-Sent Events (SSE)

**Connect to SSE**:
```html
<div hx-sse="connect:/events">
  <!-- Listen for 'message' event -->
  <div hx-sse="swap:message">
    Waiting for messages...
  </div>

  <!-- Listen for 'notification' event -->
  <div hx-sse="swap:notification" id="notifications">
    No notifications
  </div>
</div>
```

**Server-side (Express)**:
```javascript
app.get('/events', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  // Send events
  const interval = setInterval(() => {
    res.write('event: message\n');
    res.write(`data: <div>Update at ${new Date()}</div>\n\n`);
  }, 1000);

  req.on('close', () => {
    clearInterval(interval);
  });
});
```

### Extensions

**Install Extensions**:
```html
<script src="https://unpkg.com/htmx.org@1.9.10"></script>
<script src="https://unpkg.com/htmx.org@1.9.10/dist/ext/json-enc.js"></script>
<script src="https://unpkg.com/htmx.org@1.9.10/dist/ext/debug.js"></script>
```

**Use Extensions**:
```html
<!-- JSON encoding for POST requests -->
<form hx-post="/api/data"
      hx-ext="json-enc">
  <input name="name">
  <button type="submit">Submit as JSON</button>
</form>

<!-- Debug extension -->
<div hx-ext="debug">
  <!-- Logs all htmx activity to console -->
</div>
```

**Popular Extensions**:
- `json-enc`: Send JSON instead of form data
- `debug`: Console logging for debugging
- `loading-states`: Automatic loading indicators
- `alpine-morph`: Morph DOM instead of replace (with Alpine.js)
- `preload`: Preload content on hover
- `remove-me`: Auto-remove elements after delay
- `response-targets`: Different targets based on response code

## Framework Integration

### Express.js (Node.js)

**Setup**:
```javascript
const express = require('express');
const app = express();

// Middleware to detect htmx requests
app.use((req, res, next) => {
  res.locals.isHtmx = req.headers['hx-request'] === 'true';
  next();
});

// Template helper
app.locals.layout = function(isHtmx) {
  return isHtmx ? 'fragment' : 'layout';
};
```

**Route Handler**:
```javascript
app.get('/users', async (req, res) => {
  const users = await User.findAll();

  if (res.locals.isHtmx) {
    // Return fragment
    res.render('users-list', { users, layout: false });
  } else {
    // Return full page
    res.render('users-page', { users });
  }
});

app.post('/users', async (req, res) => {
  const user = await User.create(req.body);

  // Trigger client event
  res.set('HX-Trigger', JSON.stringify({
    userCreated: { id: user.id }
  }));

  res.render('user-card', { user, layout: false });
});
```

### Spring Boot (Java)

**Controller**:
```java
@Controller
public class UserController {

    @GetMapping("/users")
    public String getUsers(
        @RequestHeader(value = "HX-Request", required = false) String htmxRequest,
        Model model
    ) {
        List<User> users = userService.findAll();
        model.addAttribute("users", users);

        // Return fragment for htmx, full page otherwise
        return "true".equals(htmxRequest)
            ? "fragments/user-list"
            : "users-page";
    }

    @PostMapping("/users")
    public ResponseEntity<String> createUser(
        @RequestBody User user,
        HttpServletResponse response
    ) {
        User created = userService.create(user);

        // Set response headers
        response.setHeader("HX-Trigger",
            "{\"userCreated\": {\"id\": " + created.getId() + "}}");

        return ResponseEntity.ok(renderUserCard(created));
    }
}
```

### Django (Python)

**View**:
```python
from django.shortcuts import render
from django.http import HttpResponse

def users_view(request):
    users = User.objects.all()

    # Check if htmx request
    is_htmx = request.headers.get('HX-Request') == 'true'

    if is_htmx:
        # Return fragment
        return render(request, 'users_list.html', {'users': users})
    else:
        # Return full page
        return render(request, 'users_page.html', {'users': users})

def create_user(request):
    if request.method == 'POST':
        user = User.objects.create(**request.POST.dict())

        # Set response header
        response = render(request, 'user_card.html', {'user': user})
        response['HX-Trigger'] = f'{{"userCreated": {{"id": {user.id}}}}}'

        return response
```

**Template**:
```django
<!-- users_list.html -->
{% for user in users %}
  <div class="user-card">
    <h3>{{ user.name }}</h3>
    <button hx-delete="{% url 'delete-user' user.id %}"
            hx-target="closest .user-card"
            hx-confirm="Delete {{ user.name }}?">
      Delete
    </button>
  </div>
{% endfor %}
```

### Rails (Ruby)

**Controller**:
```ruby
class UsersController < ApplicationController
  def index
    @users = User.all

    # Render fragment for htmx
    if request.headers['HX-Request']
      render partial: 'users/list', locals: { users: @users }
    else
      render :index
    end
  end

  def create
    @user = User.create(user_params)

    # Set response header
    response.set_header('HX-Trigger',
      { userCreated: { id: @user.id } }.to_json
    )

    render partial: 'users/card', locals: { user: @user }
  end
end
```

**View**:
```erb
<!-- _card.html.erb -->
<div class="user-card" id="user-<%= user.id %>">
  <h3><%= user.name %></h3>
  <%= button_to "Delete",
      user_path(user),
      method: :delete,
      data: {
        hx_delete: user_path(user),
        hx_target: "closest .user-card",
        hx_confirm: "Delete #{user.name}?"
      } %>
</div>
```

## Best Practices

### Performance Optimization

**Use hx-select for Large Responses**:
```html
<!-- Only extract specific part of response -->
<button hx-get="/full-page"
        hx-select="#content"
        hx-target="#main">
  Load Content Only
</button>
```

**Debounce Input Events**:
```html
<!-- Prevent excessive requests -->
<input hx-get="/search"
       hx-trigger="input changed delay:500ms"
       hx-target="#results">
```

**Use Indicators Wisely**:
```html
<!-- Show loading state -->
<button hx-get="/data"
        hx-indicator="#spinner">
  Load Data
</button>

<div id="spinner" class="htmx-indicator">
  <i class="fa fa-spinner fa-spin"></i> Loading...
</div>

<style>
  .htmx-indicator { display: none; }
  .htmx-request .htmx-indicator { display: inline; }
</style>
```

**Optimize Swapping**:
```html
<!-- Use transitions for smooth UX -->
<div hx-swap="innerHTML transition:true">
  <!-- Content transitions smoothly -->
</div>

<!-- Settle time for animations -->
<div hx-swap="innerHTML settle:300ms">
  <!-- Wait for CSS transitions -->
</div>
```

### Caching Strategies

**Client-side Caching**:
```html
<!-- Cache GET requests -->
<button hx-get="/expensive-data"
        hx-target="#result"
        hx-sync="this:replace">
  Load Data (Cached)
</button>
```

**Server-side Caching**:
```javascript
const cache = new Map();

app.get('/data', (req, res) => {
  const cacheKey = req.url;

  if (cache.has(cacheKey)) {
    res.set('X-Cache', 'HIT');
    return res.send(cache.get(cacheKey));
  }

  const data = fetchExpensiveData();
  cache.set(cacheKey, data);

  res.set('X-Cache', 'MISS');
  res.send(data);
});
```

**ETag Support**:
```javascript
app.get('/data', (req, res) => {
  const data = getData();
  const etag = generateETag(data);

  if (req.headers['if-none-match'] === etag) {
    return res.status(304).end();
  }

  res.set('ETag', etag);
  res.send(data);
});
```

### Error Handling

**Global Error Handler**:
```javascript
// Listen for htmx errors
document.body.addEventListener('htmx:responseError', (event) => {
  const status = event.detail.xhr.status;
  const response = event.detail.xhr.responseText;

  if (status === 401) {
    window.location.href = '/login';
  } else if (status === 422) {
    // Show validation errors
    showErrors(JSON.parse(response));
  } else {
    showNotification('An error occurred', 'error');
  }
});
```

**Server Error Responses**:
```javascript
app.post('/users', (req, res) => {
  try {
    const user = createUser(req.body);
    res.send(renderUserCard(user));
  } catch (error) {
    if (error.name === 'ValidationError') {
      res.status(422).send(renderErrors(error.errors));
    } else {
      res.status(500).send(`
        <div class="error" role="alert">
          An unexpected error occurred
        </div>
      `);
    }
  }
});
```

**Inline Error Display**:
```html
<form hx-post="/users"
      hx-target="#form-container"
      hx-swap="outerHTML">

  <div id="form-container">
    <input name="email" required>
    <button type="submit">Submit</button>
  </div>
</form>

<!-- Server returns on error -->
<div id="form-container">
  <div class="error">Email is invalid</div>
  <input name="email" value="invalid@" required>
  <button type="submit">Submit</button>
</div>
```

### Testing

**Unit Testing htmx Attributes**:
```javascript
// Jest example
test('button has correct htmx attributes', () => {
  const button = document.querySelector('[hx-get]');

  expect(button.getAttribute('hx-get')).toBe('/api/data');
  expect(button.getAttribute('hx-target')).toBe('#result');
  expect(button.getAttribute('hx-swap')).toBe('innerHTML');
});
```

**Integration Testing**:
```javascript
// Playwright example
test('clicking button loads content', async ({ page }) => {
  await page.goto('/');

  // Wait for htmx to load
  await page.waitForLoadState('networkidle');

  // Click button
  await page.click('[hx-get="/api/data"]');

  // Wait for htmx request
  await page.waitForResponse('/api/data');

  // Verify content updated
  await expect(page.locator('#result')).toContainText('Expected content');
});
```

**Mock htmx Requests**:
```javascript
// Intercept htmx requests in tests
test('handles error response', async ({ page }) => {
  await page.route('/api/data', route => {
    route.fulfill({
      status: 500,
      body: '<div class="error">Server error</div>'
    });
  });

  await page.click('[hx-get="/api/data"]');

  await expect(page.locator('.error')).toBeVisible();
});
```

## Common Patterns

### 1. Infinite Scroll

**Implementation**:
```html
<div id="content">
  <!-- Initial items -->
  <div class="item">Item 1</div>
  <div class="item">Item 2</div>

  <!-- Load more trigger -->
  <div hx-get="/api/items?page=2"
       hx-trigger="revealed"
       hx-swap="afterend"
       hx-indicator="#loading">
    <div id="loading" class="htmx-indicator">
      Loading more items...
    </div>
  </div>
</div>
```

**Server Response**:
```html
<!-- New items -->
<div class="item">Item 3</div>
<div class="item">Item 4</div>

<!-- Next page trigger -->
<div hx-get="/api/items?page=3"
     hx-trigger="revealed"
     hx-swap="afterend">
  <div class="htmx-indicator">Loading more...</div>
</div>
```

### 2. Inline Editing

**Implementation**:
```html
<div class="editable" id="user-name">
  <span class="view">
    John Doe
    <button hx-get="/edit/name/1"
            hx-target="#user-name"
            hx-swap="outerHTML">
      Edit
    </button>
  </span>
</div>
```

**Edit Mode Response**:
```html
<div class="editable" id="user-name">
  <form hx-put="/update/name/1"
        hx-target="#user-name"
        hx-swap="outerHTML">
    <input name="name" value="John Doe" autofocus>
    <button type="submit">Save</button>
    <button hx-get="/cancel/name/1"
            hx-target="#user-name"
            hx-swap="outerHTML">
      Cancel
    </button>
  </form>
</div>
```

**Save Response**:
```html
<div class="editable" id="user-name">
  <span class="view">
    Jane Smith
    <button hx-get="/edit/name/1"
            hx-target="#user-name"
            hx-swap="outerHTML">
      Edit
    </button>
  </span>
</div>
```

### 3. Modal Dialogs

**Trigger**:
```html
<button hx-get="/modal/user/1"
        hx-target="#modal"
        hx-swap="innerHTML"
        _="on htmx:afterSwap wait 10ms then add .show to #modal">
  Open Modal
</button>

<div id="modal" class="modal">
  <!-- Modal content loaded here -->
</div>
```

**Modal Response**:
```html
<div class="modal-content">
  <div class="modal-header">
    <h2>User Details</h2>
    <button class="close"
            _="on click remove .show from #modal">
      ×
    </button>
  </div>

  <div class="modal-body">
    <h3>John Doe</h3>
    <p>Software Engineer</p>
  </div>

  <div class="modal-footer">
    <button hx-delete="/users/1"
            hx-target="#user-list"
            _="on htmx:afterRequest remove .show from #modal">
      Delete User
    </button>
  </div>
</div>
```

**Styles**:
```css
.modal {
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.5);
}

.modal.show {
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-content {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  max-width: 500px;
  width: 90%;
}
```

### 4. Active Search with Filters

**Implementation**:
```html
<form id="search-form">
  <!-- Search input -->
  <input name="q"
         type="search"
         hx-get="/search"
         hx-trigger="input changed delay:300ms, search"
         hx-target="#results"
         hx-include="#search-form"
         placeholder="Search...">

  <!-- Filters -->
  <select name="category"
          hx-get="/search"
          hx-target="#results"
          hx-include="#search-form">
    <option value="">All Categories</option>
    <option value="books">Books</option>
    <option value="electronics">Electronics</option>
  </select>

  <select name="sort"
          hx-get="/search"
          hx-target="#results"
          hx-include="#search-form">
    <option value="relevance">Relevance</option>
    <option value="price-asc">Price: Low to High</option>
    <option value="price-desc">Price: High to Low</option>
  </select>
</form>

<div id="results">
  <!-- Search results appear here -->
</div>
```

**Server Handler**:
```javascript
app.get('/search', async (req, res) => {
  const { q, category, sort } = req.query;

  const results = await searchProducts({
    query: q,
    category: category || null,
    sortBy: sort || 'relevance'
  });

  res.render('search-results', { results, query: q });
});
```

### 5. Cascading Dropdowns

**Implementation**:
```html
<form>
  <!-- First dropdown -->
  <select name="country"
          hx-get="/api/states"
          hx-target="#state-container"
          hx-indicator="#state-loading">
    <option value="">Select Country</option>
    <option value="us">United States</option>
    <option value="ca">Canada</option>
    <option value="uk">United Kingdom</option>
  </select>

  <span id="state-loading" class="htmx-indicator">
    <i class="fa fa-spinner fa-spin"></i>
  </span>

  <!-- Second dropdown (dependent) -->
  <div id="state-container">
    <select name="state" disabled>
      <option>Select a country first</option>
    </select>
  </div>

  <!-- Third dropdown (dependent on second) -->
  <div id="city-container">
    <select name="city" disabled>
      <option>Select a state first</option>
    </select>
  </div>
</form>
```

**Server Response for States**:
```html
<select name="state"
        hx-get="/api/cities"
        hx-target="#city-container"
        hx-include="[name='country']">
  <option value="">Select State</option>
  <option value="ca">California</option>
  <option value="ny">New York</option>
  <option value="tx">Texas</option>
</select>
```

**Server Response for Cities**:
```html
<select name="city">
  <option value="">Select City</option>
  <option value="la">Los Angeles</option>
  <option value="sf">San Francisco</option>
  <option value="sd">San Diego</option>
</select>
```

## Example: Complete CRUD Application

### HTML Structure

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>User Management</title>
  <script src="https://unpkg.com/htmx.org@1.9.10"></script>
  <link rel="stylesheet" href="/styles.css">
</head>
<body hx-boost="true">

  <!-- Header -->
  <header>
    <h1>User Management</h1>
    <button hx-get="/users/new"
            hx-target="#modal"
            hx-swap="innerHTML"
            class="btn-primary">
      Add User
    </button>
  </header>

  <!-- Search -->
  <div class="search-bar">
    <input type="search"
           name="q"
           hx-get="/users/search"
           hx-trigger="input changed delay:300ms, search"
           hx-target="#user-list"
           hx-indicator="#search-indicator"
           placeholder="Search users...">

    <span id="search-indicator" class="htmx-indicator">
      <i class="fa fa-spinner fa-spin"></i>
    </span>
  </div>

  <!-- User List -->
  <div id="user-list">
    <!-- Users loaded here -->
    <div hx-get="/users"
         hx-trigger="load"
         hx-indicator="#loading">
      <div id="loading" class="htmx-indicator">
        Loading users...
      </div>
    </div>
  </div>

  <!-- Modal Container -->
  <div id="modal" class="modal"></div>

  <!-- Notifications -->
  <div id="notifications"
       role="region"
       aria-live="polite"
       aria-label="Notifications">
  </div>

</body>
</html>
```

### User List Response

```html
<!-- /users response -->
<div class="user-grid">
  <div class="user-card" id="user-1">
    <div class="user-avatar">JD</div>
    <div class="user-info">
      <h3>John Doe</h3>
      <p>john.doe@example.com</p>
      <span class="badge">Active</span>
    </div>
    <div class="user-actions">
      <button hx-get="/users/1/edit"
              hx-target="#modal"
              hx-swap="innerHTML"
              class="btn-sm">
        Edit
      </button>
      <button hx-delete="/users/1"
              hx-confirm="Delete John Doe?"
              hx-target="#user-1"
              hx-swap="outerHTML swap:300ms"
              class="btn-sm btn-danger">
        Delete
      </button>
    </div>
  </div>

  <!-- More users... -->
</div>
```

### Create/Edit Form

```html
<!-- /users/new or /users/1/edit response -->
<div class="modal-content">
  <div class="modal-header">
    <h2>Add User</h2>
    <button class="close"
            _="on click remove .show from #modal">
      ×
    </button>
  </div>

  <form hx-post="/users"
        hx-target="#user-list"
        hx-swap="beforeend"
        _="on htmx:afterRequest remove .show from #modal">

    <div class="form-group">
      <label for="name">Name</label>
      <input id="name"
             name="name"
             required
             autofocus>
    </div>

    <div class="form-group">
      <label for="email">Email</label>
      <input id="email"
             name="email"
             type="email"
             required>
    </div>

    <div class="form-group">
      <label for="role">Role</label>
      <select id="role" name="role">
        <option value="user">User</option>
        <option value="admin">Admin</option>
      </select>
    </div>

    <div class="modal-footer">
      <button type="submit" class="btn-primary">
        Save User
      </button>
      <button type="button"
              class="btn-secondary"
              _="on click remove .show from #modal">
        Cancel
      </button>
    </div>
  </form>
</div>
```

### Server Implementation (Express)

```javascript
const express = require('express');
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Get all users
app.get('/users', async (req, res) => {
  const users = await db.users.findAll();
  res.render('user-list', { users });
});

// Search users
app.get('/users/search', async (req, res) => {
  const users = await db.users.search(req.query.q);
  res.render('user-list', { users });
});

// New user form
app.get('/users/new', (req, res) => {
  res.render('user-form', { user: {}, action: 'create' });
});

// Edit user form
app.get('/users/:id/edit', async (req, res) => {
  const user = await db.users.findById(req.params.id);
  res.render('user-form', { user, action: 'edit' });
});

// Create user
app.post('/users', async (req, res) => {
  const user = await db.users.create(req.body);

  // Trigger notification
  res.set('HX-Trigger', JSON.stringify({
    userCreated: {
      id: user.id,
      message: 'User created successfully'
    }
  }));

  res.render('user-card', { user });
});

// Update user
app.put('/users/:id', async (req, res) => {
  const user = await db.users.update(req.params.id, req.body);

  res.set('HX-Trigger', JSON.stringify({
    userUpdated: {
      id: user.id,
      message: 'User updated successfully'
    }
  }));

  res.render('user-card', { user });
});

// Delete user
app.delete('/users/:id', async (req, res) => {
  await db.users.delete(req.params.id);

  res.set('HX-Trigger', JSON.stringify({
    userDeleted: {
      message: 'User deleted successfully'
    }
  }));

  res.send(''); // Empty response deletes element
});

// Error handling
app.use((err, req, res, next) => {
  if (req.headers['hx-request']) {
    res.status(err.status || 500).render('error', {
      error: err.message
    });
  } else {
    res.status(err.status || 500).render('error-page', {
      error: err
    });
  }
});
```

### Event Handlers

```javascript
// Listen for htmx events
document.body.addEventListener('userCreated', (event) => {
  showNotification(event.detail.message, 'success');
});

document.body.addEventListener('userUpdated', (event) => {
  showNotification(event.detail.message, 'success');
});

document.body.addEventListener('userDeleted', (event) => {
  showNotification(event.detail.message, 'info');
});

// Show notification function
function showNotification(message, type) {
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.textContent = message;

  document.getElementById('notifications').appendChild(notification);

  setTimeout(() => {
    notification.classList.add('fade-out');
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}
```

## Summary

htmx enables building dynamic, modern web applications with minimal JavaScript by:

1. **Extending HTML** with AJAX, WebSockets, and SSE capabilities
2. **Progressive Enhancement** with graceful degradation for accessibility
3. **Server-Side Rendering** using familiar backend frameworks
4. **Hypermedia-Driven** architecture for maintainable applications
5. **Simple Integration** with existing codebases and frameworks

**When to Use htmx**:
- Building hypermedia-driven applications
- Progressive enhancement of existing sites
- Server-side rendering with dynamic updates
- Reducing JavaScript complexity
- Improving accessibility
- Rapid prototyping

**Key Benefits**:
- Minimal JavaScript required
- Works with any backend framework
- Preserves browser history and navigation
- Excellent accessibility out of the box
- Simple mental model (HTML-first)
- Small library size (~14KB gzipped)

**Resources**:
- Official docs: https://htmx.org
- Examples: https://htmx.org/examples/
- Essays: https://htmx.org/essays/
- Extensions: https://htmx.org/extensions/
