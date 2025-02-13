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