// DOM Elements
const loginModal = document.getElementById('loginModal');
const signupModal = document.getElementById('signupModal');
const swapBtn = document.getElementById('swapBtn');
const fromCitySelect = document.getElementById('fromCity');
const toCitySelect = document.getElementById('toCity');
const trainSearchForm = document.getElementById('trainSearchForm');
const travelDateInput = document.getElementById('traveldate');

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeDatePicker();
    setupEventListeners();
    preventSameCitySelection();
});

// Modal Functions
function openLoginModal() {
    loginModal.classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
}

function opensignupModal() {
    signupModal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal(event) {
    // Close modal if clicked outside or on close button
    if (event && event.target === event.currentTarget) {
        closeAllModals();
    } else if (!event) {
        closeAllModals();
    }
}

function closeAllModals() {
    loginModal.classList.remove('active');
    signupModal.classList.remove('active');
    document.body.style.overflow = 'auto';
}

// Swap Cities Functionality
function swapCities() {
    const fromValue = fromCitySelect.value;
    const toValue = toCitySelect.value;
    
    // Swap the values
    fromCitySelect.value = toValue;
    toCitySelect.value = fromValue;
    
    // Add visual feedback
    swapBtn.style.transform = 'translateY(-50%) rotate(180deg)';
    setTimeout(() => {
        swapBtn.style.transform = 'translateY(-50%) rotate(0deg)';
    }, 300);
    
    // Show notification
    showNotification('Cities swapped successfully!', 'success');
}

// Date Picker Initialization
function initializeDatePicker() {
    const today = new Date();
    const maxDate = new Date();
    maxDate.setMonth(today.getMonth() + 4); // Allow booking up to 4 months ahead
    
    // Set minimum date to today
    travelDateInput.min = today.toISOString().split('T')[0];
    
    // Set maximum date to 4 months from today
    travelDateInput.max = maxDate.toISOString().split('T')[0];
    
    // Set default date to today
    if (!travelDateInput.value) {
        travelDateInput.value = today.toISOString().split('T')[0];
    }
}

// Prevent Same City Selection
function preventSameCitySelection() {
    function updateOptions() {
        const fromValue = fromCitySelect.value;
        const toValue = toCitySelect.value;
        
        // If same city is selected, show warning
        if (fromValue && toValue && fromValue === toValue) {
            showNotification('Source and destination cannot be the same!', 'error');
            
            // Reset the last changed select
            if (event.target === fromCitySelect) {
                fromCitySelect.value = '';
            } else {
                toCitySelect.value = '';
            }
        }
    }
    
    fromCitySelect.addEventListener('change', updateOptions);
    toCitySelect.addEventListener('change', updateOptions);
}

// Form Validation and Submission
function validateTrainSearchForm(event) {
    event.preventDefault();
    
    const fromCity = fromCitySelect.value;
    const toCity = toCitySelect.value;
    const travelDate = travelDateInput.value;
    const trainClass = document.getElementById('trainClass').value;
    
    // Validation
    if (!fromCity || !toCity) {
        showNotification('Please select both source and destination cities', 'error');
        return false;
    }
    
    if (fromCity === toCity) {
        showNotification('Source and destination cannot be the same!', 'error');
        return false;
    }
    
    if (!travelDate) {
        showNotification('Please select a travel date', 'error');
        return false;
    }
    
    // Check if date is in the past
    const selectedDate = new Date(travelDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (selectedDate < today) {
        showNotification('Travel date cannot be in the past', 'error');
        return false;
    }
    
    // If all validations pass, show search results (simulation)
    showSearchResults(fromCity, toCity, travelDate, trainClass);
    return true;
}

// Simulate Search Results
function showSearchResults(from, to, date, trainClass) {
    const resultData = {
        from: from.charAt(0).toUpperCase() + from.slice(1),
        to: to.charAt(0).toUpperCase() + to.slice(1),
        date: formatDate(date),
        class: trainClass || 'Any Class'
    };
    
    showNotification(
        `Searching trains from ${resultData.from} to ${resultData.to} on ${resultData.date} for ${resultData.class}...`,
        'info'
    );
    
    // Simulate loading
    setTimeout(() => {
        showNotification('Search completed! In a different page(in development), train results would appear there.', 'success');
    }, 2000);
}

// Modal Form Handling
function handleLoginForm(event) {
    event.preventDefault();
    const phone = document.getElementById('loginPhone').value;
    
    if (validatePhone(phone)) {
        showNotification('OTP sent to your mobile number!', 'success');
        // In real app, you would send OTP here
    }
}

function handleSignupForm(event) {
    event.preventDefault();
    const phone = document.getElementById('signupPhone').value;
    const email = document.getElementById('email').value;
    const termsAccepted = document.getElementById('terms').checked;
    
    if (!termsAccepted) {
        showNotification('Please accept the terms and conditions', 'error');
        return;
    }
    
    if (phone && validatePhone(phone)) {
        showNotification('OTP sent to your mobile number!', 'success');
    } else if (email && validateEmail(email)) {
        showNotification('Verification email sent!', 'success');
    } else {
        showNotification('Please enter a valid phone number or email', 'error');
    }
}

// Validation Functions
function validatePhone(phone) {
    const phoneRegex = /^[6-9]\d{9}$/; // Indian mobile number format
    return phoneRegex.test(phone);
}

function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Utility Functions
function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    };
    return date.toLocaleDateString('en-IN', options);
}

