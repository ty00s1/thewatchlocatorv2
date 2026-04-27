<?php
defined('ABSPATH') || exit;

add_action('rest_api_init', function () {
    register_rest_route('twl/v1', '/repair', [
        'methods'             => 'POST',
        'permission_callback' => '__return_true',
        'callback'            => 'twl_rest_repair',
    ]);
});

function twl_rest_repair(WP_REST_Request $req) {
    $data = $req->get_json_params() ?: $req->get_params();

    if (!empty($data['website_url'])) {
        return rest_ensure_response(['ok' => true]);
    }

    $name      = sanitize_text_field($data['name'] ?? '');
    $phone     = sanitize_text_field($data['phone'] ?? '');
    $email     = sanitize_email($data['email'] ?? '');
    $brand     = sanitize_text_field($data['brand'] ?? '');
    $reference = sanitize_text_field($data['reference'] ?? '');
    $model     = sanitize_text_field($data['model'] ?? '');
    $boxPapers = sanitize_text_field($data['box_papers'] ?? '');
    $service   = sanitize_text_field($data['service'] ?? '');
    $notes     = sanitize_textarea_field($data['notes'] ?? '');

    if (!$name || (!$phone && !$email)) {
        return new WP_Error('twl_missing_fields', 'Name and a phone or email are required.', ['status' => 422]);
    }

    $body = sprintf(
        "New repair request:\n\n" .
        "Name: %s\nPhone: %s\nEmail: %s\n\n" .
        "Brand: %s\nReference: %s\nModel: %s\n" .
        "Box / papers / service card: %s\n" .
        "Service requested: %s\n\nNotes:\n%s",
        $name, $phone, $email,
        $brand, $reference, $model,
        $boxPapers, $service, $notes
    );

    wp_mail(
        get_option('admin_email'),
        sprintf('[The Watch Locator] Repair Request — %s %s', $brand ?: 'Unknown', $model),
        $body,
        $email ? ['Reply-To: ' . $name . ' <' . $email . '>'] : []
    );

    return rest_ensure_response(['ok' => true]);
}
