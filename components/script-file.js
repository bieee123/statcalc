// Fungsi untuk menambahkan header dan footer
document.addEventListener('DOMContentLoaded', function() {
    // Memuat header
    fetch('components/header-file.html')
        .then(response => response.text())
        .then(data => {
            document.querySelector('header').innerHTML = data;
            
            // Menambahkan fungsionalitas menu mobile setelah header dimuat
            setupMobileMenu();
            
            // Mengatur link aktif berdasarkan URL saat ini
            setActiveLink();
        })
        .catch(error => console.error('Error loading header:', error));

    // Memuat footer
    fetch('components/footer-file.html')
        .then(response => response.text())
        .then(data => {
            document.querySelector('footer').innerHTML = data;
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
    
    // Mencari link yang sesuai dengan URL saat ini di desktop nav
    const desktopLinks = document.querySelectorAll('.desktop-nav a');
    desktopLinks.forEach(link => {
        if (currentPath === link.getAttribute('href') || currentPath.includes(link.getAttribute('href').split('/')[1])) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
    
    // Mencari link yang sesuai dengan URL saat ini di mobile nav
    const mobileLinks = document.querySelectorAll('.mobile-nav a');
    mobileLinks.forEach(link => {
        if (currentPath === link.getAttribute('href') || currentPath.includes(link.getAttribute('href').split('/')[1])) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}
