document.addEventListener('DOMContentLoaded', function() {
    // Find the correct container elements
    const headerContainer = document.getElementById('header-container') || document.querySelector('header');
    const footerContainer = document.getElementById('footer-container') || document.querySelector('footer');
    
    // Determine the correct path prefix based on the current location
    const pathPrefix = getPathPrefix();
    
    // Load header
    fetch(pathPrefix + 'components/header-file.html')
        .then(response => response.text())
        .then(data => {
            if (headerContainer) {
                headerContainer.innerHTML = data;
                
                // Fix all navigation links to be relative to the root
                updateNavigationLinks(headerContainer, pathPrefix);
                
                // Add mobile menu functionality after header is loaded
                setupMobileMenu();
                
                // Set active link based on current URL
                setActiveLink();
            }
        })
        .catch(error => console.error('Error loading header:', error));

    // Load footer
    fetch(pathPrefix + 'components/footer-file.html')
        .then(response => response.text())
        .then(data => {
            if (footerContainer) {
                footerContainer.innerHTML = data;
                
                // Also update links in the footer if needed
                updateNavigationLinks(footerContainer, pathPrefix);
            }
        })
        .catch(error => console.error('Error loading footer:', error));
});

/**
 * Determines the correct path prefix based on the current location
 * This handles all specified file paths:
 * - index.html (root)
 * - basic-stats/basic_stats.html
 * - distributions/distributions.html
 * - inference/inference.html
 * - visualization/charts.html
 * - documentation/documentation.html
 */
function getPathPrefix() {
    const currentPath = window.location.pathname;
    
    // For the root page (index.html)
    if (currentPath.endsWith('/') || currentPath.endsWith('index.html')) {
        return './';
    }
    
    // For pages in subdirectories (one level deep)
    if (currentPath.includes('/')) {
        // Count the number of directory levels by counting slashes
        const parts = currentPath.split('/').filter(Boolean);
        if (parts.length >= 1) {
            return '../';
        }
    }
    
    // Default fallback
    return './';
}

/**
 * Updates all navigation links to use the correct paths
 */
function updateNavigationLinks(container, pathPrefix) {
    const allLinks = container.querySelectorAll('a');
    allLinks.forEach(link => {
        const href = link.getAttribute('href');
        
        if (!href) return; // Skip if no href
        
        if (href.startsWith('/')) {
            // Remove the leading slash to make relative to root
            link.setAttribute('href', pathPrefix + href.substring(1));
        }
        else if (!href.startsWith('http') && !href.startsWith('#') && !href.startsWith('mailto:')) {
            // For relative links that don't have pathPrefix already
            // Don't adjust links that are already properly prefixed, or are absolute URLs, 
            // anchors, or mailto links
            if (!href.startsWith(pathPrefix) && !href.startsWith('./') && !href.startsWith('../')) {
                link.setAttribute('href', pathPrefix + href);
            }
        }
    });
}

/**
 * Sets up the mobile menu toggle functionality
 */
function setupMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileNav = document.querySelector('.mobile-nav');
    
    if (mobileMenuBtn && mobileNav) {
        mobileMenuBtn.addEventListener('click', function() {
            mobileMenuBtn.classList.toggle('active');
            mobileNav.classList.toggle('open');
        });
    }
}

/**
 * Sets the active class on navigation links that match the current page
 */
function setActiveLink() {
    const currentPath = window.location.pathname;
    
    // Extract the page name from the path
    let pageName = currentPath.split('/').pop(); // Get the file name
    
    // If the path ends with /, assume it's the index page
    if (currentPath.endsWith('/') || pageName === '') {
        pageName = 'index.html';
    }
    
    // Also check for the directory name for section pages
    const dirName = currentPath.split('/').filter(Boolean).slice(-2, -1)[0] || '';
    
    // Find and mark active links in desktop and mobile navigation
    markActiveLinks(document.querySelectorAll('.desktop-nav a'), pageName, dirName);
    markActiveLinks(document.querySelectorAll('.mobile-nav a'), pageName, dirName);
}

/**
 * Marks the appropriate navigation links as active
 */
function markActiveLinks(links, pageName, dirName) {
    links.forEach(link => {
        const href = link.getAttribute('href') || '';
        
        // Clean the href for comparison
        const cleanHref = href.replace(/^\.\.\/|^\.\/|^\//g, '');
        
        // Check if link points to current page
        const isActive = 
            cleanHref.endsWith(pageName) || 
            (pageName === 'index.html' && cleanHref === '') ||
            cleanHref.includes(dirName + '/');
        
        if (isActive) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}
