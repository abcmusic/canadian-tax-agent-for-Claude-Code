---
name: avada-wordpress-theme-expert
description: Avada WordPress theme customization expertise. Provides Avada architecture, Fusion Builder usage, performance optimization, common patterns, and troubleshooting. Use when working with Avada theme projects.
version: 1.0.0
tags:
  - avada
  - wordpress
  - theme
  - fusion-builder
  - customization
  - woocommerce
  - performance
category: domain-expert
dependencies:
  - wordpress-development
  - php
  - css
related_skills:
  - elementor-expert
  - woocommerce-expert
  - wordpress-performance-optimization
---

# Avada WordPress Theme Expert

Comprehensive expertise for Avada theme development, customization, and optimization. Avada is one of the best-selling WordPress themes with the Fusion Builder page builder.

## Overview

Avada is a premium multipurpose WordPress theme featuring:
- Fusion Builder (visual page builder)
- Extensive theme options panel
- Pre-built websites and demos
- WooCommerce integration
- Responsive design system
- Performance optimization features

## Avada Architecture

### Theme Structure

```
avada/
├── assets/
│   ├── css/
│   │   ├── dynamic/          # Dynamically generated CSS
│   │   ├── media/            # Media query styles
│   │   └── theme-styles.css  # Core theme styles
│   ├── js/
│   │   ├── general/          # General scripts
│   │   └── library/          # Third-party libraries
│   └── fonts/
├── includes/
│   ├── class-avada.php       # Main theme class
│   ├── class-avada-admin.php # Admin functionality
│   ├── options/              # Theme options definitions
│   ├── metaboxes/            # Page options metaboxes
│   └── lib/                  # Core libraries
├── templates/
│   ├── header.php
│   ├── footer.php
│   ├── content-*.php         # Content templates
│   └── portfolio-*.php       # Portfolio templates
├── Avada/
│   ├── includes/             # Fusion core files
│   └── framework/            # Framework components
└── functions.php             # Theme functions
```

### Fusion Core Components

**Key Classes:**
- `Avada` - Main theme singleton
- `Fusion_Builder` - Page builder engine
- `Fusion_Options` - Options framework
- `Fusion_Dynamic_CSS` - Dynamic CSS generation
- `Avada_Partial_Refresh` - Customizer partial refresh

**Hooks System:**
```php
// Avada-specific action hooks
add_action('avada_hook_before_header', 'custom_header_content');
add_action('avada_hook_after_content', 'custom_footer_widgets');
add_action('avada_hook_main_menu_nav', 'custom_menu_items');

// Filter hooks
add_filter('avada_logo_retina', 'custom_retina_logo');
add_filter('avada_setting_get_option_name', 'modify_theme_option');
```

### Options System

**Global Options (Theme Options):**
```php
// Access theme options
$option_value = Avada()->settings->get('option_name');

// Common options
$primary_color = Avada()->settings->get('primary_color');
$logo_url = Avada()->settings->get('logo', 'url');
$header_layout = Avada()->settings->get('header_layout');

// Dynamic access
$option = 'sidebar_width';
$width = Avada()->settings->get($option);
```

**Page Options (Post Meta):**
```php
// Get page-specific option
$page_title = fusion_get_page_option('page_title_bar', $post_id);
$sidebar = fusion_get_page_option('sidebar_position', $post_id);

// Set page option
update_post_meta($post_id, 'pyre_sidebar_position', 'right');
```

## Fusion Builder Mastery

### Builder Architecture

**Element Structure:**
```php
// Register custom Fusion Builder element
function custom_fusion_element() {
    fusion_builder_map(
        fusion_builder_frontend_data(
            'FusionSC_CustomElement',
            array(
                'name'              => esc_attr__('Custom Element', 'fusion-builder'),
                'shortcode'         => 'custom_element',
                'icon'              => 'fusiona-custom',
                'preview'           => FUSION_BUILDER_PLUGIN_DIR . 'inc/templates/previews/fusion-custom-element-preview.php',
                'preview_id'        => 'fusion-builder-block-module-custom-element-preview-template',
                'allow_generator'   => true,
                'inline_editor'     => true,
                'params'            => array(
                    array(
                        'type'        => 'textfield',
                        'heading'     => esc_attr__('Title', 'fusion-builder'),
                        'description' => esc_attr__('Enter title.', 'fusion-builder'),
                        'param_name'  => 'title',
                        'value'       => '',
                    ),
                    array(
                        'type'        => 'colorpickeralpha',
                        'heading'     => esc_attr__('Background Color', 'fusion-builder'),
                        'param_name'  => 'background_color',
                        'value'       => '',
                        'default'     => '#ffffff',
                    ),
                    array(
                        'type'        => 'select',
                        'heading'     => esc_attr__('Layout', 'fusion-builder'),
                        'param_name'  => 'layout',
                        'value'       => array(
                            'default' => esc_attr__('Default', 'fusion-builder'),
                            'boxed'   => esc_attr__('Boxed', 'fusion-builder'),
                            'wide'    => esc_attr__('Wide', 'fusion-builder'),
                        ),
                        'default'     => 'default',
                    ),
                ),
            )
        )
    );
}
add_action('fusion_builder_before_init', 'custom_fusion_element');

// Element shortcode handler
function fusion_sc_custom_element($atts, $content = '') {
    extract(shortcode_atts(array(
        'title'            => '',
        'background_color' => '#ffffff',
        'layout'           => 'default',
        'class'            => '',
        'id'               => '',
    ), $atts, 'custom_element'));

    $html = sprintf(
        '<div class="custom-element custom-element-%s %s" style="background-color:%s">',
        esc_attr($layout),
        esc_attr($class),
        esc_attr($background_color)
    );

    if ($title) {
        $html .= '<h3>' . esc_html($title) . '</h3>';
    }

    $html .= do_shortcode($content);
    $html .= '</div>';

    return $html;
}
add_shortcode('custom_element', 'fusion_sc_custom_element');
```

### Container System

