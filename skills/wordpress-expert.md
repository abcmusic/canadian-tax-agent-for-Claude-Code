---
name: wordpress-expert
description: WordPress development and optimization expertise. Provides WordPress architecture, theme development, plugin development, performance optimization, security best practices, and WP-CLI usage. Use when working with WordPress projects.
version: 1.0.0
tags:
  - wordpress
  - cms
  - php
  - theme-development
  - plugins
category: domain-expert
---

# WordPress Expert Skill

Comprehensive WordPress development and optimization expertise covering architecture, theme/plugin development, performance, security, and best practices.

## WordPress Architecture

### Core Files Structure

```
wordpress/
├── wp-admin/           # Admin interface
├── wp-content/         # User content
│   ├── themes/        # Themes
│   ├── plugins/       # Plugins
│   ├── uploads/       # Media files
│   └── mu-plugins/    # Must-use plugins
├── wp-includes/       # Core libraries
├── wp-config.php      # Configuration
└── index.php          # Entry point
```

### Database Schema

WordPress uses 12 default tables (prefix: `wp_`):

**Core Tables:**
- `wp_posts` - Posts, pages, custom post types
- `wp_postmeta` - Post metadata (custom fields)
- `wp_comments` - Comments and trackbacks
- `wp_commentmeta` - Comment metadata
- `wp_users` - User accounts
- `wp_usermeta` - User metadata
- `wp_terms` - Categories, tags, taxonomies
- `wp_term_taxonomy` - Term-taxonomy relationships
- `wp_term_relationships` - Object-term relationships
- `wp_termmeta` - Term metadata
- `wp_options` - Site settings
- `wp_links` - Blogroll (deprecated but present)

### Hooks System

WordPress hooks are the foundation of extensibility:

**Actions** - Do something at a specific point:
```php
// Register an action
add_action('init', 'my_custom_function');

function my_custom_function() {
    // Your code here
}

// Common action hooks
add_action('wp_head', 'add_custom_meta_tags');
add_action('save_post', 'process_custom_data');
add_action('admin_menu', 'register_custom_menu');
```

**Filters** - Modify data:
```php
// Register a filter
add_filter('the_content', 'modify_content');

function modify_content($content) {
    return $content . '<p>Additional text</p>';
}

// Common filter hooks
add_filter('the_title', 'modify_title');
add_filter('wp_mail_from', 'custom_email_from');
add_filter('body_class', 'add_custom_body_class');
```

### Template Hierarchy

WordPress follows a specific template hierarchy:

```
1. Custom Templates (selected in admin)
2. Specific Templates:
   - single-{post-type}-{slug}.php
   - single-{post-type}.php
   - page-{slug}.php
   - category-{slug}.php
   - tag-{slug}.php
   - archive-{post-type}.php
3. Generic Templates:
   - single.php
   - page.php
   - category.php
   - tag.php
   - archive.php
4. Fallbacks:
   - singular.php
   - index.php (always required)
```

## Theme Development

### Essential Theme Files

**style.css** (required):
```css
/*
Theme Name: My Custom Theme
Theme URI: https://example.com/theme
Author: Your Name
Author URI: https://example.com
Description: A custom WordPress theme
Version: 1.0.0
License: GNU General Public License v2 or later
License URI: http://www.gnu.org/licenses/gpl-2.0.html
Text Domain: my-custom-theme
*/
```

**functions.php** (required):
```php
<?php
/**
 * Theme Functions
 */

// Theme setup
function mytheme_setup() {
    // Add theme support
    add_theme_support('title-tag');
    add_theme_support('post-thumbnails');
    add_theme_support('custom-logo');
    add_theme_support('html5', array(
        'search-form',
        'comment-form',
        'comment-list',
        'gallery',
        'caption',
    ));

    // Register navigation menus
    register_nav_menus(array(
        'primary' => __('Primary Menu', 'my-custom-theme'),
        'footer' => __('Footer Menu', 'my-custom-theme'),
    ));

    // Set content width
    $GLOBALS['content_width'] = 1200;
}
add_action('after_setup_theme', 'mytheme_setup');

// Enqueue scripts and styles
function mytheme_scripts() {
    // Styles
    wp_enqueue_style(
        'mytheme-style',
        get_stylesheet_uri(),
        array(),
        wp_get_theme()->get('Version')
    );

    // Scripts
    wp_enqueue_script(
        'mytheme-script',
        get_template_directory_uri() . '/js/main.js',
        array('jquery'),
        wp_get_theme()->get('Version'),
        true
    );

    // Localize script for AJAX
    wp_localize_script('mytheme-script', 'mythemeAjax', array(
        'ajaxurl' => admin_url('admin-ajax.php'),
        'nonce' => wp_create_nonce('mytheme-nonce')
    ));
}
add_action('wp_enqueue_scripts', 'mytheme_scripts');

// Register widget areas
function mytheme_widgets_init() {
    register_sidebar(array(
        'name' => __('Sidebar', 'my-custom-theme'),
        'id' => 'sidebar-1',
        'description' => __('Add widgets here.', 'my-custom-theme'),
        'before_widget' => '<section id="%1$s" class="widget %2$s">',
        'after_widget' => '</section>',
        'before_title' => '<h2 class="widget-title">',
        'after_title' => '</h2>',
    ));
}
add_action('widgets_init', 'mytheme_widgets_init');
```

**index.php** (required):
```php
<?php get_header(); ?>

<main id="main" class="site-main">
    <?php
    if (have_posts()) :
        while (have_posts()) :
            the_post();
            get_template_part('template-parts/content', get_post_type());
        endwhile;

        the_posts_pagination();
    else :
        get_template_part('template-parts/content', 'none');
    endif;
    ?>
</main>

<?php
get_sidebar();
get_footer();
```

**header.php**:
```php
<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
    <meta charset="<?php bloginfo('charset'); ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <?php wp_head(); ?>
</head>

<body <?php body_class(); ?>>
<?php wp_body_open(); ?>

<div id="page" class="site">
    <header id="masthead" class="site-header">
        <div class="site-branding">
            <?php
            if (has_custom_logo()) :
                the_custom_logo();
            else :
                ?>
                <h1 class="site-title">
                    <a href="<?php echo esc_url(home_url('/')); ?>">
                        <?php bloginfo('name'); ?>
                    </a>
                </h1>
                <p class="site-description"><?php bloginfo('description'); ?></p>
            <?php endif; ?>
        </div>

        <nav id="site-navigation" class="main-navigation">
            <?php
            wp_nav_menu(array(
                'theme_location' => 'primary',
                'menu_id' => 'primary-menu',
                'container_class' => 'menu-container',
            ));
            ?>
        </nav>
    </header>

    <div id="content" class="site-content">
```

