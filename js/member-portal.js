document.addEventListener('DOMContentLoaded', function() {
    // Set current date
    const currentDate = new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    // Load weekly schedule
    loadWeeklySchedule();

    // Handle prayer request form submission
    if (document.getElementById('prayerForm')) {
        document.getElementById('prayerForm').addEventListener('submit', handlePrayerSubmission);
    }

    // Handle testimony form submission
    if (document.getElementById('testimonyForm')) {
        document.getElementById('testimonyForm').addEventListener('submit', handleTestimonySubmission);
    }

    // Event Carousel Functionality
    const carousel = document.getElementById('eventsCarousel');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    
    // Function to fetch events from the server/database
    async function fetchEvents() {
        try {
            // Replace with your actual API endpoint
            const response = await fetch('/api/events');
            const events = await response.json();
            displayEvents(events);
        } catch (error) {
            console.error('Error fetching events:', error);
            // Display placeholder content if fetch fails
            displayPlaceholderEvents();
        }
    }

    function displayEvents(events) {
        carousel.innerHTML = events.map(event => `
            <div class="event-card">
                <h3>${event.title}</h3>
                <p class="event-date">
                    <i class="far fa-calendar"></i> ${event.date}
                </p>
                <p class="event-location">
                    <i class="fas fa-map-marker-alt"></i> ${event.location}
                </p>
            </div>
        `).join('');
    }

    function displayPlaceholderEvents() {
        // Temporary placeholder events for testing
        const placeholderEvents = [
            {
                title: "Sabbath Divine Service",
                date: "Saturday, 9:00 AM",
                location: "Main Sanctuary"
            },
            {
                title: "Prayer Meeting",
                date: "Wednesday, 6:00 PM",
                location: "Prayer Room"
            }
        ];
        displayEvents(placeholderEvents);
    }

    // Initialize carousel
    fetchEvents();

    // Carousel navigation
    let currentPosition = 0;
    
    prevBtn.addEventListener('click', () => {
        if (currentPosition > 0) {
            currentPosition--;
            updateCarouselPosition();
        }
    });

    nextBtn.addEventListener('click', () => {
        const maxPosition = document.querySelectorAll('.event-card').length - 1;
        if (currentPosition < maxPosition) {
            currentPosition++;
            updateCarouselPosition();
        }
    });

    function updateCarouselPosition() {
        const cards = document.querySelectorAll('.event-card');
        const cardWidth = cards[0].offsetWidth + 20; // including margin
        carousel.style.transform = `translateX(-${currentPosition * cardWidth}px)`;
    }
});

function loadWeeklySchedule() {
    const scheduleContainer = document.getElementById('weeklySchedule');
    if (!scheduleContainer) return;

    const schedule = JSON.parse(localStorage.getItem('weeklySchedule') || '[]');
    
    if (schedule.length === 0) {
        scheduleContainer.innerHTML = '<p class="no-schedule">No activities scheduled yet</p>';
        return;
    }

    // Sort schedule by time
    schedule.sort((a, b) => a.time.localeCompare(b.time));

    const scheduleHTML = schedule.map(activity => `
        <div class="schedule-item">
            <span class="time">${formatTime(activity.time)}</span>
            <span class="activity">${activity.name}</span>
        </div>
    `).join('');

    scheduleContainer.innerHTML = scheduleHTML;
}

function formatTime(time) {
    return new Date(`2000-01-01T${time}`).toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    });
}

function handlePrayerSubmission(event) {
    event.preventDefault();
    
    const prayerRequest = {
        id: Date.now(),
        request: event.target.prayerRequest.value.trim(),
        dateSubmitted: new Date().toISOString(),
        addressed: false,
        anonymous: event.target.prayerAnonymous.checked
    };

    // Get existing prayers
    const prayers = JSON.parse(localStorage.getItem('prayers') || '[]');
    
    // Add new prayer
    prayers.push(prayerRequest);
    
    // Save to localStorage
    localStorage.setItem('prayers', JSON.stringify(prayers));
    
    // Reset form
    event.target.reset();
    
    // Show success message
    alert('Your prayer request has been submitted.');
}

function handleTestimonySubmission(event) {
    event.preventDefault();
    
    const testimony = {
        id: Date.now(),
        type: event.target.testimonyType.value,
        testimony: event.target.testimony.value.trim(),
        isAnonymous: event.target.anonymous.checked,
        dateSubmitted: new Date().toISOString(),
        sharedInChurch: false
    };

    // Get existing testimonies
    const testimonies = JSON.parse(localStorage.getItem('testimonies') || '[]');
    
    // Add new testimony
    testimonies.push(testimony);
    
    // Save to localStorage
    localStorage.setItem('testimonies', JSON.stringify(testimonies));
    
    // Reset form
    event.target.reset();
    
    // Show success message
    alert('Thank you for sharing your testimony!');
}

// Display events in member portal
function displayMemberEvents() {
    const weeklySchedule = document.getElementById('weeklySchedule');
    const events = JSON.parse(localStorage.getItem('churchEvents') || '[]');
    
    if (events.length === 0) {
        weeklySchedule.innerHTML = '<p class="no-events">No upcoming events scheduled.</p>';
        return;
    }

    // Sort events by date
    const sortedEvents = events.sort((a, b) => new Date(a.date) - new Date(b.date));
    
    weeklySchedule.innerHTML = sortedEvents.map(event => `
        <div class="schedule-item">
            <div class="event-time">
                <i class="fas fa-clock"></i>
                <span>${event.time}</span>
            </div>
            <div class="event-details">
                <h3>${event.title}</h3>
                <p>${event.description}</p>
                <div class="event-location">
                    <i class="fas fa-map-marker-alt"></i>
                    <span>${event.location}</span>
                </div>
                <div class="event-date">
                    <i class="fas fa-calendar"></i>
                    <span>${event.date}</span>
                </div>
            </div>
        </div>
    `).join('');
}

// Initialize events display when page loads
document.addEventListener('DOMContentLoaded', displayMemberEvents);

// Live Stream Functions
function openLiveStream(event) {
    event.preventDefault();
    
    // Get live sessions from localStorage
    const sessions = JSON.parse(localStorage.getItem('live_sessions') || '[]');
    const activeSession = sessions.find(session => session.isActive);

    if (activeSession) {
        // Open the live stream link in a new tab
        window.open(activeSession.link, '_blank');
    } else {
        // Show message if no active stream
        showNoStreamMessage();
    }
}

function showNoStreamMessage() {
    const message = document.createElement('div');
    message.className = 'stream-message';
    message.innerHTML = `
        <div class="message-content">
            <i class="fas fa-info-circle"></i>
            <h3>No Active Stream</h3>
            <p>There is no live stream at the moment. Please check back later.</p>
            <button onclick="this.parentElement.parentElement.remove()">Close</button>
        </div>
    `;
    document.body.appendChild(message);
}

// Check for active stream on page load
document.addEventListener('DOMContentLoaded', () => {
    const sessions = JSON.parse(localStorage.getItem('live_sessions') || '[]');
    const activeSession = sessions.find(session => session.isActive);
    const liveStreamBtn = document.getElementById('liveStreamBtn');

    if (activeSession) {
        liveStreamBtn.classList.add('active');
        // Optionally add a badge or indicator
        if (!document.querySelector('.live-badge')) {
            const badge = document.createElement('span');
            badge.className = 'live-badge';
            badge.textContent = 'LIVE';
            liveStreamBtn.appendChild(badge);
        }
    }
}); 