**Fusion Containers:**
```php
// Container element (parent)
[fusion_builder_container
    hundred_percent="no"
    hundred_percent_height="no"
    overflow="visible"
    background_color="#f2f3f5"
    background_position="center center"
    background_repeat="no-repeat"
    fade="no"
    border_size="0px"
    border_style="solid"
    padding_top="80px"
    padding_bottom="80px"
    margin_top="0px"
    margin_bottom="0px"]

    [fusion_builder_row]
        [fusion_builder_column type="1_2" spacing="yes" last="no"]
            [fusion_text]Content here[/fusion_text]
        [/fusion_builder_column]

        [fusion_builder_column type="1_2" spacing="yes" last="yes"]
            [fusion_imageframe]...[/fusion_imageframe]
        [/fusion_builder_column]
    [/fusion_builder_row]

[/fusion_builder_container]
```

**Responsive Columns:**
```php
// Responsive column configuration
[fusion_builder_column
    type="1_3"                    # Desktop: 33.33%
    type_medium="1_2"             # Tablet: 50%
    type_small="1_1"              # Mobile: 100%
    spacing="yes"
    center_content="no"
    hover_type="none"
    hide_on_mobile="small-visibility,medium-visibility"
    class="custom-column"
    min_height=""
    last="no"]
```

### Responsive Design

**Breakpoint System:**
```php
// Avada breakpoints
$breakpoints = array(
    'large'  => 1024,  // Desktop
    'medium' => 768,   // Tablet
    'small'  => 640,   // Mobile
);

// Responsive helper function
function get_responsive_value($desktop, $tablet = '', $mobile = '') {
    if (wp_is_mobile()) {
        return $mobile ?: $tablet ?: $desktop;
    } elseif (is_tablet()) {
        return $tablet ?: $desktop;
    }
    return $desktop;
}
```

**Responsive Typography:**
```php
// Dynamic font sizes
add_filter('fusion_dynamic_css_final', function($css) {
    $css['global']['.custom-heading']['font-size'] = Avada()->settings->get('h1_typography', 'font-size');

    // Responsive font size
    $css['media']['@media only screen and (max-width: 768px)']['.custom-heading']['font-size'] = '24px';
    $css['media']['@media only screen and (max-width: 640px)']['.custom-heading']['font-size'] = '18px';

    return $css;
});
```

## Theme Options & Customization

### Global Options Access

**Reading Options:**
```php
// Single option
$primary_color = Avada()->settings->get('primary_color');

// Multiple options
$options = array(
    'logo'          => Avada()->settings->get('logo', 'url'),
    'logo_retina'   => Avada()->settings->get('logo_retina', 'url'),
    'site_width'    => Avada()->settings->get('site_width'),
    'sidebar_width' => Avada()->settings->get('sidebar_width'),
);

// Check if option exists
if (Avada()->settings->exists('custom_option')) {
    $value = Avada()->settings->get('custom_option');
}
```

**Modifying Options (Filters):**
```php
// Override specific option
add_filter('fusion_get_option_primary_color', function($value) {
    if (is_page('special-page')) {
        return '#ff0000';
    }
    return $value;
});

// Modify all options
add_filter('avada_setting_get_option_name', function($value, $option_name) {
    if ('sidebar_width' === $option_name && is_singular('product')) {
        return '25%';
    }
    return $value;
}, 10, 2);
```

### Page Options (Meta Boxes)

**Custom Page Options:**
```php
// Add custom page option
function add_custom_page_option($sections) {
    $sections['custom_section'] = array(
        'label'  => esc_html__('Custom Settings', 'Avada'),
        'id'     => 'custom_section',
        'icon'   => 'el-icon-cog',
        'fields' => array(
            'custom_field' => array(
                'id'          => 'custom_field',
                'label'       => esc_html__('Custom Field', 'Avada'),
                'description' => esc_html__('Description here.', 'Avada'),
                'type'        => 'text',
                'default'     => '',
            ),
            'custom_toggle' => array(
                'id'          => 'custom_toggle',
                'label'       => esc_html__('Enable Feature', 'Avada'),
                'type'        => 'radio-buttonset',
                'default'     => 'yes',
                'choices'     => array(
                    'yes' => esc_html__('Yes', 'Avada'),
                    'no'  => esc_html__('No', 'Avada'),
                ),
            ),
        ),
    );

    return $sections;
}
add_filter('avada_page_options_sections', 'add_custom_page_option');

// Access custom page option
$custom_value = fusion_get_page_option('custom_field', $post_id);
```

### Dynamic CSS

**CSS Generation System:**
```php
// Add custom dynamic CSS
function add_custom_dynamic_css() {
    $custom_color = Avada()->settings->get('custom_color');

    $css = "
        .custom-element {
            background-color: {$custom_color};
            padding: 20px;
        }

        @media only screen and (max-width: 768px) {
            .custom-element {
                padding: 10px;
            }
        }
    ";

    return $css;
}
add_filter('fusion_dynamic_css_final', function($css) {
    $css['global']['.custom-element'] = array(
        'background-color' => Avada()->settings->get('custom_color'),
        'padding'          => '20px',
    );

    $css['media']['@media only screen and (max-width: 768px)']['.custom-element'] = array(
        'padding' => '10px',
    );

    return $css;
});
```

### CSS Customization Methods

**Method 1: Theme Options Custom CSS:**
```css
/* Avada > Theme Options > Custom CSS */
.custom-class {
    background: #f5f5f5;
    border-radius: 10px;
}

/* Override Fusion Builder element */
.fusion-button.custom-button {
    background-color: #ff6b6b !important;
    border-color: #ff6b6b !important;
}
```

**Method 2: Child Theme Style:**
```php
// Child theme functions.php
function child_theme_enqueue_styles() {
    wp_enqueue_style('child-style',
        get_stylesheet_directory_uri() . '/style.css',
        array('avada-stylesheet'),
        wp_get_theme()->get('Version')
    );
}
add_action('wp_enqueue_scripts', 'child_theme_enqueue_styles');
```

