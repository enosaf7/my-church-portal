function toggleAnnouncementVisibility(id) {
    let announcements = JSON.parse(localStorage.getItem('announcements'));
    const index = announcements.findIndex(a => a.id === id);
    announcements[index].isActive = !announcements[index].isActive;
    localStorage.setItem('announcements', JSON.stringify(announcements));
    displayAnnouncements();
}

function toggleEventVisibility(id) {
    let events = JSON.parse(localStorage.getItem('events'));
    const index = events.findIndex(e => e.id === id);
    events[index].isActive = !events[index].isActive;
    localStorage.setItem('events', JSON.stringify(events));
    displayEvents();
}

function displayAnnouncements() {
    const announcements = JSON.parse(localStorage.getItem('announcements') || '[]');
    const container = document.querySelector('.announcements-list');
    
    if (announcements.length === 0) {
        container.innerHTML = '<p class="no-items">No announcements posted yet.</p>';
        return;
    }
    
    container.innerHTML = announcements.map(announcement => `
        <div class="announcement-item">
            <h3>${announcement.title}</h3>
            <p>${announcement.content}</p>
            <div class="announcement-meta">
                <span>Posted: ${new Date(announcement.datePosted).toLocaleDateString()}</span>
                <span>Expires: ${new Date(announcement.expiryDate).toLocaleDateString()}</span>
            </div>
        </div>
    `).join('');
}

function displayEvents() {
    const eventsList = document.querySelector('.events-list');
    const events = JSON.parse(localStorage.getItem('events') || '[]');
    
    if (events.length === 0) {
        eventsList.innerHTML = '<p class="no-events">No events created yet.</p>';
        return;
    }

    events.sort((a, b) => new Date(a.date) - new Date(b.date));

    eventsList.innerHTML = events.map(event => `
        <div class="event-item" data-id="${event.id}">
            <div class="event-content">
                <h3>${event.title}</h3>
                <p class="event-description">${event.description}</p>
                <div class="event-details">
                    <span><i class="fas fa-calendar"></i> ${formatDate(event.date)}</span>
                    <span><i class="fas fa-clock"></i> ${formatTime(event.time)}</span>
                    <span><i class="fas fa-map-marker-alt"></i> ${event.location}</span>
                </div>
            </div>
            <div class="event-actions">
                <button onclick="deleteEvent(${event.id})" class="delete-btn">
                    <i class="fas fa-trash"></i> Delete
                </button>
            </div>
        </div>
    `).join('');
}

function deleteEvent(eventId) {
    if (confirm('Are you sure you want to delete this event?')) {
        let events = JSON.parse(localStorage.getItem('events') || '[]');
        events = events.filter(event => event.id !== eventId);
        localStorage.setItem('events', JSON.stringify(events));
        displayEvents();
    }
}

function editEvent(eventId) {
    const events = JSON.parse(localStorage.getItem('events') || '[]');
    const event = events.find(e => e.id === eventId);
    
    if (event) {
        const form = document.querySelector('#eventForm form');
        form.title.value = event.title;
        form.description.value = event.description;
        form.location.value = event.location;
        form.date.value = event.date;
        form.time.value = event.time;
        
        // Show form
        showEventForm();
        
        // Update form submission to handle edit
        form.onsubmit = (e) => {
            e.preventDefault();
            
            // Update event data
            event.title = form.title.value;
            event.description = form.description.value;
            event.location = form.location.value;
            event.date = form.date.value;
            event.time = form.time.value;
            event.updatedAt = new Date().toISOString();
            
            // Update events in localStorage
            const updatedEvents = events.map(e => e.id === eventId ? event : e);
            localStorage.setItem('events', JSON.stringify(updatedEvents));
            
            // Reset form and display
            form.reset();
            hideEventForm();
            displayEvents();
            
            // Reset form submission handler
            form.onsubmit = (e) => submitEvent(e);
        };
    }
}

// Helper functions for date/time formatting
function formatDate(dateStr) {
    return new Date(dateStr).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

function formatTime(timeStr) {
    return new Date(`2000/01/01 ${timeStr}`).toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    });
}

// Form visibility functions
function showAnnouncementForm() {
    document.getElementById('announcementForm').style.display = 'block';
}

function hideAnnouncementForm() {
    document.getElementById('announcementForm').style.display = 'none';
}

function showEventForm() {
    document.getElementById('eventForm').style.display = 'block';
}

function hideEventForm() {
    document.getElementById('eventForm').style.display = 'none';
}

// Submit functions
function submitAnnouncement(event) {
    event.preventDefault();
    
    const form = event.target;
    const announcement = {
        id: Date.now(),
        title: form.title.value,
        content: form.content.value,
        expiryDate: form.expiryDate.value,
        datePosted: new Date().toISOString(),
        isActive: true
    };
    
    // Get existing announcements
    let announcements = JSON.parse(localStorage.getItem('announcements') || '[]');
    announcements.unshift(announcement);
    
    // Save to localStorage
    localStorage.setItem('announcements', JSON.stringify(announcements));
    
    // Reset form and hide it
    form.reset();
    hideAnnouncementForm();
    
    // Refresh display
    displayAnnouncements();
    
    alert('Announcement posted successfully!');
}

