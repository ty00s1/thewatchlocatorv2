<?php
// Headless theme — Next.js owns the frontend. Direct visits get redirected by inc/redirect.php.
http_response_code(404);
echo 'Headless mode — visit the Next.js frontend.';