**Method 3: Dynamic CSS Filter:**
```php
// Most performant method
add_filter('fusion_dynamic_css_final', function($css) {
    $css['global']['.custom-section'] = array(
        'background-color' => '#ffffff',
        'padding'          => '40px 20px',
        'border-radius'    => '8px',
    );

    return $css;
});
```

## Performance Optimization

### Avada-Specific Optimization

**1. Performance Panel Settings:**
```php
// Recommended settings
Avada()->settings->set('status_gzip', '1');          // Enable GZIP
Avada()->settings->set('status_fusion_builder', '1'); // Fusion Builder
Avada()->settings->set('js_compiler', '1');          // JS compiler
Avada()->settings->set('css_cache_method', 'file'); // File-based CSS cache
Avada()->settings->set('lazy_load', '1');            // Lazy loading
Avada()->settings->set('smooth_scrolling', '0');     // Disable if not needed
```

**2. Disable Unused Features:**
```php
// In child theme functions.php
add_action('after_setup_theme', function() {
    // Remove unused post types
    remove_post_type_support('avada_portfolio', 'thumbnail');

    // Disable Avada widgets not in use
    add_filter('avada_disable_widgets', function($widgets) {
        $widgets[] = 'Fusion_Widget_Recent_Works';
        $widgets[] = 'Fusion_Widget_Tabs';
        return $widgets;
    });
});

// Disable Font Awesome if using custom icons
add_filter('fusion_load_font_awesome', '__return_false');
```

**3. Script Optimization:**
```php
// Defer non-critical scripts
function defer_avada_scripts($tag, $handle) {
    $scripts_to_defer = array(
        'avada-carousel',
        'avada-elastic-slider',
        'avada-video-bg',
    );

    if (in_array($handle, $scripts_to_defer)) {
        return str_replace(' src', ' defer src', $tag);
    }

    return $tag;
}
add_filter('script_loader_tag', 'defer_avada_scripts', 10, 2);

// Remove jQuery Migrate
function remove_jquery_migrate($scripts) {
    if (!is_admin() && isset($scripts->registered['jquery'])) {
        $script = $scripts->registered['jquery'];

        if ($script->deps) {
            $script->deps = array_diff($script->deps, array('jquery-migrate'));
        }
    }
}
add_action('wp_default_scripts', 'remove_jquery_migrate');
```

**4. Image Optimization:**
```php
// Configure lazy loading
add_filter('fusion_lazy_load_threshold', function() {
    return 200; // Start loading 200px before viewport
});

// Disable lazy load on specific images
add_filter('fusion_disable_lazy_load', function($disable, $element) {
    if ('logo' === $element || 'featured_image' === $element) {
        return true;
    }
    return $disable;
}, 10, 2);
```

**5. Database Optimization:**
```php
// Clean up Fusion Builder cache
function clean_fusion_cache() {
    if (class_exists('Fusion_Cache')) {
        Fusion_Cache::reset_all_caches();
    }

    // Clear page options cache
    delete_transient('fusion_page_options');
}

// Schedule weekly cleanup
if (!wp_next_scheduled('weekly_fusion_cleanup')) {
    wp_schedule_event(time(), 'weekly', 'weekly_fusion_cleanup');
}
add_action('weekly_fusion_cleanup', 'clean_fusion_cache');
```

### Caching Configuration

**Recommended Caching Stack:**
```php
// 1. Avada built-in CSS cache (file-based)
Avada()->settings->set('css_cache_method', 'file');

// 2. Object caching (Redis/Memcached)
// wp-config.php
define('WP_CACHE', true);
define('WP_REDIS_HOST', 'localhost');
define('WP_REDIS_PORT', 6379);

// 3. Page caching exclusions
// For WP Rocket
add_filter('rocket_cache_reject_uri', function($uri) {
    $uri[] = '/cart/(.*)';
    $uri[] = '/my-account/(.*)';
    $uri[] = '/checkout/(.*)';
    return $uri;
});
```

## Common Patterns

### Header Customization

**Custom Header Layout:**
```php
// Override header template
function custom_avada_header() {
    if (is_page('custom-page')) {
        get_template_part('templates/custom-header');
        return;
    }
}
add_action('avada_override_current_page_title_bar', 'custom_avada_header');

// Add custom header element
add_action('avada_header', function() {
    echo '<div class="custom-header-notice">Special Offer!</div>';
}, 5);

// Modify logo
add_filter('avada_logo_retina', function($logo) {
    if (is_page('special-landing')) {
        return get_stylesheet_directory_uri() . '/images/special-logo@2x.png';
    }
    return $logo;
});
```

**Mobile Menu Customization:**
```php
// Custom mobile menu trigger
add_filter('avada_mobile_menu_toggle', function($html) {
    return '<button class="custom-mobile-toggle">
        <span></span>
        <span></span>
        <span></span>
    </button>';
});

// Add custom mobile menu items
add_filter('wp_nav_menu_items', function($items, $args) {
    if ('main_navigation' === $args->theme_location && wp_is_mobile()) {
        $items .= '<li class="mobile-only-item">
            <a href="/mobile-app">Download App</a>
        </li>';
    }
    return $items;
}, 10, 2);
```

### Footer Customization

**Custom Footer Widgets:**
```php
// Register custom footer widget area
function custom_footer_widgets() {
    register_sidebar(array(
        'name'          => esc_html__('Custom Footer', 'Avada'),
        'id'            => 'custom-footer',
        'before_widget' => '<div id="%1$s" class="fusion-footer-widget %2$s">',
        'after_widget'  => '</div>',
        'before_title'  => '<h4 class="widget-title">',
        'after_title'   => '</h4>',
    ));
}
add_action('widgets_init', 'custom_footer_widgets');

// Display in footer
add_action('avada_hook_footer_area_before', function() {
    if (is_active_sidebar('custom-footer')) {
        echo '<div class="custom-footer-area">';
        dynamic_sidebar('custom-footer');
        echo '</div>';
    }
});
```

