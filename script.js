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
        // Relaxed constraints
        const constraints = {
            video: {
                deviceId: deviceId ? { exact: deviceId } : undefined, // Use exact if deviceId is available
                width: { ideal: 1280 }, // Preferred width
                height: { ideal: 720 }  // Preferred height
            }
        };
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        const videoElement = document.getElementById('webcam');
        videoElement.srcObject = stream;
        window.stream = stream;
    } catch (error) {
        console.error('Error accessing the webcam:', error);
    }
}


// Get the devices when the page loads
window.onload = getDevices;
