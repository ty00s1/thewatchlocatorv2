<?php
defined('ABSPATH') || exit;

/**
 * Register the watch_submission CPT for the "Sell Your Watch" form.
 * REST-enabled so the Next.js frontend can POST submissions and the admin can list them.
 */
add_action('init', function () {
    register_post_type('watch_submission', [
        'labels' => [
            'name'          => 'Watch Submissions',
            'singular_name' => 'Watch Submission',
            'menu_name'     => 'Watch Submissions',
            'all_items'     => 'All Submissions',
            'edit_item'     => 'View Submission',
        ],
        'public'              => false,
        'show_ui'             => true,
        'show_in_menu'        => true,
        'show_in_rest'        => true,
        'rest_base'           => 'watch_submission',
        'rest_controller_class' => 'WP_REST_Posts_Controller',
        'menu_icon'           => 'dashicons-clock',
        'supports'            => ['title', 'editor', 'custom-fields'],
        'capability_type'     => 'post',
    ]);

    foreach ([
        '_seller_name', '_seller_email', '_seller_phone',
        '_watch_brand', '_watch_model', '_watch_reference',
        '_watch_year', '_watch_condition',
    ] as $key) {
        register_post_meta('watch_submission', $key, [
            'type'         => 'string',
            'single'       => true,
            'show_in_rest' => true,
            'auth_callback' => '__return_true',
        ]);
    }

    register_post_meta('watch_submission', '_watch_includes', [
        'type'         => 'array',
        'single'       => true,
        'show_in_rest' => [
            'schema' => ['type' => 'array', 'items' => ['type' => 'string']],
        ],
        'auth_callback' => '__return_true',
    ]);
});

/**
 * Custom REST namespace for the submission endpoint — accepts a flat JSON payload
 * (brand, model, etc.) and creates the post + meta in one call. Public, no auth required.
 */
add_action('rest_api_init', function () {
    register_rest_route('twl/v1', '/sell-your-watch', [
        'methods'             => 'POST',
        'permission_callback' => '__return_true',
        'callback'            => 'twl_rest_submit_watch',
    ]);
});

function twl_rest_submit_watch(WP_REST_Request $req) {
    $data = $req->get_json_params() ?: $req->get_params();

    $brand     = sanitize_text_field($data['brand'] ?? '');
    $model     = sanitize_text_field($data['model'] ?? '');
    $reference = sanitize_text_field($data['reference'] ?? '');
    $year      = sanitize_text_field($data['year'] ?? '');
    $condition = sanitize_text_field($data['condition'] ?? '');
    $includes  = is_array($data['includes'] ?? null) ? array_map('sanitize_text_field', $data['includes']) : [];
    $notes     = sanitize_textarea_field($data['notes'] ?? '');
    $name      = sanitize_text_field($data['name'] ?? '');
    $email     = sanitize_email($data['email'] ?? '');
    $phone     = sanitize_text_field($data['phone'] ?? '');

    if (!$brand || !$model || !$condition || !$name || !$email) {
        return new WP_Error('twl_missing_fields', 'Missing required fields.', ['status' => 422]);
    }

    $body = sprintf(
        "Brand: %s\nModel: %s\nReference: %s\nYear: %s\nCondition: %s\nIncludes: %s\n\nNotes:\n%s\n\nContact:\n%s | %s | %s",
        $brand, $model, $reference, $year, $condition,
        implode(', ', $includes), $notes, $name, $email, $phone
    );

    $post_id = wp_insert_post([
        'post_type'    => 'watch_submission',
        'post_title'   => sprintf('%s %s — %s', $brand, $model, $name),
        'post_content' => $body,
        'post_status'  => 'publish',
    ], true);

    if (is_wp_error($post_id)) {
        return $post_id;
    }

    update_post_meta($post_id, '_seller_name', $name);
    update_post_meta($post_id, '_seller_email', $email);
    update_post_meta($post_id, '_seller_phone', $phone);
    update_post_meta($post_id, '_watch_brand', $brand);
    update_post_meta($post_id, '_watch_model', $model);
    update_post_meta($post_id, '_watch_reference', $reference);
    update_post_meta($post_id, '_watch_year', $year);
    update_post_meta($post_id, '_watch_condition', $condition);
    update_post_meta($post_id, '_watch_includes', $includes);

    wp_mail(
        get_option('admin_email'),
        sprintf('[The Watch Locator] New Watch Submission: %s %s', $brand, $model),
        $body . "\n\nView in admin: " . admin_url('post.php?post=' . $post_id . '&action=edit')
    );

    return rest_ensure_response([
        'ok' => true,
        'id' => $post_id,
    ]);
}
