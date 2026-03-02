<?php
/**
 * SEO Analyzer Frontend Template - Updated
 */
if (!defined('ABSPATH')) exit;
?>
<div class="seo-analyzer-wrap">
    <div class="analyzer-header">
        <h1>🚀 AI SEO Analyzer</h1>
        <p>Complete SEO audit with AI-powered recommendations</p>
    </div>

    <div class="analyzer-form">
        <div class="form-group">
            <label for="analyze-url"><span class="label-icon">🔗</span> Enter Website URL to Analyze</label>
            <input type="hidden" id="seo-analyzer-nonce" value="<?php echo wp_create_nonce('seo_analyzer_nonce'); ?>" />
            <div class="input-wrapper">
                <input type="url" id="analyze-url" placeholder="https://example.com" required>
                <button id="analyze-btn" class="btn-primary">
                    <span class="btn-text">Analyze SEO</span>
                    <span class="btn-loader" style="display:none;"><span class="spinner"></span> Analyzing...</span>
                </button>
            </div>
        </div>
        <div id="error-message" class="error-msg" style="display:none;"></div>
    </div>

    <div id="results-container" style="display:none;">

        <!-- SCORE CARD -->
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
                    <div class="analyzed-url"><strong>Analyzed URL:</strong> <span id="analyzed-url"></span></div>
                </div>
            </div>
        </div>

        <!-- QUICK STATS -->
        <div class="stats-grid">
            <div class="stat-card"><div class="stat-icon">📝</div><div class="stat-content"><div class="stat-value" id="word-count">0</div><div class="stat-label">Words</div></div></div>
            <div class="stat-card"><div class="stat-icon">🖼️</div><div class="stat-content"><div class="stat-value" id="image-count">0</div><div class="stat-label">Images</div></div></div>
            <div class="stat-card"><div class="stat-icon">🔗</div><div class="stat-content"><div class="stat-value" id="link-count">0</div><div class="stat-label">Links</div></div></div>
            <div class="stat-card"><div class="stat-icon">⚡</div><div class="stat-content"><div class="stat-value" id="load-time">0s</div><div class="stat-label">Load Time</div></div></div>
        </div>

        <!-- SECTION 1: SEO ISSUES -->
        <div class="seo-section">
            <div class="section-header collapsible active" data-target="seo-issues">
                <h2><span class="toggle-icon">▼</span><span class="section-icon">⚠️</span> SEO Issues & Recommendations <span class="badge" id="issues-count">0</span></h2>
            </div>
            <div id="seo-issues" class="section-content"><div id="issues-list"></div></div>
        </div>

        <!-- SECTION 2: BASIC SEO -->
        <div class="seo-section">
            <div class="section-header collapsible" data-target="basic-seo">
                <h2><span class="toggle-icon">▶</span><span class="section-icon">📄</span> Basic SEO</h2>
            </div>
            <div id="basic-seo" class="section-content" style="display:none;">
                <div id="basic-seo-content"></div>
            </div>
        </div>

        <!-- SECTION 3: TECHNICAL SEO -->
        <div class="seo-section">
            <div class="section-header collapsible" data-target="technical-seo">
                <h2><span class="toggle-icon">▶</span><span class="section-icon">🛠️</span> Technical SEO (Advanced)</h2>
            </div>
            <div id="technical-seo" class="section-content" style="display:none;">
                <div class="tech-grid">
                    <div class="tech-item"><h4>🔗 Canonical Tag</h4><div id="canonical-status"></div></div>
                    <div class="tech-item"><h4>🔒 SSL Certificate</h4><div id="ssl-status"></div></div>
                    <div class="tech-item"><h4>🤖 Robots & Sitemap</h4><div id="robots-status"></div></div>
                    <div class="tech-item"><h4>📋 Schema Markup</h4><div id="schema-status"></div></div>
                </div>
            </div>
        </div>

        <!-- SECTION 4: KEYWORDS & BACKLINKS -->
        <div class="seo-section">
            <div class="section-header collapsible" data-target="kw-backlinks">
                <h2><span class="toggle-icon">▶</span><span class="section-icon">🎯</span> Keywords & Backlinks</h2>
            </div>
            <div id="kw-backlinks" class="section-content" style="display:none;">
                <div id="keyword-strategy-content"></div>
            </div>
        </div>

        <!-- SECTION 5: INTERNAL LINKING -->
        <div class="seo-section">
            <div class="section-header collapsible" data-target="linking">
                <h2><span class="toggle-icon">▶</span><span class="section-icon">🔗</span> Internal Linking Analysis</h2>
            </div>
            <div id="linking" class="section-content" style="display:none;">
                <div id="linking-content"></div>
            </div>
        </div>

        <!-- SECTION 6: EXTERNAL LINKS & SOCIAL MEDIA -->
        <div class="seo-section">
            <div class="section-header collapsible" data-target="external-links">
                <h2><span class="toggle-icon">▶</span><span class="section-icon">🌐</span> Backlinks & External Links</h2>
            </div>
            <div id="external-links" class="section-content" style="display:none;">
                <div id="backlink-content"></div>
            </div>
        </div>

        <!-- SECTION 7: RECOMMENDATIONS -->
        <div class="seo-section">
            <div class="section-header collapsible" data-target="recommendations">
                <h2><span class="toggle-icon">▶</span><span class="section-icon">⚠️</span> Recommendations & Competitive Landscape</h2>
            </div>
            <div id="recommendations" class="section-content" style="display:none;">
                <div id="recommendations-content"></div>
            </div>
        </div>

        <!-- SECTION 8: CONTENT RECOMMENDATIONS -->
        <div class="seo-section">
            <div class="section-header collapsible" data-target="content-rec">
                <h2><span class="toggle-icon">▶</span><span class="section-icon">📝</span> Content Recommendations</h2>
            </div>
            <div id="content-rec" class="section-content" style="display:none;">
                <div id="content-rec-content"></div>
            </div>
        </div>

        <!-- SECTION 9: ADVANCED ANALYTICS -->
        <div class="seo-section">
            <div class="section-header collapsible" data-target="advanced-analytics">
                <h2><span class="toggle-icon">▶</span><span class="section-icon">📈</span> Advanced Analytics</h2>
            </div>
            <div id="advanced-analytics" class="section-content" style="display:none;">
                <div id="readability-content"></div>
                <div id="keyword-density-content"></div>
            </div>
        </div>

        <!-- SECTION 10: PAGE SPEED -->
        <div class="seo-section">
            <div class="section-header collapsible" data-target="page-speed">
                <h2><span class="toggle-icon">▶</span><span class="section-icon">⚡</span> Page Speed & Performance</h2>
            </div>
            <div id="page-speed" class="section-content" style="display:none;">
                <div id="speed-content"></div>
            </div>
        </div>

        <!-- SECTION 11: ACTION PLAN -->
        <div class="seo-section">
            <div class="section-header collapsible" data-target="action-plan">
                <h2><span class="toggle-icon">▶</span><span class="section-icon">📅</span> 30-Day Action Plan</h2>
            </div>
            <div id="action-plan" class="section-content" style="display:none;">
                <div id="action-content"></div>
            </div>
        </div>

    </div><!-- end results-container -->
</div><!-- end seo-analyzer-wrap -->