**Footer Copyright Customization:**
```php
// Modify copyright text
add_filter('fusion_copyright_content', function($content) {
    $year = date('Y');
    return "© {$year} Company Name. All Rights Reserved.";
});

// Add social icons to footer
add_action('avada_hook_copyright_content', function() {
    echo '<div class="footer-social">';
    echo do_shortcode('[fusion_social_links icons_boxed="no" icon_colors="#ffffff" box_colors="" /]');
    echo '</div>';
});
```

### Portfolio Layouts

**Custom Portfolio Grid:**
```php
// Custom portfolio template
add_filter('fusion_portfolio_load_more_posts_per_page', function() {
    return 12; // Override posts per page
});

// Add custom portfolio filter
add_filter('fusion_portfolio_filters', function($filters) {
    $filters['custom'] = array(
        'label' => 'Custom Filter',
        'slug'  => 'custom-category',
    );
    return $filters;
});

// Modify portfolio query
add_filter('fusion_portfolio_query_args', function($args) {
    $args['meta_query'] = array(
        array(
            'key'     => 'featured_project',
            'value'   => '1',
            'compare' => '=',
        ),
    );
    return $args;
});
```

### WooCommerce Integration

**Product Page Customization:**
```php
// Remove default Avada WooCommerce hooks
remove_action('woocommerce_before_shop_loop', 'avada_woocommerce_ordering', 30);
remove_action('woocommerce_after_shop_loop_item', 'avada_woocommerce_template_loop_add_to_cart', 10);

// Add custom product badges
add_action('woocommerce_before_shop_loop_item_title', function() {
    global $product;

    if ($product->is_on_sale()) {
        $percentage = round((($product->get_regular_price() - $product->get_sale_price()) / $product->get_regular_price()) * 100);
        echo '<span class="custom-sale-badge">-' . $percentage . '%</span>';
    }

    if ($product->is_featured()) {
        echo '<span class="custom-featured-badge">Featured</span>';
    }
}, 15);

// Custom cart icon counter
add_filter('fusion_woocommerce_cart_link_fragment', function($fragments) {
    $count = WC()->cart->get_cart_contents_count();

    $fragments['.custom-cart-count'] = sprintf(
        '<span class="custom-cart-count">%s</span>',
        $count > 0 ? $count : ''
    );

    return $fragments;
});
```

**Checkout Customization:**
```php
// Add custom checkout field
add_filter('woocommerce_checkout_fields', function($fields) {
    $fields['billing']['billing_company_vat'] = array(
        'label'       => __('VAT Number', 'woocommerce'),
        'placeholder' => _x('VAT Number', 'placeholder', 'woocommerce'),
        'required'    => false,
        'class'       => array('form-row-wide'),
        'clear'       => true,
    );

    return $fields;
});

// Save custom field
add_action('woocommerce_checkout_update_order_meta', function($order_id) {
    if (!empty($_POST['billing_company_vat'])) {
        update_post_meta($order_id, 'billing_company_vat', sanitize_text_field($_POST['billing_company_vat']));
    }
});
```

## Child Theme Development

### Child Theme Setup

**style.css:**
```css
/*
Theme Name: Avada Child
Theme URI: https://theme-fusion.com/
Description: Avada Child Theme
Author: ThemeFusion
Author URI: https://theme-fusion.com/
Template: Avada
Version: 1.0.0
Text Domain: Avada
*/

/* Custom styles below */
```

**functions.php:**
```php
<?php
/**
 * Avada Child Theme Functions
 */

// Exit if accessed directly
if (!defined('ABSPATH')) {
    exit;
}

/**
 * Enqueue child theme styles
 */
function avada_child_enqueue_styles() {
    // Parent theme stylesheet
    wp_enqueue_style('avada-stylesheet',
        get_template_directory_uri() . '/assets/css/style.min.css',
        array(),
        wp_get_theme('Avada')->get('Version')
    );

    // Child theme stylesheet
    wp_enqueue_style('avada-child-stylesheet',
        get_stylesheet_directory_uri() . '/style.css',
        array('avada-stylesheet'),
        wp_get_theme()->get('Version')
    );
}
add_action('wp_enqueue_scripts', 'avada_child_enqueue_styles', 20);

/**
 * Load child theme text domain
 */
function avada_child_load_textdomain() {
    load_child_theme_textdomain('Avada', get_stylesheet_directory() . '/languages');
}
add_action('after_setup_theme', 'avada_child_load_textdomain');

/**
 * Custom functions below
 */
```

### Function Overrides

**Override Parent Functions:**
```php
// Check if function exists before declaring
if (!function_exists('avada_render_custom_element')) {
    function avada_render_custom_element() {
        // Child theme version
        return '<div class="custom-element">Child Theme Content</div>';
    }
}

// Remove parent action and add child version
remove_action('avada_hook', 'parent_function', 10);
add_action('avada_hook', 'child_custom_function', 10);
```

**Template Overrides:**
```
avada-child/
├── templates/
│   ├── header.php          # Override header
│   ├── content-page.php    # Override page content
│   └── portfolio-grid.php  # Override portfolio
├── woocommerce/
│   ├── single-product.php  # Override WooCommerce template
│   └── archive-product.php
```

### Custom Post Types & Taxonomies

**Register Custom Content:**
```php
// Custom post type
function register_custom_portfolio() {
    $args = array(
        'label'               => __('Custom Projects', 'Avada'),
        'public'              => true,
        'has_archive'         => true,
        'supports'            => array('title', 'editor', 'thumbnail', 'excerpt'),
        'show_in_fusion'      => true, // Show in Fusion Builder
        'fusion_element_name' => 'custom_projects',
    );

    register_post_type('custom_project', $args);
}
add_action('init', 'register_custom_portfolio');

// Custom taxonomy
function register_custom_taxonomy() {
    register_taxonomy('project_category', 'custom_project', array(
        'label'        => __('Project Categories', 'Avada'),
        'hierarchical' => true,
        'public'       => true,
        'show_admin_column' => true,
    ));
}
add_action('init', 'register_custom_taxonomy');
```

## Troubleshooting

### Common Issues

