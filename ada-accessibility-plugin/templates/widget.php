<?php
/**
 * Widget Template
 * The widget HTML is generated via JavaScript for flexibility
 * This template adds any necessary PHP-rendered elements
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}
?>

<!-- ADA Accessibility Widget Container -->
<div id="ada-accessibility-widget"
     role="region"
     aria-label="<?php esc_attr_e('Accessibility Options', 'ada-accessibility'); ?>">
    <!-- Widget content is injected via JavaScript -->
</div>

<?php
// Add inline styles for custom colors if set
$primary_color = get_option('ada_access_primary_color', '#0066cc');
if ($primary_color !== '#0066cc') :
?>
<style>
    :root {
        --ada-primary: <?php echo esc_attr($primary_color); ?>;
        --ada-primary-hover: <?php echo esc_attr($primary_color); ?>dd;
    }
</style>
<?php endif; ?>
