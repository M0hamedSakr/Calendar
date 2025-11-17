/**
 * Footer Component
 */

export function initFooter() {
    const footerRoot = document.getElementById('footer-root');
    if (!footerRoot) return;

    const currentYear = new Date().getFullYear();

    const footer = `
        <footer class="site-footer">
            <div class="container">
                <div class="footer-content">
                    <div class="footer-brand">
                        <div class="logo">
                            <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
                                <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" fill="none" stroke-width="2"/>
                                <path d="M3 9h18M8 2v4M16 2v4" stroke="currentColor" stroke-width="2"/>
                            </svg>
                            BrandCal
                        </div>
                        <p>Smart calendar and scheduling platform for modern teams and individuals.</p>
                        <div class="footer-social">
                            <a href="https://twitter.com" target="_blank" rel="noopener" aria-label="Twitter">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"/>
                                </svg>
                            </a>
                            <a href="https://facebook.com" target="_blank" rel="noopener" aria-label="Facebook">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/>
                                </svg>
                            </a>
                            <a href="https://linkedin.com" target="_blank" rel="noopener" aria-label="LinkedIn">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"/>
                                    <circle cx="4" cy="4" r="2"/>
                                </svg>
                            </a>
                            <a href="https://github.com" target="_blank" rel="noopener" aria-label="GitHub">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22"/>
                                </svg>
                            </a>
                        </div>
                    </div>
                    
                    <div class="footer-links">
                        <div class="footer-column">
                            <h4>Product</h4>
                            <ul>
                                <li><a href="features.html">Features</a></li>
                                <li><a href="pricing.html">Pricing</a></li>
                                <li><a href="faq.html">FAQ</a></li>
                                <li><a href="help.html">Help Center</a></li>
                            </ul>
                        </div>
                        
                        <div class="footer-column">
                            <h4>Company</h4>
                            <ul>
                                <li><a href="about.html">About Us</a></li>
                                <li><a href="contact.html">Contact</a></li>
                                <li><a href="blog.html">Blog</a></li>
                                <li><a href="careers.html">Careers</a></li>
                            </ul>
                        </div>
                        
                        <div class="footer-column">
                            <h4>Resources</h4>
                            <ul>
                                <li><a href="help.html">Documentation</a></li>
                                <li><a href="help.html">API</a></li>
                                <li><a href="help.html">Integrations</a></li>
                                <li><a href="help.html">Community</a></li>
                            </ul>
                        </div>
                        
                        <div class="footer-column">
                            <h4>Legal</h4>
                            <ul>
                                <li><a href="terms.html">Terms of Service</a></li>
                                <li><a href="privacy.html">Privacy Policy</a></li>
                                <li><a href="cookies.html">Cookie Policy</a></li>
                                <li><a href="security.html">Security</a></li>
                            </ul>
                        </div>
                    </div>
                </div>
                
                <div class="footer-bottom">
                    <p>&copy; ${currentYear} BrandCal. All rights reserved.</p>
                    <div class="footer-bottom-links">
                        <a href="terms.html">Terms</a>
                        <a href="privacy.html">Privacy</a>
                        <a href="cookies.html">Cookies</a>
                    </div>
                </div>
            </div>
            
            <button class="back-to-top" id="back-to-top" title="Back to top">
                <svg width="24" height="24" viewBox="0 0 24 24">
                    <path d="M12 19V5M5 12l7-7 7 7" stroke="currentColor" stroke-width="2" fill="none"/>
                </svg>
            </button>
        </footer>
    `;

    footerRoot.innerHTML = footer;

    // Back to top functionality
    const backToTop = document.getElementById('back-to-top');
    
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    });

    backToTop?.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Auto-initialize
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initFooter);
} else {
    initFooter();
}

console.log('✅ Footer loaded');
