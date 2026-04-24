//    +---------------------------+
//    |    MUSIC INITIALIZATION   |
//    +---------------------------+

const tracks =
[
    {
        title: "Mystic Quest - City of Fire",
        artist: "Final Fantasy Mystic Quest",
        file: "City-of-Fire.mp3",
		bpm: 92,
		volume: 1.0
    },
    {
        title: "Mesmerizer",
        artist: "32ki",
        file: "Mesmerizer.flac",
		bpm: 185,
		volume: 0.75
    },
	{
        title: "Drop Pop Candy",
        artist: "Luka and Miku",
        file: "drop_pop_candy.mp3",
		bpm: 65,
		volume: 1.0
    }

]

export default class Music
{
	constructor(audioElement, playlist = tracks)
	{

		this.playlist = playlist;
		this.musicIndex = 0;    // Index of the tracklist
		this.music = audioElement;
		this.music.volume = this.getCurrentTrack().volume;
		this.isMuted = false;

		this.timer = 0;
		this.cooldown = 300;    // 300ms -> 0.3 s

		this.music.play().catch(() => 
		{
			console.log("Autoplay blocked, waiting for user input.");
		});

		document.addEventListener("keydown", () => 
		{
  			if (this.music.paused) this.music.play();
		}, { once: true });
	}

	getCurrentTrack()
	{
		return this.playlist[this.musicIndex];
	}

	getCurrentBPM()
	{
		const track = this.getCurrentTrack();
		console.log(`Current BPM:  ${track.title} - ${track.bpm}`);

		return this.getCurrentTrack().bpm;
	}

	loadCurrentTrack()
	{
		const track = this.getCurrentTrack();
		this.music.src = `./assets/music/${track.file}`;
	}

	play()
	{
		this.music.play();
	}
	
	toggleMute()
	{
		if (this.isMuted)
		{
			this.music.volume = this.getCurrentTrack().volume;
			this.isMuted = false;
			// button.style.backgroundImage = 'url("./assets/images/Volume_On.png")';
		}
		else
		{
			this.music.volume = 0.0;
			this.isMuted = true;
			// button.style.backgroundImage = 'url("./assets/images/Volume_Mute.png")';
		}
		console.log((this.isMuted) ? "Volume is muted." : "Volume is unmuted.");
	}

	changeMusic(forward = true)
	{
		// Check for cooldown timer
		const now = performance.now();    
		if (now - this.timer < this.cooldown) return;    // this prevents a single click or double click from skipping songs twice
		this.timer = now;

		// Loop forwards or backwards the tracklist
		this.musicIndex = (forward) ? (this.musicIndex + 1) % this.playlist.length : (this.musicIndex - 1 + this.playlist.length) % this.playlist.length;

		// Change current track
		this.loadCurrentTrack();
		this.music.volume = this.getCurrentTrack().volume;
		this.music.play()

		const track = this.getCurrentTrack();
		console.log(`Now playing: ${track.title} - ${track.artist}`);
	}
}
// BPM of Music
// Mystic Quest - 108 BPM