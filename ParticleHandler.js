import { Particle } from "./Particle.js";
import { WINDOW_WIDTH, WINDOW_HEIGHT } from "./config.js";

export default class ParticleHandler
{
    constructor(canvas)
    {
        // Particle variables
        this.canvas = canvas;
	    this.particles = [];
	    this.timeSinceLastParticle = 0;

		// BPM variables
		this.bpmModeEnabled = false;
		this.beatTimer = 0;
		this.secondsPerBeat = 0;
    }

    update(dt)
    {
    	// Particles logic for despawning and updating position of spawned particles
		this.timeSinceLastParticle += dt;	// Tracks the time since last particle was spawned
		this.updateOnBeat(dt);
        this.despawn();
		this.particles.forEach((p) => p.update(dt));
		this.particles = this.particles.filter((p) => p.m_ttl > 0); // Remove particles when their timer is up
    }

    draw()
    {
        this.particles.forEach((p) => p.draw());
    }

    //+==================+					
	//|	PARTICLES LOGIC	 |
	//+==================+
    despawn()
    {
        // if particle center coordinate is found outside WINDOW_HEIGHT and WINDOW_WIDTH + buffer OR too many onscreen, delete particle from this.particles
        const buffer = 500;
		const NUM_MAX_PARTICLES = 9999;
        const boundsX = this.canvas.width / 2 + buffer;
	    const boundsY = this.canvas.height / 2 + buffer;

        for (let i = this.particles.length - 1; i >= 0; i--)
        {
            const p = this.particles[i];

            if (Math.abs(p.m_centerCoordinate) > boundsX || Math.abs(p.m_centerCoordinate) > boundsY || this.particles.length >= NUM_MAX_PARTICLES)
            {
                this.particles.splice(i, 1);    // removes specific particle by its index
            }
        }
    }

    generateParticle(min, max, position)
	{
		// Randomize the range of particles spawned per call
		let numParticles = getRandomInt(min, max);
		const particles = [];

		for (let i = 0; i < numParticles; i++)
		{
			// Randomize a star with min to max number of vertices
            let minPoints = 8;    // If min < 8, program will sometimes create triangle particles
            let maxPoints = 20;

            let numPoints = getRandomInt(minPoints, maxPoints); // randomize number of points per particle
            if (numPoints % 2 == 0) { numPoints++; }    // ensures numPoints is an odd number
            
            // Creates particle and pushes them
            const p = new Particle(this.canvas, numPoints, position);
            particles.push(p);

			// Debug statements
			//console.log("Particle created at:", p.m_centerCoordinate);
            //console.log("Particles after click:", this.particles.length);
		}
		return particles;
	}

    specialEvent()
    {
        const character = document.getElementById("character");
		const rect = character.getBoundingClientRect();
		const canvasRect = this.canvas.getBoundingClientRect();

		// Find the edges of the character box relative to the screen
		const left = rect.left;					// Top left edge
		const right = rect.left + rect.width;	// Top right edge
		const top = rect.top;					// Top of character box
		const bottom = rect.top + rect.height;	// Bottom of character box

		const NUM_BURSTS = 2;
        for (let i = 0; i < NUM_BURSTS; i++)
		{
			// Pick a random edge, 4 total or 0 to 3
			const edge = getRandomInt(0, 3);
			let position = { x: 0, y: 0 };

			switch (edge)
			{
				case 0:	// Top edge
					position.x = getRandomFloat(left, right);
					position.y = top;
					break;

				case 1:	// Right edge
					position.x = right;
					position.y = getRandomFloat(top, bottom);
					break;

				case 2: // Bottom edge
					position.x = getRandomFloat(left, right);
					position.y = bottom;
					break;

				case 3: // Left edge
					position.x = left;
					position.y = getRandomFloat(top, bottom);
					break;
			}
		
			// adjust velocity of each particle

				const particles = this.generateParticle(5, 12, position);
				const scale = Math.min(this.canvas.width, this.canvas.height);

				for (let p of particles)
				{
					const angle = Math.random() * Math.PI * 2;
					const speed = Math.random() * (scale * 0.5) + (scale * 0.5);

					const vx = Math.cos(angle) * speed;
					const vy = Math.sin(angle) * speed;

					p.setVelocity(vx, vy);
				}

				this.particles.push(...particles);
		}

		// Debug
		//console.log("Calling event");
    }

	updateOnBeat(dt)
	{
		if (!this.bpmModeEnabled) return;

		this.beatTimer += dt;

		if (this.beatTimer >= this.secondsPerBeat)
		{
			this.beatTimer -= this.secondsPerBeat;
			this.specialEvent();
		}
	}
	
	toggleBPM(bpm)
	{
		this.bpmModeEnabled = !this.bpmModeEnabled;
		this.beatTimer = 0;

		if (typeof bpm === "number" && bpm > 0)
		{
			this.secondsPerBeat = 60 / bpm;
		}

        // Debug
		/*console.log("bpmModeEnabled:", this.bpmModeEnabled);
		console.log("bpm:", bpm);
		console.log("secondsPerBeat:", this.secondsPerBeat);*/
	}
}

function getRandomFloat(min, max)	// Helper for returning a random floating pointfrom min to max (inclusive range)
{
	return Math.random() * (max - min) + min;
}

function getRandomInt(min, max)		// Helper for returning a random int pointing from min to max (inclusive range)
{
	return Math.floor(Math.random() * (max - min + 1) + min);
}
	