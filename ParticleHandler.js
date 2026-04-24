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
    }

    update(dt)
    {
    	// Particles logic for despawning and updating position of spawned particles
		this.timeSinceLastParticle += dt;	// Tracks the time since last particle was spawned
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
	// Might need to create a separate class for managing particle functions

    despawn()
    {
        // if particle center coordinate is found outside WINDOW_HEIGHT and WINDOW_WIDTH + buffer, delete particle from this.particles
        const buffer = 500;
        const boundsX = this.canvas.width / 2 + buffer;
	    const boundsY = this.canvas.height / 2 + buffer;

        for (let i = this.particles.length - 1; i >= 0; i--)
        {
            const p = this.particles[i];

            if (Math.abs(p.m_centerCoordinate) > boundsX || Math.abs(p.m_centerCoordinate) > boundsY)
            {
                this.particles.splice(i, 1);    // removes specific particle by its index
            }
        }
    }

    generateParticle(min, max, position)
	{
		// Randomize the range of particles spawned per call
		let numParticles = Math.floor(Math.random() * (max - min + 1)) + min;
		const particles = [];

		for (let i = 0; i < numParticles; i++)
		{
			// Randomize a star with min to max number of vertices
            let minPoints = 8;    // If min < 8, program will sometimes create triangle particles
            let maxPoints = 20;

            let numPoints = Math.floor(Math.random() * (maxPoints - minPoints + 1)) + minPoints; // randomize number of points per particle
            if (numPoints % 2 == 0) { numPoints++; }    // ensures numPoints is an odd number
            
            // Creates particle and pushes them
            const p = new Particle(this.canvas, numPoints, position);
            particles.push(p);

			// Debug statements
			console.log("Particle created at:", p.m_centerCoordinate);
            console.log("Particles after click:", this.particles.length);
		}
		return particles;
	}

    specialEvent()
    {
        // create a box for particles to spawn from
        const character = document.getElementById("character");
        const rect = character.getBoundingClientRect();
		// create a random position within the spawn box
        const position =
        {
            x: rect.left + rect.width / 2,
            y: rect.top + rect.height * 0.5   // tweak this (0.5 = center)
        };
        
        // adjust velocity of each particle
        const particles = this.generateParticle(4, 10, position);

        for (let p of particles)
        {
            const angle = Math.random() * Math.PI * 2;
		    const speed = Math.random() * 250 + 250;

		    const vx = Math.cos(angle) * speed;
		    const vy = Math.sin(angle) * speed;

            p.setVelocity(vx, vy);
        }

		this.particles.push(...particles);

		// Debug
		console.log("Calling event");
    }
}
	