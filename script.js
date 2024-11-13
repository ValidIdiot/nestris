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
    try {
        // Stop any existing video streams
        if (window.stream) {
            window.stream.getTracks().forEach(track => track.stop());
        }

        // Get the selected device's video stream
        const stream = await navigator.mediaDevices.getUserMedia({ video: { deviceId: { exact: deviceId } } });
        const videoElement = document.getElementById('webcam');
        videoElement.srcObject = stream;
        window.stream = stream; // Save the stream to stop it later
    } catch (error) {
        console.error('Error accessing the webcam:', error);
    }
}

// Get the devices when the page loads
window.onload = getDevices;
