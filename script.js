/**
 * SAFEBIND PRO - HACKATHON EDITION
 * Core Logic: Navigation, ABDM Sync, and Biometric Security
 */

// --- 1. INITIALIZATION ---
// Runs as soon as the page loads to check for an existing session
window.onload = function() {
    updateClock();
    const savedName = localStorage.getItem('safeBindUser');
    
    if (savedName) {
        // If user already "linked" their ID, go straight to Dashboard
        document.getElementById('display-name').innerText = savedName;
        showView('home');
    } else {
        // New user or cleared cache starts at Login/ABHA Link
        showView('login');
    }
};

// --- 2. NAVIGATION SYSTEM ---
// Switches between "Screens" by toggling the 'hidden' class
function showView(viewId) {
    // Hide all possible views first
    const allViews = document.querySelectorAll('.view');
    allViews.forEach(view => view.classList.add('hidden'));
    
    // Show the target view
    const target = document.getElementById('screen-' + viewId);
    if (target) {
        target.classList.remove('hidden');
    }
}

// Helper to return to the main dashboard
function goHome() {
    showView('home');
}

// --- 3. OVERLAY CONTROLS ---
function showOverlay(id) {
    document.getElementById(id).classList.remove('hidden');
}

function hideOverlay(id) {
    document.getElementById(id).classList.add('hidden');
}

// --- 4. ABDM REGISTRATION & LINKING ---
function registerUser() {
    const nameInput = document.getElementById('user-name-input').value;
    const abhaInput = document.getElementById('abha-id').value;

    // VALIDATION: Requires a name and a 14-digit ID (or the '123' demo bypass)
    if (nameInput && (abhaInput.length === 14 || abhaInput === "123")) {
        
        // Save to browser memory so it persists on refresh
        localStorage.setItem('safeBindUser', nameInput);
        document.getElementById('display-name').innerText = nameInput;
        
        // Show a "Success" modal to simulate API connection
        showInfo("Linking ABHA", "Authenticating with National Health Gateway... <br><br><b>Success:</b> Records Synced!");
        
        // Transition to home after a short "processing" delay
        setTimeout(() => {
            hideOverlay('info-modal');
            showView('home');
        }, 2000);
        
    } else {
        showInfo("Input Required", "Please enter your Full Name and a valid 14-digit ABHA ID to proceed.");
    }
}

// --- 5. BIOMETRIC SECURITY FLOW ---
function startAuth() {
    showOverlay('biometric-gate');
}

function processAuth() {
    // Visual feedback: Speed up the laser scan to show "processing"
    const laser = document.querySelector('.laser');
    laser.style.animationDuration = '0.5s'; 
    
    setTimeout(() => {
        hideOverlay('biometric-gate');
        showView('records');
        // Reset laser speed for next time
        laser.style.animationDuration = '2s'; 
    }, 1200);
}

// --- 6. CUSTOM MODAL LOGIC (Replaces browser alerts) ---
function showInfo(title, content) {
    document.getElementById('info-title').innerText = title;
    document.getElementById('info-body').innerHTML = content;
    showOverlay('info-modal');
}

function showMeds() {
    showInfo("Medication Schedule", "💊 <b>Morning (8 AM):</b> Vitamin D3<br>💊 <b>Evening (9 PM):</b> Aspirin 75mg");
}

function showCare() {
    showInfo("Your Care Team", "👨‍⚕️ <b>Dr. Vikram (Cardio):</b> +91 98XXX-XXXXX<br>📞 <b>Sarah (Daughter):</b> Primary Contact");
}

// --- 7. SOS EMERGENCY LOGIC ---
let sosInterval;

function launchSOS() {
    showOverlay('sos-module');
    let timeLeft = 5;
    const timerElement = document.getElementById('timer');
    timerElement.innerText = timeLeft;

    sosInterval = setInterval(() => {
        timeLeft--;
        timerElement.innerText = timeLeft;
        
        if (timeLeft <= 0) {
            clearInterval(sosInterval);
            // In a real app, this is where the SMS/Call API is triggered
            showInfo("SOS Active", "🚨 Emergency signal sent to family and nearest hospital. <b>Stay calm, help is on the way.</b>");
            hideOverlay('sos-module');
        }
    }, 1000);
}

function abortSOS() {
    clearInterval(sosInterval);
    hideOverlay('sos-module');
}

// --- 8. UTILITIES ---
function updateClock() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    document.getElementById('clock').innerText = `${hours}:${minutes}`;
}
function speak(text) {
    const msg = new SpeechSynthesisUtterance();
    msg.text = text;
    msg.rate = 0.9; // Slightly slower for seniors
    window.speechSynthesis.speak(msg);
}

// Example: Call this when the SOS starts
// speak("Emergency alert activated. Help is on the way.");

// Keep the clock ticking every minute
setInterval(updateClock, 60000);