class StreamFlowPlayer {
    constructor() {
        // DOM Elements
        this.video = document.getElementById('videoPlayer');
        this.urlSection = document.getElementById('urlSection');
        this.playerSection = document.getElementById('playerSection');
        this.loadBtn = document.getElementById('loadBtn');
        this.urlInput = document.getElementById('videoUrl');
        
        // Menus
        this.audioBtn = document.getElementById('audioBtn');
        this.audioMenu = document.getElementById('audioMenu');
        this.audioTracksList = document.getElementById('audioTracksList');
        this.speedBtn = document.getElementById('speedBtn');
        this.speedMenu = document.getElementById('speedMenu');

        this.init();
    }

    init() {
        this.bindEvents();
    }

    bindEvents() {
        this.loadBtn.addEventListener('click', () => this.loadVideo());
        
        // Toggle Audio Menu
        this.audioBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.audioMenu.classList.toggle('active');
            this.speedMenu.classList.remove('active');
        });

        // Toggle Speed Menu
        this.speedBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.speedMenu.classList.toggle('active');
            this.audioMenu.classList.remove('active');
        });

        // Close menus on click outside
        document.addEventListener('click', () => {
            this.audioMenu.classList.remove('active');
            this.speedMenu.classList.remove('active');
        });

        this.video.addEventListener('loadedmetadata', () => {
            this.setupAudioTracks();
        });
    }

    loadVideo() {
        const url = this.urlInput.value.trim();
        if (!url) return;

        this.urlSection.style.display = 'none';
        this.playerSection.style.display = 'block';
        this.video.src = url;
        this.video.load();
    }

    setupAudioTracks() {
        // Note: audioTracks is primarily supported in Safari or via HLS.js
        const tracks = this.video.audioTracks;
        
        if (!tracks || tracks.length <= 1) {
            this.audioBtn.style.display = 'none';
            return;
        }

        this.audioBtn.style.display = 'flex';
        this.audioTracksList.innerHTML = '';

        for (let i = 0; i < tracks.length; i++) {
            const track = tracks[i];
            const option = document.createElement('div');
            option.className = `audio-option ${track.enabled ? 'active' : ''}`;
            
            // Labeling logic
            const label = track.label || track.language || `Track ${i + 1}`;
            option.textContent = label.toUpperCase();

            option.onclick = () => {
                // Disable all tracks, enable chosen one
                for (let j = 0; j < tracks.length; j++) {
                    tracks[j].enabled = (i === j);
                }
                this.setupAudioTracks(); // Refresh active state in UI
            };

            this.audioTracksList.appendChild(option);
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new StreamFlowPlayer();
});
