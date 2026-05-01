// This handles the game loop

import { WINDOW_WIDTH, WINDOW_HEIGHT, /*TARGET_FPS,*/ MAX_DELTA_TIME } from "./config.js";
import Player from "./Player.js";
import Music from "./Music.js";
import ParticleHandler from "./ParticleHandler.js";
import { preloadAnimation } from "./Animation.js";
import { setMusic, setPlayer, setParticleHandler } from "./InputHandler.js";

export default class GameEngine 
{
	constructor(canvasId = "window")
	{
		// Initialize canvas variables
		this.canvas = document.getElementById(canvasId);
		this.ctx = this.canvas.getContext("2d");
		this.syncCanvasSize();
		this.createBackground();

		// Handle window resizing and fullscreen
		window.addEventListener("resize", () => this.syncCanvasSize());
		window.addEventListener("resize", () => this.createBackground());
		document.addEventListener("fullscreenchange", () => this.syncCanvasSize());
		document.addEventListener("fullscreenchange", () => this.createBackground());
	
		// Shift origin to center of canvas
    	this.ctx.translate(this.canvas.width / 2, this.canvas.height / 2);

		// Initialize class objects
		const audio = document.querySelector("audio");
		this.music = new Music(audio);
		this.player = new Player();
		this.handler = new ParticleHandler(this.canvas);

		this.player.music = this.music;
		this.player.handler = this.handler
		this.handler.secondsPerBeat = 60 / this.music.getCurrentBPM();
		this.handler.bpmModeEnabled = true;
		
		setPlayer(this.player);
		setMusic(this.music);
		setParticleHandler(this.handler);
	}

	async run()
	{
		await preloadAnimation();
		this.player.updateBPM();
		this.music.play();

		let lastFrameTime = performance.now();
		const loop = (now) =>
		{
			let dt = (now - lastFrameTime) / 1000;
			dt = Math.min(dt, MAX_DELTA_TIME);
			lastFrameTime = now;

			this.update(dt);
			this.draw();
			requestAnimationFrame(loop);
		};

		requestAnimationFrame(loop);
	}

	update(dt)
	{
		if (this.player.update)
		{
			this.player.update(dt);
		}

		this.handler.update(dt);
	}

	draw()
	{
    	this.ctx.setTransform(1, 0, 0, 1, 0, 0);  // Reset transform
    	this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    	this.ctx.translate(this.canvas.width / 2, this.canvas.height / 2);
		this.handler.draw();
	}

	syncCanvasSize()
	{
		this.canvas.width = window.innerWidth;
		this.canvas.height = window.innerHeight;
		this.canvas.style.width = "100vw";
		this.canvas.style.height = "100vh";
	}

	createBackground()	// This method initializes a repeating background
	{
		const bg = document.getElementById("bg"); // Assign to background
		if (!bg) return;
		
		// !! Keep this num == the cols * rows in CSS #bg
		const NUM_LEEKS = 16; // how many leeks ya want
		bg.innerHTML = "";

		for (let i = 0; i < NUM_LEEKS; i++)
		{
			const img = document.createElement("img");
			img.src = "./assets/images/leek.png"; // This file path sets the background image
			img.className = "bg-tile";
			bg.appendChild(img);
		}
	}
}

