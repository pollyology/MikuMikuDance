//    +---------------------------+
//    |       HANDLING KEYS       |
//    +---------------------------+
const keyPress = {};    // Stores whether key was pressed or released as (true/false) in an array
let player = null;
let music = null;
let particleHandler = null;

export function setPlayer(p)
{ 
	player = p; 
}

export function setMusic(m)
{
	music = m;
}

export function setParticleHandler(handler)
{
    particleHandler = handler;
}

document.addEventListener("keydown", (e) =>    
{
    if (keyPress[e.code]) return;   // If key is held down, mark as pressed (true)
    keyPress[e.code] = true;        // If key wasn't pressed already (false), mark as pressed (true)

    switch (e.code)                 // When one of the following keys are pressed, do:
    {
        case "KeyM":                // When "M" is pressed, mute volume.
            if (music) music.toggleMute();
            break;
        case "Space":               // When "Space is pressed", change track.
            if (music) music.changeMusic();
            if (player) player.updateBPM();
            break;
		case "KeyP":				// When "P" is pressed, toggle BPM mode.
			if (particleHandler && music) particleHandler.toggleBPM(music.getCurrentBPM());
			break;			
    }

	if (player && isDirectionPressed()) player.dance(e.code); 
    
});

document.addEventListener("keyup", (e) => 
{ 
    keyPress[e.code] = false; 
	if (!isDirectionPressed() && player) player.resetIdle(); // Resets frame only if no direction keys are being pressed

}); // Marks the key pressed as released, this prevents function call spam.

function isDirectionPressed()   // This is a helper function that determines if any of the movement keys are currently pressed.
{
    // Returns true if ANY of the WASD or arrow keys is pressed.
    return (keyPress["KeyW"] || keyPress["ArrowUp"]   ||
            keyPress["KeyA"] || keyPress["ArrowLeft"] ||
            keyPress["KeyS"] || keyPress["ArrowDown"] ||
            keyPress["KeyD"] || keyPress["ArrowRight"]);
}

