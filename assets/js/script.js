/**
 * SEO Analyzer JavaScript - Complete with All Features
 */

window.addEventListener('DOMContentLoaded', function() {
    console.log('=== SEO Analyzer: DOM Content Loaded ===');
    
    var $ = window.jQuery || window.$ || null;
    
    if (!$) {
        console.error('SEO Analyzer: jQuery not found! Retrying...');
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
    
    if (typeof seoAnalyzer === 'undefined') {
        console.error('SEO Analyzer: Configuration missing!');
        window.seoAnalyzer = {
            ajaxurl: '/wp-admin/admin-ajax.php',
            nonce: $('#seo-analyzer-nonce').val() || ''
        };
        console.log('SEO Analyzer: Created fallback config');
    }
    
    console.log('Config:', seoAnalyzer);
    
    $(document).ready(function() {
        console.log('SEO Analyzer: jQuery DOM Ready');
        
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

        $('#analyze-url').on('keypress', function(e) {
            if (e.which === 13) {
                $('#analyze-btn').click();
            }
        });
    }

    function isValidURL(string) {
        try {
            const url = new URL(string);
            return url.protocol === 'http:' || url.protocol === 'https:';
        } catch (_) {
            return false;
        }
    }

    function showError(message) {
        $('#error-message').html('<strong>Error:</strong> ' + message).fadeIn();
        setTimeout(function() {
            $('#error-message').fadeOut();
        }, 5000);
    }

    function analyzeURL(url) {
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
            timeout: 120000,
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
                $('#analyze-btn').prop('disabled', false);
                $('.btn-text').show();
                $('.btn-loader').hide();
            }
        });
    }

    /**
     * MAIN DISPLAY FUNCTION - Calls all sub-functions
     */
    function displayResults(data) {
        console.log('=== Full Analysis Data ===', data);
        
        $('#results-container').fadeIn();
        
        $('html, body').animate({
            scrollTop: $('#results-container').offset().top - 50
        }, 500);

        // Call ALL display functions
        displayScoreAndSummary(data);
        displayQuickStats(data);
        displaySEOIssues(data);
        displayTechnicalSEO(data);
        displayOnPageSEO(data);
        displayReadability(data);
        displayKeywordAnalysis(data);
        displayPageSpeed(data);
        displayLinkingAnalysis(data);
        displayBacklinkAnalysis(data);
        displayKeywordStrategy(data);
        displayContentRecommendations(data);
        displayActionPlan(data);
    }

    function displayScoreAndSummary(data) {
        const score = data.seo_score || 0;
        
        $('#seo-score').text(score);
        $('#analyzed-url').text(data.url || 'N/A');
        $('#analysis-summary').text(data.analysis_summary || 'Analysis completed successfully.');
        
        const circumference = 2 * Math.PI * 90;
        const offset = circumference - (score / 100) * circumference;
        
        $('#score-circle').css({
            'stroke-dasharray': circumference,
            'stroke-dashoffset': circumference
        });
        
        setTimeout(() => {
            $('#score-circle').css('stroke-dashoffset', offset);
        }, 100);
        
        let color = '#ef4444';
        if (score >= 80) color = '#22c55e';
        else if (score >= 60) color = '#f59e0b';
        
        $('#score-circle').css('stroke', color);
    }

    function displayQuickStats(data) {
        $('#word-count').text(data.word_count || 0);
        $('#image-count').text(data.total_images || 0);
        
        const linkingData = data.linking_analysis || {};
        $('#link-count').text(linkingData.total_links || 0);
        
        const speedData = data.page_speed_analysis || {};
        const loadTime = speedData.total_load_time_seconds || 0;
        $('#load-time').text(loadTime.toFixed(2) + 's');
    }

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

    function getPriorityIcon(priority) {
        const icons = {
            'High': '🔴',
            'Medium': '🟡',
            'Low': '🟢'
        };
        return icons[priority] || '⚪';
    }

    function formatRecommendation(text) {
        if (!text) return '';
        return text.replace(/\\n/g, '<br>').replace(/\n/g, '<br>');
    }

    function displayTechnicalSEO(data) {
        const technical = data.technical_seo || {};
        
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
        
        const sslHTML = `
            <div class="status-item ${technical.ssl_enabled ? 'status-good' : 'status-error'}">
                <strong>HTTPS:</strong> ${technical.ssl_enabled ? '✅ Enabled' : '❌ Disabled (Critical!)'}
            </div>
        `;
        $('#ssl-status').html(sslHTML);
        
        const schema = data.schema_analysis || {};
        let schemaHTML = `
            <div class="status-item ${schema.has_schema ? 'status-good' : 'status-warning'}">
                <strong>Schema Markup:</strong> ${schema.has_schema ? '✅ Present' : '⚠️ Missing'}
            </div>
        `;
        if (schema.schema_types && schema.schema_types.length > 0) {
            schemaHTML += `<div class="status-item"><strong>Types:</strong> ${schema.schema_types.join(', ')}</div>`;
            schemaHTML += `<div class="status-item"><strong>Count:</strong> ${schema.schema_count || 0} items</div>`;
        }
        $('#schema-status').html(schemaHTML);
    }

    function displayOnPageSEO(data) {
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
     * READABILITY ANALYSIS - Complete Display
     */
    function displayReadability(data) {
        const readability = data.readability_analysis || {};
        
        console.log('Readability Data:', readability);
        
        if (!readability.flesch_reading_ease && readability.flesch_reading_ease !== 0) {
            $('#readability-content').html('<p class="no-data">❌ No readability data available from API</p>');
            return;
        }
        
        const score = readability.flesch_reading_ease;
        const scoreClass = score >= 60 ? 'good' : (score >= 40 ? 'warning' : 'error');
        
        const html = `
            <div class="readability-grid">
                <div class="metric-card main-metric status-${scoreClass}">
                    <div class="metric-icon">📖</div>
                    <div class="metric-value">${score}</div>
                    <div class="metric-label">Flesch Reading Ease</div>
                    <div class="metric-grade">${readability.readability_grade || 'N/A'}</div>
                </div>
                <div class="metric-card">
                    <div class="metric-icon">🎓</div>
                    <div class="metric-value">${readability.flesch_kincaid_grade || 'N/A'}</div>
                    <div class="metric-label">Grade Level</div>
                </div>
                <div class="metric-card">
                    <div class="metric-icon">📊</div>
                    <div class="metric-value">${readability.gunning_fog || 'N/A'}</div>
                    <div class="metric-label">Gunning Fog Index</div>
                </div>
                <div class="metric-card">
                    <div class="metric-icon">⏱️</div>
                    <div class="metric-value">${readability.reading_time_minutes || 0} min</div>
                    <div class="metric-label">Reading Time</div>
                </div>
            </div>
            <div class="readability-info">
                <p><strong>Difficulty Level:</strong> ${readability.difficulty_level || 'N/A'}</p>
                <p><strong>Interpretation:</strong> ${getReadabilityInterpretation(score)}</p>
            </div>
        `;
        $('#readability-content').html(html);
    }

    function getReadabilityInterpretation(score) {
        if (score >= 80) return '✅ Excellent - Very easy to read';
        if (score >= 70) return '✅ Good - Fairly easy to understand';
        if (score >= 60) return '⚠️ Standard - Acceptable readability';
        if (score >= 50) return '⚠️ Fairly Difficult - Consider simplifying';
        return '❌ Very Difficult - Content may be too complex';
    }

    /**
     * KEYWORD DENSITY ANALYSIS - Complete Table
     */
    function displayKeywordAnalysis(data) {
        const keywords = data.keyword_density_analysis || {};
        
        console.log('Keyword Data:', keywords);
        
        if (!keywords.top_keywords || keywords.top_keywords.length === 0) {
            $('#keyword-content').html('<p class="no-data">❌ No keyword data available from API</p>');
            return;
        }
        
        let html = `
            <div class="keyword-stats-grid">
                <div class="stat-box">
                    <div class="stat-number">${keywords.total_words || 0}</div>
                    <div class="stat-label">Total Words</div>
                </div>
                <div class="stat-box">
                    <div class="stat-number">${keywords.unique_words || 0}</div>
                    <div class="stat-label">Unique Words</div>
                </div>
                <div class="stat-box">
                    <div class="stat-number">${keywords.lexical_diversity || 0}</div>
                    <div class="stat-label">Lexical Diversity</div>
                </div>
                <div class="stat-box">
                    <div class="stat-number">${keywords.lexical_diversity_grade || 'N/A'}</div>
                    <div class="stat-label">Diversity Grade</div>
                </div>
            </div>
            
            <h4>Top Keywords Found</h4>
            <table class="keyword-table">
                <thead>
                    <tr>
                        <th>Keyword</th>
                        <th>Count</th>
                        <th>Density %</th>
                        <th>In Title</th>
                        <th>In Meta</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
        `;
        
        keywords.top_keywords.slice(0, 15).forEach(kw => {
            html += `
                <tr>
                    <td><strong>${kw.keyword}</strong></td>
                    <td>${kw.count}</td>
                    <td>${kw.density_percent}%</td>
                    <td>${kw.in_title ? '✅' : '❌'}</td>
                    <td>${kw.in_meta_description ? '✅' : '❌'}</td>
                    <td><span class="keyword-status ${kw.status.includes('Good') || kw.status.includes('✅') ? 'good' : 'warning'}">${kw.status}</span></td>
                </tr>
            `;
        });
        
        html += '</tbody></table>';
        
        if (keywords.top_phrases && keywords.top_phrases.length > 0) {
            html += '<h4>Top 2-Word Phrases</h4><div class="phrases-grid">';
            keywords.top_phrases.slice(0, 10).forEach(phrase => {
                html += `
                    <div class="phrase-item">
                        <strong>"${phrase.phrase}"</strong>
                        <span>${phrase.count} times (${phrase.density_percent}%)</span>
                    </div>
                `;
            });
            html += '</div>';
        }
        
        if (keywords.recommendations && keywords.recommendations.length > 0) {
            html += '<div class="keyword-recommendations"><h4>💡 Recommendations</h4><ul>';
            keywords.recommendations.forEach(rec => {
                html += `<li>${rec}</li>`;
            });
            html += '</ul></div>';
        }
        
        if (keywords.keyword_stuffing_risk) {
            html += '<div class="keyword-warning">⚠️ Keyword stuffing risk detected! Reduce overused keywords.</div>';
        }
        
        $('#keyword-content').html(html);
    }

    /**
     * PAGE SPEED ANALYSIS - Complete Breakdown
     */
    function displayPageSpeed(data) {
        const speed = data.page_speed_analysis || {};
        
        console.log('Page Speed Data:', speed);
        
        if (!speed.performance_score && speed.performance_score !== 0) {
            $('#speed-content').html('<p class="no-data">❌ No page speed data available from API</p>');
            return;
        }
        
        const scoreClass = speed.performance_score >= 80 ? 'good' : 
                          (speed.performance_score >= 60 ? 'warning' : 'error');
        
        let html = `
            <div class="speed-dashboard">
                <div class="speed-score status-${scoreClass}">
                    <div class="speed-value">${speed.performance_score}/100</div>
                    <div class="speed-grade">${speed.performance_grade || 'N/A'}</div>
                </div>
                <div class="speed-metrics-grid">
                    <div class="metric">
                        <div class="metric-icon">⚡</div>
                        <div class="metric-value">${speed.total_load_time_seconds?.toFixed(2) || 0}s</div>
                        <div class="metric-label">Total Load Time</div>
                    </div>
                    <div class="metric">
                        <div class="metric-icon">⏱️</div>
                        <div class="metric-value">${speed.time_to_first_byte_seconds?.toFixed(2) || 0}s</div>
                        <div class="metric-label">TTFB</div>
                    </div>
                    <div class="metric">
                        <div class="metric-icon">📦</div>
                        <div class="metric-value">${speed.page_size_mb?.toFixed(2) || 0} MB</div>
                        <div class="metric-label">Page Size</div>
                    </div>
                    <div class="metric">
                        <div class="metric-icon">📄</div>
                        <div class="metric-value">${speed.total_resources || 0}</div>
                        <div class="metric-label">Total Resources</div>
                    </div>
                </div>
            </div>
            
            <div class="resource-breakdown">
                <h4>Resource Breakdown</h4>
                <div class="resource-grid">
                    <div class="resource-item">
                        <span>JavaScript Files:</span>
                        <strong>${speed.external_scripts_count || 0}</strong>
                    </div>
                    <div class="resource-item">
                        <span>CSS Files:</span>
                        <strong>${speed.external_css_count || 0}</strong>
                    </div>
                    <div class="resource-item">
                        <span>Images:</span>
                        <strong>${speed.images_count || 0}</strong>
                    </div>
                    <div class="resource-item">
                        <span>Render-Blocking:</span>
                        <strong>${speed.render_blocking_scripts || 0}</strong>
                    </div>
                    <div class="resource-item">
                        <span>Compression:</span>
                        <strong>${speed.compression_enabled ? '✅ ' + (speed.compression_type || 'Enabled') : '❌ Disabled'}</strong>
                    </div>
                    <div class="resource-item">
                        <span>Caching:</span>
                        <strong>${speed.caching_enabled ? '✅ Enabled' : '❌ Disabled'}</strong>
                    </div>
                </div>
            </div>
        `;
        
        if (speed.issues && speed.issues.length > 0) {
            html += '<div class="speed-issues"><h4>⚠️ Performance Issues</h4><ul>';
            speed.issues.forEach(issue => {
                html += `<li>${issue}</li>`;
            });
            html += '</ul></div>';
        }
        
        if (speed.recommendations && speed.recommendations.length > 0) {
            html += '<div class="speed-recommendations"><h4>💡 Optimization Recommendations</h4><ul>';
            speed.recommendations.forEach(rec => {
                html += `<li>${rec}</li>`;
            });
            html += '</ul></div>';
        }
        
        $('#speed-content').html(html);
    }

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
            ${linking.nofollow_internal_count > 0 ? `<div class="link-warning">⚠️ ${linking.nofollow_internal_count} internal links have nofollow attribute</div>` : ''}
            ${linking.empty_anchor_count > 0 ? `<div class="link-error">❌ ${linking.empty_anchor_count} links have empty anchor text</div>` : ''}
        `;
        $('#linking-content').html(html);
    }

    /**
     * BACKLINK ANALYSIS
     */
    function displayBacklinkAnalysis(data) {
        const backlinks = data.backlink_analysis || {};
        
        console.log('Backlink Data:', backlinks);
        
        if (!backlinks.total_external_links && backlinks.total_external_links !== 0) {
            return; // Optional section
        }
        
        const qualityClass = backlinks.link_quality_score >= 70 ? 'good' : 
                            (backlinks.link_quality_score >= 50 ? 'warning' : 'error');
        
        let html = `
            <div class="backlink-stats">
                <div class="stat-box">
                    <div class="stat-number">${backlinks.total_external_links || 0}</div>
                    <div class="stat-label">External Links</div>
                </div>
                <div class="stat-box">
                    <div class="stat-number">${backlinks.dofollow_count || 0}</div>
                    <div class="stat-label">Dofollow</div>
                </div>
                <div class="stat-box">
                    <div class="stat-number">${backlinks.unique_domains || 0}</div>
                    <div class="stat-label">Unique Domains</div>
                </div>
                <div class="stat-box status-${qualityClass}">
                    <div class="stat-number">${backlinks.link_quality_score || 0}</div>
                    <div class="stat-label">Quality Score</div>
                </div>
            </div>
        `;
        
        if (backlinks.top_linked_domains && backlinks.top_linked_domains.length > 0) {
            html += '<h4>Top Linked Domains</h4><table class="domains-table"><thead><tr><th>Domain</th><th>Links</th><th>Authority</th></tr></thead><tbody>';
            backlinks.top_linked_domains.slice(0, 5).forEach(domain => {
                html += `
                    <tr>
                        <td>${domain.domain}</td>
                        <td>${domain.link_count}</td>
                        <td>${domain.estimated_authority || 'N/A'}</td>
                    </tr>
                `;
            });
            html += '</tbody></table>';
        }
        
        // Add to existing linking section or create new
        $('#linking-content').append('<hr>' + html);
    }

    function displayKeywordStrategy(data) {
        const strategy = data.keyword_strategy || {};
        
        if (!strategy.primary_keyword) {
            $('#strategy-content').html('<p class="no-data">No keyword strategy available</p>');
            return;
        }
        
        let html = `
            <div class="strategy-section">
                <h4>🎯 Primary Keyword</h4>
                <p class="primary-keyword">${strategy.primary_keyword}</p>
            </div>
        `;
        
        if (strategy.long_tail_keywords && strategy.long_tail_keywords.length > 0) {
            html += '<div class="strategy-section"><h4>📝 Long-tail Keywords</h4><div class="keywords-chips">';
            strategy.long_tail_keywords.forEach(kw => {
                html += `<span class="keyword-chip">${kw}</span>`;
            });
            html += '</div></div>';
        }
        
        if (strategy.keyword_intent && Object.keys(strategy.keyword_intent).length > 0) {
            html += '<div class="strategy-section"><h4>🎯 Keyword Intent</h4><ul>';
            Object.entries(strategy.keyword_intent).forEach(([kw, intent]) => {
                html += `<li><strong>${kw}:</strong> <span class="intent-badge ${intent}">${intent}</span></li>`;
            });
            html += '</ul></div>';
        }
        
        $('#strategy-content').html(html);
    }

    /**
     * CONTENT RECOMMENDATIONS
     */
    function displayContentRecommendations(data) {
        const recommendations = data.content_recommendations || [];
        
        console.log('Content Recommendations:', recommendations);
        
        if (recommendations.length === 0) {
            return; // Optional section
        }
        
        let html = '';
        recommendations.forEach((rec, index) => {
            html += `
                <div class="content-rec-card">
                    <h4>💡 ${rec.page_type}: ${rec.topic}</h4>
                    <div class="rec-keywords">
                        <strong>Target Keywords:</strong>
                        ${rec.target_keywords.map(kw => `<span class="keyword-chip">${kw}</span>`).join('')}
                    </div>
                    ${rec.structure ? '<div class="rec-structure"><strong>Suggested Structure:</strong><ul>' + 
                        Object.entries(rec.structure).map(([level, headings]) => 
                            `<li><strong>${level}:</strong> ${headings.join(', ')}</li>`
                        ).join('') + '</ul></div>' : ''}
                </div>
            `;
        });
        
        // Append to a dedicated section if exists
        if ($('#content-recommendations-section').length) {
            $('#content-recommendations-section').html(html);
        }
    }

    function displayActionPlan(data) {
        const plan = data.action_plan_30_days || [];
        
        if (plan.length === 0) {
            $('#action-content').html('<p class="no-data">No action plan available</p>');
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

    function setupCollapsibleSections() {
        $('.collapsible').on('click', function() {
            const target = $(this).data('target');
            const content = $('#' + target);
            const icon = $(this).find('.toggle-icon');
            
            content.slideToggle(300);
            
            $(this).toggleClass('active');
            if ($(this).hasClass('active')) {
                icon.text('▼');
            } else {
                icon.text('▶');
            }
        });
    }
}

