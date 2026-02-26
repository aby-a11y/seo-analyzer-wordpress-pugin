<?php
/**
 * Plugin Name: SEO Analyzer
 * Description: AI-powered SEO analysis tool for WordPress
 * Version: 1.0.4
 * Author: Abhishek Kumar
 */

if (!defined('ABSPATH')) exit;

define('SEO_ANALYZER_DIR', plugin_dir_path(__FILE__));
define('SEO_ANALYZER_URL', plugin_dir_url(__FILE__));
define('SEO_ANALYZER_VERSION', '1.0.4');

class SEO_Analyzer_Plugin {
    
    private static $instance = null;
    
    public static function get_instance() {
        if (null === self::$instance) {
            self::$instance = new self();
        }
        return self::$instance;
    }
    
    private function __construct() {
        register_activation_hook(__FILE__, array($this, 'activate'));
        add_action('admin_menu', array($this, 'add_admin_menu'));
        
        // CRITICAL: Load assets with highest priority
        add_action('admin_enqueue_scripts', array($this, 'enqueue_assets'), 1);
        add_action('wp_enqueue_scripts', array($this, 'enqueue_frontend_assets'), 1);
        
        $this->load_dependencies();
    }
    
    private function load_dependencies() {
        require_once SEO_ANALYZER_DIR . 'includes/class-seo-analyzer.php';
        $analyzer = new SEO_Analyzer();
        $analyzer->init();
    }
    
    public function activate() {
        global $wpdb;
        $table_name = $wpdb->prefix . 'seo_reports';
        $charset_collate = $wpdb->get_charset_collate();
        
        $sql = "CREATE TABLE IF NOT EXISTS $table_name (
            id mediumint(9) NOT NULL AUTO_INCREMENT,
            report_id varchar(100) NOT NULL,
            url varchar(500) NOT NULL,
            seo_score float DEFAULT 0,
            title text,
            meta_description text,
            report_data longtext,
            created_at datetime DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY  (id),
            KEY report_id (report_id)
        ) $charset_collate;";
        
        require_once(ABSPATH . 'wp-admin/includes/upgrade.php');
        dbDelta($sql);
        flush_rewrite_rules();
    }
    
    public function add_admin_menu() {
        add_menu_page(
            'SEO Analyzer',
            'SEO Analyzer',
            'manage_options',
            'seo-analyzer',
            array($this, 'render_page'),
            'dashicons-search',
            30
        );
    }
    
    // ADMIN ASSETS
    public function enqueue_assets($hook) {
        if ($hook !== 'toplevel_page_seo-analyzer') {
            return;
        }
        
        // Remove ALL conflicting scripts first
        $this->remove_all_conflicts();
        
        // Force load fresh jQuery
        wp_deregister_script('jquery');
        wp_deregister_script('jquery-core');
        wp_deregister_script('jquery-migrate');
        
        wp_enqueue_script('jquery-core', includes_url('/js/jquery/jquery.min.js'), array(), '3.7.1', false);
        wp_enqueue_script('jquery-migrate', includes_url('/js/jquery/jquery-migrate.min.js'), array('jquery-core'), '3.4.1', false);
        wp_enqueue_script('jquery', false, array('jquery-core', 'jquery-migrate'), '3.7.1', false);
        
        // Our assets
    }
}
        // Enqueue CSS
wp_enqueue_style('seo-analyzer-css', SEO_ANALYZER_URL . 'assets/css/style.css', array(), SEO_ANALYZER_VERSION);

// Enqueue JS
wp_enqueue_script('seo-analyzer-js', SEO_ANALYZER_URL . 'assets/js/script.js', array('jquery'), SEO_ANALYZER_VERSION, true);

// CRITICAL: Pass config BEFORE script loads
wp_localize_script('seo-analyzer-js', 'seoAnalyzer', array(
    'ajaxurl' => admin_url('admin-ajax.php'),
    'nonce' => wp_create_nonce('seo_analyzer_nonce')
));

// Also add inline config as backup
wp_add_inline_script('seo-analyzer-js', '
    if (typeof seoAnalyzer === "undefined") {
        window.seoAnalyzer = {
            ajaxurl: "' . admin_url('admin-ajax.php') . '",
            nonce: "' . wp_create_nonce('seo_analyzer_nonce') . '"
        };
        console.log("SEO Analyzer: Inline config injected");
    }
', 'before');

    // FRONTEND ASSETS
    public function enqueue_frontend_assets() {
        global $post;
        
        if (!is_a($post, 'WP_Post') || !has_shortcode($post->post_content, 'seo_analyzer')) {
            return;
        }
        
        // Remove conflicts
        $this->remove_all_conflicts();
        
        // Ensure jQuery loaded properly
        if (!wp_script_is('jquery', 'enqueued')) {
            wp_enqueue_script('jquery');
        }
        
// Enqueue CSS
wp_enqueue_style('seo-analyzer-frontend-css', SEO_ANALYZER_URL . 'assets/css/style.css', array(), SEO_ANALYZER_VERSION);

// Enqueue JS
wp_enqueue_script('seo-analyzer-frontend-js', SEO_ANALYZER_URL . 'assets/js/script.js', array('jquery'), SEO_ANALYZER_VERSION, true);

// Pass config
wp_localize_script('seo-analyzer-frontend-js', 'seoAnalyzer', array(
    'ajaxurl' => admin_url('admin-ajax.php'),
    'nonce' => wp_create_nonce('seo_analyzer_nonce')
));

// Inline backup config
wp_add_inline_script('seo-analyzer-frontend-js', '
    if (typeof seoAnalyzer === "undefined") {
        window.seoAnalyzer = {
            ajaxurl: "' . admin_url('admin-ajax.php') . '",
            nonce: "' . wp_create_nonce('seo_analyzer_nonce') . '"
        };
        console.log("SEO Analyzer: Inline config injected (frontend)");
    }
', 'before');

    
    private function remove_all_conflicts() {
        // Remove conflicting scripts
        $conflicts = array(
            'gform_gravityforms', 'gform_placeholder', 'gform_conditional_logic', 
            'gform_json', 'gform_tooltip', 'lightslider', 'jquery-ui-core',
            'jquery-ui-widget', 'jquery-ui-mouse', 'jquery-ui-datepicker'
        );
        
        foreach ($conflicts as $handle) {
            wp_dequeue_script($handle);
            wp_deregister_script($handle);
        }
        
        // Remove conflicting styles
        $style_conflicts = array('gform_admin', 'gform_tooltip', 'gform_reset', 'lightslider');
        foreach ($style_conflicts as $handle) {
            wp_dequeue_style($handle);
            wp_deregister_style($handle);
        }
    }
    
    public function render_page() {
        echo '<div class="wrap">';
        $analyzer = new SEO_Analyzer();
        echo $analyzer->render_frontend(array());
        echo '</div>';
    }
}

function seo_analyzer_init() {
    return SEO_Analyzer_Plugin::get_instance();
}
add_action('plugins_loaded', 'seo_analyzer_init');
   
