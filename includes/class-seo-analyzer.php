<?php
/**
 * SEO Analyzer Main Class
 * Handles AJAX requests and frontend rendering
 */

class SEO_Analyzer {
    
    private $api_url = 'https://web-production-cf0cb.up.railway.app/api/seo/analyze';
    
    public function init() {
        add_action('wp_ajax_analyze_url', array($this, 'handle_analyze'));
        add_action('wp_ajax_nopriv_analyze_url', array($this, 'handle_analyze'));
        add_shortcode('seo_analyzer', array($this, 'render_frontend'));
    }
    
    public function handle_analyze() {
        check_ajax_referer('seo_analyzer_nonce', 'nonce');
        
        $url = isset($_POST['url']) ? sanitize_url($_POST['url']) : '';
        
        if (empty($url)) {
            wp_send_json_error('URL required');
            return;
        }
        
        // Validate URL format
        if (!filter_var($url, FILTER_VALIDATE_URL)) {
            wp_send_json_error('Invalid URL format');
            return;
        }
        
        $report = $this->call_api($url);
        
        if (isset($report['error'])) {
            wp_send_json_error($report['error']);
            return;
        }
        
        // Save to database
        $this->save_report($report);
        
        wp_send_json_success($report);
    }
    
  private function call_api($url) {
    // Debug logging
    error_log('SEO Analyzer: Starting API call for URL: ' . $url);
    error_log('SEO Analyzer: API Endpoint: ' . $this->api_url);
    
    $response = wp_remote_post($this->api_url, array(
        'body' => json_encode(array('url' => $url)),
        'headers' => array(
            'Content-Type' => 'application/json',
            'Accept' => 'application/json'
        ),
        'timeout' => 180,  // 3 minutes
        'sslverify' => false  // Temporary for debugging
    ));
    
    if (is_wp_error($response)) {
        $error_msg = $response->get_error_message();
        error_log('SEO Analyzer API Error: ' . $error_msg);
        return array('error' => 'Connection failed: ' . $error_msg);
    }
    
    $code = wp_remote_retrieve_response_code($response);
    $body = wp_remote_retrieve_body($response);
    
    error_log('SEO Analyzer API Response Code: ' . $code);
    error_log('SEO Analyzer API Response (first 500 chars): ' . substr($body, 0, 500));
    
    if ($code !== 200) {
        $error_msg = 'API error (code: ' . $code . '): ' . substr($body, 0, 200);
        error_log('SEO Analyzer: ' . $error_msg);
        return array('error' => $error_msg);
    }
    
    $data = json_decode($body, true);
    
    if (json_last_error() !== JSON_ERROR_NONE) {
        $json_error = json_last_error_msg();
        error_log('SEO Analyzer JSON Error: ' . $json_error);
        return array('error' => 'Invalid JSON response: ' . $json_error);
    }
    
    error_log('SEO Analyzer: API call successful!');
    return $data;
}

    private function save_report($report) {
        global $wpdb;
        $table = $wpdb->prefix . 'seo_reports';
        
        // Extract data safely with defaults
        $seo_score = isset($report['seo_score']) ? floatval($report['seo_score']) : 0;
        $title = isset($report['title']) ? sanitize_text_field($report['title']) : '';
        $meta_desc = isset($report['meta_description']) ? sanitize_text_field($report['meta_description']) : '';
        
        $wpdb->insert($table, array(
            'report_id' => sanitize_text_field($report['id']),
            'url' => esc_url_raw($report['url']),
            'seo_score' => $seo_score,
            'title' => $title,
            'meta_description' => $meta_desc,
            'report_data' => wp_json_encode($report),
            'created_at' => current_time('mysql')
        ), array('%s', '%s', '%f', '%s', '%s', '%s', '%s'));
    }
    
    public function render_frontend($atts) {
        ob_start();
        include SEO_ANALYZER_DIR . 'template/analyzerpage.php';
        return ob_get_clean();
    }
}
?>

