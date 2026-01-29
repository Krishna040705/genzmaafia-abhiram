// Main Application Class
class ABHIRAMApp {
    constructor() {
        this.cart = [
            { id: 1, name: "Premium Cotton T-Shirt", price: 499, quantity: 1, image: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80" },
            { id: 2, name: "Smart Watch Pro", price: 2499, quantity: 1, image: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80" }
        ];
        this.init();
    }

    // Initialize the application
    init() {
        this.setupEventListeners();
        this.updateCartCount();
        this.setupCategoryFilter();
        this.setupSmoothScrolling();
        this.setupPromoterButtons();
    }

    // Setup all event listeners
    setupEventListeners() {
        // Search functionality
        document.getElementById('searchBtn').addEventListener('click', () => this.performSearch());
        document.getElementById('searchInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.performSearch();
        });

        // Cart functionality
        document.getElementById('cartBtn').addEventListener('click', () => this.showCartModal());
        document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.addToCart(e));
        });

        // Promotion functionality
        document.querySelectorAll('.promote-product-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.showPromotionModal(e));
        });

        // Account and wishlist buttons
        document.getElementById('accountBtn').addEventListener('click', () => this.showAccountModal());
        document.getElementById('wishlistBtn').addEventListener('click', () => this.showWishlistModal());

        // Promoter registration buttons
        document.querySelectorAll('.promoter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                this.showPromoterRegistration();
            });
        });

        // Modal close buttons
        document.querySelectorAll('.close-modal').forEach(btn => {
            btn.addEventListener('click', () => this.closeAllModals());
        });

        // Close modal when clicking outside
        window.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                this.closeAllModals();
            }
        });

        // Newsletter subscription
        document.getElementById('subscribeBtn').addEventListener('click', () => this.subscribeNewsletter());

        // Footer links
        document.querySelectorAll('.footer-links a[data-category]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const category = e.target.getAttribute('data-category');
                this.filterProductsByCategory(category);
            });
        });

        // Checkout button
        document.querySelector('.checkout-btn')?.addEventListener('click', () => this.checkout());
    }

    // Setup category filtering
    setupCategoryFilter() {
        const categoryButtons = document.querySelectorAll('.category-btn');
        const productCards = document.querySelectorAll('.product-card');
        
        categoryButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Remove active class from all buttons
                categoryButtons.forEach(btn => btn.classList.remove('active'));
                
                // Add active class to clicked button
                button.classList.add('active');
                
                const selectedCategory = button.getAttribute('data-category');
                
                // Show/hide products based on category
                productCards.forEach(card => {
                    if (selectedCategory === 'all' || card.getAttribute('data-category') === selectedCategory) {
                        card.style.display = 'block';
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'translateY(0)';
                        }, 10);
                    } else {
                        card.style.opacity = '0';
                        card.style.transform = 'translateY(20px)';
                        setTimeout(() => {
                            card.style.display = 'none';
                        }, 300);
                    }
                });
            });
        });
    }

    // Setup smooth scrolling
    setupSmoothScrolling() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                
                const targetId = this.getAttribute('href');
                if (targetId === '#') return;
                
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop - 100,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    // Setup promoter buttons
    setupPromoterButtons() {
        document.querySelectorAll('.promoter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                this.showNotification("Promoter registration page will open in a new window.", "info");
                // In a real app, this would redirect to promoter registration
                setTimeout(() => {
                    window.open('#', '_blank');
                }, 1000);
            });
        });
    }

    // Perform search
    performSearch() {
        const searchInput = document.getElementById('searchInput');
        const searchTerm = searchInput.value.trim();
        
        if (searchTerm) {
            this.showNotification(`Searching for: "${searchTerm}"`, "info");
            // In a real app, this would make an API call and display results
            searchInput.value = '';
        } else {
            this.showNotification('Please enter a search term.', "warning");
        }
    }

    // Add product to cart
    addToCart(event) {
        const productId = event.target.getAttribute('data-product-id');
        const productCard = event.target.closest('.product-card');
        const productName = productCard.querySelector('.product-title').textContent;
        const productPrice = parseInt(productCard.querySelector('.current-price').textContent.replace('₹', '').replace(',', ''));
        const productImage = productCard.querySelector('img').src;
        
        // Check if product is already in cart
        const existingItem = this.cart.find(item => item.id == productId);
        
        if (existingItem) {
            existingItem.quantity++;
        } else {
            this.cart.push({
                id: productId,
                name: productName,
                price: productPrice,
                quantity: 1,
                image: productImage
            });
        }
        
        this.updateCartCount();
        this.showNotification(`${productName} added to cart!`, "success");
        
        // Add animation to cart icon
        const cartIcon = document.getElementById('cartBtn');
        cartIcon.style.transform = 'scale(1.2)';
        setTimeout(() => {
            cartIcon.style.transform = 'scale(1)';
        }, 300);
    }

    // Update cart count display
    updateCartCount() {
        const totalItems = this.cart.reduce((total, item) => total + item.quantity, 0);
        document.getElementById('cartCount').textContent = totalItems;
    }

    // Show cart modal
    showCartModal() {
        const modal = document.getElementById('cartModal');
        const cartItemsContainer = document.getElementById('cartItems');
        const cartTotalElement = document.getElementById('cartTotal');
        
        // Clear existing items
        cartItemsContainer.innerHTML = '';
        
        if (this.cart.length === 0) {
            cartItemsContainer.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
            cartTotalElement.textContent = '₹0';
        } else {
            // Calculate total
            let total = 0;
            
            // Add each item to cart display
            this.cart.forEach(item => {
                const itemTotal = item.price * item.quantity;
                total += itemTotal;
                
                const cartItem = document.createElement('div');
                cartItem.className = 'cart-item';
                cartItem.innerHTML = `
                    <div class="cart-item-img">
                        <img src="${item.image}" alt="${item.name}">
                    </div>
                    <div class="cart-item-info">
                        <div class="cart-item-title">${item.name}</div>
                        <div class="cart-item-price">₹${item.price} x ${item.quantity}</div>
                    </div>
                    <button class="cart-item-remove" data-product-id="${item.id}">
                        <i class="fas fa-trash"></i>
                    </button>
                `;
                
                cartItemsContainer.appendChild(cartItem);
            });
            
            // Add event listeners to remove buttons
            cartItemsContainer.querySelectorAll('.cart-item-remove').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const productId = e.target.closest('.cart-item-remove').getAttribute('data-product-id');
                    this.removeFromCart(productId);
                });
            });
            
            cartTotalElement.textContent = `₹${total}`;
        }
        
        modal.style.display = 'flex';
    }

    // Remove item from cart
    removeFromCart(productId) {
        this.cart = this.cart.filter(item => item.id != productId);
        this.updateCartCount();
        this.showCartModal(); // Refresh cart modal
        this.showNotification('Item removed from cart', "info");
    }

    // Show promotion modal
    showPromotionModal(event) {
        const productId = event.target.getAttribute('data-product-id');
        const productCard = event.target.closest('.product-card');
        const productName = productCard.querySelector('.product-title').textContent;
        const productPrice = productCard.querySelector('.current-price').textContent;
        const productImage = productCard.querySelector('img').src;
        const productCategory = productCard.querySelector('.product-category').textContent;
        
        const modal = document.getElementById('promotionModal');
        const promotionDetails = document.getElementById('promotionDetails');
        const promotionLink = document.getElementById('promotionLink');
        
        // Generate unique promotion link
        const uniqueId = `ABH${productId}${Date.now().toString().slice(-6)}`;
        const promotionUrl = `https://abhiram.com/promote/${uniqueId}`;
        
        // Set promotion details
        promotionDetails.innerHTML = `
            <div class="promotion-product">
                <img src="${productImage}" alt="${productName}" style="width: 100px; height: 100px; object-fit: contain; margin-bottom: 15px;">
                <h4>${productName}</h4>
                <p>${productCategory}</p>
                <p><strong>Price: ${productPrice}</strong></p>
                <p>You earn <strong>₹${Math.round(parseInt(productPrice.replace('₹', '').replace(',', '')) * 0.1)}</strong> commission per sale!</p>
            </div>
        `;
        
        // Set promotion link
        promotionLink.textContent = promotionUrl;
        
        // Add event listener to copy link button
        const copyBtn = document.querySelector('.copy-link-btn');
        copyBtn.onclick = () => this.copyToClipboard(promotionUrl);
        
        // Add event listeners to share buttons
        document.querySelectorAll('.share-btn').forEach(btn => {
            btn.onclick = (e) => this.shareProduct(e, productName, promotionUrl);
        });
        
        modal.style.display = 'flex';
    }

    // Copy text to clipboard
    copyToClipboard(text) {
        navigator.clipboard.writeText(text)
            .then(() => {
                this.showNotification('Link copied to clipboard!', "success");
            })
            .catch(err => {
                console.error('Failed to copy: ', err);
                this.showNotification('Failed to copy link', "error");
            });
    }

    // Share product on social media
    shareProduct(event, productName, url) {
        const platform = event.target.classList.contains('facebook') ? 'facebook' : 
                        event.target.classList.contains('whatsapp') ? 'whatsapp' : 
                        'twitter';
        
        let shareUrl;
        const text = `Check out ${productName} on ABHIRAM at factory-direct prices!`;
        
        switch(platform) {
            case 'facebook':
                shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(text)}`;
                break;
            case 'whatsapp':
                shareUrl = `https://wa.me/?text=${encodeURIComponent(`${text} ${url}`)}`;
                break;
            case 'twitter':
                shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
                break;
        }
        
        window.open(shareUrl, '_blank');
        this.showNotification(`Sharing on ${platform}...`, "info");
    }

    // Show account modal
    showAccountModal() {
        this.showNotification("Account page will open soon.", "info");
        // In a real app, this would show account modal or redirect
    }

    // Show wishlist modal
    showWishlistModal() {
        this.showNotification("Wishlist page will open soon.", "info");
        // In a real app, this would show wishlist modal or redirect
    }

    // Show promoter registration
    showPromoterRegistration() {
        this.showNotification("Redirecting to promoter registration...", "info");
        // In a real app, this would open promoter registration page
    }

    // Filter products by category (for footer links)
    filterProductsByCategory(category) {
        const categoryMap = {
            'men': 'fashion',
            'women': 'fashion',
            'kids': 'fashion',
            'home': 'home',
            'electronics': 'electronics',
            'beauty': 'fashion'
        };
        
        const targetCategory = categoryMap[category] || 'all';
        
        // Find and click the corresponding category button
        const categoryButtons = document.querySelectorAll('.category-btn');
        categoryButtons.forEach(btn => {
            if (btn.getAttribute('data-category') === targetCategory) {
                btn.click();
            }
        });
        
        // Scroll to products section
        document.getElementById('products').scrollIntoView({ behavior: 'smooth' });
    }

    // Subscribe to newsletter
    subscribeNewsletter() {
        const emailInput = document.getElementById('newsletterEmail');
        const email = emailInput.value.trim();
        
        if (this.validateEmail(email)) {
            this.showNotification("Thank you for subscribing to our newsletter!", "success");
            emailInput.value = '';
        } else {
            this.showNotification("Please enter a valid email address.", "warning");
        }
    }

    // Validate email address
    validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    // Checkout process
    checkout() {
        if (this.cart.length === 0) {
            this.showNotification("Your cart is empty!", "warning");
            return;
        }
        
        this.showNotification("Proceeding to checkout...", "info");
        this.closeAllModals();
        
        // In a real app, this would redirect to checkout page
        setTimeout(() => {
            const total = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            alert(`Checkout Complete!\n\nTotal Amount: ₹${total}\n\nThank you for shopping with ABHIRAM!`);
            this.cart = [];
            this.updateCartCount();
        }, 1000);
    }

    // Show notification
    showNotification(message, type = "info") {
        // Remove existing notification if any
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }
        
        // Create new notification
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        
        let icon = 'info-circle';
        if (type === 'success') icon = 'check-circle';
        if (type === 'warning') icon = 'exclamation-circle';
        if (type === 'error') icon = 'times-circle';
        
        notification.innerHTML = `
            <i class="fas fa-${icon}"></i>
            <span>${message}</span>
        `;
        
        document.body.appendChild(notification);
        
        // Show notification
        setTimeout(() => {
            notification.style.display = 'flex';
        }, 10);
        
        // Hide notification after 3 seconds
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }

    // Close all modals
    closeAllModals() {
        document.querySelectorAll('.modal').forEach(modal => {
            modal.style.display = 'none';
        });
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const app = new ABHIRAMApp();
});

// Add some sample products data for demonstration
const sampleProducts = [
    {
        id: 1,
        name: "Premium Cotton T-Shirt",
        category: "fashion",
        price: 499,
        originalPrice: 1299,
        image: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
        description: "High-quality cotton t-shirt, perfect for casual wear."
    },
    {
        id: 2,
        name: "Smart Watch Pro",
        category: "electronics",
        price: 2499,
        originalPrice: 5999,
        image: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
        description: "Feature-rich smartwatch with health monitoring."
    },
    {
        id: 3,
        name: "Non-Stick Cookware Set",
        category: "home",
        price: 1799,
        originalPrice: 4200,
        image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
        description: "Complete non-stick cookware set for your kitchen."
    }
];

// In a real application, you would fetch products from an API
// This is just for demonstration
console.log("ABHIRAM Factory-Direct E-commerce Platform Loaded");
console.log("Sample products available:", sampleProducts.length);