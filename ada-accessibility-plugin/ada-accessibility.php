<?php
/**
 * Plugin Name: C&C ADA Accessibility
 * Plugin URI: https://craftandcommunicate.com
 * Description: A comprehensive accessibility widget by Craft & Communicate, designed for seniors and senior living communities. Provides text sizing, contrast modes, reading guides, and more.
 * Version: 1.3.1
 * Author: Craft & Communicate LLC
 * License: GPL v2 or later
 * Text Domain: ada-accessibility
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}

// Define plugin constants
define('ADA_ACCESS_VERSION', '1.3.1');
define('ADA_ACCESS_PLUGIN_DIR', plugin_dir_path(__FILE__));
define('ADA_ACCESS_PLUGIN_URL', plugin_dir_url(__FILE__));

// Plugin Update Checker - enables auto-updates from GitHub
require_once ADA_ACCESS_PLUGIN_DIR . 'plugin-update-checker/plugin-update-checker.php';
use YahnisElsts\PluginUpdateChecker\v5\PucFactory;

$adaUpdateChecker = PucFactory::buildUpdateChecker(
    'https://github.com/Craft-And-Communicate/ada-accessibility-plugin/',
    __FILE__,
    'ada-accessibility-plugin'
);

// Use release assets (zip files) for updates
$adaUpdateChecker->getVcsApi()->enableReleaseAssets();

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
        add_filter('plugin_action_links_' . plugin_basename(__FILE__), array($this, 'add_settings_link'));
    }

    public function add_settings_link($links) {
        $settings_link = '<a href="' . admin_url('options-general.php?page=ada-accessibility') . '">' . __('Settings', 'ada-accessibility') . '</a>';
        array_unshift($links, $settings_link);
        return $links;
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
            __('C&C ADA Accessibility Settings', 'ada-accessibility'),
            __('C&C Accessibility', 'ada-accessibility'),
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
