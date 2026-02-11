// Valentine's Website - Page Progression System
// This manages which pages are unlocked and accessible

const PageManager = {
    // Define the page order
    pages: ['index', 'timeline', 'photos', 'love-cycle', 'game', 'surprise'],
    
    // Get current page name from URL
    getCurrentPage: function() {
        const path = window.location.pathname;
        const filename = path.substring(path.lastIndexOf('/') + 1);
        if (filename === '' || filename === 'index.html') return 'index';
        return filename.replace('.html', '');
    },
    
    // Get unlocked pages from localStorage
    getUnlockedPages: function() {
        const unlocked = localStorage.getItem('unlockedPages');
        return unlocked ? JSON.parse(unlocked) : ['index'];
    },
    
    // Save unlocked pages to localStorage
    saveUnlockedPages: function(pages) {
        localStorage.setItem('unlockedPages', JSON.stringify(pages));
    },
    
    // Unlock a page
    unlockPage: function(pageName) {
        const unlocked = this.getUnlockedPages();
        if (!unlocked.includes(pageName)) {
            unlocked.push(pageName);
            this.saveUnlockedPages(unlocked);
        }
    },
    
    // Check if a page is unlocked
    isPageUnlocked: function(pageName) {
        return this.getUnlockedPages().includes(pageName);
    },
    
    // Get next page in sequence
    getNextPage: function() {
        const current = this.getCurrentPage();
        const currentIndex = this.pages.indexOf(current);
        if (currentIndex < this.pages.length - 1) {
            return this.pages[currentIndex + 1];
        }
        return null;
    },
    
    // Check if current page should be accessible
    checkAccess: function() {
        const currentPage = this.getCurrentPage();
        
        // Home page is always accessible
        if (currentPage === 'index') {
            return true;
        }
        
        // Check if this page is unlocked
        if (!this.isPageUnlocked(currentPage)) {
            // Redirect to home
            window.location.href = 'index.html';
            return false;
        }
        
        return true;
    },
    
    // Mark current page as completed and unlock next page
    completeCurrentPage: function() {
        const nextPage = this.getNextPage();
        if (nextPage) {
            this.unlockPage(nextPage);
            return nextPage + '.html';
        }
        return null;
    },
    
    // Update navigation to show only unlocked pages
    updateNavigation: function() {
        const nav = document.querySelector('nav ul');
        if (!nav) return;
        
        const unlocked = this.getUnlockedPages();
        const currentPage = this.getCurrentPage();
        
        // Clear existing nav
        nav.innerHTML = '';
        
        // Add only unlocked pages
        this.pages.forEach(page => {
            if (unlocked.includes(page)) {
                const li = document.createElement('li');
                const a = document.createElement('a');
                
                // Set page display names and icons
                const pageInfo = {
                    'index': { icon: '🏠', name: 'Home' },
                    'timeline': { icon: '📅', name: 'Timeline' },
                    'photos': { icon: '📸', name: 'Photos' },
                    'love-cycle': { icon: '✨', name: 'Reasons' },
                    'game': { icon: '🎮', name: 'Game' },
                    'surprise': { icon: '🎁', name: 'Surprise' }
                };
                
                a.href = page + '.html';
                a.textContent = pageInfo[page].icon + ' ' + pageInfo[page].name;
                
                if (page === currentPage) {
                    a.classList.add('active');
                }
                
                li.appendChild(a);
                nav.appendChild(li);
            }
        });
    },
    
    // Initialize the page manager
    init: function() {
        // Check access to current page
        if (!this.checkAccess()) {
            return;
        }
        
        // Update navigation
        this.updateNavigation();
    },
    
    // Reset progress (for testing)
    resetProgress: function() {
        localStorage.removeItem('unlockedPages');
        window.location.href = 'index.html';
    }
};

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    PageManager.init();
});
