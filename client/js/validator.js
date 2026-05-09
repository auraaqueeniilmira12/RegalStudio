// ============================================
// REGALSTUDIO - VALIDATOR
// Form validation utilities
// ============================================

const Validator = {
    // Validate email format
    email: function(email) {
        const re = /^[^\s@]+@([^\s@]+\.)+[^\s@]+$/;
        return re.test(email);
    },
    
    // Validate phone number (10-13 digits)
    phone: function(phone) {
        const re = /^[0-9]{10,13}$/;
        return re.test(phone);
    },
    
    // Validate password (min 6 characters)
    password: function(password) {
        return password && password.length >= 6;
    },
    
    // Validate password strength
    passwordStrength: function(password) {
        let strength = 0;
        if (password.length >= 6) strength++;
        if (password.length >= 10) strength++;
        if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
        if (/[0-9]/.test(password)) strength++;
        if (/[^a-zA-Z0-9]/.test(password)) strength++;
        
        const levels = ['Sangat Lemah', 'Lemah', 'Sedang', 'Kuat', 'Sangat Kuat'];
        const colors = ['#EF4444', '#F59E0B', '#F59E0B', '#10B981', '#10B981'];
        
        return {
            score: strength,
            level: levels[strength - 1] || 'Sangat Lemah',
            color: colors[strength - 1] || '#EF4444',
            percent: strength * 20
        };
    },
    
    // Validate name (min 2 characters, letters and spaces only)
    name: function(name) {
        const re = /^[a-zA-Z\s]{2,50}$/;
        return re.test(name.trim());
    },
    
    // Validate URL
    url: function(url) {
        const re = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
        return re.test(url);
    },
    
    // Validate number
    number: function(value, min, max) {
        const num = parseFloat(value);
        if (isNaN(num)) return false;
        if (min !== undefined && num < min) return false;
        if (max !== undefined && num > max) return false;
        return true;
    },
    
    // Validate not empty
    required: function(value) {
        return value !== null && value !== undefined && value.toString().trim() !== '';
    },
    
    // Validate file size (max MB)
    fileSize: function(file, maxMB) {
        return file.size <= maxMB * 1024 * 1024;
    },
    
    // Validate file type
    fileType: function(file, allowedTypes) {
        return allowedTypes.includes(file.type);
    },
    
    // Show error message
    showError: function(input, message) {
        const formGroup = input.closest('.form-group');
        if (!formGroup) return;
        
        // Remove existing error
        const existingError = formGroup.querySelector('.error-message');
        if (existingError) existingError.remove();
        
        // Add error class
        input.classList.add('error');
        
        // Create error message
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;
        errorDiv.style.cssText = `
            color: #EF4444;
            font-size: 0.7rem;
            margin-top: 0.25rem;
        `;
        
        formGroup.appendChild(errorDiv);
    },
    
    // Remove error
    removeError: function(input) {
        const formGroup = input.closest('.form-group');
        if (!formGroup) return;
        
        input.classList.remove('error');
        const error = formGroup.querySelector('.error-message');
        if (error) error.remove();
    },
    
    // Validate form
    validateForm: function(form, rules) {
        let isValid = true;
        const errors = {};
        
        for (const field in rules) {
            const input = form.querySelector(`[name="${field}"], #${field}`);
            if (!input) continue;
            
            const value = input.value;
            const fieldRules = rules[field];
            
            // Required validation
            if (fieldRules.required && !Validator.required(value)) {
                Validator.showError(input, fieldRules.messages?.required || `${field} wajib diisi`);
                isValid = false;
                errors[field] = fieldRules.messages?.required || `${field} wajib diisi`;
                continue;
            }
            
            // Email validation
            if (fieldRules.email && value && !Validator.email(value)) {
                Validator.showError(input, fieldRules.messages?.email || 'Format email tidak valid');
                isValid = false;
                errors[field] = fieldRules.messages?.email || 'Format email tidak valid';
                continue;
            }
            
            // Phone validation
            if (fieldRules.phone && value && !Validator.phone(value)) {
                Validator.showError(input, fieldRules.messages?.phone || 'Nomor telepon tidak valid (10-13 digit)');
                isValid = false;
                errors[field] = fieldRules.messages?.phone || 'Nomor telepon tidak valid (10-13 digit)';
                continue;
            }
            
            // Password validation
            if (fieldRules.password && value && !Validator.password(value)) {
                Validator.showError(input, fieldRules.messages?.password || 'Password minimal 6 karakter');
                isValid = false;
                errors[field] = fieldRules.messages?.password || 'Password minimal 6 karakter';
                continue;
            }
            
            // Min length validation
            if (fieldRules.minLength && value && value.length < fieldRules.minLength) {
                Validator.showError(input, fieldRules.messages?.minLength || `Minimal ${fieldRules.minLength} karakter`);
                isValid = false;
                errors[field] = fieldRules.messages?.minLength || `Minimal ${fieldRules.minLength} karakter`;
                continue;
            }
            
            // Max length validation
            if (fieldRules.maxLength && value && value.length > fieldRules.maxLength) {
                Validator.showError(input, fieldRules.messages?.maxLength || `Maksimal ${fieldRules.maxLength} karakter`);
                isValid = false;
                errors[field] = fieldRules.messages?.maxLength || `Maksimal ${fieldRules.maxLength} karakter`;
                continue;
            }
            
            // If no error, remove error
            Validator.removeError(input);
        }
        
        return { isValid, errors };
    }
};

// Export for use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Validator;
}