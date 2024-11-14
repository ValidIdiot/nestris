async function getDevices() {
    try {
        // Get the list of available media devices
        const devices = await navigator.mediaDevices.enumerateDevices();
        // Filter to only include video input devices that are likely capture cards
        const captureCardDevices = devices.filter(device => 
            device.kind === 'videoinput' && 
            (device.label.toLowerCase().includes('capture') || 
             device.label.toLowerCase().includes('hdmi'))
        );

        // Populate the dropdown menu with the capture card devices
        const deviceSelect = document.getElementById('deviceSelect');
        deviceSelect.innerHTML = ""; // Clear existing options
        captureCardDevices.forEach(device => {
            const option = document.createElement('option');
            option.value = device.deviceId;
            option.text = device.label || `Capture Card ${deviceSelect.length + 1}`;
            deviceSelect.appendChild(option);
        });

        // Start the first available capture card by default
        if (captureCardDevices.length > 0) {
            startWebcam(captureCardDevices[0].deviceId);
        } else {
            console.warn('No capture card devices found.');
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
        // Use the selected device ID for the video stream, configured for capture cards
        const constraints = {
            video: {
                deviceId: { exact: deviceId },
                width: { ideal: 640 }, // Adjust based on your capture card's capabilities
                height: { ideal: 480 }, // Full HD resolution
                frameRate: { ideal: 60 } // Higher frame rates for capture cards, if supported
            }
        };
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        const videoElement = document.getElementById('webcam');
        videoElement.srcObject = stream;
        window.stream = stream;
    } catch (error) {
        console.error('Error accessing the webcam/capture card:', error);
    }
}

// Get the devices when the page loads
window.onload = getDevices;
