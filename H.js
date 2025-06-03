// DOM Elements
const startTestBtn = document.getElementById('start-test');
const progressContainer = document.querySelector('.progress-container');
const progressFill = document.querySelector('.progress-fill');
const progressText = document.querySelector('.progress-text');
const downloadSpeedEl = document.getElementById('download-speed');
const uploadSpeedEl = document.getElementById('upload-speed');
const pingEl = document.getElementById('ping');
const ipAddressEl = document.getElementById('ip-address');
const ispEl = document.getElementById('isp');
const themeToggle = document.getElementById('theme-toggle');

// Variables
let testInProgress = false;
let downloadSpeed = 0;
let uploadSpeed = 0;
let ping = 0;

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);

    // Fetch IP and ISP information
    fetchNetworkInfo();
});

// Theme toggle functionality
themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
});

function updateThemeIcon(theme) {
    const icon = themeToggle.querySelector('i');
    icon.className = theme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
}

// Fetch IP and ISP information
async function fetchNetworkInfo() {
    try {
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();
        
        ipAddressEl.textContent = data.ip || '-';
        ispEl.textContent = data.org || '-';
    } catch (error) {
        console.error('Error fetching network info:', error);
        ipAddressEl.textContent = '-';
        ispEl.textContent = '-';
    }
}

// Start speed test
startTestBtn.addEventListener('click', async () => {
    if (testInProgress) return;
    
    testInProgress = true;
    startTestBtn.disabled = true;
    progressContainer.classList.remove('hidden');
    
    // Reset previous results
    downloadSpeedEl.textContent = '- Mbps';
    uploadSpeedEl.textContent = '- Mbps';
    pingEl.textContent = '- ms';
    
    try {
        // Simulate progress (in a real app, this would be tied to actual test progress)
        simulateProgress();
        
        // Run actual speed test
        await runSpeedTest();
        
        // Update UI with results
        downloadSpeedEl.textContent = `${downloadSpeed.toFixed(2)} Mbps`;
        uploadSpeedEl.textContent = `${uploadSpeed.toFixed(2)} Mbps`;
        pingEl.textContent = `${ping.toFixed(2)} ms`;
        
    } catch (error) {
        console.error('Speed test failed:', error);
        showError('Speed test failed. Please try again.');
    } finally {
        testInProgress = false;
        startTestBtn.disabled = false;
        progressContainer.classList.add('hidden');
    }
});

// Simulate progress bar animation
function simulateProgress() {
    let progress = 0;
    const interval = setInterval(() => {
        if (progress >= 100) {
            clearInterval(interval);
            return;
        }
        
        progress += 1;
        progressFill.style.width = `${progress}%`;
        
        if (progress < 30) {
            progressText.textContent = 'Finding optimal server...';
        } else if (progress < 60) {
            progressText.textContent = 'Testing download speed...';
        } else if (progress < 90) {
            progressText.textContent = 'Testing upload speed...';
        } else {
            progressText.textContent = 'Finalizing results...';
        }
    }, 50);
}

// Actual speed test using a third-party API
async function runSpeedTest() {
    // Note: In a production environment, you would use a proper speed test API
    // like Ookla's Speedtest.net API or similar. This is a simulation.
    
    // Simulate ping test (random value between 5 and 50)
    ping = 5 + Math.random() * 45;
    
    // Simulate download test (random value between 10 and 500 Mbps)
    await new Promise(resolve => setTimeout(resolve, 2000));
    downloadSpeed = 10 + Math.random() * 490;
    
    // Simulate upload test (random value between 5 and 100 Mbps)
    await new Promise(resolve => setTimeout(resolve, 2000));
    uploadSpeed = 5 + Math.random() * 95;
    
    /* 
    // For a real implementation, you would use something like:
    const tester = new SpeedTest({
        maxTime: 5000,
        server: 'your-server-id'
    });
    
    ping = await tester.getPing();
    downloadSpeed = await tester.getDownloadSpeed();
    uploadSpeed = await tester.getUploadSpeed();
    */
}

// Show error message
function showError(message) {
    // Remove any existing error messages
    const existingError = document.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
    
    const errorEl = document.createElement('div');
    errorEl.className = 'error-message';
    errorEl.textContent = message;
    
    const testContainer = document.querySelector('.test-container');
    testContainer.appendChild(errorEl);
    
    // Remove error after 5 seconds
    setTimeout(() => {
        errorEl.remove();
    }, 5000);
}

