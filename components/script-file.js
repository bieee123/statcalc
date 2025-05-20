// Fixed script-file.js
document.addEventListener('DOMContentLoaded', function() {
    // Find the correct container elements
    const headerContainer = document.getElementById('header-container') || document.querySelector('header');
    const footerContainer = document.getElementById('footer-container') || document.querySelector('footer');
    
    // Get the current path to determine relative path to components
    const pathPrefix = window.location.pathname.includes('/statcalc/') && 
                      !window.location.pathname.endsWith('/statcalc/') ? 
                      '../' : './';
    
    // Memuat header
    fetch(pathPrefix + 'components/header-file.html')
        .then(response => response.text())
        .then(data => {
            if (headerContainer) {
                headerContainer.innerHTML = data;
                
                // Fix all navigation links to be relative instead of absolute
                const allLinks = headerContainer.querySelectorAll('a');
                allLinks.forEach(link => {
                    const href = link.getAttribute('href');
                    if (href && href.startsWith('/')) {
                        // Remove the leading slash to make it relative
                        link.setAttribute('href', href.substring(1));
                    }
                });
                
                // Menambahkan fungsionalitas menu mobile setelah header dimuat
                setupMobileMenu();
                
                // Mengatur link aktif berdasarkan URL saat ini
                setActiveLink();
            }
        })
        .catch(error => console.error('Error loading header:', error));

    // Memuat footer
    fetch(pathPrefix + 'components/footer-file.html')
        .then(response => response.text())
        .then(data => {
            if (footerContainer) {
                footerContainer.innerHTML = data;
            }
        })
        .catch(error => console.error('Error loading footer:', error));
});

// Fungsi untuk mengatur menu mobile
function setupMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileNav = document.querySelector('.mobile-nav');
    
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function() {
            mobileMenuBtn.classList.toggle('active');
            mobileNav.classList.toggle('open');
        });
    }
}

// Fungsi untuk mengatur link aktif di menu
function setActiveLink() {
    const currentPath = window.location.pathname;
    const repoPath = '/statcalc/';
    
    // Strip the repo path from the current path for comparison
    const normalizedPath = currentPath.includes(repoPath) ? 
        currentPath.substring(currentPath.indexOf(repoPath) + repoPath.length) : 
        currentPath;
    
    // Mencari link yang sesuai dengan URL saat ini di desktop nav
    const desktopLinks = document.querySelectorAll('.desktop-nav a');
    desktopLinks.forEach(link => {
        let href = link.getAttribute('href');
        // Remove leading slash if present
        if (href.startsWith('/')) {
            href = href.substring(1);
        }
        
        if (normalizedPath === href || normalizedPath.includes(href.split('/')[0])) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
    
    // Mencari link yang sesuai dengan URL saat ini di mobile nav
    const mobileLinks = document.querySelectorAll('.mobile-nav a');
    mobileLinks.forEach(link => {
        let href = link.getAttribute('href');
        // Remove leading slash if present
        if (href.startsWith('/')) {
            href = href.substring(1);
        }
        
        if (normalizedPath === href || normalizedPath.includes(href.split('/')[0])) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}
