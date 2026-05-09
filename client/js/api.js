// ============================================
// REGALSTUDIO - API CLIENT
// Backend communication (AJAX / Fetch)
// ============================================

const API = {
    // Base URL - ganti dengan URL backend saat production
    baseURL: 'http://localhost:3000/api',
    
    // Current user session
    currentUser: null,
    
    // Initialize API (check session)
    init: function() {
        // Check session from localStorage/sessionStorage
        const session = localStorage.getItem('regalstudio_session') || sessionStorage.getItem('regalstudio_session');
        if (session) {
            this.currentUser = JSON.parse(session);
        }
        return this;
    },
    
    // Generic fetch wrapper
    request: async function(endpoint, options = {}) {
        const url = this.baseURL + endpoint;
        const defaultOptions = {
            headers: {
                'Content-Type': 'application/json',
            }
        };
        
        // Add auth token if user is logged in
        if (this.currentUser && this.currentUser.token) {
            defaultOptions.headers['Authorization'] = `Bearer ${this.currentUser.token}`;
        }
        
        const mergedOptions = {
            ...defaultOptions,
            ...options,
            headers: {
                ...defaultOptions.headers,
                ...options.headers
            }
        };
        
        try {
            const response = await fetch(url, mergedOptions);
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.message || 'Something went wrong');
            }
            
            return { success: true, data };
        } catch (error) {
            console.error('API Error:', error);
            return { success: false, error: error.message };
        }
    },
    
    // ========== AUTH ENDPOINTS ==========
    
    // Login user
    login: async function(email, password, rememberMe = false) {
        const result = await this.request('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password })
        });
        
        if (result.success && result.data.token) {
            const userData = {
                id: result.data.userId,
                email: result.data.email,
                name: result.data.name,
                role: result.data.role,
                token: result.data.token,
                loginAt: new Date().toISOString()
            };
            
            if (rememberMe) {
                localStorage.setItem('regalstudio_session', JSON.stringify(userData));
            } else {
                sessionStorage.setItem('regalstudio_session', JSON.stringify(userData));
            }
            
            this.currentUser = userData;
        }
        
        return result;
    },
    
    // Register user
    register: async function(userData) {
        return await this.request('/auth/register', {
            method: 'POST',
            body: JSON.stringify(userData)
        });
    },
    
    // Logout
    logout: function() {
        localStorage.removeItem('regalstudio_session');
        sessionStorage.removeItem('regalstudio_session');
        this.currentUser = null;
        window.location.href = 'login.html';
    },
    
    // Forgot password
    forgotPassword: async function(email) {
        return await this.request('/auth/forgot-password', {
            method: 'POST',
            body: JSON.stringify({ email })
        });
    },
    
    // Reset password
    resetPassword: async function(token, newPassword) {
        return await this.request('/auth/reset-password', {
            method: 'POST',
            body: JSON.stringify({ token, newPassword })
        });
    },
    
    // Get current user profile
    getProfile: async function() {
        return await this.request('/auth/profile', {
            method: 'GET'
        });
    },
    
    // Update profile
    updateProfile: async function(profileData) {
        return await this.request('/auth/profile', {
            method: 'PUT',
            body: JSON.stringify(profileData)
        });
    },
    
    // Change password
    changePassword: async function(oldPassword, newPassword) {
        return await this.request('/auth/change-password', {
            method: 'POST',
            body: JSON.stringify({ oldPassword, newPassword })
        });
    },
    
    // ========== SERVICES ENDPOINTS ==========
    
    // Get all services
    getServices: async function(category = null) {
        let endpoint = '/services';
        if (category) {
            endpoint += `?category=${category}`;
        }
        return await this.request(endpoint, { method: 'GET' });
    },
    
    // Get single service by ID
    getServiceById: async function(id) {
        return await this.request(`/services/${id}`, { method: 'GET' });
    },
    
    // Create service (admin only)
    createService: async function(serviceData) {
        return await this.request('/services', {
            method: 'POST',
            body: JSON.stringify(serviceData)
        });
    },
    
    // Update service (admin only)
    updateService: async function(id, serviceData) {
        return await this.request(`/services/${id}`, {
            method: 'PUT',
            body: JSON.stringify(serviceData)
        });
    },
    
    // Delete service (admin only)
    deleteService: async function(id) {
        return await this.request(`/services/${id}`, {
            method: 'DELETE'
        });
    },
    
    // ========== ORDERS ENDPOINTS ==========
    
    // Create new order
    createOrder: async function(orderData) {
        return await this.request('/orders', {
            method: 'POST',
            body: JSON.stringify(orderData)
        });
    },
    
    // Get all orders (admin: all, user: own orders)
    getOrders: async function(status = null) {
        let endpoint = '/orders';
        if (status) {
            endpoint += `?status=${status}`;
        }
        return await this.request(endpoint, { method: 'GET' });
    },
    
    // Get single order by ID
    getOrderById: async function(id) {
        return await this.request(`/orders/${id}`, { method: 'GET' });
    },
    
    // Update order status (admin only)
    updateOrderStatus: async function(id, status, notes = '') {
        return await this.request(`/orders/${id}/status`, {
            method: 'PUT',
            body: JSON.stringify({ status, notes })
        });
    },
    
    // Upload payment proof
    uploadPaymentProof: async function(orderId, file) {
        const formData = new FormData();
        formData.append('paymentProof', file);
        
        return await this.request(`/orders/${orderId}/payment`, {
            method: 'POST',
            body: formData,
            headers: {} // Let browser set Content-Type for FormData
        });
    },
    
    // Cancel order
    cancelOrder: async function(id, reason = '') {
        return await this.request(`/orders/${id}/cancel`, {
            method: 'POST',
            body: JSON.stringify({ reason })
        });
    },
    
    // ========== PORTFOLIO ENDPOINTS ==========
    
    // Get all portfolios
    getPortfolios: async function(category = null) {
        let endpoint = '/portfolios';
        if (category) {
            endpoint += `?category=${category}`;
        }
        return await this.request(endpoint, { method: 'GET' });
    },
    
    // Get single portfolio
    getPortfolioById: async function(id) {
        return await this.request(`/portfolios/${id}`, { method: 'GET' });
    },
    
    // Create portfolio (admin only)
    createPortfolio: async function(portfolioData) {
        return await this.request('/portfolios', {
            method: 'POST',
            body: JSON.stringify(portfolioData)
        });
    },
    
    // Update portfolio (admin only)
    updatePortfolio: async function(id, portfolioData) {
        return await this.request(`/portfolios/${id}`, {
            method: 'PUT',
            body: JSON.stringify(portfolioData)
        });
    },
    
    // Delete portfolio (admin only)
    deletePortfolio: async function(id) {
        return await this.request(`/portfolios/${id}`, {
            method: 'DELETE'
        });
    },
    
    // ========== E-BOOK ENDPOINTS ==========
    
    // Get all e-books
    getEbooks: async function(category = null) {
        let endpoint = '/ebooks';
        if (category) {
            endpoint += `?category=${category}`;
        }
        return await this.request(endpoint, { method: 'GET' });
    },
    
    // Get single e-book
    getEbookById: async function(id) {
        return await this.request(`/ebooks/${id}`, { method: 'GET' });
    },
    
    // Purchase e-book
    purchaseEbook: async function(ebookId, paymentMethod) {
        return await this.request('/ebooks/purchase', {
            method: 'POST',
            body: JSON.stringify({ ebookId, paymentMethod })
        });
    },
    
    // Download e-book (after purchase)
    downloadEbook: async function(purchaseId) {
        return await this.request(`/ebooks/download/${purchaseId}`, { method: 'GET' });
    },
    
    // ========== INQUIRIES ENDPOINTS ==========
    
    // Send contact message
    sendInquiry: async function(inquiryData) {
        return await this.request('/inquiries', {
            method: 'POST',
            body: JSON.stringify(inquiryData)
        });
    },
    
    // Get all inquiries (admin only)
    getInquiries: async function(status = null) {
        let endpoint = '/inquiries';
        if (status) {
            endpoint += `?status=${status}`;
        }
        return await this.request(endpoint, { method: 'GET' });
    },
    
    // Update inquiry status (admin only)
    updateInquiryStatus: async function(id, status, response = '') {
        return await this.request(`/inquiries/${id}`, {
            method: 'PUT',
            body: JSON.stringify({ status, response })
        });
    },
    
    // ========== STATISTICS ENDPOINTS ==========
    
    // Get dashboard statistics (admin only)
    getStats: async function() {
        return await this.request('/admin/stats', { method: 'GET' });
    },
    
    // Get sales report (admin only)
    getSalesReport: async function(startDate, endDate) {
        let endpoint = '/admin/sales-report';
        if (startDate && endDate) {
            endpoint += `?start=${startDate}&end=${endDate}`;
        }
        return await this.request(endpoint, { method: 'GET' });
    },
    
    // ========== UPLOAD ENDPOINTS ==========
    
    // Upload file (image, document)
    uploadFile: async function(file, type = 'general') {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('type', type);
        
        return await this.request('/upload', {
            method: 'POST',
            body: formData,
            headers: {}
        });
    },
    
    // ========== HELPER METHODS ==========
    
    // Check if user is logged in
    isLoggedIn: function() {
        return this.currentUser !== null;
    },
    
    // Check if user is admin
    isAdmin: function() {
        return this.currentUser && this.currentUser.role === 'admin';
    },
    
    // Get auth token
    getToken: function() {
        return this.currentUser ? this.currentUser.token : null;
    },
    
    // Handle API error (show notification)
    handleError: function(error) {
        console.error('API Error:', error);
        
        // Show notification to user
        const notification = document.createElement('div');
        notification.className = 'api-error-notification';
        notification.innerHTML = `
            <i class="fas fa-exclamation-circle"></i>
            <span>${error.message || 'Terjadi kesalahan. Silakan coba lagi.'}</span>
        `;
        notification.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: #EF4444;
            color: white;
            padding: 12px 24px;
            border-radius: 12px;
            z-index: 10000;
            animation: slideIn 0.3s ease;
            display: flex;
            align-items: center;
            gap: 10px;
        `;
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 5000);
    }
};

// Initialize API on load
API.init();

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = API;
}