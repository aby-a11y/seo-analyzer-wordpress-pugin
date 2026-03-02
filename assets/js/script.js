/**
 * SEO Analyzer - Complete Fixed Script
 */
window.addEventListener('DOMContentLoaded', function () {
    var $ = window.jQuery || window.$ || null;
    if (!$) {
        setTimeout(function () {
            $ = window.jQuery || window.$;
            if ($) initSEOAnalyzer($);
            else alert('Error: jQuery not loaded.');
        }, 500);
        return;
    }
    initSEOAnalyzer($);
});

function initSEOAnalyzer($) {
    'use strict';
    if (typeof seoAnalyzer === 'undefined') {
        window.seoAnalyzer = { ajaxurl: '/wp-admin/admin-ajax.php', nonce: $('#seo-analyzer-nonce').val() || '' };
    }
    $(document).ready(function () {
        if ($('#analyze-btn').length === 0) return;
        initializeAnalyzer();
        setupCollapsibleSections();
    });

    function initializeAnalyzer() {
        $('#analyze-btn').on('click', function (e) {
            e.preventDefault();
            const url = $('#analyze-url').val().trim();
            if (!url) { showError('Please enter a URL'); return; }
            if (!isValidURL(url)) { showError('Please enter a valid URL (e.g., https://example.com)'); return; }
            analyzeURL(url);
        });
        $('#analyze-url').on('keypress', function (e) { if (e.which === 13) $('#analyze-btn').click(); });
    }

    function isValidURL(str) {
        try { const u = new URL(str); return u.protocol === 'http:' || u.protocol === 'https:'; }
        catch (_) { return false; }
    }

    function showError(msg) {
        $('#error-message').html('<strong>Error:</strong> ' + msg).fadeIn();
        setTimeout(function () { $('#error-message').fadeOut(); }, 5000);
    }

    function analyzeURL(url) {
        $('#analyze-btn').prop('disabled', true);
        $('.btn-text').hide(); $('.btn-loader').show();
        $('#error-message').hide(); $('#results-container').hide();
        $.ajax({
            url: seoAnalyzer.ajaxurl, type: 'POST',
            data: { action: 'analyze_url', url: url, nonce: seoAnalyzer.nonce },
            timeout: 120000,
            success: function (response) {
                if (response.success) displayResults(response.data);
                else showError(response.data || 'Analysis failed.');
            },
            error: function (xhr, status) {
                showError(status === 'timeout' ? 'Request timed out.' : 'Connection error. Try again.');
            },
            complete: function () {
                $('#analyze-btn').prop('disabled', false);
                $('.btn-text').show(); $('.btn-loader').hide();
            }
        });
    }

    function displayResults(data) {
        console.log('Full API Data:', data);
        $('#results-container').fadeIn();
        $('html, body').animate({ scrollTop: $('#results-container').offset().top - 50 }, 500);
        displayScoreAndSummary(data);
        displayQuickStats(data);
        displaySEOIssues(data);
        displayBasicSEO(data);
        displayTechnicalSEO(data);
        displayKeywordStrategy(data);
        displayInternalLinking(data);
        displayExternalLinks(data);
        displayRecommendations(data);
        displayContentRecommendations(data);
        displayAdvancedAnalytics(data);
        displayPageSpeed(data);
        displayActionPlan(data);
    }

    function displayScoreAndSummary(data) {
        const score = data.seo_score || 0;
        $('#seo-score').text(score);
        $('#analyzed-url').text(data.url || 'N/A');
        $('#analysis-summary').text(data.analysis_summary || 'Analysis completed.');
        const circ = 2 * Math.PI * 90;
        $('#score-circle').css({ 'stroke-dasharray': circ, 'stroke-dashoffset': circ });
        setTimeout(() => { $('#score-circle').css('stroke-dashoffset', circ - (score / 100) * circ); }, 100);
        $('#score-circle').css('stroke', score >= 80 ? '#22c55e' : score >= 60 ? '#f59e0b' : '#ef4444');
    }

    function displayQuickStats(data) {
        $('#word-count').text(data.word_count || 0);
        $('#image-count').text(data.total_images || 0);
        $('#link-count').text((data.linking_analysis || {}).total_links || 0);
        $('#load-time').text(parseFloat((data.page_speed_analysis || {}).total_load_time_seconds || 0).toFixed(2) + 's');
    }

    function getPriorityIcon(p) { return { 'High': '🔴', 'Medium': '🟡', 'Low': '🟢' }[p] || '⚪'; }
    // ===== SECTION 1: SEO ISSUES =====
    function displaySEOIssues(data) {
        const issues = data.seo_issues || [];
        $('#issues-count').text(issues.length);
        if (issues.length === 0) {
            $('#issues-list').html('<div class="no-issues">✅ No critical SEO issues found!</div>'); return;
        }
        let html = '';
        issues.forEach(issue => {
            const pc = (issue.priority || 'low').toLowerCase();
            html += `
            <div class="issue-card priority-${pc}">
                <div class="issue-header">
                    <span class="priority-badge">${getPriorityIcon(issue.priority)} ${issue.priority || 'Low'}</span>
                    <span class="issue-category">${issue.category || ''}</span>
                </div>
                <div class="issue-body">
                    <div class="issue-title">${issue.issue || ''}</div>
                    <div class="issue-collapsible" style="display:none;">
                        <div class="issue-fix">${formatText(issue.recommendation || '')}</div>
                        ${issue.priority_impact ? `<div class="priority-impact"><strong>Priority Impact:</strong> ${issue.priority_impact}</div>` : ''}
                    </div>
                    <button class="issue-toggle-btn">Show Details ▼</button>
                </div>
            </div>`;
        });
        $('#issues-list').html(html);
        $(document).on('click', '.issue-toggle-btn', function () {
            const box = $(this).siblings('.issue-collapsible');
            box.slideToggle(200);
            $(this).text(box.is(':visible') ? 'Hide Details ▲' : 'Show Details ▼');
        });
    }

    // ===== SECTION 2: BASIC SEO =====
    function displayBasicSEO(data) {
        const titleLen = (data.title || '').length;
        const metaLen = (data.meta_description || '').length;
        const titleStatus = titleLen >= 50 && titleLen <= 60 ? 'good' : titleLen > 60 ? 'warning' : 'error';
        const metaStatus = metaLen >= 150 && metaLen <= 160 ? 'good' : metaLen > 160 ? 'warning' : 'error';

        const statusIcon = (s) => s === 'good' ? '✅ Good' : s === 'warning' ? '⚠️ Fair' : '❌ Fix';

        let html = `
        <div class="basic-seo-table-wrap">
            <table class="basic-table">
                <thead><tr>
                    <th>Title Tag</th><th>Meta Description</th>
                    <th>Content Length</th><th>Image Alt Tags</th>
                </tr></thead>
                <tbody><tr>
                    <td>
                        <div class="badge-status ${titleStatus}">${statusIcon(titleStatus)}</div>
                        <div class="tag-text">${data.title || 'Not set'}</div>
                        <div class="tag-meta">${titleLen} characters — Target: 50–60</div>
                    </td>
                    <td>
                        <div class="badge-status ${metaStatus}">${statusIcon(metaStatus)}</div>
                        <div class="tag-text">${data.meta_description || 'Not set'}</div>
                        <div class="tag-meta">${metaLen} characters — Target: 150–160</div>
                    </td>
                    <td>
                        <div class="badge-status good">✅ Good</div>
                        <div class="tag-text"><strong>${data.word_count || 0}</strong> words</div>
                        <div class="tag-meta">Target: 1000–2500</div>
                    </td>
                    <td>
                        <div class="badge-status good">✅ Perfect</div>
                        <div class="tag-text">${data.total_images || 0} Images</div>
                        <div class="tag-meta">✓ All have alt text</div>
                    </td>
                </tr></tbody>
            </table>
        </div>`;

        const h1Tags = data.h1_tags || [];
        html += `
        <div class="h1-section">
            <h4>H1 Header Tag — <span class="${h1Tags.length === 1 ? 'text-good' : 'text-error'}">${h1Tags.length === 1 ? '✅ 1 H1 (Perfect)' : '⚠️ ' + h1Tags.length + ' H1s (Should be 1)'}</span></h4>
            ${h1Tags.map(t => `<div class="h1-tag-box">${t}</div>`).join('')}
        </div>`;

        const headingMap = {
            'H2': data.h2_tags || [], 'H3': data.h3_tags || [],
            'H4': data.h4_tags || [], 'H5': data.h5_tags || [], 'H6': data.h6_tags || []
        };

        html += `<div class="heading-hierarchy"><h4>📋 Heading Hierarchy (H2–H6)</h4>`;
        Object.entries(headingMap).forEach(([tag, tags]) => {
            if (tags.length === 0) return;
            html += `
            <div class="heading-group">
                <div class="heading-group-header collapsible-heading" data-htarget="htag-${tag}">
                    <strong>${tag} Tags</strong> <span class="htag-count">(${tags.length})</span>
                    <span class="htag-toggle">▶</span>
                </div>
                <ul class="htag-list" id="htag-${tag}" style="display:none;">
                    ${tags.map(t => `<li>${t}</li>`).join('')}
                </ul>
            </div>`;
        });
        html += `</div>`;
        $('#basic-seo-content').html(html);

        $(document).on('click', '.collapsible-heading', function () {
            const id = $(this).data('htarget');
            $('#' + id).slideToggle(200);
            $(this).find('.htag-toggle').text($('#' + id).is(':visible') ? '▼' : '▶');
        });
    }

    // ===== SECTION 3: TECHNICAL SEO =====
    function displayTechnicalSEO(data) {
        const t = data.technical_seo || {};
        const schema = data.schema_analysis || {};
        $('#canonical-status').html(`
            <div class="status-item ${t.canonical_status?.includes('✅') ? 'status-good' : 'status-warning'}">
                <strong>Status:</strong> ${t.canonical_status || 'Not checked'}</div>
            ${t.canonical_url ? `<div class="status-item"><strong>URL:</strong> ${t.canonical_url}</div>` : ''}
            ${(t.canonical_issues || []).map(i => `<div class="status-item status-warning">${i}</div>`).join('')}`);
        $('#ssl-status').html(`
            <div class="status-item ${t.ssl_enabled ? 'status-good' : 'status-error'}">
                <strong>HTTPS:</strong> ${t.ssl_enabled ? '✅ Enabled' : '❌ Disabled (Critical!)'}</div>`);
        $('#robots-status').html(`
            <div class="status-item ${t.robots_txt_found ? 'status-good' : 'status-error'}">
                <strong>Robots.txt:</strong> ${t.robots_txt_found ? '✅ Found' : '❌ Missing'}</div>
            <div class="status-item ${t.sitemap_found ? 'status-good' : 'status-error'}">
                <strong>Sitemap:</strong> ${t.sitemap_found ? '✅ Found' : '❌ Missing'}</div>
            ${t.robots_directive ? `<div class="status-item"><strong>Meta Robots:</strong> ${t.robots_directive}</div>` : ''}`);
        $('#schema-status').html(`
            <div class="status-item ${schema.has_schema ? 'status-good' : 'status-warning'}">
                <strong>Schema:</strong> ${schema.has_schema ? '✅ Present' : '⚠️ Missing'}</div>
            ${schema.schema_types?.length ? `<div class="status-item"><strong>Types:</strong> ${schema.schema_types.join(', ')}</div>
            <div class="status-item"><strong>Count:</strong> ${schema.schema_count || 0} items</div>` : ''}`);
    }
    // ===== SECTION 4: KEYWORDS & BACKLINKS =====
    function displayKeywordStrategy(data) {
        const strategy = data.keyword_strategy || {};
        if (!strategy.primary_keyword) {
            $('#keyword-strategy-content').html('<p class="no-data">No keyword strategy data available</p>'); return;
        }
        let html = `
        <div class="strategy-section">
            <h4>🎯 Primary Keyword</h4>
            <p class="primary-keyword">${strategy.primary_keyword}</p>
        </div>`;
        if (strategy.long_tail_keywords?.length) {
            html += `<div class="strategy-section"><h4>📝 Long-tail Keywords</h4><div class="keywords-chips">`;
            strategy.long_tail_keywords.forEach(kw => {
                html += `<span class="keyword-chip">${kw.keyword || kw} <em>(${kw.intent || ''})</em></span>`;
            });
            html += `</div></div>`;
        }
        if (strategy.keyword_intent && Object.keys(strategy.keyword_intent).length) {
            html += `<div class="strategy-section"><h4>🔍 Keyword Intent</h4><ul class="intent-list">`;
            Object.entries(strategy.keyword_intent).forEach(([kw, intent]) => {
                html += `<li><strong>${kw}:</strong> <span class="intent-badge ${intent}">${intent}</span></li>`;
            });
            html += `</ul></div>`;
        }
        $('#keyword-strategy-content').html(html);
    }

    // ===== SECTION 5: INTERNAL LINKING =====
    function displayInternalLinking(data) {
        const linking = data.linking_analysis || {};
        let html = `
        <div class="linking-stats">
            <div class="stat-box"><div class="stat-number">${linking.total_links || 0}</div><div class="stat-label">Total Links</div></div>
            <div class="stat-box"><div class="stat-number">${linking.internal_count || 0}</div><div class="stat-label">Internal Links</div></div>
            <div class="stat-box"><div class="stat-number">${linking.external_count || 0}</div><div class="stat-label">External Links</div></div>
            <div class="stat-box"><div class="stat-number">${linking.internal_ratio || 0}%</div><div class="stat-label">Internal Ratio<br><small>Target: 70–85%</small></div></div>
        </div>`;
        if (linking.nofollow_internal_count > 0)
            html += `<div class="link-warning">⚠️ ${linking.nofollow_internal_count} internal links have nofollow</div>`;
        if (linking.empty_anchor_count > 0)
            html += `<div class="link-error">❌ ${linking.empty_anchor_count} links have empty anchor text — Add descriptive anchor text</div>`;

        const internalLinks = linking.internal_links || [];
        if (internalLinks.length > 0) {
            html += `<div class="links-detail-block">
                <h4>🔵 Internal Links (${internalLinks.length})</h4>
                <table class="links-table"><thead><tr><th>Anchor Text</th><th>URL</th><th>Follow</th></tr></thead><tbody>`;
            internalLinks.slice(0, 25).forEach(link => {
                const href = link.href || link.url || '#';
                const anchor = link.anchor || link.text || '<em>(empty)</em>';
                html += `<tr>
                    <td>${anchor}</td>
                    <td><a href="${href}" target="_blank" rel="noopener">${href.length > 60 ? href.substring(0, 60) + '...' : href}</a></td>
                    <td>${link.nofollow ? '❌ nofollow' : '✅ follow'}</td>
                </tr>`;
            });
            html += `</tbody></table></div>`;
        }
        $('#linking-content').html(html);
    }

    // ===== SECTION 6: EXTERNAL LINKS + SOCIAL MEDIA =====
    function displayExternalLinks(data) {
        const bl = data.backlink_analysis || {};
        const linking = data.linking_analysis || {};
        const qc = bl.link_quality_score >= 70 ? 'good' : bl.link_quality_score >= 50 ? 'warning' : 'error';

        let html = `
        <div class="linking-stats">
            <div class="stat-box"><div class="stat-number">${bl.total_external_links || linking.external_count || 0}</div><div class="stat-label">External Links<br><small>Outbound links</small></div></div>
            <div class="stat-box"><div class="stat-number">${bl.dofollow_count || 0}</div><div class="stat-label">Dofollow Links<br><small>Link equity passing</small></div></div>
            <div class="stat-box"><div class="stat-number">${bl.unique_domains || 0}</div><div class="stat-label">Unique Domains<br><small>Domain diversity</small></div></div>
            <div class="stat-box status-${qc}"><div class="stat-number">${bl.link_quality_score || 0}</div><div class="stat-label">Link Quality<br><small>Algorithm score</small></div></div>
        </div>`;

        const domains = bl.top_linked_domains || [];
        if (domains.length > 0) {
            const socialDomains = ['facebook.com', 'twitter.com', 'instagram.com', 'linkedin.com', 'youtube.com', 'pinterest.com'];
            const socialLinks = domains.filter(d => socialDomains.some(s => (d.domain || '').includes(s)));
            const otherLinks = domains.filter(d => !socialDomains.some(s => (d.domain || '').includes(s)));

            html += `<h4>☑️ Top Linked Domains (Referrer Potential)</h4>
            <table class="links-table"><thead><tr><th>Domain</th><th>Links</th><th>Authority</th></tr></thead><tbody>`;
            otherLinks.forEach(d => {
                html += `<tr><td><a href="https://${d.domain}" target="_blank" rel="noopener">${d.domain}</a></td>
                    <td>${d.link_count}</td><td>${d.estimated_authority || 'Unknown'}</td></tr>`;
            });
            html += `</tbody></table>`;

            if (socialLinks.length > 0) {
                html += `<div class="social-media-section"><h4>📱 Social Media Links</h4><div class="social-links-grid">`;
                socialLinks.forEach(d => {
                    const iconMap = { 'facebook': '📘', 'twitter': '🐦', 'instagram': '📸', 'linkedin': '💼', 'youtube': '▶️', 'pinterest': '📌' };
                    const icon = Object.entries(iconMap).find(([k]) => d.domain.includes(k))?.[1] || '🔗';
                    html += `<div class="social-card">
                        <span class="social-icon">${icon}</span>
                        <a href="https://${d.domain}" target="_blank" rel="noopener">${d.domain}</a>
                        <span class="social-authority">${d.estimated_authority || 'N/A'}</span>
                    </div>`;
                });
                html += `</div></div>`;
            }
        }

        const extLinks = linking.external_links || [];
        if (extLinks.length > 0) {
            html += `<div class="links-detail-block"><h4>🔴 All External Links (${extLinks.length})</h4>
                <table class="links-table"><thead><tr><th>Anchor Text</th><th>URL</th><th>Follow</th></tr></thead><tbody>`;
            extLinks.slice(0, 20).forEach(link => {
                const href = link.href || link.url || '#';
                const anchor = link.anchor || link.text || '<em>(empty)</em>';
                html += `<tr><td>${anchor}</td>
                    <td><a href="${href}" target="_blank" rel="noopener">${href.length > 60 ? href.substring(0, 60) + '...' : href}</a></td>
                    <td>${link.nofollow ? '❌ nofollow' : '✅ follow'}</td></tr>`;
            });
            html += `</tbody></table></div>`;
        }

        if (bl.recommendations?.length) {
            html += `<div class="speed-recommendations"><h4>💡 Referrer Strategy & Recommendations</h4><ul>`;
            bl.recommendations.forEach(r => { html += `<li>${r}</li>`; });
            html += `</ul></div>`;
        }
        $('#backlink-content').html(html);
    }

    // ===== SECTION 7: RECOMMENDATIONS =====
    function displayRecommendations(data) {
        const comp = data.competitive_analysis || {};
        let html = '';
        if (comp.likely_competitors?.length) {
            html += `<div class="rec-block"><h4>👥 Competitive Landscape</h4>
                <p><strong>Likely Competitors:</strong> ${comp.likely_competitors.join(', ')}</p></div>`;
        }
        if (comp.content_gaps?.length) {
            html += `<div class="rec-block"><h4>📉 Content Gaps</h4><ul>`;
            comp.content_gaps.forEach(g => { html += `<li>${g}</li>`; });
            html += `</ul></div>`;
        }
        if (comp.opportunities?.length) {
            html += `<div class="rec-block"><h4>✅ Opportunities</h4><ul>`;
            comp.opportunities.forEach(o => { html += `<li>✅ ${o}</li>`; });
            html += `</ul></div>`;
        }
        if (!html) html = '<p class="no-data">No recommendation data available</p>';
        $('#recommendations-content').html(html);
    }
    // ===== SECTION 8: CONTENT RECOMMENDATIONS =====
    function displayContentRecommendations(data) {
        const recs = data.content_recommendations || [];
        if (!recs.length) { $('#content-rec-content').html('<p class="no-data">No content recommendations available</p>'); return; }
        let html = '';
        recs.forEach((rec, i) => {
            html += `
            <div class="content-rec-card">
                <div class="content-rec-header collapsible-rec" data-rectarget="rec-${i}">
                    <strong>📄 ${rec.page_type}</strong> | ${rec.topic}
                    <span class="rec-toggle">▶</span>
                </div>
                <div class="content-rec-body" id="rec-${i}" style="display:none;">
                    <div class="rec-keywords">
                        <strong>🎯 Target Keywords:</strong>
                        ${(rec.target_keywords || []).map(kw => `<span class="keyword-chip">${kw}</span>`).join('')}
                    </div>
                    ${rec.structure ? `<div class="rec-structure"><strong>📝 Suggested Structure:</strong><ul>
                        ${Object.entries(rec.structure).map(([level, headings]) =>
                            `<li><strong>${level}:</strong> ${Array.isArray(headings) ? headings.join(' / ') : headings}</li>`).join('')}
                    </ul></div>` : ''}
                </div>
            </div>`;
        });
        $('#content-rec-content').html(html);
        $(document).on('click', '.collapsible-rec', function () {
            const id = $(this).data('rectarget');
            $('#' + id).slideToggle(200);
            $(this).find('.rec-toggle').text($('#' + id).is(':visible') ? '▼' : '▶');
        });
    }

    // ===== SECTION 9: ADVANCED ANALYTICS (Readability + Keywords) =====
    function displayAdvancedAnalytics(data) {
        const r = data.readability_analysis || {};
        const kw = data.keyword_density_analysis || {};
        const score = r.flesch_reading_ease;
        const sc = score >= 60 ? 'good' : score >= 40 ? 'warning' : 'error';

        let readHtml = `<h4>📊 Readability Analysis</h4>
        <table class="basic-table">
            <thead><tr><th>Flesch Reading Ease</th><th>Reading Grade</th><th>Reading Time</th><th>Difficulty</th></tr></thead>
            <tbody><tr>
                <td><strong>${score ?? 0}</strong><br><small>Target: 60–70</small></td>
                <td>${r.readability_grade || r.flesch_kincaid_grade || 'N/A'}</td>
                <td>${r.reading_time_minutes || 0} minutes</td>
                <td class="${sc}">${r.difficulty_level || 'N/A'}</td>
            </tr></tbody>
        </table>`;
        $('#readability-content').html(readHtml);

        if (kw.top_keywords?.length) {
            let kwHtml = `<h4 style="margin-top:25px;">🔑 Keyword Density Analysis</h4>
            <div class="keyword-stats-grid">
                <div class="stat-box"><div class="stat-number">${kw.total_words || 0}</div><div class="stat-label">Total Words</div></div>
                <div class="stat-box"><div class="stat-number">${kw.unique_words || 0}</div><div class="stat-label">Unique Words</div></div>
                <div class="stat-box"><div class="stat-number">${kw.lexical_diversity || 0}</div><div class="stat-label">Lexical Diversity</div></div>
                <div class="stat-box"><div class="stat-number">${kw.lexical_diversity_grade || 'N/A'}</div><div class="stat-label">Diversity Grade</div></div>
            </div>
            <table class="keyword-table"><thead><tr>
                <th>Keyword</th><th>Count</th><th>Density %</th><th>In Title</th><th>In Meta</th><th>Status</th>
            </tr></thead><tbody>`;
            kw.top_keywords.slice(0, 15).forEach(k => {
                kwHtml += `<tr>
                    <td><strong>${k.keyword}</strong></td><td>${k.count}</td><td>${k.density_percent}%</td>
                    <td>${k.in_title ? '✅' : '❌'}</td><td>${k.in_meta_description ? '✅' : '❌'}</td>
                    <td><span class="keyword-status ${k.status?.includes('Good') || k.status?.includes('✅') ? 'good' : 'warning'}">${k.status || 'N/A'}</span></td>
                </tr>`;
            });
            kwHtml += `</tbody></table>`;
            if (kw.top_phrases?.length) {
                kwHtml += `<h4>📝 Top 2-Word Phrases</h4><div class="phrases-grid">`;
                kw.top_phrases.slice(0, 10).forEach(p => {
                    kwHtml += `<div class="phrase-item"><strong>"${p.phrase}"</strong><span>${p.count} times (${p.density_percent}%)</span></div>`;
                });
                kwHtml += `</div>`;
            }
            $('#keyword-density-content').html(kwHtml);
        }
    }

    // ===== SECTION 10: PAGE SPEED =====
    function displayPageSpeed(data) {
        const speed = data.page_speed_analysis || {};
        if (!speed.performance_score && speed.performance_score !== 0) {
            $('#speed-content').html('<p class="no-data">❌ No page speed data available</p>'); return;
        }
        const sc = speed.performance_score >= 80 ? 'good' : speed.performance_score >= 60 ? 'warning' : 'error';
        let html = `
        <div class="speed-score-header status-${sc}">
            <div class="speed-main-score">${speed.performance_score}/100</div>
            <div class="speed-grade-label">${speed.performance_grade || 'N/A'}</div>
        </div>
        <table class="basic-table" style="margin-top:20px;">
            <thead><tr><th>Metric</th><th>Value</th><th>Status</th></tr></thead>
            <tbody>
                <tr><td>Load Time</td><td>${parseFloat(speed.total_load_time_seconds || 0).toFixed(2)}s</td>
                    <td>${speed.total_load_time_seconds <= 2 ? '✅ Fast' : '⚠️ Slow'}</td></tr>
                <tr><td>TTFB</td><td>${parseFloat(speed.time_to_first_byte_seconds || 0).toFixed(2)}s</td>
                    <td>${speed.time_to_first_byte_seconds <= 0.6 ? '✅ Good' : '⚠️ Slow'}</td></tr>
                <tr><td>Page Size</td><td>${parseFloat(speed.page_size_mb || 0).toFixed(2)} MB</td>
                    <td>${speed.page_size_mb <= 1 ? '✅ Small' : '⚠️ Large'}</td></tr>
                <tr><td>Total Resources</td><td>${speed.total_resources || 0}</td><td>JS, CSS, Images</td></tr>
            </tbody>
        </table>
        <table class="basic-table" style="margin-top:15px;">
            <thead><tr><th>Resource Type</th><th>Count</th></tr></thead>
            <tbody>
                <tr><td>JavaScript Files</td><td>${speed.external_scripts_count || 0}</td></tr>
                <tr><td>CSS Files</td><td>${speed.external_css_count || 0}</td></tr>
                <tr><td>Images</td><td>${speed.images_count || 0}</td></tr>
                <tr><td>Blocking Scripts</td><td>${speed.render_blocking_scripts || 0}</td></tr>
            </tbody>
        </table>
        <table class="basic-table" style="margin-top:15px;">
            <thead><tr><th>Optimization</th><th>Status</th></tr></thead>
            <tbody>
                <tr><td>Text Compression</td><td>${speed.compression_enabled ? '✅ Enabled (' + (speed.compression_type || 'gzip') + ')' : '❌ Disabled'}</td></tr>
                <tr><td>Browser Caching</td><td>${speed.caching_enabled ? '✅ Enabled' : '❌ Not Set'}</td></tr>
                <tr><td>HTTP/2</td><td>${speed.http2_enabled ? '✅ Enabled' : '❌ Not detected'}</td></tr>
                <tr><td>Minified JS/CSS</td><td>${speed.minified_js ? '✅ Yes' : '❌ No'}</td></tr>
            </tbody>
        </table>`;
        if (speed.issues?.length) {
            html += `<div class="speed-issues"><h4>⚠️ Performance Issues</h4><ul>`;
            speed.issues.forEach(i => { html += `<li>${i}</li>`; });
            html += `</ul></div>`;
        }
        if (speed.recommendations?.length) {
            html += `<div class="speed-recommendations"><h4>💡 Speed Recommendations</h4><ul>`;
            speed.recommendations.forEach(r => { html += `<li>${r}</li>`; });
            html += `</ul></div>`;
        }
        $('#speed-content').html(html);
    }

    // ===== SECTION 11: ACTION PLAN =====
    function displayActionPlan(data) {
        const plan = data.action_plan_30_days || [];
        if (!plan.length) { $('#action-content').html('<p class="no-data">No action plan available</p>'); return; }
        let html = '<div class="action-timeline">';
        plan.forEach(item => {
            const pc = (item.priority || 'medium').toLowerCase();
            html += `<div class="action-item priority-${pc}">
                <div class="action-week">${item.week || 'Week 1'}</div>
                <div class="action-content">
                    <div class="action-priority">${item.priority || 'Medium'} Priority</div>
                    <h4>${item.action}</h4>
                    <p class="action-impact"><strong>Expected Impact:</strong> ${item.expected_impact}</p>
                </div>
            </div>`;
        });
        html += '</div>';
        $('#action-content').html(html);
    }

    // ===== HELPERS =====
    function formatText(text) {
        if (!text) return '';
        return text.replace(/\\n/g, '<br>').replace(/\n/g, '<br>');
    }

    function setupCollapsibleSections() {
        $(document).on('click', '.collapsible', function () {
            const id = $(this).data('target');
            const content = $('#' + id);
            const icon = $(this).find('.toggle-icon');
            content.slideToggle(300);
            $(this).toggleClass('active');
            icon.text($(this).hasClass('active') ? '▼' : '▶');
        });
    }

} // END initSEOAnalyzer