**1. Fusion Builder Not Loading:**
```php
// Check builder status
if (function_exists('fusion_is_builder_frame')) {
    if (!fusion_is_builder_frame()) {
        error_log('Fusion Builder frame not detected');
    }
}

// Force regenerate Fusion cache
function force_regenerate_fusion_cache() {
    if (class_exists('Fusion_Cache')) {
        Fusion_Cache::reset_all_caches();
    }

    // Clear compiler cache
    delete_option('fusion_cache_timestamp');

    // Regenerate dynamic CSS
    Fusion_Dynamic_CSS::get_instance()->reset_all_caches();
}

// Add to admin menu for debugging
add_action('admin_menu', function() {
    add_submenu_page(
        'tools.php',
        'Reset Fusion Cache',
        'Reset Fusion Cache',
        'manage_options',
        'reset-fusion-cache',
        'force_regenerate_fusion_cache'
    );
});
```

**2. Dynamic CSS Not Applying:**
```php
// Debug dynamic CSS generation
add_action('init', function() {
    if (current_user_can('manage_options') && isset($_GET['debug_css'])) {
        $css = Fusion_Dynamic_CSS::get_instance();
        $styles = $css->make_css();

        header('Content-Type: text/plain');
        echo $styles;
        exit;
    }
});

// Force CSS regeneration
function force_css_regeneration() {
    $fusion_settings = get_option('fusion_options');
    $fusion_settings['compiler_version'] = time();
    update_option('fusion_options', $fusion_settings);
}
```

**3. Theme Options Not Saving:**
```php
// Check options integrity
function check_avada_options() {
    $options = get_option('fusion_options');

    if (!$options || !is_array($options)) {
        error_log('Avada options corrupted or missing');

        // Backup and restore
        $backup = get_option('fusion_options_backup');
        if ($backup) {
            update_option('fusion_options', $backup);
            return true;
        }
    }

    return false;
}

// Create backup before saving
add_action('update_option_fusion_options', function($old_value, $value) {
    update_option('fusion_options_backup', $old_value);
}, 10, 2);
```

**4. Performance Issues:**
```php
// Identify slow queries
function log_slow_avada_queries() {
    global $wpdb;

    add_filter('query', function($query) use ($wpdb) {
        $start = microtime(true);

        register_shutdown_function(function() use ($start, $query) {
            $time = microtime(true) - $start;

            if ($time > 0.5) { // Log queries > 500ms
                error_log(sprintf(
                    'Slow query (%.2fs): %s',
                    $time,
                    $query
                ));
            }
        });

        return $query;
    });
}
add_action('init', 'log_slow_avada_queries');

// Monitor script loading
add_action('wp_footer', function() {
    if (current_user_can('manage_options')) {
        global $wp_scripts;

        echo '<!-- Loaded Scripts: -->';
        foreach ($wp_scripts->done as $handle) {
            echo "\n<!-- {$handle} -->";
        }
    }
}, 9999);
```

**5. Plugin Conflicts:**
```php
// Detect conflicting plugins
function detect_plugin_conflicts() {
    $known_conflicts = array(
        'wp-rocket/wp-rocket.php' => array(
            'setting' => 'js_defer',
            'message' => 'Disable JS defer in WP Rocket, use Avada JS compiler instead',
        ),
        'autoptimize/autoptimize.php' => array(
            'setting' => 'css_optimization',
            'message' => 'Use Avada CSS cache instead of Autoptimize',
        ),
    );

    $active_plugins = get_option('active_plugins');

    foreach ($known_conflicts as $plugin => $conflict) {
        if (in_array($plugin, $active_plugins)) {
            add_action('admin_notices', function() use ($conflict) {
                printf(
                    '<div class="notice notice-warning"><p>%s</p></div>',
                    esc_html($conflict['message'])
                );
            });
        }
    }
}
add_action('admin_init', 'detect_plugin_conflicts');
```

### Debugging Tools

**Enable Debug Mode:**
```php
// wp-config.php
define('WP_DEBUG', true);
define('WP_DEBUG_LOG', true);
define('WP_DEBUG_DISPLAY', false);
define('SCRIPT_DEBUG', true);

// Avada-specific debugging
define('FUSION_DEBUG', true);
```

**Debug Helper Functions:**
```php
// Log Fusion Builder data
function debug_fusion_builder_data($post_id = null) {
    if (!$post_id) {
        $post_id = get_the_ID();
    }

    $data = array(
        'builder_status' => get_post_meta($post_id, '_fusion_builder_status', true),
        'page_options'   => get_post_meta($post_id, 'pyre_page_options', true),
        'shortcodes'     => get_post_meta($post_id, 'fusion_builder_content', true),
    );

    error_log('Fusion Builder Data: ' . print_r($data, true));
}

// Monitor theme option access
add_filter('fusion_get_option', function($value, $option_name) {
    if (defined('FUSION_DEBUG') && FUSION_DEBUG) {
        error_log("Accessing option: {$option_name} = " . print_r($value, true));
    }
    return $value;
}, 10, 2);
```

## Best Practices

### Update Workflow

**Safe Update Process:**
```bash
# 1. Full site backup
# 2. Test on staging environment
# 3. Check changelog for breaking changes
# 4. Update Avada core
# 5. Update Fusion Builder plugin
# 6. Update Fusion Core (if applicable)
# 7. Clear all caches
# 8. Test critical functionality
# 9. Deploy to production
```

**Pre-Update Checklist:**
```php
// Create pre-update snapshot
function create_update_snapshot() {
    $snapshot = array(
        'theme_version'   => wp_get_theme('Avada')->get('Version'),
        'options'         => get_option('fusion_options'),
        'active_plugins'  => get_option('active_plugins'),
        'php_version'     => phpversion(),
        'wp_version'      => get_bloginfo('version'),
        'timestamp'       => current_time('mysql'),
    );

    update_option('avada_pre_update_snapshot', $snapshot);

    return $snapshot;
}

// Compare post-update
function compare_update_snapshot() {
    $before = get_option('avada_pre_update_snapshot');
    $after = array(
        'theme_version' => wp_get_theme('Avada')->get('Version'),
        'options'       => get_option('fusion_options'),
    );

    $diff = array_diff_assoc($before, $after);

    if (!empty($diff)) {
        error_log('Update changes detected: ' . print_r($diff, true));
    }
}
```