**footer.php**:
```php
    </div><!-- #content -->

    <footer id="colophon" class="site-footer">
        <div class="footer-widgets">
            <?php if (is_active_sidebar('footer-1')) : ?>
                <div class="footer-widget-area">
                    <?php dynamic_sidebar('footer-1'); ?>
                </div>
            <?php endif; ?>
        </div>

        <div class="site-info">
            <p>&copy; <?php echo date('Y'); ?> <?php bloginfo('name'); ?></p>
        </div>
    </footer>
</div><!-- #page -->

<?php wp_footer(); ?>
</body>
</html>
```

### Child Theme Development

**Child Theme Structure:**
```
my-child-theme/
├── style.css
├── functions.php
├── screenshot.png
└── template-parts/ (override parent templates)
```

**style.css**:
```css
/*
Theme Name: My Child Theme
Template: parent-theme-folder-name
Description: Child theme for customization
Version: 1.0.0
*/

/* Your custom styles here */
```

**functions.php**:
```php
<?php
/**
 * Child Theme Functions
 */

// Enqueue parent and child theme styles
function mytheme_child_enqueue_styles() {
    // Parent theme stylesheet
    wp_enqueue_style(
        'parent-style',
        get_template_directory_uri() . '/style.css'
    );

    // Child theme stylesheet
    wp_enqueue_style(
        'child-style',
        get_stylesheet_uri(),
        array('parent-style'),
        wp_get_theme()->get('Version')
    );
}
add_action('wp_enqueue_scripts', 'mytheme_child_enqueue_styles');

// Override parent theme functions
function mytheme_child_custom_function() {
    // Your custom code
}
```

### Block Theme Development (Gutenberg)

**theme.json** (configuration):
```json
{
    "$schema": "https://schemas.wp.org/trunk/theme.json",
    "version": 2,
    "settings": {
        "color": {
            "palette": [
                {
                    "name": "Primary",
                    "slug": "primary",
                    "color": "#007cba"
                },
                {
                    "name": "Secondary",
                    "slug": "secondary",
                    "color": "#23282d"
                }
            ]
        },
        "typography": {
            "fontSizes": [
                {
                    "name": "Small",
                    "slug": "small",
                    "size": "14px"
                },
                {
                    "name": "Medium",
                    "slug": "medium",
                    "size": "18px"
                },
                {
                    "name": "Large",
                    "slug": "large",
                    "size": "24px"
                }
            ]
        },
        "layout": {
            "contentSize": "840px",
            "wideSize": "1200px"
        }
    },
    "styles": {
        "color": {
            "background": "#ffffff",
            "text": "#000000"
        },
        "typography": {
            "fontSize": "var(--wp--preset--font-size--medium)",
            "lineHeight": "1.6"
        }
    }
}
```

## Plugin Development

### Plugin Structure

**Basic Plugin Template:**
```php
<?php
/**
 * Plugin Name: My Custom Plugin
 * Plugin URI: https://example.com/plugin
 * Description: A custom WordPress plugin
 * Version: 1.0.0
 * Author: Your Name
 * Author URI: https://example.com
 * License: GPL v2 or later
 * License URI: https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain: my-custom-plugin
 * Domain Path: /languages
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}

// Define plugin constants
define('MCP_VERSION', '1.0.0');
define('MCP_PLUGIN_DIR', plugin_dir_path(__FILE__));
define('MCP_PLUGIN_URL', plugin_dir_url(__FILE__));

// Include required files
require_once MCP_PLUGIN_DIR . 'includes/class-main.php';
require_once MCP_PLUGIN_DIR . 'includes/class-admin.php';
require_once MCP_PLUGIN_DIR . 'includes/class-frontend.php';

// Initialize plugin
function mcp_init() {
    $plugin = new MCP_Main();
    $plugin->run();
}
add_action('plugins_loaded', 'mcp_init');

// Activation hook
register_activation_hook(__FILE__, 'mcp_activate');
function mcp_activate() {
    // Create custom tables
    global $wpdb;
    $table_name = $wpdb->prefix . 'custom_data';

    $charset_collate = $wpdb->get_charset_collate();

    $sql = "CREATE TABLE $table_name (
        id mediumint(9) NOT NULL AUTO_INCREMENT,
        time datetime DEFAULT '0000-00-00 00:00:00' NOT NULL,
        name tinytext NOT NULL,
        text text NOT NULL,
        PRIMARY KEY  (id)
    ) $charset_collate;";

    require_once(ABSPATH . 'wp-admin/includes/upgrade.php');
    dbDelta($sql);

    // Set default options
    add_option('mcp_version', MCP_VERSION);

    // Flush rewrite rules
    flush_rewrite_rules();
}

// Deactivation hook
register_deactivation_hook(__FILE__, 'mcp_deactivate');
function mcp_deactivate() {
    // Flush rewrite rules
    flush_rewrite_rules();
}

// Uninstall hook (in separate uninstall.php file)
```

### Custom Post Types

```php
<?php
/**
 * Register Custom Post Type
 */
function mcp_register_custom_post_type() {
    $labels = array(
        'name' => _x('Projects', 'Post Type General Name', 'my-custom-plugin'),
        'singular_name' => _x('Project', 'Post Type Singular Name', 'my-custom-plugin'),
        'menu_name' => __('Projects', 'my-custom-plugin'),
        'add_new_item' => __('Add New Project', 'my-custom-plugin'),
        'edit_item' => __('Edit Project', 'my-custom-plugin'),
        'view_item' => __('View Project', 'my-custom-plugin'),
        'all_items' => __('All Projects', 'my-custom-plugin'),
    );

    $args = array(
        'label' => __('Project', 'my-custom-plugin'),
        'labels' => $labels,
        'supports' => array('title', 'editor', 'thumbnail', 'excerpt', 'custom-fields'),
        'public' => true,
        'show_ui' => true,
        'show_in_menu' => true,
        'menu_position' => 5,
        'menu_icon' => 'dashicons-portfolio',
        'show_in_admin_bar' => true,
        'show_in_nav_menus' => true,
        'can_export' => true,
        'has_archive' => true,
        'exclude_from_search' => false,
        'publicly_queryable' => true,
        'capability_type' => 'post',
        'show_in_rest' => true, // Enable Gutenberg editor
        'rewrite' => array('slug' => 'projects'),
    );

    register_post_type('project', $args);
}
add_action('init', 'mcp_register_custom_post_type', 0);
```

