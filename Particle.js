import { Matrix, RotationMatrix, ScalingMatrix, TranslationMatrix } from "./Matrices.js";

// Constants
const M_PI = 3.1415926535897932384626433;
const G = 250; //1000;
const TTL = 3.0;
const SCALE = 0.999 

export class Particle
{
    constructor(canvas, numPoints, mouseClickPosition)
    {
        // Initialize variables
        this.canvas = canvas;
        this.numPoints = numPoints;
        this.mouseClickPosition = mouseClickPosition;   // holds coords of mouse click position
        this.m_A = new Matrix(2, numPoints);
        this.m_ttl = TTL;
        this.m_initialTTL = TTL;
        
        // Create random values
        this.random = Math.random() // generates a floating point number between 0 and 1
        this.m_radiansPerSec = this.random * M_PI;    // basically affects how much particle spins by randomizing rotation angle

        // Initialize the center coordinate based on mouse click location and canvas size
       this.m_centerCoordinate = 
       { 
            x: mouseClickPosition.x - canvas.width / 2,
            y:mouseClickPosition.y - canvas.height / 2
       };

        // Initialize velocity in X & Y directions
        this.m_vx = Math.random() * 400 + 100; // Random velocity between 100 and 500
        this.m_vy = Math.random() * 400 + 100; // Random velocity between 100 and 500
        this.m_vx *= Math.random() < 0.5 ? 1 : -1; // Randomizes m_vx to be positive or negative
        this.m_vy *= Math.random() < 0.5 ? 1 : -1;
    
        // Initialize color scheme
        this.m_color1 = 'rgba(252, 193, 26, 1)';    // fill color
        this.m_color2 = 'rgba(255, 255, 0, 1)';     // outline color

        // Initialize canvas to draw Particle on
        this.ctx = this.canvas.getContext('2d');

        // Create the Particles shape
        this.generateShape();
    }

    // Methods
    draw()
    {
        const ctx = this.ctx;
        const { m_A, numPoints } = this;

        // Draw shape
        ctx.beginPath();
        ctx.moveTo(m_A.get(0, 0), m_A.get(1, 0));    // start at first vertex

        for (let j = 1; j < numPoints; j++)        // draw lines for each vertex (numPoints)
        {
            ctx.lineTo(m_A.get(0, j), m_A.get(1, j));
        }
        ctx.closePath();    // connect first and last vertex together

        // Set colors
        ctx.fillStyle = this.m_color1;
        ctx.strokeStyle = this.m_color2;
        ctx.lineWidth = 1;

        ctx.fill();
        ctx.stroke();
    }

    update(dt)
    {  
        const { m_initialTTL, m_radiansPerSec } = this; 

        // Create a lifetime ratio ranging from 0 to 1, using m_ttl and m_initialTTL
        const ratio = Math.max(0, (this.m_ttl / m_initialTTL));
        
        // Calculate a new alpha based on the ratio, this creates a fading effect by gradually decreasing the Particle's opacity
        const alpha = (Math.floor(255 * ratio)) / 255;

        // Updates colors with new opacity (just hardcode rgb for now)
        this.m_color1 = `rgba(252, 193, 26, ${alpha})`;   // fill color
        this.m_color2 = `rgba(255, 255, 0, ${alpha})`;    // outline color

        // Update TTL based on DT
        this.m_ttl -= dt;

        // Update rotation, scaling, translation on Particle every frame
        this.rotate(dt * m_radiansPerSec);
        this.scale(SCALE);

        let dx = this.m_vx * dt;
        this.m_vy += G * dt;
        let dy = this.m_vy * dt;

        this.translate(dx, dy);
    }

    generateShape() // This method generates the positions required to draw a star-like Particle.
    {
        const { m_A, m_centerCoordinate, numPoints } = this;
        
        let random = this.random;     // uses a floating point number between 0 - 1
        let theta = random / M_PI       // divide the random fraction by PI constant
        let dTheta = 2 * M_PI / (numPoints - 1);

        // Logic for making star-like shapes
		const scale = Math.min(this.canvas.width, this.canvas.height);
        let outerRadius = Math.random() * (scale * 0.05) + (scale * 0.01);     // generates a random distance that determines the length of each 'tip' of the star
        let innerRadius = outerRadius * 0.5           // a constant fraction that keeps the depth of each 'dip' of the star to end halfway of the outer radius

        for (let j = 0; j < numPoints; j++)
        {
            let radius = ( j % 2 === 0) ? outerRadius : innerRadius;    // Alternates between drawing the 'tip' then 'dip' of the star points
            let dx = radius * Math.cos(theta);
            let dy = radius * Math.sin(theta);

            m_A.set(0, j, (m_centerCoordinate.x + dx));
            m_A.set(1, j, (m_centerCoordinate.y + dy));
            theta += dTheta;
        }
    }

    setVelocity(vx, vy)
    {
        this.m_vx = vx;
        this.m_vy = vy;
    }

    // Private Methods

    rotate(theta)   // This method rotates the Particle counter-clockwise by theta radians using a RotationMatrix and matrix multiplication.
    {
        let temp = { x: this.m_centerCoordinate.x, y: this.m_centerCoordinate.y };
        this.translate(-this.m_centerCoordinate.x, -this.m_centerCoordinate.y);
        let rotation = new RotationMatrix(theta);

        this.m_A = rotation.multiply(this.m_A);     // ex: m_A = R * m_A
        this.translate(temp.x, temp.y);
    }

    scale(c)    // This method scales the Particle size by a factor of 'c' by using a ScalingMatrix and matrix multiplication.
    {
        let temp = { x: this.m_centerCoordinate.x, y: this.m_centerCoordinate.y };
        this.translate(-this.m_centerCoordinate.x, -this.m_centerCoordinate.y);
        let scalar = new ScalingMatrix(c);

        this.m_A = scalar.multiply(this.m_A);   // ex: m_A = S * m_A
        this.translate(temp.x, temp.y);
    }

    translate(xShift, yShift)   // This method shifts the Particle by coordinates (xShift, yShift) using a TranslationMatrix and matrix addition.
    {
        let nCols = this.m_A.getCols();
        let translation = new TranslationMatrix(xShift, yShift, nCols);
        
        this.m_A = this.m_A.add(translation);   // ex: m_A = T + m_A
        this.m_centerCoordinate.x += xShift;
        this.m_centerCoordinate.y += yShift;

    }
}