### Backup Strategies

**Automated Backup:**
```php
// Daily theme options backup
function backup_avada_options() {
    $options = get_option('fusion_options');
    $backup_key = 'fusion_options_backup_' . date('Y-m-d');

    update_option($backup_key, $options);

    // Keep last 7 days
    $cutoff = date('Y-m-d', strtotime('-7 days'));

    global $wpdb;
    $wpdb->query($wpdb->prepare(
        "DELETE FROM {$wpdb->options}
         WHERE option_name LIKE 'fusion_options_backup_%'
         AND option_name < %s",
        'fusion_options_backup_' . $cutoff
    ));
}

if (!wp_next_scheduled('daily_avada_backup')) {
    wp_schedule_event(time(), 'daily', 'daily_avada_backup');
}
add_action('daily_avada_backup', 'backup_avada_options');
```

### Staging Environment

**Staging-Specific Settings:**
```php
// Detect staging environment
function is_staging_site() {
    $url = home_url();
    return (
        strpos($url, 'staging') !== false ||
        strpos($url, 'dev.') !== false ||
        strpos($url, '.local') !== false
    );
}

// Disable analytics on staging
if (is_staging_site()) {
    add_filter('fusion_google_analytics', '__return_empty_string');
    add_filter('fusion_google_tagmanager', '__return_empty_string');

    // Show staging notice
    add_action('wp_footer', function() {
        echo '<div style="position:fixed;bottom:0;left:0;right:0;background:#ff0000;color:#fff;text-align:center;padding:10px;z-index:999999;">
            STAGING ENVIRONMENT - NOT LIVE
        </div>';
    });
}
```

## Practical Examples

### Example 1: Custom Landing Page Builder

**Complete landing page with Fusion Builder elements:**

```php
// Register custom landing page template
function register_landing_page_template() {
    add_filter('theme_page_templates', function($templates) {
        $templates['template-landing.php'] = 'Custom Landing Page';
        return $templates;
    });
}
add_action('init', 'register_landing_page_template');

// template-landing.php
<?php
/**
 * Template Name: Custom Landing Page
 */

get_header();

// Remove header elements
remove_action('avada_header', 'avada_header_template');

// Custom hero section
?>
<div class="landing-hero">
    <?php echo do_shortcode('[fusion_builder_container
        hundred_percent="yes"
        overflow="visible"
        background_color="#1a1a1a"
        background_position="center center"
        background_repeat="no-repeat"
        padding_top="120px"
        padding_bottom="120px"]

        [fusion_builder_row]
            [fusion_builder_column type="1_1" spacing="yes"]
                [fusion_title
                    title_type="text"
                    rotation_effect="bounceIn"
                    display_time="1200"
                    highlight_effect="circle"
                    loop_animation="off"
                    highlight_width="9"
                    highlight_top_margin="0"
                    size="1"
                    content_align="center"
                    style_type="default"
                    sep_color=""
                    margin_top="0px"
                    margin_bottom="30px"]
                    Transform Your Business Today
                [/fusion_title]

                [fusion_text]
                    <p style="text-align:center;color:#fff;font-size:20px;">
                        Join thousands of successful companies using our platform
                    </p>
                [/fusion_text]

                [fusion_button
                    link="/signup"
                    title="Get Started"
                    target="_self"
                    alignment="center"
                    modal=""
                    hide_on_mobile="small-visibility,medium-visibility,large-visibility"
                    color="custom"
                    button_gradient_top_color="#ff6b6b"
                    button_gradient_bottom_color="#ff5252"
                    accent_color="#ffffff"
                    type="3d"
                    bevel_color=""
                    border_width=""
                    size="xlarge"
                    stretch="default"
                    icon="fa-rocket fas"
                    icon_position="left"
                    icon_divider="no"]
                    Start Free Trial
                [/fusion_button]
            [/fusion_builder_column]
        [/fusion_builder_row]
    [/fusion_builder_container]'); ?>
</div>

<div class="landing-features">
    <?php echo do_shortcode('[fusion_builder_container]
        [fusion_builder_row]
            [fusion_builder_column type="1_3" spacing="yes"]
                [fusion_fontawesome
                    icon="fa-rocket"
                    size="60px"
                    flip=""
                    rotate=""
                    spin="no"
                    alignment="center"
                    iconcolor="#ff6b6b"]
                [/fusion_fontawesome]

                [fusion_title
                    title_type="text"
                    size="3"
                    content_align="center"]
                    Fast Setup
                [/fusion_title]

                [fusion_text]
                    <p style="text-align:center;">
                        Get started in minutes with our intuitive setup wizard.
                    </p>
                [/fusion_text]
            [/fusion_builder_column]

            [fusion_builder_column type="1_3" spacing="yes"]
                [fusion_fontawesome
                    icon="fa-shield-alt"
                    size="60px"
                    alignment="center"
                    iconcolor="#ff6b6b"]
                [/fusion_fontawesome]

                [fusion_title
                    title_type="text"
                    size="3"
                    content_align="center"]
                    Secure & Reliable
                [/fusion_title]

                [fusion_text]
                    <p style="text-align:center;">
                        Enterprise-grade security with 99.9% uptime guarantee.
                    </p>
                [/fusion_text]
            [/fusion_builder_column]

            [fusion_builder_column type="1_3" spacing="yes" last="yes"]
                [fusion_fontawesome
                    icon="fa-headset"
                    size="60px"
                    alignment="center"
                    iconcolor="#ff6b6b"]
                [/fusion_fontawesome]

                [fusion_title
                    title_type="text"
                    size="3"
                    content_align="center"]
                    24/7 Support
                [/fusion_title]

                [fusion_text]
                    <p style="text-align:center;">
                        Our expert team is always here to help you succeed.
                    </p>
                [/fusion_text]
            [/fusion_builder_column]
        [/fusion_builder_row]
    [/fusion_builder_container]'); ?>
</div>

<?php
get_footer();
```

