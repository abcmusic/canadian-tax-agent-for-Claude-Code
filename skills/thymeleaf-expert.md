---
name: thymeleaf-expert
description: Thymeleaf template engine expertise. Provides Thymeleaf template syntax, expressions, form handling, fragments, layouts, Spring integration, and best practices. Use when working with Thymeleaf templates in Spring applications.
version: 1.0.0
tags: [thymeleaf, template-engine, spring, html, forms]
category: domain-expert
dependencies: []
platforms: [all]
---

# Thymeleaf Expert Skill

Comprehensive expertise for working with Thymeleaf template engine in Spring applications. This skill covers template syntax, expressions, form handling, fragments, Spring integration, and production best practices.

## Table of Contents

1. [Thymeleaf Fundamentals](#thymeleaf-fundamentals)
2. [Expression Syntax](#expression-syntax)
3. [Form Handling](#form-handling)
4. [Fragments & Layouts](#fragments--layouts)
5. [Spring Integration](#spring-integration)
6. [Advanced Features](#advanced-features)
7. [Best Practices](#best-practices)
8. [Common Patterns](#common-patterns)
9. [Practical Examples](#practical-examples)

---

## Thymeleaf Fundamentals

### Standard Dialect

Thymeleaf Standard Dialect provides attribute processors for HTML templates:

**Core Attributes:**
```html
<!-- Text replacement -->
<p th:text="${message}">Default text</p>

<!-- HTML content (unescaped) -->
<div th:utext="${htmlContent}">Default HTML</div>

<!-- Attribute setting -->
<img th:src="@{/images/logo.png}" th:alt="${logoAlt}"/>

<!-- Conditional rendering -->
<div th:if="${user.isAdmin()}">Admin Panel</div>
<div th:unless="${user.isAdmin()}">User Panel</div>

<!-- Iteration -->
<tr th:each="product : ${products}">
    <td th:text="${product.name}">Product Name</td>
</tr>

<!-- Fragment inclusion -->
<div th:insert="~{fragments/header :: header}"></div>
```

### Natural Templates

Thymeleaf templates are valid HTML that can be opened in browsers:

```html
<!DOCTYPE html>
<html xmlns:th="http://www.thymeleaf.org">
<head>
    <title th:text="${pageTitle}">Default Title</title>
    <link rel="stylesheet" th:href="@{/css/styles.css}"
          href="../static/css/styles.css"/>
</head>
<body>
    <!-- Natural template: shows prototype content in browser,
         replaced by dynamic content when processed -->
    <h1 th:text="${heading}">Welcome Page</h1>

    <table>
        <tr>
            <th>Name</th>
            <th>Price</th>
        </tr>
        <!-- Prototype row visible in static HTML -->
        <tr th:each="product : ${products}">
            <td th:text="${product.name}">Sample Product</td>
            <td th:text="${product.price}">$99.99</td>
        </tr>
        <!-- Static prototype rows for design -->
        <tr>
            <td>Product 1</td>
            <td>$19.99</td>
        </tr>
        <tr>
            <td>Product 2</td>
            <td>$29.99</td>
        </tr>
    </table>
</body>
</html>
```

### th: Namespace

**Essential Attributes:**

```html
<!-- th:text - Set text content (HTML escaped) -->
<span th:text="${username}">Guest</span>

<!-- th:utext - Set HTML content (unescaped) -->
<div th:utext="${richContent}"></div>

<!-- th:attr - Set any attribute -->
<input th:attr="value=${inputValue},placeholder=${placeholder}"/>

<!-- th:attrappend / th:attrprepend - Append/prepend to attributes -->
<div class="container" th:attrappend="class=${' ' + additionalClasses}"></div>

<!-- th:classappend - Append to class attribute -->
<div class="base" th:classappend="${isActive ? 'active' : ''}"></div>

<!-- th:styleappend - Append to style attribute -->
<div th:styleappend="${'color: ' + color}"></div>

<!-- th:value - Set input value -->
<input type="text" th:value="${user.name}"/>

<!-- th:with - Define local variables -->
<div th:with="fullName=${user.firstName + ' ' + user.lastName}">
    <p th:text="${fullName}"></p>
</div>

<!-- th:object - Set form backing object -->
<form th:object="${user}" th:action="@{/save}" method="post">
    <input type="text" th:field="*{name}"/>
</form>

<!-- th:remove - Remove element or content -->
<tr th:remove="all">This row is for design only</tr>
```

---

## Expression Syntax

### Variable Expressions (${...})

Access model attributes and Spring beans:

```html
<!-- Simple property access -->
<p th:text="${user.name}">Name</p>

<!-- Method calls -->
<p th:text="${user.getFullName()}">Full Name</p>

<!-- Array/List access -->
<p th:text="${products[0].name}">First Product</p>

<!-- Map access -->
<p th:text="${userMap['admin'].email}">Admin Email</p>

<!-- Null-safe navigation -->
<p th:text="${user?.address?.city}">City</p>

<!-- Spring bean access -->
<p th:text="${@userService.findById(id)}">User</p>

<!-- Built-in objects -->
<p th:text="${#ctx.locale}">Locale</p>
<p th:text="${#request.requestURI}">URI</p>
<p th:text="${#session.getAttribute('user')}">Session User</p>
```

### Selection Expressions (*{...})

Used with th:object for form binding:

```html
<form th:object="${user}">
    <!-- *{name} is equivalent to ${user.name} -->
    <input type="text" th:field="*{name}"/>
    <input type="email" th:field="*{email}"/>

    <!-- Nested objects -->
    <input type="text" th:field="*{address.street}"/>
    <input type="text" th:field="*{address.city}"/>

    <!-- Without th:object, * works like $ -->
    <span th:text="*{user.name}">Name</span>
</form>
```

### Message Expressions (#{...})

Internationalization with message properties:

```html
<!-- Simple message -->
<p th:text="#{welcome.message}">Welcome</p>

<!-- Parameterized messages -->
<p th:text="#{greeting.user(${user.name})}">Hello, User</p>

<!-- Multiple parameters -->
<p th:text="#{order.confirmation(${order.id}, ${order.total})}">
    Order confirmation
</p>

<!-- Fallback messages -->
<p th:text="#{custom.message} ?: 'Default Message'">Message</p>
```

**messages.properties:**
```properties
welcome.message=Welcome to our site!
greeting.user=Hello, {0}!
order.confirmation=Order #{0} confirmed. Total: ${1}
```

**messages_es.properties:**
```properties
welcome.message=¡Bienvenido a nuestro sitio!
greeting.user=¡Hola, {0}!
order.confirmation=Pedido #{0} confirmado. Total: ${1}
```

### Link URL Expressions (@{...})

Generate URLs with context path and parameters:

```html
<!-- Simple URL -->
<a th:href="@{/products}">Products</a>

<!-- URL with path variables -->
<a th:href="@{/products/{id}(id=${product.id})}">Details</a>

<!-- URL with query parameters -->
<a th:href="@{/search(query=${searchTerm},page=${pageNum})}">Search</a>

<!-- Multiple path variables and parameters -->
<a th:href="@{/users/{userId}/orders/{orderId}(userId=${user.id},orderId=${order.id},details=true)}">
    Order Details
</a>

<!-- Protocol-relative URL -->
<link rel="stylesheet" th:href="@{//cdn.example.com/styles.css}"/>

<!-- Absolute URL -->
<a th:href="@{http://www.example.com}">External Link</a>

<!-- Server-relative URL (no context path) -->
<a th:href="@{~/resources/doc.pdf}">Document</a>
```

### Fragment Expressions (~{...})

Reference template fragments:

```html
<!-- Insert fragment -->
<div th:insert="~{fragments/header :: header}"></div>

<!-- Replace with fragment -->
<div th:replace="~{fragments/footer :: footer}"></div>

<!-- Fragment with parameters -->
<div th:insert="~{fragments/alert :: alert(type='success', message=${msg})}"></div>

<!-- Conditional fragment -->
<div th:insert="${user.isAdmin()} ? ~{admin :: panel} : ~{user :: panel}"></div>

<!-- Fragment from variable -->
<div th:insert="~{${templateName} :: ${fragmentName}}"></div>
```

### Literal Tokens

```html
<!-- Text literals (single quotes) -->
<p th:text="'Hello, World!'">Text</p>

<!-- Number literals -->
<span th:text="42">Number</span>
<span th:text="3.14159">Pi</span>

<!-- Boolean literals -->
<div th:if="true">Always shown</div>
<div th:if="false">Never shown</div>

<!-- Null literal -->
<span th:text="${value} ?: null">Value</span>

<!-- Literal substitutions (|...|) -->
<span th:text="|Welcome, ${user.name}!|">Welcome</span>
<a th:href="@{|/users/${user.id}/profile|}">Profile</a>
```

### Operators

```html
<!-- Arithmetic -->
<span th:text="${quantity * price}">Total</span>
<span th:text="${total / count}">Average</span>
<span th:text="${count + 1}">Next</span>

<!-- Comparison -->
<div th:if="${age >= 18}">Adult</div>
<div th:if="${price < 100}">Affordable</div>
<div th:if="${status == 'active'}">Active</div>
<div th:if="${role != 'admin'}">Not Admin</div>

<!-- Logical -->
<div th:if="${user != null and user.isActive()}">Active User</div>
<div th:if="${isAdmin or isModerator}">Staff</div>
<div th:if="${not isGuest}">Logged In</div>

<!-- Conditional (ternary) -->
<span th:text="${user.isPremium()} ? 'Premium' : 'Standard'">Tier</span>
<span th:class="${isActive} ? 'active' : 'inactive'">Status</span>

<!-- Elvis operator (default value) -->
<span th:text="${user.nickname} ?: ${user.username}">Name</span>

<!-- No-operation token (_) -->
<span th:text="${customText} ?: _">Keep original text</span>
```

---

## Form Handling

### Form Binding

Bind forms to command objects:

```html
<!-- Controller -->
@GetMapping("/register")
public String showForm(Model model) {
    model.addAttribute("user", new User());
    return "register";
}

@PostMapping("/register")
public String submitForm(@Valid @ModelAttribute User user,
                        BindingResult result, Model model) {
    if (result.hasErrors()) {
        return "register";
    }
    userService.save(user);
    return "redirect:/success";
}

<!-- Template: register.html -->
<form th:action="@{/register}" th:object="${user}" method="post">
    <div>
        <label for="username">Username:</label>
        <input type="text" id="username" th:field="*{username}"/>
        <span th:if="${#fields.hasErrors('username')}"
              th:errors="*{username}" class="error">Error</span>
    </div>

    <div>
        <label for="email">Email:</label>
        <input type="email" id="email" th:field="*{email}"/>
        <span th:if="${#fields.hasErrors('email')}"
              th:errors="*{email}" class="error">Error</span>
    </div>

    <div>
        <label for="password">Password:</label>
        <input type="password" id="password" th:field="*{password}"/>
        <span th:if="${#fields.hasErrors('password')}"
              th:errors="*{password}" class="error">Error</span>
    </div>

    <button type="submit">Register</button>
</form>
```

### Field Binding (th:field)

Automatically sets id, name, and value:

```html
<!-- Text input -->
<input type="text" th:field="*{name}"/>
<!-- Generates: <input type="text" id="name" name="name" value="..."/> -->

<!-- Checkbox (boolean) -->
<input type="checkbox" th:field="*{active}"/>
<!-- Generates: <input type="checkbox" id="active" name="active" value="true"/> -->

<!-- Radio buttons -->
<input type="radio" th:field="*{gender}" value="M"/> Male
<input type="radio" th:field="*{gender}" value="F"/> Female

<!-- Select dropdown -->
<select th:field="*{country}">
    <option th:each="c : ${countries}"
            th:value="${c.code}"
            th:text="${c.name}">Country</option>
</select>

<!-- Multiple select -->
<select th:field="*{selectedRoles}" multiple>
    <option th:each="role : ${availableRoles}"
            th:value="${role.id}"
            th:text="${role.name}">Role</option>
</select>

<!-- Checkbox list -->
<div th:each="hobby : ${hobbies}">
    <input type="checkbox" th:field="*{selectedHobbies}"
           th:value="${hobby.id}"/>
    <label th:text="${hobby.name}">Hobby</label>
</div>

<!-- Textarea -->
<textarea th:field="*{description}" rows="5"></textarea>

<!-- Hidden input -->
<input type="hidden" th:field="*{id}"/>
```

### Validation & Error Messages

Display validation errors:

```html
<!-- Global errors -->
<div th:if="${#fields.hasErrors('global')}">
    <ul>
        <li th:each="err : ${#fields.errors('global')}"
            th:text="${err}">Error</li>
    </ul>
</div>

<!-- Field-specific errors -->
<div>
    <input type="text" th:field="*{email}"
           th:classappend="${#fields.hasErrors('email')} ? 'error'"/>
    <span th:if="${#fields.hasErrors('email')}"
          th:errors="*{email}" class="error-message">Error</span>
</div>

<!-- All errors for a field -->
<div th:if="${#fields.hasErrors('password')}">
    <ul>
        <li th:each="err : ${#fields.errors('password')}"
            th:text="${err}">Error</li>
    </ul>
</div>

<!-- Check for any errors -->
<div th:if="${#fields.hasErrors('*')}" class="alert alert-danger">
    <p>Please correct the following errors:</p>
    <ul>
        <li th:each="err : ${#fields.allErrors()}"
            th:text="${err}">Error</li>
    </ul>
</div>

<!-- Custom error messages -->
<span th:if="${#fields.hasErrors('email')}" class="error">
    <span th:each="err : ${#fields.errors('email')}">
        <span th:if="${err.contains('NotBlank')}" th:text="#{error.email.required}">
            Email is required
        </span>
        <span th:if="${err.contains('Email')}" th:text="#{error.email.invalid}">
            Invalid email format
        </span>
    </span>
</span>
```

### Validation Annotations

**Java Model:**
```java
public class User {
    @NotBlank(message = "Username is required")
    @Size(min = 3, max = 20, message = "Username must be 3-20 characters")
    private String username;

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;

    @NotBlank(message = "Password is required")
    @Size(min = 8, message = "Password must be at least 8 characters")
    @Pattern(regexp = "^(?=.*[A-Z])(?=.*[a-z])(?=.*\\d).*$",
             message = "Password must contain uppercase, lowercase, and digit")
    private String password;

    @NotNull(message = "Age is required")
    @Min(value = 18, message = "Must be at least 18 years old")
    @Max(value = 120, message = "Invalid age")
    private Integer age;

    @NotNull(message = "Terms must be accepted")
    @AssertTrue(message = "You must agree to terms and conditions")
    private Boolean termsAccepted;
}
```

### Spring Form Integration

**Complete Form Example:**

```html
<!-- Controller -->
@Controller
@RequestMapping("/products")
public class ProductController {

    @GetMapping("/new")
    public String showForm(Model model) {
        model.addAttribute("product", new Product());
        model.addAttribute("categories", categoryService.findAll());
        return "products/form";
    }

    @PostMapping
    public String save(@Valid @ModelAttribute Product product,
                      BindingResult result,
                      RedirectAttributes redirectAttributes) {
        if (result.hasErrors()) {
            return "products/form";
        }
        productService.save(product);
        redirectAttributes.addFlashAttribute("message", "Product saved successfully");
        return "redirect:/products";
    }
}

<!-- Template: products/form.html -->
<!DOCTYPE html>
<html xmlns:th="http://www.thymeleaf.org">
<head>
    <title>Product Form</title>
    <style>
        .error { color: red; font-size: 0.9em; }
        .field-error { border-color: red; }
    </style>
</head>
<body>
    <h1>Product Form</h1>

    <form th:action="@{/products}" th:object="${product}" method="post">
        <input type="hidden" th:field="*{id}"/>

        <div>
            <label for="name">Product Name:</label>
            <input type="text" id="name" th:field="*{name}"
                   th:classappend="${#fields.hasErrors('name')} ? 'field-error'"/>
            <div th:if="${#fields.hasErrors('name')}" class="error">
                <span th:errors="*{name}">Name error</span>
            </div>
        </div>

        <div>
            <label for="description">Description:</label>
            <textarea id="description" th:field="*{description}" rows="4"></textarea>
            <div th:if="${#fields.hasErrors('description')}" class="error">
                <span th:errors="*{description}">Description error</span>
            </div>
        </div>

        <div>
            <label for="price">Price:</label>
            <input type="number" step="0.01" id="price" th:field="*{price}"/>
            <div th:if="${#fields.hasErrors('price')}" class="error">
                <span th:errors="*{price}">Price error</span>
            </div>
        </div>

        <div>
            <label for="category">Category:</label>
            <select id="category" th:field="*{category.id}">
                <option value="">Select Category</option>
                <option th:each="cat : ${categories}"
                        th:value="${cat.id}"
                        th:text="${cat.name}">Category</option>
            </select>
            <div th:if="${#fields.hasErrors('category')}" class="error">
                <span th:errors="*{category}">Category error</span>
            </div>
        </div>

        <div>
            <label>
                <input type="checkbox" th:field="*{active}"/> Active
            </label>
        </div>

        <div>
            <button type="submit">Save Product</button>
            <a th:href="@{/products}">Cancel</a>
        </div>
    </form>
</body>
</html>
```

---

## Fragments & Layouts

### Template Fragments

Reusable template pieces:

**fragments/header.html:**
```html
<!DOCTYPE html>
<html xmlns:th="http://www.thymeleaf.org">
<head>
    <title>Fragments</title>
</head>
<body>
    <!-- Simple fragment -->
    <header th:fragment="header">
        <h1>My Application</h1>
        <nav>
            <a th:href="@{/}">Home</a>
            <a th:href="@{/products}">Products</a>
            <a th:href="@{/about}">About</a>
        </nav>
    </header>

    <!-- Parameterized fragment -->
    <div th:fragment="alert(type, message)">
        <div th:class="${'alert alert-' + type}">
            <p th:text="${message}">Alert message</p>
        </div>
    </div>

    <!-- Fragment with default parameters -->
    <div th:fragment="card(title, content, footer : 'Default Footer')">
        <div class="card">
            <div class="card-header" th:text="${title}">Title</div>
            <div class="card-body" th:utext="${content}">Content</div>
            <div class="card-footer" th:text="${footer}">Footer</div>
        </div>
    </div>

    <!-- Fragment selector by id -->
    <div id="user-info">
        <p th:text="${user.name}">Name</p>
        <p th:text="${user.email}">Email</p>
    </div>
</body>
</html>
```

**Using Fragments:**
```html
<!-- Insert: includes fragment inside host element -->
<div th:insert="~{fragments/header :: header}"></div>
<!-- Result: <div><header>...</header></div> -->

<!-- Replace: replaces host element with fragment -->
<div th:replace="~{fragments/header :: header}"></div>
<!-- Result: <header>...</header> -->

<!-- Include: includes only fragment content -->
<div th:include="~{fragments/header :: header}"></div>
<!-- Result: <div><h1>...</h1><nav>...</nav></div> -->

<!-- Parameterized fragments -->
<div th:replace="~{fragments/header :: alert('success', 'Operation completed!')}"></div>

<!-- Fragment by id/class selector -->
<div th:insert="~{fragments/header :: #user-info}"></div>

<!-- Empty fragment (no-op) -->
<div th:insert="~{fragments/header :: .missing-fragment} ?: ~{}"></div>
```

### Layout Patterns

**Master Layout (layout/master.html):**
```html
<!DOCTYPE html>
<html xmlns:th="http://www.thymeleaf.org"
      xmlns:layout="http://www.ultraq.net.nz/thymeleaf/layout">
<head>
    <meta charset="UTF-8"/>
    <title layout:title-pattern="$CONTENT_TITLE - $LAYOUT_TITLE">My App</title>
    <link rel="stylesheet" th:href="@{/css/bootstrap.min.css}"/>
    <link rel="stylesheet" th:href="@{/css/main.css}"/>

    <!-- Additional page-specific head content -->
    <th:block layout:fragment="head"></th:block>
</head>
<body>
    <!-- Header -->
    <header th:replace="~{fragments/header :: header}"></header>

    <!-- Main content area -->
    <main class="container">
        <!-- Flash messages -->
        <div th:if="${message}" class="alert alert-success" th:text="${message}"></div>
        <div th:if="${error}" class="alert alert-danger" th:text="${error}"></div>

        <!-- Page content -->
        <div layout:fragment="content">
            <p>Default content</p>
        </div>
    </main>

    <!-- Footer -->
    <footer th:replace="~{fragments/footer :: footer}"></footer>

    <!-- Scripts -->
    <script th:src="@{/js/jquery.min.js}"></script>
    <script th:src="@{/js/bootstrap.min.js}"></script>

    <!-- Page-specific scripts -->
    <th:block layout:fragment="scripts"></th:block>
</body>
</html>
```

**Using Layout (products/list.html):**
```html
<!DOCTYPE html>
<html xmlns:th="http://www.thymeleaf.org"
      xmlns:layout="http://www.ultraq.net.nz/thymeleaf/layout"
      layout:decorate="~{layout/master}">
<head>
    <title>Products</title>

    <!-- Additional CSS for this page -->
    <th:block layout:fragment="head">
        <link rel="stylesheet" th:href="@{/css/products.css}"/>
    </th:block>
</head>
<body>
    <!-- Main content -->
    <div layout:fragment="content">
        <h1>Products</h1>

        <div class="toolbar">
            <a th:href="@{/products/new}" class="btn btn-primary">Add Product</a>
        </div>

        <table class="table">
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Price</th>
                    <th>Category</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                <tr th:each="product : ${products}">
                    <td th:text="${product.name}">Name</td>
                    <td th:text="${#numbers.formatCurrency(product.price)}">Price</td>
                    <td th:text="${product.category.name}">Category</td>
                    <td>
                        <a th:href="@{/products/{id}(id=${product.id})}">View</a>
                        <a th:href="@{/products/{id}/edit(id=${product.id})}">Edit</a>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>

    <!-- Page-specific scripts -->
    <th:block layout:fragment="scripts">
        <script th:src="@{/js/products.js}"></script>
    </th:block>
</body>
</html>
```

### Fragment Parameterization

**Advanced Fragment Patterns:**

```html
<!-- fragments/components.html -->

<!-- Table component with sorting -->
<table th:fragment="sortable-table(items, columns, sortField, sortDir)">
    <thead>
        <tr>
            <th th:each="col : ${columns}">
                <a th:href="@{''(sort=${col.field},dir=${sortField == col.field and sortDir == 'asc' ? 'desc' : 'asc'})}">
                    <span th:text="${col.label}">Column</span>
                    <i th:if="${sortField == col.field}"
                       th:class="${sortDir == 'asc' ? 'fa fa-sort-up' : 'fa fa-sort-down'}"></i>
                </a>
            </th>
        </tr>
    </thead>
    <tbody>
        <tr th:each="item : ${items}">
            <td th:each="col : ${columns}" th:text="${#objects.arrayGet(item, col.field)}">Value</td>
        </tr>
    </tbody>
</table>

<!-- Pagination component -->
<nav th:fragment="pagination(page, totalPages, url)">
    <ul class="pagination">
        <li th:class="${page <= 0} ? 'disabled'">
            <a th:href="@{${url}(page=${page - 1})}">Previous</a>
        </li>

        <li th:each="i : ${#numbers.sequence(0, totalPages - 1)}"
            th:class="${i == page} ? 'active'">
            <a th:href="@{${url}(page=${i})}" th:text="${i + 1}">Page</a>
        </li>

        <li th:class="${page >= totalPages - 1} ? 'disabled'">
            <a th:href="@{${url}(page=${page + 1})}">Next</a>
        </li>
    </ul>
</nav>

<!-- Modal component -->
<div th:fragment="modal(id, title, body, footer)">
    <div class="modal fade" th:id="${id}" tabindex="-1">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" th:text="${title}">Title</h5>
                    <button type="button" class="close" data-dismiss="modal">
                        <span>&times;</span>
                    </button>
                </div>
                <div class="modal-body" th:utext="${body}">Body</div>
                <div class="modal-footer" th:utext="${footer}">Footer</div>
            </div>
        </div>
    </div>
</div>

<!-- Using components -->
<div th:replace="~{fragments/components :: sortable-table(${products}, ${columns}, ${sort}, ${dir})}"></div>

<div th:replace="~{fragments/components :: pagination(${page}, ${totalPages}, '/products')}"></div>

<div th:replace="~{fragments/components :: modal('deleteModal', 'Confirm Delete',
                 '<p>Are you sure?</p>', '<button data-dismiss=modal>Cancel</button>')}"></div>
```

---

## Spring Integration

### Model Attributes

Pass data from controller to template:

```java
@Controller
public class ProductController {

    // Single attribute
    @GetMapping("/products/{id}")
    public String show(@PathVariable Long id, Model model) {
        Product product = productService.findById(id);
        model.addAttribute("product", product);
        return "products/show";
    }

    // Multiple attributes
    @GetMapping("/products")
    public String list(Model model,
                      @RequestParam(defaultValue = "0") int page,
                      @RequestParam(defaultValue = "10") int size) {
        Page<Product> products = productService.findAll(PageRequest.of(page, size));
        model.addAttribute("products", products.getContent());
        model.addAttribute("page", page);
        model.addAttribute("totalPages", products.getTotalPages());
        return "products/list";
    }

    // Using Map
    @GetMapping("/dashboard")
    public String dashboard(Map<String, Object> model) {
        model.put("users", userService.findAll());
        model.put("stats", statsService.getStats());
        return "dashboard";
    }

    // Return ModelAndView
    @GetMapping("/report")
    public ModelAndView report() {
        ModelAndView mav = new ModelAndView("report");
        mav.addObject("data", reportService.generateData());
        mav.addObject("generatedAt", LocalDateTime.now());
        return mav;
    }

    // @ModelAttribute for all methods
    @ModelAttribute("categories")
    public List<Category> categories() {
        return categoryService.findAll();
    }
}
```

### @Controller Integration

Complete controller patterns:

```java
@Controller
@RequestMapping("/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    // List with pagination and search
    @GetMapping
    public String list(Model model,
                      @RequestParam(required = false) String search,
                      @PageableDefault(size = 20, sort = "name") Pageable pageable) {
        Page<User> users = search != null
            ? userService.search(search, pageable)
            : userService.findAll(pageable);

        model.addAttribute("users", users);
        model.addAttribute("search", search);
        return "users/list";
    }

    // Show single user
    @GetMapping("/{id}")
    public String show(@PathVariable Long id, Model model) {
        User user = userService.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        model.addAttribute("user", user);
        return "users/show";
    }

    // New form
    @GetMapping("/new")
    public String newForm(Model model) {
        model.addAttribute("user", new User());
        model.addAttribute("roles", roleService.findAll());
        return "users/form";
    }

    // Edit form
    @GetMapping("/{id}/edit")
    public String edit(@PathVariable Long id, Model model) {
        User user = userService.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        model.addAttribute("user", user);
        model.addAttribute("roles", roleService.findAll());
        return "users/form";
    }

    // Create
    @PostMapping
    public String create(@Valid @ModelAttribute User user,
                        BindingResult result,
                        RedirectAttributes redirectAttributes) {
        if (result.hasErrors()) {
            return "users/form";
        }

        try {
            userService.create(user);
            redirectAttributes.addFlashAttribute("message", "User created successfully");
            return "redirect:/users";
        } catch (DuplicateException e) {
            result.rejectValue("email", "duplicate", "Email already exists");
            return "users/form";
        }
    }

    // Update
    @PostMapping("/{id}")
    public String update(@PathVariable Long id,
                        @Valid @ModelAttribute User user,
                        BindingResult result,
                        RedirectAttributes redirectAttributes) {
        if (result.hasErrors()) {
            return "users/form";
        }

        userService.update(id, user);
        redirectAttributes.addFlashAttribute("message", "User updated successfully");
        return "redirect:/users/{id}";
    }

    // Delete
    @PostMapping("/{id}/delete")
    public String delete(@PathVariable Long id, RedirectAttributes redirectAttributes) {
        userService.delete(id);
        redirectAttributes.addFlashAttribute("message", "User deleted successfully");
        return "redirect:/users";
    }

    // Exception handling
    @ExceptionHandler(ResourceNotFoundException.class)
    public String handleNotFound(ResourceNotFoundException e, Model model) {
        model.addAttribute("error", e.getMessage());
        return "error/404";
    }
}
```

### Form Objects & Command Objects

**Form-specific DTOs:**

```java
// UserRegistrationForm.java
public class UserRegistrationForm {
    @NotBlank(message = "Username is required")
    @Size(min = 3, max = 20)
    private String username;

    @NotBlank(message = "Email is required")
    @Email
    private String email;

    @NotBlank(message = "Password is required")
    @Size(min = 8)
    private String password;

    @NotBlank(message = "Password confirmation is required")
    private String passwordConfirmation;

    @AssertTrue(message = "Passwords must match")
    public boolean isPasswordsMatch() {
        return password != null && password.equals(passwordConfirmation);
    }

    // Getters and setters
}

// Controller
@Controller
public class RegistrationController {

    @GetMapping("/register")
    public String showForm(Model model) {
        model.addAttribute("form", new UserRegistrationForm());
        return "register";
    }

    @PostMapping("/register")
    public String register(@Valid @ModelAttribute("form") UserRegistrationForm form,
                          BindingResult result,
                          RedirectAttributes redirectAttributes) {
        if (result.hasErrors()) {
            return "register";
        }

        // Convert form to entity
        User user = new User();
        user.setUsername(form.getUsername());
        user.setEmail(form.getEmail());
        user.setPassword(passwordEncoder.encode(form.getPassword()));

        userService.register(user);
        redirectAttributes.addFlashAttribute("message", "Registration successful");
        return "redirect:/login";
    }
}

<!-- Template -->
<form th:action="@{/register}" th:object="${form}" method="post">
    <input type="text" th:field="*{username}"/>
    <span th:if="${#fields.hasErrors('username')}" th:errors="*{username}"></span>

    <input type="email" th:field="*{email}"/>
    <span th:if="${#fields.hasErrors('email')}" th:errors="*{email}"></span>

    <input type="password" th:field="*{password}"/>
    <span th:if="${#fields.hasErrors('password')}" th:errors="*{password}"></span>

    <input type="password" th:field="*{passwordConfirmation}"/>
    <span th:if="${#fields.hasErrors('passwordConfirmation')}"
          th:errors="*{passwordConfirmation}"></span>

    <button type="submit">Register</button>
</form>
```

### Spring Security Integration

```html
<!-- Thymeleaf Spring Security dialect -->
<html xmlns:th="http://www.thymeleaf.org"
      xmlns:sec="http://www.thymeleaf.org/extras/spring-security">

<!-- Check if user is authenticated -->
<div sec:authorize="isAuthenticated()">
    Welcome, <span sec:authentication="name">Username</span>
</div>

<div sec:authorize="isAnonymous()">
    <a th:href="@{/login}">Login</a>
</div>

<!-- Check user roles -->
<div sec:authorize="hasRole('ADMIN')">
    <a th:href="@{/admin}">Admin Panel</a>
</div>

<div sec:authorize="hasAnyRole('ADMIN', 'MODERATOR')">
    <a th:href="@{/manage}">Management</a>
</div>

<!-- Check authorities -->
<button sec:authorize="hasAuthority('WRITE_PRIVILEGE')">Edit</button>

<!-- Access authentication object -->
<p>Email: <span sec:authentication="principal.email">email@example.com</span></p>
<p>Roles: <span sec:authentication="principal.authorities">roles</span></p>

<!-- Conditional rendering -->
<table>
    <tr th:each="user : ${users}">
        <td th:text="${user.name}">Name</td>
        <td sec:authorize="hasRole('ADMIN')">
            <a th:href="@{/users/{id}/delete(id=${user.id})}">Delete</a>
        </td>
    </tr>
</table>

<!-- CSRF token -->
<form th:action="@{/users}" method="post">
    <input type="hidden" th:name="${_csrf.parameterName}" th:value="${_csrf.token}"/>
    <!-- Form fields -->
</form>

<!-- Logout -->
<form th:action="@{/logout}" method="post">
    <input type="hidden" th:name="${_csrf.parameterName}" th:value="${_csrf.token}"/>
    <button type="submit">Logout</button>
</form>
```

---

## Advanced Features

### Iteration

```html
<!-- Basic iteration -->
<tr th:each="product : ${products}">
    <td th:text="${product.name}">Name</td>
</tr>

<!-- Iteration with status -->
<tr th:each="product, status : ${products}">
    <td th:text="${status.index}">Index</td>
    <td th:text="${status.count}">Count</td>
    <td th:text="${product.name}">Name</td>
    <td th:text="${status.size}">Total</td>
    <td th:text="${status.current.id}">ID</td>
    <td th:class="${status.even} ? 'even' : 'odd'">Data</td>
    <td th:if="${status.first}">First</td>
    <td th:if="${status.last}">Last</td>
</tr>

<!-- Iterate Map -->
<div th:each="entry : ${userMap}">
    <p th:text="${entry.key}">Key</p>
    <p th:text="${entry.value.name}">Value</p>
</div>

<!-- Iterate with range -->
<option th:each="i : ${#numbers.sequence(1, 10)}" th:value="${i}" th:text="${i}">Number</option>

<!-- Iterate with step -->
<div th:each="i : ${#numbers.sequence(0, 100, 10)}" th:text="${i}">0, 10, 20...</div>

<!-- Nested iteration -->
<div th:each="category : ${categories}">
    <h3 th:text="${category.name}">Category</h3>
    <ul>
        <li th:each="product : ${category.products}" th:text="${product.name}">Product</li>
    </ul>
</div>
```

### Conditionals

```html
<!-- If/Unless -->
<div th:if="${user.isAdmin()}">Admin Content</div>
<div th:unless="${user.isAdmin()}">User Content</div>

<!-- Else (using th:block) -->
<th:block th:if="${users.isEmpty()}">
    <p>No users found</p>
</th:block>
<th:block th:unless="${users.isEmpty()}">
    <table>
        <!-- User list -->
    </table>
</th:block>

<!-- Switch/Case -->
<div th:switch="${user.role}">
    <p th:case="'ADMIN'">Administrator</p>
    <p th:case="'MODERATOR'">Moderator</p>
    <p th:case="'USER'">Regular User</p>
    <p th:case="*">Unknown Role</p>
</div>

<!-- Complex conditions -->
<div th:if="${user != null and user.isActive() and !user.isBlocked()}">
    Active user content
</div>

<!-- Conditional CSS classes -->
<tr th:each="user : ${users}"
    th:class="${user.isActive()} ? 'active' : 'inactive'"
    th:classappend="${user.isPremium()} ? 'premium'">
    <td th:text="${user.name}">Name</td>
</tr>

<!-- Elvis operator for default values -->
<p th:text="${user.nickname} ?: ${user.username} ?: 'Anonymous'">Name</p>
```

### Utility Objects

Thymeleaf provides many utility objects:

```html
<!-- #dates - Date formatting -->
<p th:text="${#dates.format(user.createdAt, 'yyyy-MM-dd HH:mm')}">Date</p>
<p th:text="${#dates.format(user.createdAt, 'dd/MM/yyyy')}">Date</p>
<p th:text="${#dates.day(now)}">Day</p>
<p th:text="${#dates.month(now)}">Month</p>
<p th:text="${#dates.year(now)}">Year</p>

<!-- #calendars - Calendar operations -->
<p th:text="${#calendars.format(cal, 'dd MMMM yyyy')}">Calendar</p>

<!-- #numbers - Number formatting -->
<p th:text="${#numbers.formatDecimal(price, 1, 2)}">12.50</p>
<p th:text="${#numbers.formatCurrency(price)}">$12.50</p>
<p th:text="${#numbers.formatPercent(ratio, 1, 2)}">45.67%</p>

<!-- #strings - String operations -->
<p th:text="${#strings.toUpperCase(name)}">UPPERCASE</p>
<p th:text="${#strings.toLowerCase(name)}">lowercase</p>
<p th:text="${#strings.substring(text, 0, 10)}">Substring</p>
<p th:text="${#strings.replace(text, 'old', 'new')}">Replaced</p>
<p th:if="${#strings.contains(text, 'keyword')}">Contains keyword</p>
<p th:if="${#strings.isEmpty(text)}">Empty</p>
<p th:text="${#strings.length(text)}">Length</p>

<!-- #lists - List operations -->
<p th:text="${#lists.size(products)}">Size</p>
<p th:if="${#lists.isEmpty(products)}">No products</p>
<p th:text="${#lists.sort(names)}">Sorted</p>
<div th:each="item : ${#lists.sort(items, comparator)}">Item</div>

<!-- #sets - Set operations -->
<p th:text="${#sets.size(categories)}">Size</p>
<p th:if="${#sets.contains(roles, 'ADMIN')}">Is Admin</p>

<!-- #maps - Map operations -->
<p th:text="${#maps.size(userMap)}">Size</p>
<p th:if="${#maps.containsKey(userMap, 'admin')}">Has admin</p>

<!-- #arrays - Array operations -->
<p th:text="${#arrays.length(items)}">Length</p>
<p th:if="${#arrays.isEmpty(items)}">Empty</p>

<!-- #bools - Boolean operations -->
<p th:text="${#bools.isTrue(condition)}">Is true</p>
<div th:if="${#bools.arrayIsTrue(conditions)}">All true</div>

<!-- #objects - Object operations -->
<p th:text="${#objects.nullSafe(user, 'Unknown')}">User or Unknown</p>

<!-- #aggregates - Aggregation -->
<p th:text="${#aggregates.sum(products.![price])}">Total</p>
<p th:text="${#aggregates.avg(products.![price])}">Average</p>

<!-- #ids - ID generation -->
<input type="text" th:id="${#ids.seq('input')}"/>
<input type="text" th:id="${#ids.seq('input')}"/>
<!-- Generates: input1, input2, etc. -->
```

### Preprocessing

Execute expressions before normal processing:

```html
<!-- Preprocessing with __ -->
<p th:text="${__${configKey}__}">Value from dynamic key</p>

<!-- Example: Dynamic property access -->
<div th:with="propName='user.name'">
    <p th:text="*{__${propName}__}">Dynamic property</p>
</div>

<!-- Dynamic fragment selection -->
<div th:replace="~{fragments :: __${fragmentName}__}"></div>

<!-- Dynamic message keys -->
<p th:text="#{__${messageKey}__}">Message</p>
```

### Inlining

Embed expressions directly in text:

```html
<!-- JavaScript inlining -->
<script th:inline="javascript">
    var user = /*[[${user}]]*/ {};
    var name = /*[[${user.name}]]*/ 'Default';
    var products = /*[[${products}]]*/ [];

    console.log('User:', user);
    console.log('Products count:', products.length);
</script>

<!-- CSS inlining -->
<style th:inline="css">
    .user-color {
        color: [[${user.favoriteColor}]];
    }

    .banner {
        background-image: url([[@{/images/${banner}}]]);
    }
</style>

<!-- Text inlining -->
<p th:inline="text">
    Hello, [[${user.name}]]! You have [[${messages.size()}]] new messages.
</p>

<!-- Disable inlining -->
<p th:inline="none">
    This [[${expression}]] will not be processed.
</p>
```

---

## Best Practices

### Performance Optimization

```html
<!-- 1. Use fragment caching -->
<div th:fragment="expensive-component" th:cache="true">
    <!-- Cached content -->
</div>

<!-- 2. Minimize database calls in templates -->
<!-- BAD: Multiple DB calls -->
<div th:each="order : ${orders}">
    <p th:text="${orderService.getCustomer(order.customerId).name}">Customer</p>
</div>

<!-- GOOD: Load all data in controller -->
<div th:each="order : ${orders}">
    <p th:text="${order.customer.name}">Customer</p>
</div>

<!-- 3. Use th:remove for design-time elements -->
<tr th:each="product : ${products}">
    <td th:text="${product.name}">Name</td>
</tr>
<tr th:remove="all-but-first">
    <td>Design Sample 1</td>
</tr>
<tr th:remove="all">
    <td>Design Sample 2</td>
</tr>

<!-- 4. Prefer th:field over manual binding -->
<!-- Slower -->
<input type="text" th:id="*{name}" th:name="*{name}" th:value="*{name}"/>

<!-- Faster -->
<input type="text" th:field="*{name}"/>

<!-- 5. Use local variables to avoid repeated expressions -->
<div th:with="fullName=${user.firstName + ' ' + user.lastName}">
    <h1 th:text="${fullName}">Name</h1>
    <p>Welcome, <span th:text="${fullName}">Name</span></p>
</div>
```

### Security Best Practices

```html
<!-- 1. Always escape user content (th:text, not th:utext) -->
<p th:text="${userComment}">Safe - HTML escaped</p>

<!-- 2. Use th:utext only for trusted content -->
<div th:utext="${adminMessage}">Trusted HTML content</div>

<!-- 3. Sanitize rich text content -->
<div th:utext="${@htmlSanitizer.sanitize(userHtml)}">Sanitized HTML</div>

<!-- 4. Use CSRF protection -->
<form th:action="@{/submit}" method="post">
    <input type="hidden" th:name="${_csrf.parameterName}" th:value="${_csrf.token}"/>
</form>

<!-- 5. Validate and sanitize URL parameters -->
<a th:href="@{/redirect(url=${@urlValidator.validate(returnUrl)})}">Back</a>

<!-- 6. Use Spring Security integration -->
<div sec:authorize="hasRole('ADMIN')">
    Sensitive content
</div>

<!-- 7. Avoid inline JavaScript with user data -->
<!-- BAD -->
<script>
    var userName = "[[${user.name}]]"; // XSS risk
</script>

<!-- GOOD -->
<script th:inline="javascript">
    var userName = /*[[${user.name}]]*/ 'default';
</script>

<!-- Or use data attributes -->
<div id="user-data" th:data-name="${user.name}"></div>
<script>
    var userName = document.getElementById('user-data').dataset.name;
</script>
```

### Template Organization

```plaintext
templates/
├── layout/
│   ├── master.html          # Main layout
│   ├── admin.html           # Admin layout
│   └── public.html          # Public layout
├── fragments/
│   ├── header.html          # Common header
│   ├── footer.html          # Common footer
│   ├── navigation.html      # Navigation menus
│   ├── forms.html           # Form components
│   └── components.html      # Reusable components
├── users/
│   ├── list.html            # User listing
│   ├── show.html            # User details
│   └── form.html            # User form (create/edit)
├── products/
│   ├── list.html
│   ├── show.html
│   └── form.html
├── error/
│   ├── 404.html
│   ├── 500.html
│   └── error.html
└── email/
    ├── registration.html
    └── password-reset.html
```

### Testing Templates

```java
// Integration test with Spring Boot
@SpringBootTest
@AutoConfigureMockMvc
class ProductControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    void shouldDisplayProductList() throws Exception {
        mockMvc.perform(get("/products"))
            .andExpect(status().isOk())
            .andExpect(view().name("products/list"))
            .andExpect(model().attributeExists("products"))
            .andExpect(content().string(containsString("Product List")));
    }

    @Test
    void shouldShowValidationErrors() throws Exception {
        mockMvc.perform(post("/products")
                .param("name", "")
                .param("price", "-1"))
            .andExpect(status().isOk())
            .andExpect(view().name("products/form"))
            .andExpect(model().attributeHasFieldErrors("product", "name", "price"))
            .andExpect(content().string(containsString("error")));
    }
}

// Unit test for template rendering
@SpringBootTest
class TemplateRenderingTest {

    @Autowired
    private TemplateEngine templateEngine;

    @Test
    void shouldRenderTemplate() {
        Context context = new Context();
        context.setVariable("user", new User("John", "john@example.com"));

        String html = templateEngine.process("users/show", context);

        assertThat(html).contains("John");
        assertThat(html).contains("john@example.com");
    }
}
```

---

## Common Patterns

### Master-Detail Views

**List View (products/list.html):**
```html
<div layout:fragment="content">
    <h1>Products</h1>

    <!-- Search and filters -->
    <form th:action="@{/products}" method="get" class="filter-form">
        <input type="text" name="search" th:value="${search}" placeholder="Search..."/>
        <select name="category">
            <option value="">All Categories</option>
            <option th:each="cat : ${categories}"
                    th:value="${cat.id}"
                    th:text="${cat.name}"
                    th:selected="${cat.id == selectedCategory}">Category</option>
        </select>
        <button type="submit">Search</button>
    </form>

    <!-- Results table -->
    <table class="table">
        <thead>
            <tr>
                <th><a th:href="@{/products(sort='name',dir=${sortDir == 'asc' ? 'desc' : 'asc'})}">Name</a></th>
                <th><a th:href="@{/products(sort='price',dir=${sortDir == 'asc' ? 'desc' : 'asc'})}">Price</a></th>
                <th>Category</th>
                <th>Actions</th>
            </tr>
        </thead>
        <tbody>
            <tr th:if="${products.isEmpty()}">
                <td colspan="4">No products found</td>
            </tr>
            <tr th:each="product : ${products}">
                <td th:text="${product.name}">Name</td>
                <td th:text="${#numbers.formatCurrency(product.price)}">Price</td>
                <td th:text="${product.category.name}">Category</td>
                <td>
                    <a th:href="@{/products/{id}(id=${product.id})}" class="btn btn-sm">View</a>
                    <a th:href="@{/products/{id}/edit(id=${product.id})}" class="btn btn-sm">Edit</a>
                </td>
            </tr>
        </tbody>
    </table>

    <!-- Pagination -->
    <nav th:replace="~{fragments/components :: pagination(${page}, ${totalPages}, '/products')}"></nav>
</div>
```

**Detail View (products/show.html):**
```html
<div layout:fragment="content">
    <div class="product-detail">
        <div class="product-header">
            <h1 th:text="${product.name}">Product Name</h1>
            <div class="actions">
                <a th:href="@{/products/{id}/edit(id=${product.id})}" class="btn">Edit</a>
                <form th:action="@{/products/{id}/delete(id=${product.id})}" method="post" style="display:inline">
                    <button type="submit" class="btn btn-danger"
                            onclick="return confirm('Are you sure?')">Delete</button>
                </form>
            </div>
        </div>

        <div class="product-info">
            <div class="info-row">
                <label>Price:</label>
                <span th:text="${#numbers.formatCurrency(product.price)}">$99.99</span>
            </div>
            <div class="info-row">
                <label>Category:</label>
                <span th:text="${product.category.name}">Category</span>
            </div>
            <div class="info-row">
                <label>Status:</label>
                <span th:text="${product.active ? 'Active' : 'Inactive'}"
                      th:class="${product.active ? 'badge-success' : 'badge-secondary'}">Active</span>
            </div>
            <div class="info-row">
                <label>Created:</label>
                <span th:text="${#dates.format(product.createdAt, 'dd/MM/yyyy HH:mm')}">Date</span>
            </div>
        </div>

        <div class="product-description">
            <h3>Description</h3>
            <p th:text="${product.description}">Description</p>
        </div>

        <!-- Related products -->
        <div class="related-products" th:if="${!relatedProducts.isEmpty()}">
            <h3>Related Products</h3>
            <div class="product-grid">
                <div th:each="related : ${relatedProducts}" class="product-card">
                    <h4 th:text="${related.name}">Name</h4>
                    <p th:text="${#numbers.formatCurrency(related.price)}">Price</p>
                    <a th:href="@{/products/{id}(id=${related.id})}">View</a>
                </div>
            </div>
        </div>
    </div>
</div>
```

### CRUD Forms

**Unified Create/Edit Form:**
```html
<div layout:fragment="content">
    <h1 th:text="${product.id != null ? 'Edit Product' : 'New Product'}">Product Form</h1>

    <form th:action="${product.id != null ? @{/products/{id}(id=${product.id})} : @{/products}}"
          th:object="${product}"
          method="post"
          enctype="multipart/form-data">

        <input type="hidden" th:field="*{id}"/>

        <!-- Name -->
        <div class="form-group">
            <label for="name">Product Name *</label>
            <input type="text" id="name" th:field="*{name}"
                   class="form-control"
                   th:classappend="${#fields.hasErrors('name')} ? 'is-invalid'"/>
            <div class="invalid-feedback" th:if="${#fields.hasErrors('name')}">
                <span th:errors="*{name}">Name error</span>
            </div>
        </div>

        <!-- Description -->
        <div class="form-group">
            <label for="description">Description</label>
            <textarea id="description" th:field="*{description}"
                      class="form-control" rows="4"
                      th:classappend="${#fields.hasErrors('description')} ? 'is-invalid'"></textarea>
            <div class="invalid-feedback" th:if="${#fields.hasErrors('description')}">
                <span th:errors="*{description}">Description error</span>
            </div>
        </div>

        <!-- Price -->
        <div class="form-group">
            <label for="price">Price *</label>
            <input type="number" step="0.01" id="price" th:field="*{price}"
                   class="form-control"
                   th:classappend="${#fields.hasErrors('price')} ? 'is-invalid'"/>
            <div class="invalid-feedback" th:if="${#fields.hasErrors('price')}">
                <span th:errors="*{price}">Price error</span>
            </div>
        </div>

        <!-- Category -->
        <div class="form-group">
            <label for="category">Category *</label>
            <select id="category" th:field="*{category.id}"
                    class="form-control"
                    th:classappend="${#fields.hasErrors('category')} ? 'is-invalid'">
                <option value="">Select Category</option>
                <option th:each="cat : ${categories}"
                        th:value="${cat.id}"
                        th:text="${cat.name}">Category</option>
            </select>
            <div class="invalid-feedback" th:if="${#fields.hasErrors('category')}">
                <span th:errors="*{category}">Category error</span>
            </div>
        </div>

        <!-- Tags (multiple select) -->
        <div class="form-group">
            <label for="tags">Tags</label>
            <select id="tags" th:field="*{tags}" class="form-control" multiple>
                <option th:each="tag : ${availableTags}"
                        th:value="${tag.id}"
                        th:text="${tag.name}">Tag</option>
            </select>
        </div>

        <!-- Image upload -->
        <div class="form-group">
            <label for="image">Product Image</label>
            <input type="file" id="image" name="imageFile"
                   class="form-control-file" accept="image/*"/>
            <div th:if="${product.imagePath != null}">
                <img th:src="@{/images/products/{path}(path=${product.imagePath})}"
                     alt="Current image" style="max-width: 200px; margin-top: 10px;"/>
            </div>
        </div>

        <!-- Active checkbox -->
        <div class="form-check">
            <input type="checkbox" id="active" th:field="*{active}" class="form-check-input"/>
            <label for="active" class="form-check-label">Active</label>
        </div>

        <!-- Submit buttons -->
        <div class="form-actions">
            <button type="submit" class="btn btn-primary"
                    th:text="${product.id != null ? 'Update' : 'Create'}">Save</button>
            <a th:href="@{/products}" class="btn btn-secondary">Cancel</a>
        </div>
    </form>
</div>
```

### Data Tables with Actions

```html
<table class="table table-striped">
    <thead>
        <tr>
            <th>
                <input type="checkbox" id="select-all"/>
            </th>
            <th>Name</th>
            <th>Email</th>
            <th>Status</th>
            <th>Actions</th>
        </tr>
    </thead>
    <tbody>
        <tr th:each="user : ${users}">
            <td>
                <input type="checkbox" th:value="${user.id}" class="row-checkbox"/>
            </td>
            <td th:text="${user.name}">Name</td>
            <td th:text="${user.email}">Email</td>
            <td>
                <span th:text="${user.active ? 'Active' : 'Inactive'}"
                      th:class="${user.active ? 'badge badge-success' : 'badge badge-secondary'}">
                    Status
                </span>
            </td>
            <td>
                <div class="btn-group">
                    <a th:href="@{/users/{id}(id=${user.id})}"
                       class="btn btn-sm btn-info">View</a>
                    <a th:href="@{/users/{id}/edit(id=${user.id})}"
                       class="btn btn-sm btn-primary">Edit</a>
                    <button type="button" class="btn btn-sm btn-danger"
                            th:onclick="|deleteUser(${user.id})|">Delete</button>
                </div>
            </td>
        </tr>
    </tbody>
</table>

<!-- Bulk actions -->
<div class="bulk-actions">
    <select id="bulk-action">
        <option value="">Bulk Actions</option>
        <option value="activate">Activate</option>
        <option value="deactivate">Deactivate</option>
        <option value="delete">Delete</option>
    </select>
    <button type="button" onclick="executeBulkAction()">Apply</button>
</div>

<script th:inline="javascript">
    function deleteUser(userId) {
        if (confirm('Are you sure you want to delete this user?')) {
            fetch('/users/' + userId + '/delete', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    [[${_csrf.headerName}]]: [[${_csrf.token}]]
                }
            }).then(response => {
                if (response.ok) {
                    location.reload();
                }
            });
        }
    }

    document.getElementById('select-all').addEventListener('change', function() {
        document.querySelectorAll('.row-checkbox').forEach(cb => {
            cb.checked = this.checked;
        });
    });
</script>
```

---

## Practical Examples

### Example 1: User Dashboard with Statistics

**Controller:**
```java
@Controller
@RequestMapping("/dashboard")
public class DashboardController {

    @GetMapping
    public String dashboard(Model model, @AuthenticationPrincipal User currentUser) {
        DashboardStats stats = dashboardService.getStats(currentUser);
        List<Activity> recentActivities = activityService.findRecent(currentUser, 10);
        List<Notification> notifications = notificationService.findUnread(currentUser);

        model.addAttribute("stats", stats);
        model.addAttribute("activities", recentActivities);
        model.addAttribute("notifications", notifications);
        model.addAttribute("currentUser", currentUser);

        return "dashboard/index";
    }
}
```

**Template (dashboard/index.html):**
```html
<!DOCTYPE html>
<html xmlns:th="http://www.thymeleaf.org"
      xmlns:layout="http://www.ultraq.net.nz/thymeleaf/layout"
      layout:decorate="~{layout/master}">
<head>
    <title>Dashboard</title>
</head>
<body>
    <div layout:fragment="content">
        <div class="dashboard">
            <h1>Welcome, <span th:text="${currentUser.firstName}">User</span>!</h1>

            <!-- Stats cards -->
            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-icon"><i class="fa fa-users"></i></div>
                    <div class="stat-content">
                        <h3 th:text="${stats.totalUsers}">0</h3>
                        <p>Total Users</p>
                    </div>
                </div>

                <div class="stat-card">
                    <div class="stat-icon"><i class="fa fa-shopping-cart"></i></div>
                    <div class="stat-content">
                        <h3 th:text="${stats.totalOrders}">0</h3>
                        <p>Orders</p>
                    </div>
                </div>

                <div class="stat-card">
                    <div class="stat-icon"><i class="fa fa-dollar-sign"></i></div>
                    <div class="stat-content">
                        <h3 th:text="${#numbers.formatCurrency(stats.totalRevenue)}">$0</h3>
                        <p>Revenue</p>
                    </div>
                </div>

                <div class="stat-card">
                    <div class="stat-icon"><i class="fa fa-chart-line"></i></div>
                    <div class="stat-content">
                        <h3 th:text="${stats.growthPercentage + '%'}">0%</h3>
                        <p>Growth</p>
                    </div>
                </div>
            </div>

            <!-- Recent activities -->
            <div class="activities-section">
                <h2>Recent Activities</h2>
                <div class="activity-list">
                    <div th:if="${activities.isEmpty()}" class="empty-state">
                        No recent activities
                    </div>
                    <div th:each="activity : ${activities}" class="activity-item">
                        <div class="activity-icon" th:classappend="${activity.type}">
                            <i th:class="${activity.icon}"></i>
                        </div>
                        <div class="activity-content">
                            <p th:text="${activity.description}">Activity description</p>
                            <small th:text="${#dates.format(activity.timestamp, 'dd/MM/yyyy HH:mm')}">
                                Time
                            </small>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Notifications -->
            <div class="notifications-section" th:if="${!notifications.isEmpty()}">
                <h2>Notifications
                    <span class="badge" th:text="${notifications.size()}">0</span>
                </h2>
                <div th:each="notification : ${notifications}" class="notification-item"
                     th:classappend="${notification.priority}">
                    <div class="notification-content">
                        <h4 th:text="${notification.title}">Title</h4>
                        <p th:text="${notification.message}">Message</p>
                        <small th:text="${#dates.format(notification.createdAt, 'dd/MM/yyyy HH:mm')}">
                            Time
                        </small>
                    </div>
                    <form th:action="@{/notifications/{id}/read(id=${notification.id})}"
                          method="post" style="display:inline">
                        <button type="submit" class="btn-icon">
                            <i class="fa fa-check"></i>
                        </button>
                    </form>
                </div>
            </div>
        </div>
    </div>
</body>
</html>
```

### Example 2: E-commerce Shopping Cart

**Controller:**
```java
@Controller
@RequestMapping("/cart")
public class CartController {

    @GetMapping
    public String viewCart(Model model, HttpSession session) {
        Cart cart = (Cart) session.getAttribute("cart");
        if (cart == null) {
            cart = new Cart();
        }

        model.addAttribute("cart", cart);
        model.addAttribute("subtotal", cart.getSubtotal());
        model.addAttribute("tax", cart.getTax());
        model.addAttribute("total", cart.getTotal());

        return "cart/view";
    }

    @PostMapping("/add/{productId}")
    public String addToCart(@PathVariable Long productId,
                           @RequestParam(defaultValue = "1") int quantity,
                           HttpSession session,
                           RedirectAttributes redirectAttributes) {
        Cart cart = getOrCreateCart(session);
        Product product = productService.findById(productId)
            .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

        cart.addItem(product, quantity);
        session.setAttribute("cart", cart);

        redirectAttributes.addFlashAttribute("message", "Product added to cart");
        return "redirect:/products";
    }
}
```

**Template (cart/view.html):**
```html
<!DOCTYPE html>
<html xmlns:th="http://www.thymeleaf.org"
      xmlns:layout="http://www.ultraq.net.nz/thymeleaf/layout"
      layout:decorate="~{layout/master}">
<head>
    <title>Shopping Cart</title>
</head>
<body>
    <div layout:fragment="content">
        <div class="shopping-cart">
            <h1>Shopping Cart</h1>

            <div th:if="${cart.items.isEmpty()}" class="empty-cart">
                <i class="fa fa-shopping-cart fa-3x"></i>
                <p>Your cart is empty</p>
                <a th:href="@{/products}" class="btn btn-primary">Continue Shopping</a>
            </div>

            <div th:unless="${cart.items.isEmpty()}">
                <table class="cart-table">
                    <thead>
                        <tr>
                            <th>Product</th>
                            <th>Price</th>
                            <th>Quantity</th>
                            <th>Subtotal</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr th:each="item : ${cart.items}">
                            <td class="product-info">
                                <img th:src="@{/images/products/{img}(img=${item.product.image})}"
                                     th:alt="${item.product.name}" class="product-thumb"/>
                                <div>
                                    <h4 th:text="${item.product.name}">Product Name</h4>
                                    <p class="text-muted" th:text="${item.product.sku}">SKU</p>
                                </div>
                            </td>
                            <td th:text="${#numbers.formatCurrency(item.product.price)}">Price</td>
                            <td>
                                <div class="quantity-control">
                                    <form th:action="@{/cart/update/{id}(id=${item.id})}"
                                          method="post" style="display:inline">
                                        <input type="number" name="quantity"
                                               th:value="${item.quantity}"
                                               min="1" max="99" class="qty-input"/>
                                        <button type="submit" class="btn-sm">Update</button>
                                    </form>
                                </div>
                            </td>
                            <td th:text="${#numbers.formatCurrency(item.subtotal)}">Subtotal</td>
                            <td>
                                <form th:action="@{/cart/remove/{id}(id=${item.id})}"
                                      method="post" style="display:inline">
                                    <button type="submit" class="btn btn-danger btn-sm">
                                        <i class="fa fa-trash"></i>
                                    </button>
                                </form>
                            </td>
                        </tr>
                    </tbody>
                </table>

                <!-- Cart summary -->
                <div class="cart-summary">
                    <div class="summary-row">
                        <span>Subtotal:</span>
                        <span th:text="${#numbers.formatCurrency(subtotal)}">$0.00</span>
                    </div>
                    <div class="summary-row">
                        <span>Tax (10%):</span>
                        <span th:text="${#numbers.formatCurrency(tax)}">$0.00</span>
                    </div>
                    <div class="summary-row total">
                        <span>Total:</span>
                        <span th:text="${#numbers.formatCurrency(total)}">$0.00</span>
                    </div>

                    <div class="cart-actions">
                        <a th:href="@{/products}" class="btn btn-secondary">Continue Shopping</a>
                        <a th:href="@{/checkout}" class="btn btn-primary">Proceed to Checkout</a>
                    </div>
                </div>
            </div>
        </div>
    </div>
</body>
</html>
```

### Example 3: Multi-step Wizard Form

**Controller:**
```java
@Controller
@RequestMapping("/wizard")
@SessionAttributes("wizardData")
public class WizardController {

    @ModelAttribute("wizardData")
    public WizardData createWizardData() {
        return new WizardData();
    }

    @GetMapping("/step1")
    public String step1(Model model) {
        return "wizard/step1";
    }

    @PostMapping("/step1")
    public String submitStep1(@Valid @ModelAttribute WizardData wizardData,
                             BindingResult result) {
        if (result.hasFieldErrors("personalInfo")) {
            return "wizard/step1";
        }
        return "redirect:/wizard/step2";
    }

    @GetMapping("/step2")
    public String step2(Model model) {
        model.addAttribute("countries", countryService.findAll());
        return "wizard/step2";
    }

    @PostMapping("/step2")
    public String submitStep2(@Valid @ModelAttribute WizardData wizardData,
                             BindingResult result) {
        if (result.hasFieldErrors("address")) {
            return "wizard/step2";
        }
        return "redirect:/wizard/step3";
    }

    @GetMapping("/step3")
    public String step3(Model model) {
        return "wizard/step3";
    }

    @PostMapping("/complete")
    public String complete(@ModelAttribute WizardData wizardData,
                          SessionStatus status,
                          RedirectAttributes redirectAttributes) {
        wizardService.save(wizardData);
        status.setComplete(); // Clear session attribute
        redirectAttributes.addFlashAttribute("message", "Registration completed");
        return "redirect:/success";
    }
}
```

**Template (wizard/step1.html):**
```html
<!DOCTYPE html>
<html xmlns:th="http://www.thymeleaf.org"
      xmlns:layout="http://www.ultraq.net.nz/thymeleaf/layout"
      layout:decorate="~{layout/master}">
<head>
    <title>Registration - Step 1</title>
</head>
<body>
    <div layout:fragment="content">
        <!-- Progress indicator -->
        <div class="wizard-progress">
            <div class="step active">
                <div class="step-number">1</div>
                <div class="step-label">Personal Info</div>
            </div>
            <div class="step">
                <div class="step-number">2</div>
                <div class="step-label">Address</div>
            </div>
            <div class="step">
                <div class="step-number">3</div>
                <div class="step-label">Review</div>
            </div>
        </div>

        <!-- Step 1 form -->
        <form th:action="@{/wizard/step1}" th:object="${wizardData}" method="post">
            <h2>Personal Information</h2>

            <div class="form-row">
                <div class="form-group col-md-6">
                    <label for="firstName">First Name *</label>
                    <input type="text" id="firstName" th:field="*{personalInfo.firstName}"
                           class="form-control"
                           th:classappend="${#fields.hasErrors('personalInfo.firstName')} ? 'is-invalid'"/>
                    <div class="invalid-feedback"
                         th:if="${#fields.hasErrors('personalInfo.firstName')}">
                        <span th:errors="*{personalInfo.firstName}">Error</span>
                    </div>
                </div>

                <div class="form-group col-md-6">
                    <label for="lastName">Last Name *</label>
                    <input type="text" id="lastName" th:field="*{personalInfo.lastName}"
                           class="form-control"
                           th:classappend="${#fields.hasErrors('personalInfo.lastName')} ? 'is-invalid'"/>
                    <div class="invalid-feedback"
                         th:if="${#fields.hasErrors('personalInfo.lastName')}">
                        <span th:errors="*{personalInfo.lastName}">Error</span>
                    </div>
                </div>
            </div>

            <div class="form-group">
                <label for="email">Email *</label>
                <input type="email" id="email" th:field="*{personalInfo.email}"
                       class="form-control"
                       th:classappend="${#fields.hasErrors('personalInfo.email')} ? 'is-invalid'"/>
                <div class="invalid-feedback"
                     th:if="${#fields.hasErrors('personalInfo.email')}">
                    <span th:errors="*{personalInfo.email}">Error</span>
                </div>
            </div>

            <div class="form-group">
                <label for="phone">Phone *</label>
                <input type="tel" id="phone" th:field="*{personalInfo.phone}"
                       class="form-control"
                       th:classappend="${#fields.hasErrors('personalInfo.phone')} ? 'is-invalid'"/>
                <div class="invalid-feedback"
                     th:if="${#fields.hasErrors('personalInfo.phone')}">
                    <span th:errors="*{personalInfo.phone}">Error</span>
                </div>
            </div>

            <div class="wizard-actions">
                <button type="submit" class="btn btn-primary">Next Step</button>
            </div>
        </form>
    </div>
</body>
</html>
```

---

## Summary

This skill provides comprehensive Thymeleaf expertise for:
- Template syntax and expressions
- Form handling and validation
- Fragment composition and layouts
- Spring integration patterns
- Security best practices
- Performance optimization
- Real-world implementation examples

Use this skill when working with Thymeleaf templates in Spring applications to ensure proper syntax, efficient rendering, and maintainable template organization.
