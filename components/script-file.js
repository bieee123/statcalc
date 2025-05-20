document.addEventListener('DOMContentLoaded', function() {
    // Find the correct container elements
    const headerContainer = document.getElementById('header-container') || document.querySelector('header');
    const footerContainer = document.getElementById('footer-container') || document.querySelector('footer');
    
    // Determine the correct path prefix based on the current location
    const pathPrefix = getPathPrefix();
    console.log('Current path prefix:', pathPrefix); // Debug log
    
    // Load header
    fetch(pathPrefix + 'components/header-file.html')
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to load header: ${response.status} ${response.statusText}`);
            }
            return response.text();
        })
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
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to load footer: ${response.status} ${response.statusText}`);
            }
            return response.text();
        })
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
 * This handles all navigational paths properly
 */
function getPathPrefix() {
    const currentPath = window.location.pathname;
    console.log('Current path:', currentPath); // Debug log
    
    // Check if we're at the root (ends with / or contains index.html)
    if (currentPath.endsWith('/') || 
        currentPath.endsWith('index.html') || 
        currentPath.split('/').filter(Boolean).length === 0) {
        return './';
    }
    
    // For pages in subdirectories (one level deep)
    return '../';
}

/**
 * Updates all navigation links to use the correct paths
 */
function updateNavigationLinks(container, pathPrefix) {
    const allLinks = container.querySelectorAll('a');
    
    allLinks.forEach(link => {
        const href = link.getAttribute('href');
        
        if (!href) return; // Skip if no href
        
        // Don't modify external links, anchors, or mailto links
        if (href.startsWith('http') || href.startsWith('#') || href.startsWith('mailto:')) {
            return;
        }
        
        // Step 1: Normalize the path by removing any existing ./ or ../ or leading /
        let normalizedHref = href;
        normalizedHref = normalizedHref.replace(/^\.\//g, ''); // Remove leading ./
        normalizedHref = normalizedHref.replace(/^\//g, '');   // Remove leading /
        
        // Don't modify paths that already have ../ if we're in a subdirectory
        if (pathPrefix === '../' && href.startsWith('../')) {
            return;
        }
        
        // Step 2: Add the correct prefix
        link.setAttribute('href', pathPrefix + normalizedHref);
        console.log(`Updated link: ${href} -> ${pathPrefix + normalizedHref}`); // Debug log
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
    let pageName = currentPath.split('/').pop() || 'index.html'; // Get the file name
    
    // If the path ends with /, assume it's the index page
    if (currentPath.endsWith('/') || pageName === '') {
        pageName = 'index.html';
    }
    
    // Also check for the directory name for section pages
    const pathParts = currentPath.split('/').filter(Boolean);
    const dirName = pathParts.length > 1 ? pathParts[pathParts.length - 2] : '';
    
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
        
        // Clean the href for comparison by removing path prefixes
        const cleanHref = href.replace(/^\.\.\/|^\.\/|^\//g, '');
        
        // Check if link points to current page
        const isActive = 
            cleanHref.endsWith(pageName) || 
            (pageName === 'index.html' && (cleanHref === '' || cleanHref === 'index.html')) ||
            (dirName && cleanHref.startsWith(dirName + '/'));
        
        if (isActive) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}