### Example 2: Dynamic Pricing Table

**Fusion Builder pricing table with dynamic content:**

```php
// Custom pricing table element
function register_pricing_table_element() {
    fusion_builder_map(
        fusion_builder_frontend_data(
            'FusionSC_PricingTable',
            array(
                'name'          => esc_attr__('Dynamic Pricing Table', 'fusion-builder'),
                'shortcode'     => 'dynamic_pricing_table',
                'icon'          => 'fusiona-dollar',
                'preview'       => FUSION_BUILDER_PLUGIN_DIR . 'inc/templates/previews/fusion-pricing-table-preview.php',
                'preview_id'    => 'fusion-builder-block-module-pricing-table-preview-template',
                'allow_generator' => true,
                'params'        => array(
                    array(
                        'type'        => 'select',
                        'heading'     => esc_attr__('Plan Type', 'fusion-builder'),
                        'param_name'  => 'plan_type',
                        'value'       => array(
                            'basic'       => esc_attr__('Basic', 'fusion-builder'),
                            'pro'         => esc_attr__('Pro', 'fusion-builder'),
                            'enterprise'  => esc_attr__('Enterprise', 'fusion-builder'),
                        ),
                        'default'     => 'basic',
                    ),
                    array(
                        'type'        => 'radio_button_set',
                        'heading'     => esc_attr__('Billing Cycle', 'fusion-builder'),
                        'param_name'  => 'billing_cycle',
                        'value'       => array(
                            'monthly'  => esc_attr__('Monthly', 'fusion-builder'),
                            'yearly'   => esc_attr__('Yearly', 'fusion-builder'),
                        ),
                        'default'     => 'monthly',
                    ),
                    array(
                        'type'        => 'colorpickeralpha',
                        'heading'     => esc_attr__('Accent Color', 'fusion-builder'),
                        'param_name'  => 'accent_color',
                        'value'       => '',
                        'default'     => Avada()->settings->get('primary_color'),
                    ),
                ),
            )
        )
    );
}
add_action('fusion_builder_before_init', 'register_pricing_table_element');

// Pricing table shortcode
function fusion_sc_dynamic_pricing_table($atts) {
    extract(shortcode_atts(array(
        'plan_type'      => 'basic',
        'billing_cycle'  => 'monthly',
        'accent_color'   => Avada()->settings->get('primary_color'),
    ), $atts, 'dynamic_pricing_table'));

    // Pricing data
    $pricing = array(
        'basic' => array(
            'name'     => 'Basic Plan',
            'monthly'  => 29,
            'yearly'   => 290,
            'features' => array(
                '10 Projects',
                '5 GB Storage',
                'Email Support',
                'Basic Analytics',
            ),
        ),
        'pro' => array(
            'name'     => 'Pro Plan',
            'monthly'  => 79,
            'yearly'   => 790,
            'features' => array(
                'Unlimited Projects',
                '50 GB Storage',
                'Priority Support',
                'Advanced Analytics',
                'Team Collaboration',
            ),
        ),
        'enterprise' => array(
            'name'     => 'Enterprise Plan',
            'monthly'  => 199,
            'yearly'   => 1990,
            'features' => array(
                'Unlimited Everything',
                '500 GB Storage',
                '24/7 Phone Support',
                'Custom Analytics',
                'Dedicated Manager',
                'API Access',
            ),
        ),
    );

    $plan = $pricing[$plan_type];
    $price = $plan[$billing_cycle];
    $period = ('monthly' === $billing_cycle) ? 'mo' : 'yr';
    $savings = ('yearly' === $billing_cycle) ? round((1 - ($plan['yearly'] / ($plan['monthly'] * 12))) * 100) : 0;

    $html = '<div class="fusion-pricing-table" style="border-top: 4px solid ' . esc_attr($accent_color) . ';">';

    // Header
    $html .= '<div class="pricing-header">';
    $html .= '<h3>' . esc_html($plan['name']) . '</h3>';

    if ($savings > 0) {
        $html .= '<span class="savings-badge" style="background-color: ' . esc_attr($accent_color) . ';">Save ' . $savings . '%</span>';
    }

    $html .= '</div>';

    // Price
    $html .= '<div class="pricing-price">';
    $html .= '<span class="currency">$</span>';
    $html .= '<span class="amount">' . number_format($price) . '</span>';
    $html .= '<span class="period">/' . $period . '</span>';
    $html .= '</div>';

    // Features
    $html .= '<ul class="pricing-features">';
    foreach ($plan['features'] as $feature) {
        $html .= '<li><i class="fa fa-check" style="color: ' . esc_attr($accent_color) . ';"></i> ' . esc_html($feature) . '</li>';
    }
    $html .= '</ul>';

    // Button
    $html .= '<div class="pricing-button">';
    $html .= do_shortcode('[fusion_button
        link="/checkout?plan=' . $plan_type . '&cycle=' . $billing_cycle . '"
        title="Choose Plan"
        target="_self"
        alignment="center"
        modal=""
        color="custom"
        button_gradient_top_color="' . $accent_color . '"
        button_gradient_bottom_color="' . $accent_color . '"
        accent_color="#ffffff"
        type="flat"
        size="large"
        stretch="yes"]
        Choose Plan
    [/fusion_button]');
    $html .= '</div>';

    $html .= '</div>';

    return $html;
}
add_shortcode('dynamic_pricing_table', 'fusion_sc_dynamic_pricing_table');

// Usage in Fusion Builder
/*
[dynamic_pricing_table plan_type="pro" billing_cycle="yearly" accent_color="#ff6b6b"]
*/
```

### Example 3: Advanced WooCommerce Product Display

**Custom product grid with Avada integration:**

