window.addEventListener('DOMContentLoaded', function() {
// Navigation switching
const navItems = document.querySelectorAll('.nav-item');

const mainPage = document.querySelector('.main-section.main-page');
const eqPage = document.querySelector('.main-section.equipment-page');

//Add click event to the left menu    idx==3（IoT & Equipment）
navItems.forEach((item, idx) => {
    item.addEventListener('click', () => {
        navItems.forEach(i => i.classList.remove('active'));
        item.classList.add('active');
        if (idx==3) {
            mainPage.style.display = 'block';
        }else{
            mainPage.style.display = 'none';
        }
    });
});

// Device card switches and sound effects (custom audio files)
const switches = document.querySelectorAll('.switch input');
const audioOn = new Audio('device_on.mp3');
const audioOff = new Audio('device_off.mp3');
function playToggleSound(on) {
    if (on) {
        audioOn.currentTime = 0;
        audioOn.play();
    } else {
        audioOff.currentTime = 0;
        audioOff.play();
    }
}
function updateSwitchStatus(sw) {
    const statusSpan = sw.parentElement.querySelector('.switch-status');
    if (sw.checked) {
        statusSpan.textContent = 'ON';
    } else {
        statusSpan.textContent = 'OFF';
    }
}
switches.forEach(sw => {
    updateSwitchStatus(sw);
    sw.addEventListener('change', function() {
        playToggleSound(this.checked);
        updateSwitchStatus(this);
    });
});


// Equipment maintenance page switching
const eqBtn = document.querySelector('.equipment-btn');
eqBtn.addEventListener('click', () => {
    mainPage.style.display = 'none';
    eqPage.style.display = 'block';
});
document.querySelector('.return-btn').addEventListener('click', () => {
    eqPage.style.display = 'none';
    mainPage.style.display = 'block';
});

// Video playback functionality
const monitoringCard = document.querySelector('.monitoring-card');
const videoModal = document.getElementById('videoModal');
const videoClose = document.getElementById('videoClose');
const monitoringVideo = document.getElementById('monitoringVideo');
const videoPlaceholder = document.getElementById('videoPlaceholder');

// Click Monitoring System card to open video
monitoringCard.addEventListener('click', function(e) {
    // Prevent video playback when clicking the switch
    if (e.target.closest('.switch')) {
        return;
    }
    
    videoModal.style.display = 'block';
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
    
    // Check if video is available
    if (monitoringVideo.readyState >= 2) {
        videoPlaceholder.style.display = 'none';
        monitoringVideo.style.display = 'block';
    } else {
        videoPlaceholder.style.display = 'flex';
        monitoringVideo.style.display = 'none';
    }
});

// Click close button to close video
videoClose.addEventListener('click', function() {
    videoModal.style.display = 'none';
    document.body.style.overflow = 'auto';
    monitoringVideo.pause();
    monitoringVideo.currentTime = 0;
});

// Click modal background to close video
videoModal.addEventListener('click', function(e) {
    if (e.target === videoModal) {
        videoModal.style.display = 'none';
        document.body.style.overflow = 'auto';
        monitoringVideo.pause();
        monitoringVideo.currentTime = 0;
    }
});

// ESC key to close video
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && videoModal.style.display === 'block') {
        videoModal.style.display = 'none';
        document.body.style.overflow = 'auto';
        monitoringVideo.pause();
        monitoringVideo.currentTime = 0;
    }
});

// Hide placeholder when video is loaded
monitoringVideo.addEventListener('loadeddata', function() {
    videoPlaceholder.style.display = 'none';
    monitoringVideo.style.display = 'block';
});

// Show placeholder when video fails to load
monitoringVideo.addEventListener('error', function() {
    videoPlaceholder.style.display = 'flex';
    monitoringVideo.style.display = 'none';
    videoPlaceholder.innerHTML = `
        <div>
            <div style="font-size: 24px; margin-bottom: 10px;">⚠️</div>
            <div>Video failed to load</div>
            <div style="font-size: 14px; margin-top: 10px; opacity: 0.8;">Please check if the video file exists</div>
        </div>
    `;
});

// Select all system cards
const systemCards = document.querySelectorAll('.system-cards .card');
systemCards.forEach(card => {
    card.addEventListener('click', function(e) {
        // Prevent video playback when clicking the switch
        if (e.target.closest('.switch')) {
            return;
        }
        videoModal.style.display = 'block';
        document.body.style.overflow = 'hidden'; // Prevent background scrolling

        // Check if video is available
        if (monitoringVideo.readyState >= 2) {
            videoPlaceholder.style.display = 'none';
            monitoringVideo.style.display = 'block';
        } else {
            videoPlaceholder.style.display = 'flex';
            monitoringVideo.style.display = 'none';
        }
    });
});

// Only add secondary confirmation popup for the switch of "Monitoring System" card
const monitoringCardSwitch = document.querySelector('.monitoring-card .switch input');
const confirmModal = document.getElementById('confirmModal');
const confirmModalText = document.getElementById('confirmModalText');
const confirmModalYes = document.getElementById('confirmModalYes');
const confirmModalNo = document.getElementById('confirmModalNo');
const confirmModalClose = document.getElementById('confirmModalClose');

let pendingSwitchChecked = null; // Record the state the user wants to switch to

// Prevent direct switching, pop up confirmation box
monitoringCardSwitch.addEventListener('click', function(e) {
    e.preventDefault();
    // The content of the popup changes according to the current state
    if (this.checked) {
        confirmModalText.textContent = 'Are you sure you want to turn it On?';
        pendingSwitchChecked = true;
    } else {
        confirmModalText.textContent = 'Are you sure you want to turn it Off?';
        pendingSwitchChecked = false;
    }
    confirmModal.style.display = 'flex';
});

function closeConfirmModal() {
    confirmModal.style.display = 'none';
    pendingSwitchChecked = null;
}

confirmModalNo.addEventListener('click', closeConfirmModal);
confirmModalClose.addEventListener('click', closeConfirmModal);
// Click outside the popup to close it
confirmModal.addEventListener('click', function(e) {
    if (e.target === confirmModal) closeConfirmModal();
});

// User confirms the switch
confirmModalYes.addEventListener('click', function() {
    if (pendingSwitchChecked !== null) {
        // Simulate user click through click event to ensure animation and state are consistent
        monitoringCardSwitch.checked = !monitoringCardSwitch.checked; // Reverse first
        monitoringCardSwitch.dispatchEvent(new Event('change', { bubbles: true }));
    }
    closeConfirmModal();
});
}); 