### Custom Taxonomies

```php
<?php
/**
 * Register Custom Taxonomy
 */
function mcp_register_custom_taxonomy() {
    $labels = array(
        'name' => _x('Project Categories', 'Taxonomy General Name', 'my-custom-plugin'),
        'singular_name' => _x('Project Category', 'Taxonomy Singular Name', 'my-custom-plugin'),
        'menu_name' => __('Categories', 'my-custom-plugin'),
        'all_items' => __('All Categories', 'my-custom-plugin'),
        'edit_item' => __('Edit Category', 'my-custom-plugin'),
        'add_new_item' => __('Add New Category', 'my-custom-plugin'),
    );

    $args = array(
        'labels' => $labels,
        'hierarchical' => true, // Like categories (false for tags)
        'public' => true,
        'show_ui' => true,
        'show_admin_column' => true,
        'show_in_nav_menus' => true,
        'show_tagcloud' => true,
        'show_in_rest' => true,
        'rewrite' => array('slug' => 'project-category'),
    );

    register_taxonomy('project_category', array('project'), $args);
}
add_action('init', 'mcp_register_custom_taxonomy', 0);
```

### Meta Boxes and Custom Fields

```php
<?php
/**
 * Add Custom Meta Box
 */
function mcp_add_meta_box() {
    add_meta_box(
        'mcp_project_details',
        __('Project Details', 'my-custom-plugin'),
        'mcp_meta_box_callback',
        'project',
        'normal',
        'high'
    );
}
add_action('add_meta_boxes', 'mcp_add_meta_box');

/**
 * Meta Box Callback
 */
function mcp_meta_box_callback($post) {
    // Add nonce for security
    wp_nonce_field('mcp_save_meta_box', 'mcp_meta_box_nonce');

    // Get existing values
    $project_url = get_post_meta($post->ID, '_project_url', true);
    $project_client = get_post_meta($post->ID, '_project_client', true);
    $project_date = get_post_meta($post->ID, '_project_date', true);

    ?>
    <p>
        <label for="project_url"><?php _e('Project URL:', 'my-custom-plugin'); ?></label><br>
        <input type="url" id="project_url" name="project_url" value="<?php echo esc_attr($project_url); ?>" class="widefat">
    </p>
    <p>
        <label for="project_client"><?php _e('Client Name:', 'my-custom-plugin'); ?></label><br>
        <input type="text" id="project_client" name="project_client" value="<?php echo esc_attr($project_client); ?>" class="widefat">
    </p>
    <p>
        <label for="project_date"><?php _e('Project Date:', 'my-custom-plugin'); ?></label><br>
        <input type="date" id="project_date" name="project_date" value="<?php echo esc_attr($project_date); ?>" class="widefat">
    </p>
    <?php
}

/**
 * Save Meta Box Data
 */
function mcp_save_meta_box($post_id) {
    // Verify nonce
    if (!isset($_POST['mcp_meta_box_nonce']) ||
        !wp_verify_nonce($_POST['mcp_meta_box_nonce'], 'mcp_save_meta_box')) {
        return;
    }

    // Check autosave
    if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) {
        return;
    }

    // Check permissions
    if (!current_user_can('edit_post', $post_id)) {
        return;
    }

    // Save fields
    if (isset($_POST['project_url'])) {
        update_post_meta($post_id, '_project_url', sanitize_url($_POST['project_url']));
    }

    if (isset($_POST['project_client'])) {
        update_post_meta($post_id, '_project_client', sanitize_text_field($_POST['project_client']));
    }

    if (isset($_POST['project_date'])) {
        update_post_meta($post_id, '_project_date', sanitize_text_field($_POST['project_date']));
    }
}
add_action('save_post', 'mcp_save_meta_box');
```

### AJAX Handlers

```php
<?php
/**
 * AJAX Handler for Logged-in Users
 */
function mcp_ajax_load_more() {
    // Verify nonce
    check_ajax_referer('mcp-nonce', 'nonce');

    // Get parameters
    $paged = isset($_POST['page']) ? intval($_POST['page']) : 1;
    $posts_per_page = isset($_POST['posts_per_page']) ? intval($_POST['posts_per_page']) : 10;

    // Query posts
    $args = array(
        'post_type' => 'post',
        'posts_per_page' => $posts_per_page,
        'paged' => $paged,
    );

    $query = new WP_Query($args);

    if ($query->have_posts()) {
        ob_start();

        while ($query->have_posts()) {
            $query->the_post();
            get_template_part('template-parts/content', 'excerpt');
        }

        $html = ob_get_clean();

        wp_send_json_success(array(
            'html' => $html,
            'max_pages' => $query->max_num_pages,
        ));
    } else {
        wp_send_json_error(array(
            'message' => __('No more posts found.', 'my-custom-plugin')
        ));
    }

    wp_reset_postdata();
}
add_action('wp_ajax_mcp_load_more', 'mcp_ajax_load_more');
add_action('wp_ajax_nopriv_mcp_load_more', 'mcp_ajax_load_more'); // For non-logged-in users
```

## Performance Optimization

### Caching Strategies

