<?php
defined('ABSPATH') || exit;

function twl_allowed_origin() {
    $origin = isset($_SERVER['HTTP_ORIGIN']) ? $_SERVER['HTTP_ORIGIN'] : '';
    $allowed = [
        getenv('FRONTEND_ORIGIN') ?: 'http://localhost:3001',
        'http://localhost:3000',
        'http://localhost:3001',
    ];
    return in_array($origin, $allowed, true) ? $origin : '';
}

function twl_send_cors_headers() {
    $origin = twl_allowed_origin();
    if ($origin === '') return;

    header('Access-Control-Allow-Origin: ' . $origin);
    header('Vary: Origin');
    header('Access-Control-Allow-Credentials: true');
    header('Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS');
    header('Access-Control-Allow-Headers: Authorization, Content-Type, Cart-Token, X-WP-Nonce, Nonce');
    header('Access-Control-Expose-Headers: Cart-Token, Link, X-WP-Total, X-WP-TotalPages');
}

// Open CORS for the REST API (Store API + WP REST + custom routes).
add_action('rest_api_init', function () {
    remove_filter('rest_pre_serve_request', 'rest_send_cors_headers');
    add_filter('rest_pre_serve_request', function ($served) {
        twl_send_cors_headers();
        return $served;
    }, 10, 1);
}, 15);

// Handle preflight even when WP routes the request before the REST stack runs.
add_action('init', function () {
    if (($_SERVER['REQUEST_METHOD'] ?? '') === 'OPTIONS') {
        twl_send_cors_headers();
        status_header(204);
        exit;
    }
}, 0);
