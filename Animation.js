// This file handles the dancing animation frames
const character = document.getElementById("character");

export let frames = {};
export let idleFrames = [];

export function setCharacter(name)
{
	frames = // Holds the animation frame based on directional key pressed.
	{
		UP:     `./assets/images/${name}/${name}-up.png`,
		DOWN:   `./assets/images/${name}/${name}-down.png`,
		LEFT:   `./assets/images/${name}/${name}-left.png`,
		RIGHT:  `./assets/images/${name}/${name}-right.png`
	};

	idleFrames = 
	[
		`./assets/images/${name}/${name}-1.png`,
		`./assets/images/${name}/${name}-2.png`,
		`./assets/images/${name}/${name}-3.png`,
		`./assets/images/${name}/${name}-2.png`
	]
}

//    +---------------------------+
//    |     HANDLING ANIMATION    |
//    +---------------------------+

export function preloadAnimation()
{
	const sources = [
		frames.UP,
		frames.DOWN,
		frames.LEFT,
		frames.RIGHT,
		...idleFrames
	];

	return Promise.all
	(
		sources.map((src) =>
			new Promise((resolve, reject) =>
			{
				const img = new Image();
				img.onload = resolve;
				img.onerror = reject;
				img.src = src;
			})
		)
	);
}

export function updateFrame(src)   // This method changes the overlay frame to the given source image.
{
    character.src = src;
}

export function resetFrame()    // This method resets the background image and hides the overlay frame.
{
    overlay.style.display = "none"; // Hides the overlay frame
    bg.style.display = "block";     // Shows the background gif again
}

//    +---------------------------+
//    |     PULSE ON KEY PRESS    |
//    +---------------------------+
let pulse = null;

function pulseElement(element)
{
    if (!element) return;   // Check for valid element

    let start = null;
    const duration = 150; // The duration of 'pulse' animation (in ms)
    const transform = "translate(-50%, -50%)";

    function animate(time)
    {
        if (!start) start = time;   // Get current time
        const dt = time - start;
        const t = Math.min(dt / duration, 1);   // Tracks 'progress' of animation, between 0 to 1. 1 -> 100% done
        const transform = (element.id === "character") ? "translate(-50%, -50%)" : "";
        
        // Fancy ass sine-wave shennanigans
        const amplitude = 0.05;
        const scale = 1 + Math.sin(t * Math.PI) * amplitude;    // To simulate pulsing, use a sine wave to go from 0 -> 1 -> 0
        
        // Apply the pulse
		element.style.transform = `${transform} scale(${scale})`;

        if (t < 1)
		{
			pulse = requestAnimationFrame(animate);
		}
        else 
		{
			element.style.transform = transform;
			pulse = null;
		}
    }

    pulse = requestAnimationFrame(animate);
}

export function rotateElement(element)
{
    
}
  
export function triggerPulse() 
{
    pulseElement(character);
    pulseElement(score);
    document.querySelectorAll(".bg-tile").forEach(pulseElement);
}