**Object Caching:**
```php
<?php
/**
 * Use WordPress Object Cache
 */
function mcp_get_expensive_data($user_id) {
    $cache_key = 'user_data_' . $user_id;
    $cache_group = 'user_data';

    // Try to get from cache
    $data = wp_cache_get($cache_key, $cache_group);

    if (false === $data) {
        // Data not in cache, generate it
        $data = perform_expensive_operation($user_id);

        // Store in cache for 1 hour
        wp_cache_set($cache_key, $data, $cache_group, 3600);
    }

    return $data;
}

/**
 * Transients API for Database Caching
 */
function mcp_get_api_data() {
    $transient_key = 'api_data';

    // Try to get from transient
    $data = get_transient($transient_key);

    if (false === $data) {
        // Fetch from API
        $response = wp_remote_get('https://api.example.com/data');

        if (!is_wp_error($response)) {
            $data = json_decode(wp_remote_retrieve_body($response), true);

            // Store for 12 hours
            set_transient($transient_key, $data, 12 * HOUR_IN_SECONDS);
        }
    }

    return $data;
}

// Clear transient when needed
function mcp_clear_api_cache() {
    delete_transient('api_data');
}
add_action('save_post', 'mcp_clear_api_cache');
```

### Database Optimization

**Query Optimization:**
```php
<?php
/**
 * Efficient Database Queries
 */

// BAD: N+1 Query Problem
function bad_get_posts_with_meta() {
    $posts = get_posts(array('numberposts' => 100));

    foreach ($posts as $post) {
        // This runs 100 separate queries!
        $meta = get_post_meta($post->ID, 'custom_field', true);
    }
}

// GOOD: Single Query with Metadata
function good_get_posts_with_meta() {
    global $wpdb;

    $query = "
        SELECT p.*, pm.meta_value
        FROM {$wpdb->posts} p
        LEFT JOIN {$wpdb->postmeta} pm ON p.ID = pm.post_id AND pm.meta_key = 'custom_field'
        WHERE p.post_type = 'post'
        AND p.post_status = 'publish'
        LIMIT 100
    ";

    $results = $wpdb->get_results($query);
}

// Use WP_Query efficiently
function optimized_wp_query() {
    $args = array(
        'post_type' => 'post',
        'posts_per_page' => 10,
        'fields' => 'ids', // Only get IDs if that's all you need
        'no_found_rows' => true, // Skip pagination count query
        'update_post_meta_cache' => false, // Skip meta cache if not needed
        'update_post_term_cache' => false, // Skip term cache if not needed
    );

    $query = new WP_Query($args);
}

// Index custom database tables
function mcp_create_custom_indexes() {
    global $wpdb;

    $table_name = $wpdb->prefix . 'custom_data';

    // Add index on frequently queried column
    $wpdb->query("ALTER TABLE $table_name ADD INDEX idx_user_id (user_id)");
    $wpdb->query("ALTER TABLE $table_name ADD INDEX idx_created_date (created_date)");
}
```

### Image Optimization

```php
<?php
/**
 * Lazy Loading Images
 */
function mcp_add_lazy_loading($content) {
    // Add loading="lazy" to images
    $content = str_replace('<img ', '<img loading="lazy" ', $content);
    return $content;
}
add_filter('the_content', 'mcp_add_lazy_loading');

/**
 * Responsive Images
 */
function mcp_add_responsive_image_sizes() {
    // Add custom image sizes
    add_image_size('featured-small', 400, 300, true);
    add_image_size('featured-medium', 800, 600, true);
    add_image_size('featured-large', 1200, 900, true);
}
add_action('after_setup_theme', 'mcp_add_responsive_image_sizes');

/**
 * WebP Image Support
 */
function mcp_enable_webp_upload($mimes) {
    $mimes['webp'] = 'image/webp';
    return $mimes;
}
add_filter('mime_types', 'mcp_enable_webp_upload');

// Serve WebP images when available
function mcp_serve_webp_images($image_url) {
    $webp_url = preg_replace('/\.(jpg|jpeg|png)$/i', '.webp', $image_url);

    if (file_exists(str_replace(site_url('/'), ABSPATH, $webp_url))) {
        return $webp_url;
    }

    return $image_url;
}
```

### Script and Style Optimization

```php
<?php
/**
 * Defer JavaScript Loading
 */
function mcp_defer_scripts($tag, $handle, $src) {
    // Don't defer jQuery
    if ('jquery' === $handle) {
        return $tag;
    }

    // Defer all other scripts
    return str_replace(' src', ' defer src', $tag);
}
add_filter('script_loader_tag', 'mcp_defer_scripts', 10, 3);

/**
 * Remove Unused WordPress Scripts
 */
function mcp_remove_unused_scripts() {
    // Remove jQuery Migrate if not needed
    wp_deregister_script('jquery-migrate');

    // Remove emoji scripts
    remove_action('wp_head', 'print_emoji_detection_script', 7);
    remove_action('wp_print_styles', 'print_emoji_styles');

    // Remove block library CSS if not using Gutenberg
    wp_dequeue_style('wp-block-library');
}
add_action('wp_enqueue_scripts', 'mcp_remove_unused_scripts', 100);

/**
 * Combine and Minify Assets (manual approach)
 */
function mcp_combine_styles() {
    if (!is_admin()) {
        // Dequeue individual stylesheets
        wp_dequeue_style('style-1');
        wp_dequeue_style('style-2');

        // Enqueue combined and minified version
        wp_enqueue_style(
            'combined-styles',
            get_template_directory_uri() . '/css/combined.min.css',
            array(),
            '1.0.0'
        );
    }
}
add_action('wp_enqueue_scripts', 'mcp_combine_styles', 100);
```

## Security Best Practices

### Input Validation and Sanitization

```php
<?php
/**
 * Sanitize User Input
 */

// Text fields
$safe_text = sanitize_text_field($_POST['text_field']);

// Email addresses
$safe_email = sanitize_email($_POST['email']);

// URLs
$safe_url = esc_url_raw($_POST['url']);

// HTML content (allows safe HTML)
$safe_html = wp_kses_post($_POST['content']);

// Integer values
$safe_int = absint($_POST['number']);

// Array of integers
$safe_ids = array_map('absint', $_POST['ids']);

// Custom validation
function mcp_validate_custom_field($value) {
    // Only allow alphanumeric and hyphens
    if (!preg_match('/^[a-z0-9-]+$/i', $value)) {
        return new WP_Error('invalid_value', __('Invalid value provided.', 'my-custom-plugin'));
    }

    return sanitize_text_field($value);
}
```

### Output Escaping

