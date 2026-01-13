<?php
/**
 * Admin Settings Page Template
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}
?>

<div class="wrap">
    <h1><?php echo esc_html(get_admin_page_title()); ?></h1>

    <form method="post" action="options.php">
        <?php settings_fields('ada_accessibility_settings'); ?>

        <table class="form-table" role="presentation">
            <tr>
                <th scope="row">
                    <label for="ada_access_position"><?php _e('Widget Position', 'ada-accessibility'); ?></label>
                </th>
                <td>
                    <select name="ada_access_position" id="ada_access_position">
                        <option value="right" <?php selected(get_option('ada_access_position', 'right'), 'right'); ?>>
                            <?php _e('Right Side', 'ada-accessibility'); ?>
                        </option>
                        <option value="left" <?php selected(get_option('ada_access_position'), 'left'); ?>>
                            <?php _e('Left Side', 'ada-accessibility'); ?>
                        </option>
                    </select>
                    <p class="description"><?php _e('Choose which side of the screen the accessibility button appears.', 'ada-accessibility'); ?></p>
                </td>
            </tr>

            <tr>
                <th scope="row">
                    <label for="ada_access_primary_color"><?php _e('Primary Color', 'ada-accessibility'); ?></label>
                </th>
                <td>
                    <input type="color" name="ada_access_primary_color" id="ada_access_primary_color"
                           value="<?php echo esc_attr(get_option('ada_access_primary_color', '#0066cc')); ?>">
                    <p class="description"><?php _e('Choose the primary color for the accessibility widget.', 'ada-accessibility'); ?></p>
                </td>
            </tr>

            <tr>
                <th scope="row">
                    <label for="ada_access_button_size"><?php _e('Button Size', 'ada-accessibility'); ?></label>
                </th>
                <td>
                    <select name="ada_access_button_size" id="ada_access_button_size">
                        <option value="large" <?php selected(get_option('ada_access_button_size', 'large'), 'large'); ?>>
                            <?php _e('Large (Recommended for Seniors)', 'ada-accessibility'); ?>
                        </option>
                        <option value="medium" <?php selected(get_option('ada_access_button_size'), 'medium'); ?>>
                            <?php _e('Medium', 'ada-accessibility'); ?>
                        </option>
                        <option value="small" <?php selected(get_option('ada_access_button_size'), 'small'); ?>>
                            <?php _e('Small', 'ada-accessibility'); ?>
                        </option>
                    </select>
                    <p class="description"><?php _e('For senior living sites, we recommend using Large for better visibility.', 'ada-accessibility'); ?></p>
                </td>
            </tr>
        </table>

        <?php submit_button(); ?>
    </form>

    <hr>

    <h2><?php _e('About C&C ADA Accessibility', 'ada-accessibility'); ?></h2>
    <p><?php _e('This accessibility widget is designed specifically for seniors and senior living communities. It provides easy-to-use tools to help visitors with:', 'ada-accessibility'); ?></p>
    <ul style="list-style: disc; margin-left: 20px;">
        <li><?php _e('Vision impairments (contrast modes, text sizing)', 'ada-accessibility'); ?></li>
        <li><?php _e('Reading difficulties (dyslexia font, reading guides)', 'ada-accessibility'); ?></li>
        <li><?php _e('Motor impairments (large cursor, keyboard navigation)', 'ada-accessibility'); ?></li>
        <li><?php _e('Cognitive needs (pause animations, simplified interface)', 'ada-accessibility'); ?></li>
    </ul>
</div>
