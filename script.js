async function getDevices() {
    try {
        // Get the list of available media devices
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter(device => device.kind === 'videoinput');

        // Populate the dropdown menu with the video devices
        const deviceSelect = document.getElementById('deviceSelect');
        videoDevices.forEach(device => {
            const option = document.createElement('option');
            option.value = device.deviceId;
            option.text = device.label || `Camera ${deviceSelect.length + 1}`;
            deviceSelect.appendChild(option);
        });

        // Start the first available device by default
        if (videoDevices.length > 0) {
            startWebcam(videoDevices[0].deviceId);
        }

        // Add an event listener for device selection change
        deviceSelect.addEventListener('change', () => {
            startWebcam(deviceSelect.value);
        });
    } catch (error) {
        console.error('Error getting devices:', error);
    }
}

async function startWebcam(deviceId) {
    if (window.stream) {
        window.stream.getTracks().forEach(track => track.stop());
    }

    try {
        // Attempt with strict constraints
        const stream = await navigator.mediaDevices.getUserMedia({
            video: { deviceId: { exact: deviceId } }
        });
        const videoElement = document.getElementById('webcam');
        videoElement.srcObject = stream;
        window.stream = stream;
    } catch (error) {
        if (error.name === 'OverconstrainedError') {
            // Fallback with relaxed constraints
            console.warn('OverconstrainedError: Retrying with relaxed constraints.');
            try {
                const fallbackStream = await navigator.mediaDevices.getUserMedia({ video: true });
                const videoElement = document.getElementById('webcam');
                videoElement.srcObject = fallbackStream;
                window.stream = fallbackStream;
            } catch (fallbackError) {
                console.error('Error accessing the webcam with fallback constraints:', fallbackError);
            }
        } else {
            console.error('Error accessing the webcam:', error);
        }
    }
}

// Get the devices when the page loads
window.onload = getDevices;
