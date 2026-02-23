<?php
/**
 * Plugin Name: AI SEO Analyzer
 * Description: Free AI-powered SEO analysis tool
 * Version: 1.0.0
 * Author: Abhishek
 */

if (!defined('ABSPATH')) exit;

define('SEO_ANALYZER_VERSION', '1.0.0');
define('SEO_ANALYZER_DIR', plugin_dir_path(__FILE__));
define('SEO_ANALYZER_URL', plugin_dir_url(__FILE__));

require_once SEO_ANALYZER_DIR . 'includes/class-seo-analyzer.php';

function seo_analyzer_init() {
    $analyzer = new SEO_Analyzer();
    $analyzer->init();
}
add_action('plugins_loaded', 'seo_analyzer_init');

// Database creation
register_activation_hook(__FILE__, 'seo_analyzer_activate');
function seo_analyzer_activate() {
    global $wpdb;
    $table = $wpdb->prefix . 'seo_reports';
    
    $sql = "CREATE TABLE IF NOT EXISTS $table (
        id mediumint(9) NOT NULL AUTO_INCREMENT,
        report_id varchar(100) NOT NULL,
        url varchar(500) NOT NULL,
        seo_score float,
        title text,
        meta_description text,
        report_data longtext,
        created_at datetime DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (id),
        UNIQUE KEY report_id (report_id)
    ) {$wpdb->get_charset_collate()};";
    
    require_once(ABSPATH . 'wp-admin/includes/upgrade.php');
    dbDelta($sql);
}

// Admin menu
add_action('admin_menu', 'seo_analyzer_menu');
function seo_analyzer_menu() {
    add_menu_page(
        'SEO Analyzer',
        'SEO Analyzer',
        'manage_options',
        'seo-analyzer',
        'seo_analyzer_page',
        'dashicons-search',
        30
    );
}

// 🔥 IMPORTANT: "template" not "templates"
function seo_analyzer_page() {
    include SEO_ANALYZER_DIR . 'template/analyzerpage.php';
}

// Assets
add_action('admin_enqueue_scripts', 'seo_analyzer_assets');
function seo_analyzer_assets($hook) {
    if ($hook !== 'toplevel_page_seo-analyzer') return;
    
    wp_enqueue_style(
        'seo-analyzer-css',
        SEO_ANALYZER_URL . 'assets/css/style.css',
        array(),
        SEO_ANALYZER_VERSION
    );
    
    wp_enqueue_script(
        'seo-analyzer-js',
        SEO_ANALYZER_URL . 'assets/js/script.js',
        array('jquery'),
        SEO_ANALYZER_VERSION,
        true
    );
    
    wp_localize_script('seo-analyzer-js', 'seoAnalyzer', array(
        'ajaxurl' => admin_url('admin-ajax.php'),
        'nonce' => wp_create_nonce('seo_analyzer_nonce')
    ));
}
?>