```php
<?php
/**
 * Escape Output Data
 */

// General HTML
echo esc_html($user_input);

// Attributes
echo '<div class="' . esc_attr($class_name) . '">';

// URLs
echo '<a href="' . esc_url($link) . '">';

// JavaScript
echo '<script>var data = "' . esc_js($data) . '";</script>';

// Textarea
echo '<textarea>' . esc_textarea($content) . '</textarea>';

// HTML blocks (allows safe HTML)
echo wp_kses_post($html_content);

// Custom allowed HTML
$allowed_html = array(
    'a' => array('href' => array(), 'title' => array()),
    'strong' => array(),
    'em' => array(),
);
echo wp_kses($content, $allowed_html);
```

### Nonce Verification

```php
<?php
/**
 * Nonce Security
 */

// Create nonce for forms
function mcp_display_form() {
    ?>
    <form method="post">
        <?php wp_nonce_field('mcp_form_action', 'mcp_nonce'); ?>
        <input type="text" name="data">
        <button type="submit">Submit</button>
    </form>
    <?php
}

// Verify nonce on submission
function mcp_process_form() {
    if (!isset($_POST['mcp_nonce']) ||
        !wp_verify_nonce($_POST['mcp_nonce'], 'mcp_form_action')) {
        wp_die(__('Security check failed', 'my-custom-plugin'));
    }

    // Process form data
}

// Nonce for URLs
$url = wp_nonce_url(
    admin_url('admin.php?action=delete_item&id=123'),
    'delete_item_123'
);

// Verify URL nonce
function mcp_delete_item() {
    if (!isset($_GET['_wpnonce']) ||
        !wp_verify_nonce($_GET['_wpnonce'], 'delete_item_123')) {
        wp_die(__('Security check failed', 'my-custom-plugin'));
    }

    // Delete item
}

// AJAX nonce
wp_localize_script('my-script', 'myAjax', array(
    'nonce' => wp_create_nonce('my-ajax-nonce')
));

// Verify AJAX nonce
function mcp_ajax_handler() {
    check_ajax_referer('my-ajax-nonce', 'nonce');

    // Process AJAX request
}
```

### SQL Injection Prevention

```php
<?php
/**
 * Prepared Statements
 */

global $wpdb;

// BAD: Vulnerable to SQL injection
$user_id = $_GET['user_id'];
$results = $wpdb->get_results("SELECT * FROM {$wpdb->posts} WHERE post_author = $user_id");

// GOOD: Using prepare()
$user_id = $_GET['user_id'];
$results = $wpdb->get_results(
    $wpdb->prepare(
        "SELECT * FROM {$wpdb->posts} WHERE post_author = %d",
        $user_id
    )
);

// Multiple parameters
$results = $wpdb->get_results(
    $wpdb->prepare(
        "SELECT * FROM {$wpdb->posts}
        WHERE post_author = %d
        AND post_status = %s
        AND post_title LIKE %s",
        $user_id,
        'publish',
        '%' . $wpdb->esc_like($search_term) . '%'
    )
);

// Insert with prepare
$wpdb->query(
    $wpdb->prepare(
        "INSERT INTO {$wpdb->prefix}custom_table
        (user_id, name, email) VALUES (%d, %s, %s)",
        $user_id,
        $name,
        $email
    )
);
```

### WordPress Hardening

```php
<?php
/**
 * wp-config.php Security Enhancements
 */

// Disable file editing from admin
define('DISALLOW_FILE_EDIT', true);

// Disable file modifications (plugin/theme install)
define('DISALLOW_FILE_MODS', true);

// Force SSL for admin
define('FORCE_SSL_ADMIN', true);

// Change security keys regularly (generate at https://api.wordpress.org/secret-key/1.1/salt/)
define('AUTH_KEY', 'put your unique phrase here');
define('SECURE_AUTH_KEY', 'put your unique phrase here');
define('LOGGED_IN_KEY', 'put your unique phrase here');
define('NONCE_KEY', 'put your unique phrase here');

// Limit login attempts (via plugin or custom code)
function mcp_limit_login_attempts() {
    $transient_key = 'login_attempts_' . $_SERVER['REMOTE_ADDR'];
    $attempts = get_transient($transient_key);

    if ($attempts >= 5) {
        wp_die(__('Too many login attempts. Please try again in 15 minutes.', 'my-custom-plugin'));
    }

    set_transient($transient_key, $attempts + 1, 15 * MINUTE_IN_SECONDS);
}
add_action('wp_login_failed', 'mcp_limit_login_attempts');

// Remove WordPress version from headers
remove_action('wp_head', 'wp_generator');

// Disable XML-RPC if not needed
add_filter('xmlrpc_enabled', '__return_false');

// Hide login errors
add_filter('login_errors', function() {
    return __('Invalid credentials.', 'my-custom-plugin');
});
```

## WP-CLI Usage

### Common Commands

```bash
# Core WordPress management
wp core download                     # Download WordPress
wp core install --url=example.com --title="Site Title" --admin_user=admin --admin_email=admin@example.com
wp core update                       # Update WordPress
wp core verify-checksums             # Verify core file integrity

# Plugin management
wp plugin list                       # List all plugins
wp plugin install plugin-name        # Install plugin
wp plugin activate plugin-name       # Activate plugin
wp plugin deactivate plugin-name     # Deactivate plugin
wp plugin update plugin-name         # Update plugin
wp plugin update --all               # Update all plugins
wp plugin delete plugin-name         # Delete plugin

# Theme management
wp theme list                        # List themes
wp theme install theme-name          # Install theme
wp theme activate theme-name         # Activate theme
wp theme update theme-name           # Update theme

# Database operations
wp db export backup.sql              # Export database
wp db import backup.sql              # Import database
wp db optimize                       # Optimize database
wp db repair                         # Repair database
wp db query "SELECT * FROM wp_posts" # Run SQL query
wp db search "search-term"           # Search database

# Post/Page management
wp post list                         # List posts
wp post create --post_type=post --post_status=publish --post_title="Title" --post_content="Content"
wp post update 123 --post_status=draft
wp post delete 123                   # Delete post

# User management
wp user list                         # List users
wp user create newuser email@example.com --role=editor --user_pass=password
wp user update 1 --user_email=newemail@example.com
wp user delete 123 --reassign=1      # Delete and reassign posts

# Media management
wp media import image.jpg --post_id=123
wp media regenerate --yes            # Regenerate thumbnails

# Cache operations
wp cache flush                       # Flush object cache
wp transient delete --all            # Delete all transients
wp rewrite flush                     # Flush rewrite rules

# Search and replace
wp search-replace 'oldurl.com' 'newurl.com' --dry-run  # Dry run
wp search-replace 'oldurl.com' 'newurl.com' --skip-columns=guid  # Execute

# Cron management
wp cron event list                   # List scheduled events
wp cron event run hook_name          # Run specific event
wp cron test                         # Test cron spawn

# Site maintenance
wp maintenance-mode activate         # Enable maintenance mode
wp maintenance-mode deactivate       # Disable maintenance mode

# Export/Import
wp export --dir=/path/to/export      # Export content
wp import export.xml --authors=create # Import content
```

