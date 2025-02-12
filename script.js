function updateClocks() {
    const now = new Date();

    // Time zones configuration
    const timeZones = {
        'new-york': 'America/New_York',
        'london': 'Europe/London',
        'india': 'Asia/Kolkata',
        'tokyo': 'Asia/Tokyo',
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

        const timeString = now.toLocaleTimeString('en-US', options);
        document.getElementById(cityId).textContent = timeString;
    }
}

// Update clocks immediately and then every second
updateClocks();
setInterval(updateClocks, 1000);
