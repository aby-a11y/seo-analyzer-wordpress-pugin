<div class="wrap seo-analyzer-wrap">
    <h1 class="wp-heading-inline">
        <span class="dashicons dashicons-search" style="font-size: 30px; width: 30px; height: 30px;"></span>
        AI SEO Analyzer
    </h1>
    
    <hr class="wp-header-end">
    
    <div class="seo-analyzer-container">
        
        <!-- Analyzer Form -->
        <div class="seo-card">
            <h2>🔍 Analyze Website</h2>
            <p>Enter any website URL to get detailed SEO analysis</p>
            
            <form id="seo-analyze-form" class="seo-form">
                <div class="form-group">
                    <input 
                        type="url" 
                        id="website-url" 
                        name="url" 
                        class="regular-text seo-input" 
                        placeholder="https://example.com"
                        required
                    >
                    <button type="submit" class="button button-primary button-large">
                        <span class="dashicons dashicons-search"></span>
                        Analyze Website
                    </button>
                </div>
                
                <div id="loading" class="seo-loading" style="display:none;">
                    <span class="spinner is-active"></span>
                    <p>Analyzing website... This may take 20-30 seconds</p>
                </div>
            </form>
        </div>
        
        <!-- Results -->
        <div id="results-section" class="seo-card" style="display:none;">
            <h2>📊 Analysis Results</h2>
            <div id="report-content"></div>
        </div>
        
        <!-- Recent Reports -->
        <div class="seo-card">
            <h2>📋 Recent Reports</h2>
            <div id="recent-reports">
                <p style="color: #666;">Your analyzed websites will appear here</p>
            </div>
        </div>
        
    </div>
</div>