### Custom WP-CLI Commands

```php
<?php
/**
 * Custom WP-CLI Command
 * Save as: wp-content/mu-plugins/custom-cli-commands.php
 */

if (defined('WP_CLI') && WP_CLI) {

    class Custom_CLI_Commands {

        /**
         * Generate test posts
         *
         * ## OPTIONS
         *
         * [--count=<number>]
         * : Number of posts to generate
         * ---
         * default: 10
         * ---
         *
         * ## EXAMPLES
         *
         *     wp custom generate-posts --count=50
         *
         * @param array $args
         * @param array $assoc_args
         */
        public function generate_posts($args, $assoc_args) {
            $count = isset($assoc_args['count']) ? intval($assoc_args['count']) : 10;

            $progress = \WP_CLI\Utils\make_progress_bar('Generating posts', $count);

            for ($i = 0; $i < $count; $i++) {
                wp_insert_post(array(
                    'post_title' => 'Test Post ' . ($i + 1),
                    'post_content' => 'This is test content for post ' . ($i + 1),
                    'post_status' => 'publish',
                    'post_type' => 'post',
                ));

                $progress->tick();
            }

            $progress->finish();

            WP_CLI::success("Generated $count test posts.");
        }

        /**
         * Clean up spam comments
         *
         * ## EXAMPLES
         *
         *     wp custom cleanup-spam
         */
        public function cleanup_spam() {
            global $wpdb;

            $deleted = $wpdb->query("DELETE FROM {$wpdb->comments} WHERE comment_approved = 'spam'");

            WP_CLI::success("Deleted $deleted spam comments.");
        }

        /**
         * Optimize images
         *
         * ## EXAMPLES
         *
         *     wp custom optimize-images
         */
        public function optimize_images() {
            $attachments = get_posts(array(
                'post_type' => 'attachment',
                'post_mime_type' => 'image',
                'posts_per_page' => -1,
            ));

            $progress = \WP_CLI\Utils\make_progress_bar('Optimizing images', count($attachments));

            foreach ($attachments as $attachment) {
                // Regenerate thumbnails
                wp_update_attachment_metadata(
                    $attachment->ID,
                    wp_generate_attachment_metadata($attachment->ID, get_attached_file($attachment->ID))
                );

                $progress->tick();
            }

            $progress->finish();

            WP_CLI::success('Image optimization complete.');
        }
    }

    WP_CLI::add_command('custom', 'Custom_CLI_Commands');
}
```

## Practical Examples

### Example 1: Custom Post Type with Advanced Features

```php
<?php
/**
 * Complete Custom Post Type Implementation
 */

// Register custom post type
function mcp_register_portfolio() {
    $labels = array(
        'name' => 'Portfolio',
        'singular_name' => 'Portfolio Item',
        'add_new' => 'Add New Item',
        'add_new_item' => 'Add New Portfolio Item',
        'edit_item' => 'Edit Portfolio Item',
        'all_items' => 'All Portfolio Items',
    );

    $args = array(
        'labels' => $labels,
        'public' => true,
        'has_archive' => true,
        'menu_icon' => 'dashicons-portfolio',
        'supports' => array('title', 'editor', 'thumbnail', 'excerpt'),
        'show_in_rest' => true,
        'rewrite' => array('slug' => 'portfolio'),
    );

    register_post_type('portfolio', $args);
}
add_action('init', 'mcp_register_portfolio');

// Register custom taxonomy
function mcp_register_portfolio_category() {
    register_taxonomy('portfolio_category', 'portfolio', array(
        'label' => 'Portfolio Categories',
        'hierarchical' => true,
        'show_in_rest' => true,
        'rewrite' => array('slug' => 'portfolio-category'),
    ));
}
add_action('init', 'mcp_register_portfolio_category');

// Add custom meta box
function mcp_portfolio_meta_box() {
    add_meta_box(
        'portfolio_details',
        'Portfolio Details',
        'mcp_portfolio_meta_box_callback',
        'portfolio',
        'normal',
        'high'
    );
}
add_action('add_meta_boxes', 'mcp_portfolio_meta_box');

function mcp_portfolio_meta_box_callback($post) {
    wp_nonce_field('mcp_save_portfolio_meta', 'mcp_portfolio_nonce');

    $client = get_post_meta($post->ID, '_portfolio_client', true);
    $url = get_post_meta($post->ID, '_portfolio_url', true);
    $technologies = get_post_meta($post->ID, '_portfolio_technologies', true);

    ?>
    <p>
        <label>Client Name:</label><br>
        <input type="text" name="portfolio_client" value="<?php echo esc_attr($client); ?>" class="widefat">
    </p>
    <p>
        <label>Project URL:</label><br>
        <input type="url" name="portfolio_url" value="<?php echo esc_attr($url); ?>" class="widefat">
    </p>
    <p>
        <label>Technologies Used:</label><br>
        <textarea name="portfolio_technologies" class="widefat" rows="4"><?php echo esc_textarea($technologies); ?></textarea>
    </p>
    <?php
}

function mcp_save_portfolio_meta($post_id) {
    if (!isset($_POST['mcp_portfolio_nonce']) ||
        !wp_verify_nonce($_POST['mcp_portfolio_nonce'], 'mcp_save_portfolio_meta')) {
        return;
    }

    if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) return;
    if (!current_user_can('edit_post', $post_id)) return;

    if (isset($_POST['portfolio_client'])) {
        update_post_meta($post_id, '_portfolio_client', sanitize_text_field($_POST['portfolio_client']));
    }

    if (isset($_POST['portfolio_url'])) {
        update_post_meta($post_id, '_portfolio_url', esc_url_raw($_POST['portfolio_url']));
    }

    if (isset($_POST['portfolio_technologies'])) {
        update_post_meta($post_id, '_portfolio_technologies', sanitize_textarea_field($_POST['portfolio_technologies']));
    }
}
add_action('save_post', 'mcp_save_portfolio_meta');

// Custom archive template query
function mcp_portfolio_archive_query($query) {
    if (!is_admin() && $query->is_main_query() && is_post_type_archive('portfolio')) {
        $query->set('posts_per_page', 12);
        $query->set('orderby', 'date');
        $query->set('order', 'DESC');
    }
}
add_action('pre_get_posts', 'mcp_portfolio_archive_query');
```

