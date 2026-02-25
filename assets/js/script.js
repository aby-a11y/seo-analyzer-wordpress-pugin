/**
 * SEO Analyzer JavaScript - Bulletproof Version
 */

// Wait for window load to ensure all scripts loaded
window.addEventListener('DOMContentLoaded', function() {
    console.log('=== SEO Analyzer: DOM Content Loaded ===');
    
    // Get jQuery reference safely
    var $ = window.jQuery || window.$ || null;
    
    if (!$) {
        console.error('SEO Analyzer: jQuery not found! Retrying...');
        
        // Retry after 500ms
        setTimeout(function() {
            $ = window.jQuery || window.$;
            if ($) {
                console.log('SEO Analyzer: jQuery found on retry!');
                initSEOAnalyzer($);
            } else {
                console.error('SEO Analyzer: jQuery still not found. Plugin cannot work.');
                alert('Error: jQuery library not loaded. Please contact support.');
            }
        }, 500);
        return;
    }
    
    console.log('SEO Analyzer: jQuery found!', 'Version:', $.fn.jquery);
    initSEOAnalyzer($);
});

function initSEOAnalyzer($) {
    'use strict';
    
    console.log('=== SEO Analyzer: Initializing ===');
    
    // Check configuration
    if (typeof seoAnalyzer === 'undefined') {
        console.error('SEO Analyzer: Configuration missing!');
        window.seoAnalyzer = {
            ajaxurl: '/wp-admin/admin-ajax.php',
            nonce: $('#seo-analyzer-nonce').val() || ''
        };
        console.log('SEO Analyzer: Created fallback config');
    }
    
    console.log('Config:', seoAnalyzer);
    
    // Initialize when DOM ready
    $(document).ready(function() {
        console.log('SEO Analyzer: jQuery DOM Ready');
        
        // Check if elements exist
        var button = $('#analyze-btn');
        var input = $('#analyze-url');
        
        console.log('Button found:', button.length > 0);
        console.log('Input found:', input.length > 0);
        
        if (button.length === 0) {
            console.error('SEO Analyzer: Button not found!');
            return;
        }
        
        initializeAnalyzer();
        setupCollapsibleSections();
        
        console.log('=== SEO Analyzer: Initialization Complete ===');
    });

 

    /**
     * Initialize analyzer functionality
     */
    function initializeAnalyzer() {
        $('#analyze-btn').on('click', function(e) {
            e.preventDefault();
            const url = $('#analyze-url').val().trim();
            
            if (!url) {
                showError('Please enter a URL');
                return;
            }
            
            if (!isValidURL(url)) {
                showError('Please enter a valid URL (e.g., https://example.com)');
                return;
            }
            
            analyzeURL(url);
        });

        // Enter key support
        $('#analyze-url').on('keypress', function(e) {
            if (e.which === 13) {
                $('#analyze-btn').click();
            }
        });
    }

    /**
     * Validate URL format
     */
    function isValidURL(string) {
        try {
            const url = new URL(string);
            return url.protocol === 'http:' || url.protocol === 'https:';
        } catch (_) {
            return false;
        }
    }

    /**
     * Show error message
     */
    function showError(message) {
        $('#error-message').html('<strong>Error:</strong> ' + message).fadeIn();
        setTimeout(function() {
            $('#error-message').fadeOut();
        }, 5000);
    }

    /**
     * Main analyze function - AJAX request
     */
    function analyzeURL(url) {
        // Show loading state
        $('#analyze-btn').prop('disabled', true);
        $('.btn-text').hide();
        $('.btn-loader').show();
        $('#error-message').hide();
        $('#results-container').hide();

        $.ajax({
            url: seoAnalyzer.ajaxurl,
            type: 'POST',
            data: {
                action: 'analyze_url',
                url: url,
                nonce: seoAnalyzer.nonce
            },
            timeout: 120000, // 2 minutes timeout
            success: function(response) {
                if (response.success) {
                    displayResults(response.data);
                } else {
                    showError(response.data || 'Analysis failed. Please try again.');
                }
            },
            error: function(xhr, status, error) {
                let errorMsg = 'Connection error. ';
                if (status === 'timeout') {
                    errorMsg += 'Request timed out. The website might be slow to respond.';
                } else {
                    errorMsg += 'Please check your internet connection and try again.';
                }
                showError(errorMsg);
            },
            complete: function() {
                // Reset button state
                $('#analyze-btn').prop('disabled', false);
                $('.btn-text').show();
                $('.btn-loader').hide();
            }
        });
    }
    /**
     * Display all results
     */
    function displayResults(data) {
        console.log('Analysis Data:', data); // Debug
        
        // Show results container
        $('#results-container').fadeIn();
        
        // Scroll to results
        $('html, body').animate({
            scrollTop: $('#results-container').offset().top - 50
        }, 500);

        // Display each section
        displayScoreAndSummary(data);
        displayQuickStats(data);
        displaySEOIssues(data);
        displayTechnicalSEO(data);
        displayOnPageSEO(data);
        displayReadability(data);
        displayKeywordAnalysis(data);
        displayPageSpeed(data);
        displayLinkingAnalysis(data);
        displayKeywordStrategy(data);
        displayActionPlan(data);
    }

    /**
     * Display SEO score and summary
     */
    function displayScoreAndSummary(data) {
        const score = data.seo_score || 0;
        
        // Update score number
        $('#seo-score').text(score);
        $('#analyzed-url').text(data.url || 'N/A');
        $('#analysis-summary').text(data.analysis_summary || 'Analysis completed successfully.');
        
        // Animate score circle
        const circumference = 2 * Math.PI * 90;
        const offset = circumference - (score / 100) * circumference;
        
        $('#score-circle').css({
            'stroke-dasharray': circumference,
            'stroke-dashoffset': circumference
        });
        
        setTimeout(() => {
            $('#score-circle').css('stroke-dashoffset', offset);
        }, 100);
        
        // Set color based on score
        let color = '#ef4444'; // Red
        if (score >= 80) color = '#22c55e'; // Green
        else if (score >= 60) color = '#f59e0b'; // Orange
        
        $('#score-circle').css('stroke', color);
    }

    /**
     * Display quick stats cards
     */
    function displayQuickStats(data) {
        $('#word-count').text(data.word_count || 0);
        $('#image-count').text(data.total_images || 0);
        
        const linkingData = data.linking_analysis || {};
        $('#link-count').text(linkingData.total_links || 0);
        
        const speedData = data.page_speed_analysis || {};
        const loadTime = speedData.total_load_time_seconds || 0;
        $('#load-time').text(loadTime.toFixed(2) + 's');
    }

    /**
     * Display SEO Issues section
     */
    function displaySEOIssues(data) {
        const issues = data.seo_issues || [];
        $('#issues-count').text(issues.length);
        
        if (issues.length === 0) {
            $('#issues-list').html('<div class="no-issues">✅ No critical SEO issues found!</div>');
            return;
        }
        
        let html = '';
        issues.forEach(issue => {
            const priorityClass = issue.priority.toLowerCase();
            const priorityIcon = getPriorityIcon(issue.priority);
            
            html += `
                <div class="issue-card priority-${priorityClass}">
                    <div class="issue-header">
                        <span class="priority-badge">${priorityIcon} ${issue.priority}</span>
                        <span class="issue-category">${issue.category}</span>
                    </div>
                    <div class="issue-content">
                        <h4>${issue.issue}</h4>
                        <div class="recommendation">${formatRecommendation(issue.recommendation)}</div>
                    </div>
                </div>
            `;
        });
        
        $('#issues-list').html(html);
    }

    /**
     * Get priority icon
     */
    function getPriorityIcon(priority) {
        const icons = {
            'High': '🔴',
            'Medium': '🟡',
            'Low': '🟢'
        };
        return icons[priority] || '⚪';
    }

    /**
     * Format recommendation text with line breaks
     */
    function formatRecommendation(text) {
        if (!text) return '';
        return text.replace(/\n/g, '<br>').replace(/\\n/g, '<br>');
    }
    /**
     * Display Technical SEO section
     */
    function displayTechnicalSEO(data) {
        const technical = data.technical_seo || {};
        
        // Canonical status
        let canonicalHTML = `
            <div class="status-item ${technical.canonical_status?.includes('✅') ? 'status-good' : 'status-warning'}">
                <strong>Status:</strong> ${technical.canonical_status || 'Not checked'}
            </div>
        `;
        if (technical.canonical_url) {
            canonicalHTML += `<div class="status-item"><strong>URL:</strong> ${technical.canonical_url}</div>`;
        }
        if (technical.canonical_issues && technical.canonical_issues.length > 0) {
            canonicalHTML += '<div class="status-item"><strong>Issues:</strong><ul>';
            technical.canonical_issues.forEach(issue => {
                canonicalHTML += `<li>${issue}</li>`;
            });
            canonicalHTML += '</ul></div>';
        }
        $('#canonical-status').html(canonicalHTML);
        
        // Robots status
        let robotsHTML = `
            <div class="status-item ${technical.robots_txt_found ? 'status-good' : 'status-error'}">
                <strong>Robots.txt:</strong> ${technical.robots_txt_found ? '✅ Found' : '❌ Missing'}
            </div>
            <div class="status-item ${technical.sitemap_found ? 'status-good' : 'status-error'}">
                <strong>Sitemap:</strong> ${technical.sitemap_found ? '✅ Found' : '❌ Missing'}
            </div>
        `;
        if (technical.robots_directive) {
            robotsHTML += `<div class="status-item"><strong>Meta Robots:</strong> ${technical.robots_directive}</div>`;
        }
        $('#robots-status').html(robotsHTML);
        
        // SSL status
        const sslHTML = `
            <div class="status-item ${technical.ssl_enabled ? 'status-good' : 'status-error'}">
                <strong>HTTPS:</strong> ${technical.ssl_enabled ? '✅ Enabled' : '❌ Disabled (Critical!)'}
            </div>
        `;
        $('#ssl-status').html(sslHTML);
        
        // Schema status
        const schema = data.schema_analysis || {};
        let schemaHTML = `
            <div class="status-item ${schema.has_schema ? 'status-good' : 'status-warning'}">
                <strong>Schema Markup:</strong> ${schema.has_schema ? '✅ Present' : '⚠️ Missing'}
            </div>
        `;
        if (schema.schema_types && schema.schema_types.length > 0) {
            schemaHTML += `<div class="status-item"><strong>Types:</strong> ${schema.schema_types.join(', ')}</div>`;
        }
        $('#schema-status').html(schemaHTML);
    }

    /**
     * Display On-Page SEO section
     */
    function displayOnPageSEO(data) {
        // Title tag
        const titleLength = (data.title || '').length;
        const titleStatus = titleLength >= 50 && titleLength <= 60 ? 'good' : 
                          (titleLength > 60 ? 'warning' : 'error');
        $('#title-tag').html(`
            <div class="tag-content status-${titleStatus}">
                <div class="tag-text">${data.title || 'Not set'}</div>
                <div class="tag-meta">Length: ${titleLength} characters 
                ${titleLength >= 50 && titleLength <= 60 ? '✅' : '⚠️'}</div>
            </div>
        `);
        
        // Meta description
        const metaLength = (data.meta_description || '').length;
        const metaStatus = metaLength >= 120 && metaLength <= 160 ? 'good' : 
                          (metaLength > 160 ? 'warning' : 'error');
        $('#meta-desc').html(`
            <div class="tag-content status-${metaStatus}">
                <div class="tag-text">${data.meta_description || 'Not set'}</div>
                <div class="tag-meta">Length: ${metaLength} characters 
                ${metaLength >= 120 && metaLength <= 160 ? '✅' : '⚠️'}</div>
            </div>
        `);
        
        // Headings structure
        let headingsHTML = '<div class="headings-list">';
        const headingCounts = {
            'H1': (data.h1_tags || []).length,
            'H2': (data.h2_tags || []).length,
            'H3': (data.h3_tags || []).length,
            'H4': (data.h4_tags || []).length,
            'H5': (data.h5_tags || []).length,
            'H6': (data.h6_tags || []).length
        };
        
        Object.entries(headingCounts).forEach(([tag, count]) => {
            const status = (tag === 'H1' && count === 1) ? 'good' : 
                          (tag === 'H1' && count !== 1) ? 'error' : 'neutral';
            headingsHTML += `
                <div class="heading-item status-${status}">
                    <strong>${tag}:</strong> ${count} 
                    ${tag === 'H1' && count === 1 ? '✅' : ''}
                    ${tag === 'H1' && count !== 1 ? '⚠️ (Should be exactly 1)' : ''}
                </div>
            `;
        });
        headingsHTML += '</div>';
        $('#headings-structure').html(headingsHTML);
    }
    /**
     * Display Readability Analysis
     */
    function displayReadability(data) {
        const readability = data.readability_analysis || {};
        
        if (!readability.flesch_reading_ease) {
            $('#readability-content').html('<p>No readability data available</p>');
            return;
        }
        
        const score = readability.flesch_reading_ease;
        const scoreClass = score >= 60 ? 'good' : (score >= 40 ? 'warning' : 'error');
        
        const html = `
            <div class="readability-grid">
                <div class="metric-card status-${scoreClass}">
                    <div class="metric-value">${score}</div>
                    <div class="metric-label">Flesch Reading Ease</div>
                </div>
                <div class="metric-card">
                    <div class="metric-value">${readability.flesch_kincaid_grade || 'N/A'}</div>
                    <div class="metric-label">Grade Level</div>
                </div>
                <div class="metric-card">
                    <div class="metric-value">${readability.reading_time_minutes || 0} min</div>
                    <div class="metric-label">Reading Time</div>
                </div>
            </div>
            <div class="readability-info">
                <p><strong>Difficulty:</strong> ${readability.difficulty_level || 'N/A'}</p>
                <p><strong>Grade:</strong> ${readability.readability_grade || 'N/A'}</p>
            </div>
        `;
        $('#readability-content').html(html);
    }

    /**
     * Display Keyword Analysis
     */
    function displayKeywordAnalysis(data) {
        const keywords = data.keyword_density_analysis || {};
        
        if (!keywords.top_keywords || keywords.top_keywords.length === 0) {
            $('#keyword-content').html('<p>No keyword data available</p>');
            return;
        }
        
        let html = `
            <div class="keyword-stats">
                <div class="stat"><strong>Total Words:</strong> ${keywords.total_words || 0}</div>
                <div class="stat"><strong>Unique Words:</strong> ${keywords.unique_words || 0}</div>
                <div class="stat"><strong>Diversity:</strong> ${keywords.lexical_diversity_grade || 'N/A'}</div>
            </div>
            <h4>Top Keywords</h4>
            <table class="keyword-table">
                <thead>
                    <tr>
                        <th>Keyword</th>
                        <th>Count</th>
                        <th>Density</th>
                        <th>In Title</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
        `;
        
        keywords.top_keywords.slice(0, 10).forEach(kw => {
            html += `
                <tr>
                    <td><strong>${kw.keyword}</strong></td>
                    <td>${kw.count}</td>
                    <td>${kw.density_percent}%</td>
                    <td>${kw.in_title ? '✅' : '❌'}</td>
                    <td>${kw.status}</td>
                </tr>
            `;
        });
        
        html += '</tbody></table>';
        
        if (keywords.top_phrases && keywords.top_phrases.length > 0) {
            html += '<h4>Top Phrases</h4><ul class="phrases-list">';
            keywords.top_phrases.slice(0, 5).forEach(phrase => {
                html += `<li><strong>${phrase.phrase}</strong> (${phrase.count} times)</li>`;
            });
            html += '</ul>';
        }
        
        $('#keyword-content').html(html);
    }

    /**
     * Display Page Speed Analysis
     */
    function displayPageSpeed(data) {
        const speed = data.page_speed_analysis || {};
        
        if (!speed.performance_score) {
            $('#speed-content').html('<p>No page speed data available</p>');
            return;
        }
        
        const scoreClass = speed.performance_score >= 80 ? 'good' : 
                          (speed.performance_score >= 60 ? 'warning' : 'error');
        
        let html = `
            <div class="speed-score status-${scoreClass}">
                <div class="speed-value">${speed.performance_score}/100</div>
                <div class="speed-grade">${speed.performance_grade || 'N/A'}</div>
            </div>
            <div class="speed-metrics">
                <div class="metric"><strong>Load Time:</strong> ${speed.total_load_time_seconds?.toFixed(2) || 0}s</div>
                <div class="metric"><strong>Page Size:</strong> ${speed.page_size_mb?.toFixed(2) || 0} MB</div>
                <div class="metric"><strong>Resources:</strong> ${speed.total_resources || 0}</div>
                <div class="metric"><strong>Compression:</strong> ${speed.compression_enabled ? '✅' : '❌'}</div>
            </div>
        `;
        
        if (speed.issues && speed.issues.length > 0) {
            html += '<h4>Performance Issues</h4><ul class="issues-list">';
            speed.issues.forEach(issue => {
                html += `<li>${issue}</li>`;
            });
            html += '</ul>';
        }
        
        $('#speed-content').html(html);
    }
    /**
     * Display Linking Analysis
     */
    function displayLinkingAnalysis(data) {
        const linking = data.linking_analysis || {};
        
        const html = `
            <div class="linking-stats">
                <div class="stat-box">
                    <div class="stat-number">${linking.total_links || 0}</div>
                    <div class="stat-label">Total Links</div>
                </div>
                <div class="stat-box">
                    <div class="stat-number">${linking.internal_count || 0}</div>
                    <div class="stat-label">Internal Links</div>
                </div>
                <div class="stat-box">
                    <div class="stat-number">${linking.external_count || 0}</div>
                    <div class="stat-label">External Links</div>
                </div>
                <div class="stat-box">
                    <div class="stat-number">${linking.internal_ratio || 0}%</div>
                    <div class="stat-label">Internal Ratio</div>
                </div>
            </div>
        `;
        $('#linking-content').html(html);
    }

    /**
     * Display Keyword Strategy
     */
    function displayKeywordStrategy(data) {
        const strategy = data.keyword_strategy || {};
        
        if (!strategy.primary_keyword) {
            $('#strategy-content').html('<p>No keyword strategy available</p>');
            return;
        }
        
        let html = `
            <div class="strategy-section">
                <h4>Primary Keyword</h4>
                <p class="primary-keyword">${strategy.primary_keyword}</p>
            </div>
        `;
        
        if (strategy.long_tail_keywords && strategy.long_tail_keywords.length > 0) {
            html += '<div class="strategy-section"><h4>Long-tail Keywords</h4><ul>';
            strategy.long_tail_keywords.forEach(kw => {
                html += `<li>${kw}</li>`;
            });
            html += '</ul></div>';
        }
        
        $('#strategy-content').html(html);
    }

    /**
     * Display 30-Day Action Plan
     */
    function displayActionPlan(data) {
        const plan = data.action_plan_30_days || [];
        
        if (plan.length === 0) {
            $('#action-content').html('<p>No action plan available</p>');
            return;
        }
        
        let html = '<div class="action-timeline">';
        plan.forEach(item => {
            const priorityClass = item.priority?.toLowerCase() || 'medium';
            html += `
                <div class="action-item priority-${priorityClass}">
                    <div class="action-week">${item.week || 'Week 1'}</div>
                    <div class="action-content">
                        <div class="action-priority">${item.priority || 'Medium'} Priority</div>
                        <h4>${item.action}</h4>
                        <p class="action-impact"><strong>Expected Impact:</strong> ${item.expected_impact}</p>
                    </div>
                </div>
            `;
        });
        html += '</div>';
        
        $('#action-content').html(html);
    }

    /**
     * Setup collapsible sections
     */
    function setupCollapsibleSections() {
        $('.collapsible').on('click', function() {
            const target = $(this).data('target');
            const content = $('#' + target);
            const icon = $(this).find('.toggle-icon');
            
            // Toggle content
            content.slideToggle(300);
            
            // Toggle icon and active class
            $(this).toggleClass('active');
            if ($(this).hasClass('active')) {
                icon.text('▼');
            } else {
                icon.text('▶');
            }
        });
    }
 
} 
