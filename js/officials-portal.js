document.addEventListener('DOMContentLoaded', function() {
    // Update current date
    document.getElementById('currentDate').textContent = new Date().toLocaleDateString('en-GB', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    // Update active members count
    updateActiveMembersCount();
});

// Function to count active members
function updateActiveMembersCount() {
    const members = JSON.parse(localStorage.getItem('members') || '[]');
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const activeMembers = members.filter(member => {
        const lastLogin = new Date(member.lastLogin || 0);
        return lastLogin > thirtyDaysAgo;
    });

    const countElement = document.getElementById('activeMembersCount');
    countElement.textContent = `${activeMembers.length} Active`;
}

// Function to count prayer requests and thanksgiving
function updatePrayerRequestsCount() {
    // Get submissions from localStorage
    const submissions = JSON.parse(localStorage.getItem('testimonies_submissions') || '[]');
    
    // Get today's date at midnight
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Count new submissions from today
    const newSubmissions = submissions.filter(submission => {
        const submissionDate = new Date(submission.timestamp);
        return submissionDate >= today;
    });

    const countElement = document.getElementById('prayerRequestsCount');
    countElement.innerHTML = `
        ${newSubmissions.length} New<br>
        <span class="total-count">${submissions.length} Total</span>
    `;
}

// Update all stats
function updateAllStats() {
    updateActiveMembersCount();
    updatePrayerRequestsCount();
}

// Listen for changes in localStorage
window.addEventListener('storage', function(e) {
    if (e.key === 'testimonies_submissions') {
        updatePrayerRequestsCount();
    }
});

// Update stats when page loads
document.addEventListener('DOMContentLoaded', () => {
    updateAllStats();
    
    // Update every 30 seconds
    setInterval(updateAllStats, 30000);
}); 