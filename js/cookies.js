document.addEventListener('DOMContentLoaded', function () {
    // Elements
    const cookieConsent = document.getElementById('cookieConsent');
    const acceptCookies = document.getElementById('acceptCookies');
    const rejectCookies = document.getElementById('rejectCookies');
    const customizeCookies = document.getElementById('customizeCookies');
    const cookiePreferences = document.getElementById('cookiePreferences');
    const savePreferences = document.getElementById('savePreferences');
    const cancelPreferences = document.getElementById('cancelPreferences');
    const performanceCookies = document.getElementById('performanceCookies');
    const marketingCookies = document.getElementById('marketingCookies');

    // Check if cookie consent was already given
    function checkCookieConsent() {
        const consent = getCookie('cookieConsent');
        if (consent === '') {
            // Show banner if no consent was given yet
            setTimeout(() => {
                cookieConsent.style.display = 'block';
            }, 1000);
        }
    }

    // Get cookie value by name
    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
        return '';
    }

    // Set cookie
    function setCookie(name, value, days) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        const expires = `expires=${date.toUTCString()}`;
        document.cookie = `${name}=${value};${expires};path=/;SameSite=Lax`;
    }

    // Set all cookies based on preferences
    function setAllCookies(preferences) {
        if (preferences.performance) {
            // Set performance cookies (e.g., Google Analytics)
            // Example: setCookie('_ga', 'GA1.2.123456789', 365);
            console.log('Performance cookies enabled');
        }

        if (preferences.marketing) {
            // Set marketing cookies (e.g., Facebook Pixel)
            // Example: setCookie('_fbp', 'fb.1.123456789', 90);
            console.log('Marketing cookies enabled');
        }

        // Always set essential cookies
        console.log('Essential cookies enabled');
    }

    // Event Listeners
    acceptCookies.addEventListener('click', function () {
        setCookie('cookieConsent', 'all', 365);
        cookieConsent.style.display = 'none';
        setAllCookies({
            performance: true,
            marketing: true
        });
    });

    rejectCookies.addEventListener('click', function () {
        setCookie('cookieConsent', 'essential', 365);
        cookieConsent.style.display = 'none';
        setAllCookies({
            performance: false,
            marketing: false
        });
    });

    customizeCookies.addEventListener('click', function () {
        cookiePreferences.style.display = 'flex';
    });

    savePreferences.addEventListener('click', function () {
        const preferences = {
            performance: performanceCookies.checked,
            marketing: marketingCookies.checked
        };

        setCookie('cookieConsent', 'custom', 365);
        setCookie('cookiePreferences', JSON.stringify(preferences), 365);
        cookieConsent.style.display = 'none';
        cookiePreferences.style.display = 'none';
        setAllCookies(preferences);
    });

    cancelPreferences.addEventListener('click', function () {
        cookiePreferences.style.display = 'none';
    });

    // Load saved preferences if they exist
    function loadPreferences() {
        const preferences = getCookie('cookiePreferences');
        if (preferences) {
            try {
                const parsed = JSON.parse(preferences);
                performanceCookies.checked = parsed.performance;
                marketingCookies.checked = parsed.marketing;
            } catch (e) {
                console.error('Error parsing cookie preferences', e);
            }
        }
    }

    // Initialize
    checkCookieConsent();
    loadPreferences();
});