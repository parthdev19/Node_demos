const Gpio = require('onoff').Gpio; // Import onoff module
const pirSensor = new Gpio(17, 'in', 'both'); // Use GPIO 17, with 'both' edge detection

let motionDetected = false; // State to track motion

// Function to handle motion detected event
pirSensor.watch((err, value) => {
    if (err) {
        console.error('There was an error:', err);
        return;
    }
    
    if (value === 1 && !motionDetected) { // Motion detected and not already in motion state
        console.log('Motion Detected!');
        motionDetected = true; // Set state to true
    } else if (value === 0 && motionDetected) { // No motion and currently in motion state
        console.log('No motion.');
        motionDetected = false; // Reset state to false
    }
});

// Clean up GPIO pins when the process is exited
process.on('SIGINT', () => {
    pirSensor.unexport();
    console.log('GPIO pins freed. Exiting...');
    process.exit();
});
