<?php
defined('ABSPATH') || exit;

add_action('rest_api_init', function () {
    register_rest_route('twl/v1', '/contact', [
        'methods'             => 'POST',
        'permission_callback' => '__return_true',
        'callback'            => 'twl_rest_contact',
    ]);
});

function twl_rest_contact(WP_REST_Request $req) {
    $data = $req->get_json_params() ?: $req->get_params();

    // Honeypot
    if (!empty($data['website_url'])) {
        return rest_ensure_response(['ok' => true]);
    }

    $name    = sanitize_text_field($data['name'] ?? '');
    $email   = sanitize_email($data['email'] ?? '');
    $phone   = sanitize_text_field($data['phone'] ?? '');
    $subject = sanitize_text_field($data['subject'] ?? '');
    $message = sanitize_textarea_field($data['message'] ?? '');

    if (!$name || !$email || !$message) {
        return new WP_Error('twl_missing_fields', 'Name, email, and message are required.', ['status' => 422]);
    }

    $admin_email = get_option('admin_email');
    $mail_subject = $subject
        ? sprintf('[The Watch Locator] Contact: %s', $subject)
        : '[The Watch Locator] New Contact Enquiry';

    $body = sprintf(
        "New contact form submission:\n\nName: %s\nEmail: %s\nPhone: %s\nSubject: %s\n\nMessage:\n%s",
        $name, $email, $phone, $subject, $message
    );

    wp_mail($admin_email, $mail_subject, $body, ['Reply-To: ' . $name . ' <' . $email . '>']);

    return rest_ensure_response(['ok' => true]);
}
