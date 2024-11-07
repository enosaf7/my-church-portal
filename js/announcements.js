document.addEventListener('DOMContentLoaded', function() {
    displayAllAnnouncements();
});

function displayAllAnnouncements() {
    const announcements = JSON.parse(localStorage.getItem('announcements') || '[]');
    const container = document.querySelector('.announcements-container');
    
    // Filter for active and non-expired announcements
    const activeAnnouncements = announcements.filter(announcement => {
        return announcement.isActive && new Date(announcement.expiryDate) >= new Date();
    });

    if (activeAnnouncements.length === 0) {
        container.innerHTML = '<p class="no-items">No current announcements.</p>';
        return;
    }

    container.innerHTML = activeAnnouncements.map(announcement => `
        <div class="announcement-card">
            <h3>${announcement.title}</h3>
            <p>${announcement.content}</p>
            <div class="announcement-meta">
                <span>Posted: ${new Date(announcement.datePosted).toLocaleDateString()}</span>
                <span>Valid until: ${new Date(announcement.expiryDate).toLocaleDateString()}</span>
            </div>
        </div>
    `).join('');
} 