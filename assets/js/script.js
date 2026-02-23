jQuery(document).ready(function($) {
    
    // Handle form submission
    $('#seo-analyze-form').on('submit', function(e) {
        e.preventDefault();
        
        var url = $('#website-url').val().trim();
        
        if (!url) {
            alert('Please enter a URL');
            return;
        }
        
        // Show loading
        $('#loading').show();
        $('#results-section').hide();
        $('#website-url').prop('disabled', true);
        $('button[type="submit"]').prop('disabled', true);
        
        // AJAX request
        $.ajax({
            url: seoAnalyzer.ajaxurl,
            type: 'POST',
            data: {
                action: 'analyze_url',
                nonce: seoAnalyzer.nonce,
                url: url
            },
            timeout: 90000, // 90 seconds
            success: function(response) {
                $('#loading').hide();
                $('#website-url').prop('disabled', false);
                $('button[type="submit"]').prop('disabled', false);
                
                if (response.success) {
                    displayReport(response.data);
                    $('#results-section').show();
                    
                    // Scroll to results
                    $('html, body').animate({
                        scrollTop: $('#results-section').offset().top - 100
                    }, 500);
                } else {
                    alert('Error: ' + response.data);
                }
            },
            error: function(xhr, status, error) {
                $('#loading').hide();
                $('#website-url').prop('disabled', false);
                $('button[type="submit"]').prop('disabled', false);
                
                if (status === 'timeout') {
                    alert('Request timeout. The website is taking too long to analyze.');
                } else {
                    alert('Analysis failed: ' + error);
                }
            }
        });
    });
    
    // Display report
    function displayReport(report) {
        var html = '';
        
        // SEO Score Card
        var scoreColor = report.seo_score >= 80 ? '#28a745' : (report.seo_score >= 60 ? '#ffc107' : '#dc3545');
        
        html += '<div class="seo-score-card" style="background: linear-gradient(135deg, ' + scoreColor + ' 0%, ' + scoreColor + 'dd 100%);">';
        html += '<h3 style="color: white; margin: 0;">SEO Score</h3>';
        html += '<div class="score-display">';
        html += '<span class="score">' + report.seo_score + '</span>';
        html += '<span class="score-label">/100</span>';
        html += '</div>';
        html += '</div>';
        
        // Website Info
        html += '<div class="info-section">';
        html += '<h3>🌐 Website Overview</h3>';
        html += '<table class="info-table">';
        html += '<tr><th>URL:</th><td>' + report.url + '</td></tr>';
        html += '<tr><th>Title:</th><td>' + report.title + ' <span class="meta-info">(' + (report.title ? report.title.length : 0) + ' chars)</span></td></tr>';
        html += '<tr><th>Meta Description:</th><td>' + (report.meta_description || 'Not found') + ' <span class="meta-info">(' + (report.meta_description ? report.meta_description.length : 0) + ' chars)</span></td></tr>';
        html += '<tr><th>Word Count:</th><td>' + (report.word_count || 'N/A') + '</td></tr>';
        html += '</table>';
        html += '</div>';
        
        // SEO Issues
        if (report.seo_issues && report.seo_issues.length > 0) {
            html += '<div class="issues-section">';
            html += '<h3>⚠️ SEO Issues Found (' + report.seo_issues.length + ')</h3>';
            
            report.seo_issues.forEach(function(issue) {
                var priorityClass = 'priority-' + issue.priority.toLowerCase();
                var priorityIcon = issue.priority === 'High' ? '🔴' : (issue.priority === 'Medium' ? '🟡' : '🟢');
                
                html += '<div class="issue-card ' + priorityClass + '">';
                html += '<div class="issue-header">';
                html += '<span class="priority-badge">' + priorityIcon + ' ' + issue.priority + '</span>';
                html += '<span class="category-badge">' + issue.category + '</span>';
                html += '</div>';
                html += '<h4>' + issue.issue + '</h4>';
                html += '<p class="recommendation">' + issue.recommendation.replace(/\\n/g, '<br>') + '</p>';
                html += '</div>';
            });
            
            html += '</div>';
        } else {
            html += '<div class="success-message">';
            html += '<h3>✅ Great! No major issues found</h3>';
            html += '<p>Your website has a good SEO foundation.</p>';
            html += '</div>';
        }
        
        $('#report-content').html(html);
    }
    
});