### Example 2: Custom REST API Endpoint

```php
<?php
/**
 * Custom REST API Endpoint
 */

function mcp_register_rest_routes() {
    // GET endpoint
    register_rest_route('mcp/v1', '/posts', array(
        'methods' => 'GET',
        'callback' => 'mcp_get_posts',
        'permission_callback' => '__return_true',
    ));

    // POST endpoint
    register_rest_route('mcp/v1', '/posts', array(
        'methods' => 'POST',
        'callback' => 'mcp_create_post',
        'permission_callback' => 'mcp_check_permission',
        'args' => array(
            'title' => array(
                'required' => true,
                'validate_callback' => function($param) {
                    return is_string($param);
                }
            ),
            'content' => array(
                'required' => true,
                'sanitize_callback' => 'sanitize_textarea_field',
            ),
        ),
    ));

    // GET single endpoint with parameter
    register_rest_route('mcp/v1', '/posts/(?P<id>\d+)', array(
        'methods' => 'GET',
        'callback' => 'mcp_get_single_post',
        'permission_callback' => '__return_true',
        'args' => array(
            'id' => array(
                'validate_callback' => function($param) {
                    return is_numeric($param);
                }
            ),
        ),
    ));
}
add_action('rest_api_init', 'mcp_register_rest_routes');

function mcp_get_posts($request) {
    $args = array(
        'post_type' => 'post',
        'posts_per_page' => $request->get_param('per_page') ?: 10,
        'paged' => $request->get_param('page') ?: 1,
    );

    $posts = get_posts($args);

    $data = array();
    foreach ($posts as $post) {
        $data[] = array(
            'id' => $post->ID,
            'title' => $post->post_title,
            'content' => $post->post_content,
            'excerpt' => $post->post_excerpt,
            'date' => $post->post_date,
        );
    }

    return new WP_REST_Response($data, 200);
}

function mcp_create_post($request) {
    $post_data = array(
        'post_title' => $request->get_param('title'),
        'post_content' => $request->get_param('content'),
        'post_status' => 'publish',
        'post_type' => 'post',
    );

    $post_id = wp_insert_post($post_data);

    if (is_wp_error($post_id)) {
        return new WP_Error('create_failed', 'Failed to create post', array('status' => 500));
    }

    return new WP_REST_Response(array(
        'id' => $post_id,
        'message' => 'Post created successfully'
    ), 201);
}

function mcp_get_single_post($request) {
    $post = get_post($request['id']);

    if (!$post) {
        return new WP_Error('not_found', 'Post not found', array('status' => 404));
    }

    return new WP_REST_Response(array(
        'id' => $post->ID,
        'title' => $post->post_title,
        'content' => $post->post_content,
    ), 200);
}

function mcp_check_permission() {
    return current_user_can('edit_posts');
}
```

### Example 3: Advanced Custom Query with Meta and Taxonomy

```php
<?php
/**
 * Complex WP_Query Example
 */

function mcp_advanced_query() {
    $args = array(
        'post_type' => 'portfolio',
        'posts_per_page' => 20,
        'post_status' => 'publish',

        // Meta query (custom fields)
        'meta_query' => array(
            'relation' => 'AND',
            array(
                'key' => '_portfolio_featured',
                'value' => '1',
                'compare' => '=',
            ),
            array(
                'key' => '_portfolio_date',
                'value' => date('Y-m-d', strtotime('-1 year')),
                'compare' => '>=',
                'type' => 'DATE',
            ),
        ),

        // Taxonomy query
        'tax_query' => array(
            'relation' => 'OR',
            array(
                'taxonomy' => 'portfolio_category',
                'field' => 'slug',
                'terms' => array('web-design', 'web-development'),
            ),
            array(
                'taxonomy' => 'portfolio_tag',
                'field' => 'slug',
                'terms' => 'featured',
            ),
        ),

        // Date query
        'date_query' => array(
            array(
                'after' => '1 year ago',
                'inclusive' => true,
            ),
        ),

        // Sorting
        'orderby' => array(
            'meta_value_num' => 'DESC',
            'date' => 'DESC',
        ),
        'meta_key' => '_portfolio_views',
    );

    $query = new WP_Query($args);

    if ($query->have_posts()) {
        while ($query->have_posts()) {
            $query->the_post();

            // Display post
            $client = get_post_meta(get_the_ID(), '_portfolio_client', true);
            $technologies = get_post_meta(get_the_ID(), '_portfolio_technologies', true);

            ?>
            <article>
                <h2><?php the_title(); ?></h2>
                <?php if ($client) : ?>
                    <p>Client: <?php echo esc_html($client); ?></p>
                <?php endif; ?>
                <?php the_content(); ?>
                <?php if ($technologies) : ?>
                    <p>Technologies: <?php echo esc_html($technologies); ?></p>
                <?php endif; ?>
            </article>
            <?php
        }

        // Pagination
        echo paginate_links(array(
            'total' => $query->max_num_pages,
        ));
    }

    wp_reset_postdata();
}
```

### Example 4: Custom User Roles and Capabilities

