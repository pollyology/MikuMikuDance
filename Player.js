import { frames, idleFrames, updateFrame, triggerPulse, setCharacter } from "./Animation.js";

export default class Player
{
	constructor()
	{
		this.isIdle = true;
		this.idleLoop = null;
		this.pulseLoop = null;
		this.index = 0;
		this.resetTimer = null;
		this.music = music;
		this.handler = null;

		setCharacter("miku");
	}

	updateBPM()
	{
		// Edit: need to change BPM stuff later to work with multiple songs
		let BPM = this.music.getCurrentBPM() / 2;	// change to let BPM = getCurrentBPM() / 2
		let duration = ((60 / BPM) * 1000)
		this.interval = duration / idleFrames.length;
 
		this.stopIdle();
		this.startIdle();
		this.stopPulse();
		this.startPulse();
	}
	startPulse()
	{
		if (this.pulseLoop) return;

		this.pulseLoop = setInterval(() =>
		{
			triggerPulse();
		}, this.interval);
	}

	stopPulse()
	{
		clearInterval(this.pulseLoop);
		this.pulseLoop = null;
	}

	startIdle()
	{
		if (this.idleLoop) return; // Prevent multiple loops

		this.idleLoop = setInterval(() =>	// Every x milliseconds, cycle through idle frame
		{
			if (!this.isIdle) return;

			updateFrame(idleFrames[this.index])
			this.index = (this.index + 1) % idleFrames.length;
		}, this.interval);
	}

	stopIdle()
	{
		clearInterval(this.idleLoop);
		this.idleLoop = null;
	}

	// Change animation frame if the following keys are pressed:
	dance(input)
	{
		clearTimeout(this.resetTimeout);
		this.isIdle = false;
		this.stopIdle();

		if (input === "KeyW" || input === "ArrowUp")         {updateFrame(frames.UP);    }        // When "W" or up arrow key is pressed.
		else if (input === "KeyA" || input === "ArrowLeft")  {updateFrame(frames.LEFT);  }        // When "A" or left arrow key is pressed.
		else if (input === "KeyS" || input === "ArrowDown")  {updateFrame(frames.DOWN);  }        // When "S" or down arrow key is pressed.
		else if (input === "KeyD" || input === "ArrowRight") {updateFrame(frames.RIGHT); }        // When "D" or right arrow key is pressed.
		//triggerPulse();
		
		if (this.handler) this.handler.specialEvent();
		console.log("Calling dance");
		
	}
	
	resetIdle()
	{
		this.resetTimeout = setTimeout(() =>
		{
			this.isIdle = true;
			const lastFrameIndex = (this.index - 1 + idleFrames.length) % idleFrames.length; // Store the last frame by getting its index
			updateFrame(idleFrames[lastFrameIndex]); // Makes changing frame look seamless
		}, 150)
		this.startIdle();		
	}
}
