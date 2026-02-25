<?php
/**
 * SEO Analyzer Frontend Template
 * Displays comprehensive SEO analysis with collapsible sections
 */

if (!defined('ABSPATH')) exit;
?>

<div class="seo-analyzer-wrap">
    <div class="analyzer-header">
        <h1>🚀 AI SEO Analyzer</h1>
        <p>Complete SEO audit with AI-powered recommendations</p>
    </div>

    <!-- URL Input Section -->
    <div class="analyzer-form">
        <div class="form-group">
            <label for="analyze-url">
                <span class="label-icon">🔗</span>
                Enter Website URL to Analyze
            </label>
            <!-- ADD THIS HIDDEN FIELD -->
            <input type="hidden" id="seo-analyzer-nonce" value="<?php echo
            wp_create_nonce('seo_analyzer_nonce'); ?>" />

            <div class="input-wrapper">
                <input 
                    type="url" 
                    id="analyze-url" 
                    placeholder="https://example.com" 
                    required
                >
                <button id="analyze-btn" class="btn-primary">
                    <span class="btn-text">Analyze SEO</span>
                    <span class="btn-loader" style="display:none;">
                        <span class="spinner"></span> Analyzing...
                    </span>
                </button>
            </div>
        </div>
        <div id="error-message" class="error-msg" style="display:none;"></div>
    </div>

    <!-- Results Container -->
    <div id="results-container" style="display:none;">
        
        <!-- Overall Score Section -->
        <div class="score-section">
            <div class="score-card">
                <div class="score-circle">
                    <svg width="200" height="200">
                        <circle cx="100" cy="100" r="90" class="score-bg"></circle>
                        <circle cx="100" cy="100" r="90" class="score-progress" id="score-circle"></circle>
                    </svg>
                    <div class="score-text">
                        <span id="seo-score" class="score-number">0</span>
                        <span class="score-label">SEO Score</span>
                    </div>
                </div>
                <div class="score-summary">
                    <h3>Analysis Summary</h3>
                    <p id="analysis-summary"></p>
                    <div class="analyzed-url">
                        <strong>Analyzed URL:</strong> <span id="analyzed-url"></span>
                    </div>
                </div>
            </div>
        </div>

        <!-- Quick Stats Cards -->
        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-icon">📝</div>
                <div class="stat-content">
                    <div class="stat-value" id="word-count">0</div>
                    <div class="stat-label">Words</div>
                </div>
            </div>
            <div class="stat-card">
                <div class="stat-icon">🖼️</div>
                <div class="stat-content">
                    <div class="stat-value" id="image-count">0</div>
                    <div class="stat-label">Images</div>
                </div>
            </div>
            <div class="stat-card">
                <div class="stat-icon">🔗</div>
                <div class="stat-content">
                    <div class="stat-value" id="link-count">0</div>
                    <div class="stat-label">Links</div>
                </div>
            </div>
            <div class="stat-card">
                <div class="stat-icon">⚡</div>
                <div class="stat-content">
                    <div class="stat-value" id="load-time">0s</div>
                    <div class="stat-label">Load Time</div>
                </div>
            </div>
        </div>

        <!-- SEO Issues Section (Collapsible) -->
        <div class="seo-section">
            <div class="section-header collapsible active" data-target="seo-issues">
                <h2>
                    <span class="toggle-icon">▼</span>
                    <span class="section-icon">⚠️</span>
                    SEO Issues & Recommendations
                    <span class="badge" id="issues-count">0</span>
                </h2>
            </div>
            <div id="seo-issues" class="section-content">
                <div id="issues-list"></div>
            </div>
        </div>

        <!-- Technical SEO Section (Collapsible) -->
        <div class="seo-section">
            <div class="section-header collapsible" data-target="technical-seo">
                <h2>
                    <span class="toggle-icon">▶</span>
                    <span class="section-icon">🔧</span>
                    Technical SEO Analysis
                </h2>
            </div>
            <div id="technical-seo" class="section-content" style="display:none;">
                <div class="tech-grid">
                    <div class="tech-item">
                        <h4>🔗 Canonical Tag</h4>
                        <div id="canonical-status"></div>
                    </div>
                    <div class="tech-item">
                        <h4>🤖 Robots & Crawling</h4>
                        <div id="robots-status"></div>
                    </div>
                    <div class="tech-item">
                        <h4>🔒 Security (SSL)</h4>
                        <div id="ssl-status"></div>
                    </div>
                    <div class="tech-item">
                        <h4>📋 Structured Data</h4>
                        <div id="schema-status"></div>
                    </div>
                </div>
            </div>
        </div>

        <!-- On-Page SEO Section (Collapsible) -->
        <div class="seo-section">
            <div class="section-header collapsible" data-target="onpage-seo">
                <h2>
                    <span class="toggle-icon">▶</span>
                    <span class="section-icon">📄</span>
                    On-Page SEO Elements
                </h2>
            </div>
            <div id="onpage-seo" class="section-content" style="display:none;">
                <div class="onpage-grid">
                    <div class="onpage-item">
                        <h4>Title Tag</h4>
                        <div class="tag-box" id="title-tag"></div>
                    </div>
                    <div class="onpage-item">
                        <h4>Meta Description</h4>
                        <div class="tag-box" id="meta-desc"></div>
                    </div>
                    <div class="onpage-item">
                        <h4>Heading Structure</h4>
                        <div id="headings-structure"></div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Readability Analysis (Collapsible) -->
        <div class="seo-section">
            <div class="section-header collapsible" data-target="readability">
                <h2>
                    <span class="toggle-icon">▶</span>
                    <span class="section-icon">📖</span>
                    Readability Analysis
                </h2>
            </div>
            <div id="readability" class="section-content" style="display:none;">
                <div id="readability-content"></div>
            </div>
        </div>

        <!-- Keyword Density (Collapsible) -->
        <div class="seo-section">
            <div class="section-header collapsible" data-target="keywords">
                <h2>
                    <span class="toggle-icon">▶</span>
                    <span class="section-icon">🔑</span>
                    Keyword Analysis
                </h2>
            </div>
            <div id="keywords" class="section-content" style="display:none;">
                <div id="keyword-content"></div>
            </div>
        </div>

        <!-- Page Speed (Collapsible) -->
        <div class="seo-section">
            <div class="section-header collapsible" data-target="page-speed">
                <h2>
                    <span class="toggle-icon">▶</span>
                    <span class="section-icon">⚡</span>
                    Page Speed & Performance
                </h2>
            </div>
            <div id="page-speed" class="section-content" style="display:none;">
                <div id="speed-content"></div>
            </div>
        </div>

        <!-- Internal Linking (Collapsible) -->
        <div class="seo-section">
            <div class="section-header collapsible" data-target="linking">
                <h2>
                    <span class="toggle-icon">▶</span>
                    <span class="section-icon">🔗</span>
                    Internal & External Links
                </h2>
            </div>
            <div id="linking" class="section-content" style="display:none;">
                <div id="linking-content"></div>
            </div>
        </div>

        <!-- Keyword Strategy (Collapsible) -->
        <div class="seo-section">
            <div class="section-header collapsible" data-target="keyword-strategy">
                <h2>
                    <span class="toggle-icon">▶</span>
                    <span class="section-icon">🎯</span>
                    Keyword Strategy
                </h2>
            </div>
            <div id="keyword-strategy" class="section-content" style="display:none;">
                <div id="strategy-content"></div>
            </div>
        </div>

        <!-- Action Plan (Collapsible) -->
        <div class="seo-section">
            <div class="section-header collapsible" data-target="action-plan">
                <h2>
                    <span class="toggle-icon">▶</span>
                    <span class="section-icon">📅</span>
                    30-Day Action Plan
                </h2>
            </div>
            <div id="action-plan" class="section-content" style="display:none;">
                <div id="action-content"></div>
            </div>
        </div>

    </div> <!-- End results-container -->
</div> <!-- End seo-analyzer-wrap -->
<!-- Fallback jQuery Check -->
<script>
console.log('=== SEO Analyzer Template Loaded ===');
console.log('jQuery available:', typeof jQuery !== 'undefined');
console.log('$ available:', typeof $ !== 'undefined');
console.log('seoAnalyzer config:', typeof seoAnalyzer !== 'undefined' ? seoAnalyzer : 'NOT LOADED');

if (typeof jQuery === 'undefined') {
    console.error('CRITICAL: jQuery not loaded when template rendered!');
} else {
    console.log('jQuery version:', jQuery.fn.jquery);
}

// Check if button exists
if (typeof jQuery !== 'undefined') {
    jQuery(document).ready(function($) {
        console.log('Button exists:', $('#analyze-btn').length);
        console.log('Input exists:', $('#analyze-url').length);
    });
}
</script>