```php
<?php
/**
 * Custom User Role Management
 */

function mcp_add_custom_roles() {
    // Add custom role
    add_role(
        'project_manager',
        'Project Manager',
        array(
            'read' => true,
            'edit_posts' => true,
            'edit_published_posts' => true,
            'publish_posts' => true,
            'delete_posts' => true,
            'upload_files' => true,
            'edit_portfolios' => true, // Custom capability
            'edit_published_portfolios' => true,
            'publish_portfolios' => true,
        )
    );

    // Add custom capability to existing role
    $role = get_role('editor');
    $role->add_cap('edit_portfolios');
    $role->add_cap('delete_portfolios');
}
register_activation_hook(__FILE__, 'mcp_add_custom_roles');

// Map custom post type capabilities
function mcp_register_portfolio_with_caps() {
    register_post_type('portfolio', array(
        'capability_type' => 'portfolio',
        'map_meta_cap' => true,
        'capabilities' => array(
            'edit_post' => 'edit_portfolio',
            'edit_posts' => 'edit_portfolios',
            'edit_others_posts' => 'edit_others_portfolios',
            'publish_posts' => 'publish_portfolios',
            'read_post' => 'read_portfolio',
            'read_private_posts' => 'read_private_portfolios',
            'delete_post' => 'delete_portfolio',
        ),
        // ... other args
    ));
}

// Check user capabilities
function mcp_check_user_capability() {
    if (current_user_can('edit_portfolios')) {
        // User can edit portfolios
    }

    // Check specific post
    if (current_user_can('edit_post', $post_id)) {
        // User can edit this specific post
    }
}
```

### Example 5: Automated Email Notifications

```php
<?php
/**
 * Custom Email Notifications
 */

function mcp_send_custom_email($to, $subject, $message) {
    $headers = array(
        'Content-Type: text/html; charset=UTF-8',
        'From: Site Name <noreply@example.com>',
    );

    // Custom email template
    $html_message = '
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body { font-family: Arial, sans-serif; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #007cba; color: white; padding: 20px; }
            .content { padding: 20px; background: #f5f5f5; }
            .button { display: inline-block; padding: 10px 20px; background: #007cba; color: white; text-decoration: none; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>' . esc_html($subject) . '</h1>
            </div>
            <div class="content">
                ' . wp_kses_post($message) . '
            </div>
        </div>
    </body>
    </html>
    ';

    wp_mail($to, $subject, $html_message, $headers);
}

// Notify admin on new post
function mcp_notify_admin_new_post($post_id, $post) {
    if ($post->post_status !== 'publish') return;

    $admin_email = get_option('admin_email');
    $subject = 'New Post Published: ' . $post->post_title;
    $message = sprintf(
        'A new post has been published.<br><br><strong>Title:</strong> %s<br><strong>Author:</strong> %s<br><br><a href="%s" class="button">View Post</a>',
        $post->post_title,
        get_the_author_meta('display_name', $post->post_author),
        get_permalink($post_id)
    );

    mcp_send_custom_email($admin_email, $subject, $message);
}
add_action('publish_post', 'mcp_notify_admin_new_post', 10, 2);
```

## Best Practices

### WordPress Coding Standards

**PHP Standards:**
```php
<?php
// Use proper indentation (tabs, not spaces)
function my_function() {
	if ( condition ) {
		// Code here
	}
}

// Space after control structures
if ( condition ) {
	// Code
}

// Yoda conditions for comparisons
if ( 'value' === $variable ) {
	// Code
}

// Single quotes for strings (double for variables)
$string = 'Hello World';
$string = "Hello $name";

// Array formatting
$array = array(
	'key1' => 'value1',
	'key2' => 'value2',
);
```

**Naming Conventions:**
```php
// Functions: lowercase with underscores
function my_custom_function() {}

// Classes: capitalized words
class My_Custom_Class {}

// Constants: uppercase with underscores
define( 'MY_CONSTANT', 'value' );

// Hooks: lowercase with underscores, prefixed
add_action( 'myplugin_custom_action', 'callback' );
add_filter( 'myplugin_custom_filter', 'callback' );
```

### Debugging

```php
<?php
/**
 * WordPress Debugging Configuration
 * Add to wp-config.php
 */

// Enable debugging
define( 'WP_DEBUG', true );

// Log errors to file
define( 'WP_DEBUG_LOG', true );

// Display errors (disable in production)
define( 'WP_DEBUG_DISPLAY', false );
@ini_set( 'display_errors', 0 );

// Script debugging (use non-minified versions)
define( 'SCRIPT_DEBUG', true );

// Save database queries
define( 'SAVEQUERIES', true );

// Debug functions
function mcp_debug_log( $message ) {
	if ( WP_DEBUG === true ) {
		if ( is_array( $message ) || is_object( $message ) ) {
			error_log( print_r( $message, true ) );
		} else {
			error_log( $message );
		}
	}
}

// Display query information
function mcp_show_queries() {
	if ( ! defined( 'SAVEQUERIES' ) || ! SAVEQUERIES ) {
		return;
	}

	global $wpdb;

	echo '<pre>';
	print_r( $wpdb->queries );
	echo '</pre>';
}
add_action( 'wp_footer', 'mcp_show_queries' );
```

### Version Control Best Practices

**.gitignore for WordPress:**
```gitignore
# WordPress core files
/wp-admin/
/wp-includes/
/wp-*.php
/xmlrpc.php
/license.txt
/readme.html

# Configuration
wp-config.php
.htaccess

# User content (optional, depends on workflow)
/wp-content/uploads/
/wp-content/cache/
/wp-content/backup-db/

# Plugins (track only custom plugins)
/wp-content/plugins/*
!/wp-content/plugins/my-custom-plugin/

# Themes (track only custom themes)
/wp-content/themes/*
!/wp-content/themes/my-custom-theme/

# Operating system files
.DS_Store
Thumbs.db

# IDE files
.idea/
.vscode/
*.sublime-project
*.sublime-workspace

# Dependencies
/vendor/
/node_modules/

# Logs
*.log
```

---

## Summary

This skill provides comprehensive WordPress development expertise covering:

1. **Architecture** - Core files, database schema, hooks system, template hierarchy
2. **Theme Development** - Essential files, child themes, block themes
3. **Plugin Development** - Structure, custom post types, taxonomies, meta boxes, AJAX
4. **Performance** - Caching, database optimization, image optimization, asset loading
5. **Security** - Input validation, output escaping, nonces, SQL injection prevention, hardening
6. **WP-CLI** - Common commands, custom commands, automation
7. **Best Practices** - Coding standards, debugging, version control

Use this skill when working with WordPress projects to ensure best practices, optimal performance, and secure implementation.
