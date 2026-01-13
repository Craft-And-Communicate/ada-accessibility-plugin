<?php
/**
 * Plugin Name: ADA Accessibility Widget
 * Plugin URI: https://yoursite.com/ada-accessibility
 * Description: A comprehensive accessibility widget designed for seniors and senior living communities. Provides text sizing, contrast modes, reading guides, and more.
 * Version: 1.0.0
 * Author: Your Company
 * License: GPL v2 or later
 * Text Domain: ada-accessibility
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}

// Define plugin constants
define('ADA_ACCESS_VERSION', '1.0.0');
define('ADA_ACCESS_PLUGIN_DIR', plugin_dir_path(__FILE__));
define('ADA_ACCESS_PLUGIN_URL', plugin_dir_url(__FILE__));

class ADA_Accessibility_Widget {

    private static $instance = null;

    public static function get_instance() {
        if (null === self::$instance) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    private function __construct() {
        add_action('wp_enqueue_scripts', array($this, 'enqueue_assets'));
        add_action('wp_footer', array($this, 'render_widget'));
        add_action('admin_menu', array($this, 'add_admin_menu'));
        add_action('admin_init', array($this, 'register_settings'));
    }

    public function enqueue_assets() {
        // Enqueue CSS
        wp_enqueue_style(
            'ada-accessibility-style',
            ADA_ACCESS_PLUGIN_URL . 'assets/css/ada-accessibility.css',
            array(),
            ADA_ACCESS_VERSION
        );

        // Enqueue JavaScript
        wp_enqueue_script(
            'ada-accessibility-script',
            ADA_ACCESS_PLUGIN_URL . 'assets/js/ada-accessibility.js',
            array(),
            ADA_ACCESS_VERSION,
            true
        );

        // Pass settings to JavaScript
        wp_localize_script('ada-accessibility-script', 'adaAccessSettings', array(
            'position' => get_option('ada_access_position', 'right'),
            'primaryColor' => get_option('ada_access_primary_color', '#0066cc'),
            'buttonSize' => get_option('ada_access_button_size', 'large'),
        ));
    }

    public function render_widget() {
        include ADA_ACCESS_PLUGIN_DIR . 'templates/widget.php';
    }

    public function add_admin_menu() {
        add_options_page(
            __('ADA Accessibility Settings', 'ada-accessibility'),
            __('ADA Accessibility', 'ada-accessibility'),
            'manage_options',
            'ada-accessibility',
            array($this, 'render_admin_page')
        );
    }

    public function register_settings() {
        register_setting('ada_accessibility_settings', 'ada_access_position');
        register_setting('ada_accessibility_settings', 'ada_access_primary_color');
        register_setting('ada_accessibility_settings', 'ada_access_button_size');
    }

    public function render_admin_page() {
        include ADA_ACCESS_PLUGIN_DIR . 'templates/admin.php';
    }
}

// Initialize plugin
function ada_accessibility_init() {
    return ADA_Accessibility_Widget::get_instance();
}
add_action('plugins_loaded', 'ada_accessibility_init');