```php
// Custom WooCommerce product element
function register_custom_product_element() {
    fusion_builder_map(
        fusion_builder_frontend_data(
            'FusionSC_CustomProducts',
            array(
                'name'          => esc_attr__('Custom Product Grid', 'fusion-builder'),
                'shortcode'     => 'custom_product_grid',
                'icon'          => 'fusiona-cart',
                'params'        => array(
                    array(
                        'type'        => 'select',
                        'heading'     => esc_attr__('Product Selection', 'fusion-builder'),
                        'param_name'  => 'selection',
                        'value'       => array(
                            'featured'    => esc_attr__('Featured', 'fusion-builder'),
                            'on_sale'     => esc_attr__('On Sale', 'fusion-builder'),
                            'best_selling' => esc_attr__('Best Selling', 'fusion-builder'),
                            'recent'      => esc_attr__('Recent', 'fusion-builder'),
                        ),
                        'default'     => 'featured',
                    ),
                    array(
                        'type'        => 'range',
                        'heading'     => esc_attr__('Number of Products', 'fusion-builder'),
                        'param_name'  => 'number',
                        'value'       => '8',
                        'min'         => '1',
                        'max'         => '24',
                        'step'        => '1',
                    ),
                    array(
                        'type'        => 'select',
                        'heading'     => esc_attr__('Columns', 'fusion-builder'),
                        'param_name'  => 'columns',
                        'value'       => array(
                            '2' => '2',
                            '3' => '3',
                            '4' => '4',
                            '5' => '5',
                        ),
                        'default'     => '4',
                    ),
                ),
            )
        )
    );
}
add_action('fusion_builder_before_init', 'register_custom_product_element');

// Product grid shortcode
function fusion_sc_custom_product_grid($atts) {
    extract(shortcode_atts(array(
        'selection' => 'featured',
        'number'    => 8,
        'columns'   => 4,
    ), $atts, 'custom_product_grid'));

    // Build query args
    $args = array(
        'post_type'      => 'product',
        'posts_per_page' => intval($number),
        'orderby'        => 'date',
        'order'          => 'DESC',
    );

    switch ($selection) {
        case 'featured':
            $args['tax_query'] = array(
                array(
                    'taxonomy' => 'product_visibility',
                    'field'    => 'name',
                    'terms'    => 'featured',
                ),
            );
            break;

        case 'on_sale':
            $args['post__in'] = array_merge(array(0), wc_get_product_ids_on_sale());
            break;

        case 'best_selling':
            $args['meta_key'] = 'total_sales';
            $args['orderby']  = 'meta_value_num';
            break;
    }

    $products = new WP_Query($args);

    if (!$products->have_posts()) {
        return '<p>No products found.</p>';
    }

    $html = '<div class="custom-product-grid columns-' . esc_attr($columns) . '">';

    while ($products->have_posts()) {
        $products->the_post();
        global $product;

        $html .= '<div class="product-item">';

        // Product image
        $html .= '<div class="product-image">';

        if ($product->is_on_sale()) {
            $html .= '<span class="onsale">Sale</span>';
        }

        $html .= '<a href="' . get_permalink() . '">';
        $html .= get_the_post_thumbnail(get_the_ID(), 'woocommerce_thumbnail');
        $html .= '</a>';

        // Quick view button
        $html .= '<div class="product-actions">';
        $html .= '<button class="quick-view" data-product-id="' . get_the_ID() . '">Quick View</button>';
        $html .= '</div>';

        $html .= '</div>';

        // Product info
        $html .= '<div class="product-info">';

        // Title
        $html .= '<h3 class="product-title"><a href="' . get_permalink() . '">' . get_the_title() . '</a></h3>';

        // Rating
        if ($rating_html = wc_get_rating_html($product->get_average_rating())) {
            $html .= '<div class="product-rating">' . $rating_html . '</div>';
        }

        // Price
        $html .= '<div class="product-price">' . $product->get_price_html() . '</div>';

        // Add to cart
        $html .= '<div class="product-add-to-cart">';
        $html .= do_shortcode('[add_to_cart id="' . get_the_ID() . '" style="border"]');
        $html .= '</div>';

        $html .= '</div>';

        $html .= '</div>';
    }

    $html .= '</div>';

    wp_reset_postdata();

    return $html;
}
add_shortcode('custom_product_grid', 'fusion_sc_custom_product_grid');

// Add dynamic CSS for product grid
add_filter('fusion_dynamic_css_final', function($css) {
    $css['global']['.custom-product-grid'] = array(
        'display'               => 'grid',
        'gap'                   => '30px',
        'margin-bottom'         => '40px',
    );

    $css['global']['.custom-product-grid.columns-2'] = array(
        'grid-template-columns' => 'repeat(2, 1fr)',
    );

    $css['global']['.custom-product-grid.columns-3'] = array(
        'grid-template-columns' => 'repeat(3, 1fr)',
    );

    $css['global']['.custom-product-grid.columns-4'] = array(
        'grid-template-columns' => 'repeat(4, 1fr)',
    );

    $css['media']['@media only screen and (max-width: 768px)']['.custom-product-grid'] = array(
        'grid-template-columns' => 'repeat(2, 1fr)',
        'gap'                   => '20px',
    );

    $css['media']['@media only screen and (max-width: 640px)']['.custom-product-grid'] = array(
        'grid-template-columns' => '1fr',
    );

    return $css;
});
```

## Summary

The Avada WordPress Theme Expert skill provides:

1. **Complete Architecture Understanding** - Theme structure, Fusion core, options system
2. **Fusion Builder Mastery** - Custom elements, containers, responsive design
3. **Customization Techniques** - Theme options, page options, dynamic CSS
4. **Performance Optimization** - Avada-specific caching, script optimization, lazy loading
5. **Common Patterns** - Header/footer customization, portfolio, WooCommerce integration
6. **Child Theme Development** - Setup, function overrides, template customization
7. **Troubleshooting** - Common issues, debugging tools, conflict resolution
8. **Best Practices** - Update workflow, backup strategies, staging environment

Use this skill when working with Avada theme projects to leverage comprehensive Avada-specific knowledge and proven patterns.
