<?php
class SEO_Analyzer {
    
    // 🔥 LINE 4 - RAILWAY URL YAHA DAALO
    private $api_url = 'https://web-production-cf0cb.up.railway.app/api/seo/analyze';
    
    public function init() {
        add_action('wp_ajax_analyze_url', array($this, 'handle_analyze'));
    }
    
    public function handle_analyze() {
        check_ajax_referer('seo_analyzer_nonce', 'nonce');
        
        if (!current_user_can('manage_options')) {
            wp_send_json_error('Unauthorized');
            return;
        }
        
        $url = isset($_POST['url']) ? sanitize_url($_POST['url']) : '';
        
        if (empty($url)) {
            wp_send_json_error('URL required');
            return;
        }
        
        // Call Railway API
        $report = $this->call_api($url);
        
        if (isset($report['error'])) {
            wp_send_json_error($report['error']);
            return;
        }
        
        $this->save_report($report);
        wp_send_json_success($report);
    }
    
    // 🔥 RAILWAY API CALL
    private function call_api($url) {
        $response = wp_remote_post($this->api_url, array(
            'body' => json_encode(array('url' => $url)),
            'headers' => array('Content-Type' => 'application/json'),
            'timeout' => 60
        ));
        
        if (is_wp_error($response)) {
            return array('error' => 'Connection failed: ' . $response->get_error_message());
        }
        
        $code = wp_remote_retrieve_response_code($response);
        if ($code !== 200) {
            return array('error' => 'API error code: ' . $code);
        }
        
        $body = wp_remote_retrieve_body($response);
        $data = json_decode($body, true);
        
        if (json_last_error() !== JSON_ERROR_NONE) {
            return array('error' => 'Invalid JSON response');
        }
        
        return $data;
    }
    
    private function save_report($report) {
        global $wpdb;
        $table = $wpdb->prefix . 'seo_reports';
        
        $wpdb->insert($table, array(
            'report_id' => $report['id'],
            'url' => $report['url'],
            'seo_score' => floatval($report['seo_score']),
            'title' => $report['title'],
            'meta_description' => $report['meta_description'],
            'report_data' => json_encode($report),
            'created_at' => current_time('mysql')
        ));
    }
}
?>