// Notification System
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <span>${message}</span>
        <button onclick="this.parentElement.remove()">&times;</button>
    `;
    
    // Add notification styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${getNotificationColor(type)};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        display: flex;
        align-items: center;
        gap: 1rem;
        max-width: 400px;
        animation: slideInRight 0.3s ease;
    `;
    
    // Add button styles
    const closeBtn = notification.querySelector('button');
    closeBtn.style.cssText = `
        background: none;
        border: none;
        color: white;
        font-size: 1.2rem;
        cursor: pointer;
        padding: 0;
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

function getNotificationColor(type) {
    const colors = {
        success: '#10b981',
        error: '#ef4444',
        info: '#3b82f6',
        warning: '#f59e0b'
    };
    return colors[type] || colors.info;
}

// Event Listeners Setup
function setupEventListeners() {
    // Swap button
    if (swapBtn) {
        swapBtn.addEventListener('click', swapCities);
    }
    
    // Train search form
    if (trainSearchForm) {
        trainSearchForm.addEventListener('submit', validateTrainSearchForm);
    }
    
    // Modal forms
    const loginForm = document.querySelector('#loginModal form');
    const signupForm = document.querySelector('#signupModal form');
    
    if (loginForm) {
        loginForm.addEventListener('submit', handleLoginForm);
    }
    
    if (signupForm) {
        signupForm.addEventListener('submit', handleSignupForm);
    }
    
    // Close modals with Escape key
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            closeAllModals();
        }
    });
    
    // Phone number input formatting
    const phoneInputs = document.querySelectorAll('input[type="tel"]');
    phoneInputs.forEach(input => {
        input.addEventListener('input', function(e) {
            // Remove non-numeric characters
            let value = e.target.value.replace(/\D/g, '');
            
            // Limit to 10 digits
            if (value.length > 10) {
                value = value.slice(0, 10);
            }
            
            e.target.value = value;
        });
    });
}

// Add CSS animations for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Google Sign-in Simulation (placeholder)
document.addEventListener('click', function(event) {
    if (event.target.id === 'google-signup') {
        showNotification('Google Sign-in would be integrated here in a real application', 'info');
    }
});

// Enhanced Form Experience
function addInputAnimations() {
    const inputs = document.querySelectorAll('input, select');
    
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.style.transform = 'translateY(-2px)';
            this.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.15)';
        });
        
        input.addEventListener('blur', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = 'none';
        });
    });
}

// Initialize input animations after DOM is loaded
document.addEventListener('DOMContentLoaded', addInputAnimations);