function submitEvent(event) {
    event.preventDefault();
    
    const form = event.target;
    const imageInput = form.querySelector('input[type="file"]');
    
    const processForm = (imageData) => {
        const eventData = {
            id: Date.now(),
            title: form.title.value,
            description: form.description.value,
            location: form.location.value,
            date: form.date.value,
            time: form.time.value,
            image: imageData,
            createdAt: new Date().toISOString()
        };

        // Get existing events or initialize empty array
        let events = JSON.parse(localStorage.getItem('events') || '[]');
        
        // Add new event
        events.push(eventData);
        
        // Save to localStorage
        localStorage.setItem('events', JSON.stringify(events));
        
        // Update display
        displayEvents();
        
        // Reset form and hide it
        form.reset();
        if (document.getElementById('imagePreview')) {
            document.getElementById('imagePreview').innerHTML = '';
        }
        hideEventForm();

        alert('Event created successfully!');
    };

    if (imageInput && imageInput.files[0]) {
        const reader = new FileReader();
        reader.onload = (e) => processForm(e.target.result);
        reader.readAsDataURL(imageInput.files[0]);
    } else {
        // Process without image
        processForm(null);
    }
}

// Image preview function
function previewImage(event) {
    const file = event.target.files[0];
    const preview = document.getElementById('imagePreview');
    
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            preview.innerHTML = `<img src="${e.target.result}" alt="Preview">`;
        }
        reader.readAsDataURL(file);
    }
}

// Live Session Management Functions
function showLiveSessionForm() {
    document.getElementById('liveSessionForm').style.display = 'block';
}

function hideLiveSessionForm() {
    document.getElementById('liveSessionForm').style.display = 'none';
}

function submitLiveSession(event) {
    event.preventDefault();
    const form = event.target;
    
    const sessionData = {
        id: Date.now(),
        title: form.title.value,
        link: form.link.value,
        description: form.description.value,
        date: form.date.value,
        time: form.time.value,
        isActive: form.isActive.checked,
        createdAt: new Date().toISOString()
    };

    // Get existing sessions or initialize empty array
    let sessions = JSON.parse(localStorage.getItem('live_sessions') || '[]');
    
    // If this session is set as active, deactivate all other sessions
    if (sessionData.isActive) {
        sessions = sessions.map(session => ({
            ...session,
            isActive: false
        }));
    }
    
    // Add new session
    sessions.push(sessionData);
    
    // Save to localStorage
    localStorage.setItem('live_sessions', JSON.stringify(sessions));
    
    // Update display
    displayLiveSessions();
    
    // Reset form and hide it
    form.reset();
    hideLiveSessionForm();
}

function displayLiveSessions() {
    const sessionsList = document.querySelector('.live-sessions-list');
    const sessions = JSON.parse(localStorage.getItem('live_sessions') || '[]');
    
    if (sessions.length === 0) {
        sessionsList.innerHTML = '<p class="no-sessions">No live sessions created yet.</p>';
        return;
    }

    sessions.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    sessionsList.innerHTML = sessions.map(session => `
        <div class="live-session-item">
            <div class="live-session-info">
                <h3 class="live-session-title">${session.title}</h3>
                <p class="live-session-description">${session.description}</p>
                <div class="live-session-meta">
                    <span><i class="fas fa-calendar"></i> ${formatDate(session.date)}</span>
                    <span><i class="fas fa-clock"></i> ${formatTime(session.time)}</span>
                </div>
                <div class="live-session-link">
                    <a href="${session.link}" target="_blank" class="link">
                        <i class="fab fa-youtube"></i> View Stream
                    </a>
                </div>
            </div>
            <div class="live-session-actions">
                <span class="status-badge ${session.isActive ? 'status-active' : 'status-inactive'}">
                    ${session.isActive ? 'Active' : 'Inactive'}
                </span>
                <button onclick="toggleSessionStatus(${session.id})" class="action-btn">
                    <i class="fas fa-power-off"></i>
                </button>
                <button onclick="deleteLiveSession(${session.id})" class="delete-btn">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `).join('');
}

function toggleSessionStatus(sessionId) {
    let sessions = JSON.parse(localStorage.getItem('live_sessions') || '[]');
    
    sessions = sessions.map(session => ({
        ...session,
        isActive: session.id === sessionId ? !session.isActive : false
    }));
    
    localStorage.setItem('live_sessions', JSON.stringify(sessions));
    displayLiveSessions();
}

function deleteLiveSession(sessionId) {
    if (confirm('Are you sure you want to delete this live session?')) {
        let sessions = JSON.parse(localStorage.getItem('live_sessions') || '[]');
        sessions = sessions.filter(session => session.id !== sessionId);
        localStorage.setItem('live_sessions', JSON.stringify(sessions));
        displayLiveSessions();
    }
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    displayAnnouncements();
    displayEvents();
    displayLiveSessions();
});