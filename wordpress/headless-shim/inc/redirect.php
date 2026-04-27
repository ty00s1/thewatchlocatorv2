<?php
defined('ABSPATH') || exit;

/**
 * Send direct frontend visits to the Next.js app, but leave admin, login,
 * REST, and uploads alone so the headless API surface keeps working.
 */
add_action('template_redirect', function () {
    if (is_admin() || wp_doing_ajax() || wp_doing_cron()) return;
    if (defined('REST_REQUEST') && REST_REQUEST) return;

    $uri = $_SERVER['REQUEST_URI'] ?? '/';
    foreach (['/wp-admin', '/wp-login.php', '/wp-json', '/wp-content', '/wp-includes'] as $allow) {
        if (strpos($uri, $allow) === 0) return;
    }

    $frontend = getenv('FRONTEND_ORIGIN') ?: 'http://localhost:3001';
    wp_redirect($frontend . $uri, 302);
    exit;
});
