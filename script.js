// Function to update the visitor's current time
function updateVisitorTime() {
    const now = new Date();

    // Options for formatting time and date
    const timeOptions = {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    };

    const dateOptions = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    };

    // Format the visitor's time and date
    const visitorTime = new Intl.DateTimeFormat('default', timeOptions).format(now);
    const visitorDate = new Intl.DateTimeFormat('default', dateOptions).format(now);

    // Update the DOM
    const visitorTimeElement = document.getElementById('visitor-time');
    const visitorDateElement = document.getElementById('visitor-date');

    if (visitorTimeElement) {
        visitorTimeElement.textContent = visitorTime;
    }
    if (visitorDateElement) {
        visitorDateElement.textContent = visitorDate;
    }
}

// Update visitor's time immediately and then every second
updateVisitorTime();
setInterval(updateVisitorTime, 1000);

// Function to update world clocks
function updateClocks() {
    const now = new Date();

    // Time zones configuration
    const timeZones = {
        // US Time Zones
        'new-york': 'America/New_York',
        'chicago': 'America/Chicago',
        'denver': 'America/Denver',
        'los-angeles': 'America/Los_Angeles',
        'boise': 'America/Boise',

        // European Time Zone
        'london': 'Europe/London',

        // Asian Time Zones
        'india': 'Asia/Kolkata',
        'singapore': 'Asia/Singapore',
        'malaysia': 'Asia/Kuala_Lumpur',
        'tokyo': 'Asia/Tokyo',

        // Australian Time Zone
        'sydney': 'Australia/Sydney'
    };

    // Update each clock
    for (const [cityId, timeZone] of Object.entries(timeZones)) {
        const options = {
            timeZone: timeZone,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        };

        const dateOptions = {
            timeZone: timeZone,
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        };

        try {
            const timeString = now.toLocaleTimeString('en-US', options);
            const dateString = now.toLocaleDateString('en-US', dateOptions);
            const timeElement = document.getElementById(cityId);
            const dateElement = timeElement?.parentElement?.querySelector('.date');

            if (timeElement) {
                timeElement.textContent = timeString;
            }
            if (dateElement) {
                dateElement.textContent = dateString;
            }
        } catch (error) {
            console.error(`Error updating clock for ${cityId}: ${error.message}`);
        }
    }
}

// Update clocks immediately and then every second
updateClocks();
setInterval(updateClocks, 1000);

// Hide the loading indicator with a fade-out effect
window.addEventListener('load', () => {
    const loading = document.getElementById('loading');
    loading.classList.add('hide');
    setTimeout(() => {
        loading.style.display = 'none';
    }, 500); // Match the duration of the CSS transition
});

// Register Service Worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', async () => {
        try {
            // Unregister any existing service workers first
            const registrations = await navigator.serviceWorker.getRegistrations();
            for (let registration of registrations) {
                await registration.unregister();
                console.log('Unregistered old service worker');
            }

            // Register new service worker
            const swPath = '/digital-world-clock/sw.js';
            const registration = await navigator.serviceWorker.register(swPath, {
                scope: '/digital-world-clock/'
            });
            
            console.log('Service Worker registered with scope:', registration.scope);

            // Force activation if needed
            if (registration.waiting) {
                registration.waiting.postMessage({ type: 'SKIP_WAITING' });
            }

        } catch (error) {
            console.error('Service Worker registration failed:', error);
        }
    });
}