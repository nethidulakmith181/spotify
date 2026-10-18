import { Track, Playlist } from '../types/spotify';

export const INITIAL_TRACKS: Track[] = [
  {
    id: 'track-1',
    title: 'Midnight Horizon (Synthwave Dream)',
    artist: 'The Midnight Echo',
    album: 'Neon Skyway',
    coverUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80',
    audioUrl: 'https://commondatastorage.googleapis.com/codeskulptor-demos/riceracer_assets/music/race.ogg',
    duration: 154,
    accentColor: '#7c3aed',
    genre: 'Synthwave / Retro',
    year: 2024,
    lyrics: [
      { time: 0, text: '♪ (Neon synth chords echoing) ♪' },
      { time: 8, text: 'Cruising through the city under purple skies' },
      { time: 16, text: 'Streetlights flashing by right before our eyes' },
      { time: 25, text: 'No static on the radio, just the open road' },
      { time: 34, text: 'Feel the rhythm pulses as the night unfolds' },
      { time: 43, text: 'Hold on to the wheel, let the engine sing' },
      { time: 52, text: 'We are chasing whatever tomorrow brings' },
      { time: 62, text: '♪ (Synthesizer solo & driving drums) ♪' },
      { time: 78, text: 'Midnight horizon, glowing in the dark' },
      { time: 88, text: 'Every neon shadow leaves a golden spark' },
      { time: 98, text: 'Never turn around now, never look behind' },
      { time: 108, text: 'Lost in the electric fever of our minds' },
      { time: 120, text: '♪ (Outro fade into starlight) ♪' }
    ]
  },
  {
    id: 'track-2',
    title: 'Starry Nights & Coffee Cups',
    artist: 'Luna & The Cloud',
    album: 'Sunday Morning Coffee',
    coverUrl: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=600&auto=format&fit=crop&q=80',
    audioUrl: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=lofi-study-112191.mp3',
    duration: 147,
    accentColor: '#d97706',
    genre: 'Lo-Fi / Chill',
    year: 2024,
    lyrics: [
      { time: 0, text: '♪ (Warm vinyl crackle & Rhodes chords) ♪' },
      { time: 12, text: 'Rain drops tapping on the window sill' },
      { time: 24, text: 'Clock is ticking slow while the world stays still' },
      { time: 36, text: 'Steaming mug of coffee in my favorite place' },
      { time: 48, text: 'Drifting off to memories I cannot erase' },
      { time: 60, text: 'Soft breeze blowing gently through the open door' },
      { time: 72, text: 'Finding peace in melodies I never heard before' },
      { time: 84, text: '♪ (Mellow saxophone riff) ♪' },
      { time: 98, text: 'Just stay right here until the morning light' },
      { time: 112, text: 'Everything is gonna be alright tonight' },
      { time: 128, text: '♪ (Gentle fading chords) ♪' }
    ]
  },
  {
    id: 'track-3',
    title: 'Golden Hour Sunset',
    artist: 'Aura Bloom',
    album: 'Velvet Summer',
    coverUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&auto=format&fit=crop&q=80',
    audioUrl: 'https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3?filename=sunset-vibes-112194.mp3',
    duration: 162,
    accentColor: '#e11d48',
    genre: 'Pop / Indie',
    year: 2024,
    lyrics: [
      { time: 0, text: '♪ (Acoustic guitar intro) ♪' },
      { time: 10, text: 'Sun dipping low on the western shore' },
      { time: 18, text: 'Every wave is washing away what came before' },
      { time: 28, text: 'Golden light is spilling across the sand' },
      { time: 38, text: 'You smiled and reached out for my hand' },
      { time: 48, text: 'This is the moment we were waiting for' },
      { time: 58, text: 'Dont want to think of yesterday anymore' },
      { time: 68, text: '♪ (Uplifting indie pop drop) ♪' },
      { time: 82, text: 'Golden hour, lighting up your face' },
      { time: 92, text: 'Time stands still in this secret place' },
      { time: 104, text: 'We got all night to watch the stars collide' },
      { time: 118, text: 'Nothing to lose with you by my side' },
      { time: 135, text: '♪ (Harmonies & fading breeze) ♪' }
    ]
  },
  {
    id: 'track-4',
    title: 'Tokyo Cyber Drift',
    artist: 'Kurogane & Neon Pulse',
    album: 'Shibuya After Dark',
    coverUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=600&auto=format&fit=crop&q=80',
    audioUrl: 'https://cdn.pixabay.com/download/audio/2022/10/14/audio_9939f792cb.mp3?filename=cyberpunk-2099-10701.mp3',
    duration: 188,
    accentColor: '#06b6d4',
    genre: 'Electronic / EDM',
    year: 2024,
    lyrics: [
      { time: 0, text: '♪ (Deep sub-bass rumble & holographic arpeggio) ♪' },
      { time: 14, text: 'Laser lights reflect in the falling rain' },
      { time: 26, text: 'Adrenaline rushing through my digital veins' },
      { time: 38, text: 'Drifting round the corner at 200 speed' },
      { time: 50, text: 'Speed and freedom is the only drug I need' },
      { time: 62, text: '♪ (Heavy electronic drop & cyber bass) ♪' },
      { time: 80, text: 'Shibuya towers shining blue and red' },
      { time: 94, text: 'Voices whispering inside my head' },
      { time: 108, text: 'Push the nitro, break the sound barrier now' },
      { time: 122, text: 'They wonder who we are and they wonder how' },
      { time: 140, text: '♪ (Distorted synth climax) ♪' },
      { time: 165, text: 'Vanishing into the morning mist' }
    ]
  },
  {
    id: 'track-5',
    title: 'Sweet Serenade',
    artist: 'Maya Rivera',
    album: 'Acoustic Soul Sessions',
    coverUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80',
    audioUrl: 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8c8a73467.mp3?filename=acoustic-guitar-relax-110756.mp3',
    duration: 175,
    accentColor: '#10b981',
    genre: 'Acoustic / Folk',
    year: 2023,
    lyrics: [
      { time: 0, text: '♪ (Fingerpicked acoustic guitar) ♪' },
      { time: 12, text: 'Morning coffee, sunlight on the floor' },
      { time: 22, text: 'I never wanted anything much more' },
      { time: 34, text: 'Simple chords and words from the heart' },
      { time: 46, text: 'You were the masterpiece right from the start' },
      { time: 58, text: 'Sing me a sweet serenade in the quiet' },
      { time: 70, text: 'Calm down the storm and the riot' },
      { time: 82, text: '♪ (Warm cello accompaniment) ♪' },
      { time: 98, text: 'Through every season we stand tall' },
      { time: 114, text: 'You are the rhythm in my soul after all' },
      { time: 132, text: 'Sweet serenade, stay here with me' },
      { time: 150, text: '♪ (Gentle acoustic outro) ♪' }
    ]
  },
  {
    id: 'track-6',
    title: 'After Midnight Beats',
    artist: 'DJ Zenith',
    album: 'Deep Bass Haven',
    coverUrl: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=600&auto=format&fit=crop&q=80',
    audioUrl: 'https://cdn.pixabay.com/download/audio/2021/09/06/audio_924296df4a.mp3?filename=chill-abstract-intention-12099.mp3',
    duration: 138,
    accentColor: '#8b5cf6',
    genre: 'Hip-Hop / Chillhop',
    year: 2024,
    lyrics: [
      { time: 0, text: '♪ (Boom-bap drum groove & jazz keys) ♪' },
      { time: 15, text: 'Headphones on, block out the noise outside' },
      { time: 28, text: 'Catching the groove on this midnight ride' },
      { time: 42, text: 'Lofi texture, heavy kick and snare' },
      { time: 56, text: 'Float through the rhythm without a care' },
      { time: 70, text: '♪ (Scratches & smooth bass break) ♪' },
      { time: 88, text: 'Night owls know the secret frequency' },
      { time: 102, text: 'Where time bends into harmony' },
      { time: 120, text: '♪ (Chill outro groove) ♪' }
    ]
  },
  {
    id: 'track-7',
    title: 'Starlight Symphony',
    artist: 'Celeste & Orchestra',
    album: 'Infinite Constellations',
    coverUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&auto=format&fit=crop&q=80',
    audioUrl: 'https://cdn.pixabay.com/download/audio/2022/11/06/audio_104cb1a575.mp3?filename=space-ambient-126282.mp3',
    duration: 195,
    accentColor: '#3b82f6',
    genre: 'Ambient / Cinematic',
    year: 2024,
    lyrics: [
      { time: 0, text: '♪ (Ethereal ambient pads & deep space echo) ♪' },
      { time: 20, text: 'Gliding past galaxies far beyond view' },
      { time: 42, text: 'The silence of space in shades of cosmic blue' },
      { time: 65, text: 'Billions of stars dancing in rhyme' },
      { time: 90, text: '♪ (Orchestral swell & planetary chime) ♪' },
      { time: 115, text: 'Forever floating free from weight and time' },
      { time: 140, text: 'The starlight symphony sings in your mind' },
      { time: 170, text: '♪ (Slow cosmic fadeout) ♪' }
    ]
  },
  {
    id: 'track-8',
    title: 'Summer Breeze (Tropical Vibes)',
    artist: 'Sunwave Collective',
    album: 'Ibiza Poolside',
    coverUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&auto=format&fit=crop&q=80',
    audioUrl: 'https://cdn.pixabay.com/download/audio/2022/08/02/audio_884fe92c21.mp3?filename=tropical-summer-116503.mp3',
    duration: 145,
    accentColor: '#14b8a6',
    genre: 'Tropical House / Pop',
    year: 2024,
    lyrics: [
      { time: 0, text: '♪ (Marimba & steel pan intro) ♪' },
      { time: 10, text: 'Clear blue waters, salty summer breeze' },
      { time: 20, text: 'Dancing under the palm tree leaves' },
      { time: 32, text: 'Feel that bassline jumping in your feet' },
      { time: 44, text: 'This tropical rhythm cannot be beat' },
      { time: 58, text: '♪ (Tropical house saxophone drop) ♪' },
      { time: 75, text: 'Sun goes down, but we just got started' },
      { time: 90, text: 'Celebration for the happy hearted' },
      { time: 105, text: 'Keep the music playing until the dawn' },
      { time: 120, text: 'Singing together this summer song' },
      { time: 135, text: '♪ (Fade into ocean waves) ♪' }
    ]
  }
];

export const INITIAL_PLAYLISTS: Playlist[] = [
  {
    id: 'playlist-top-hits',
    title: "Today's Top Hits",
    description: 'The biggest tracks right now. Non-stop, uninterrupted & ad-free.',
    coverUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&auto=format&fit=crop&q=80',
    curator: 'Spotify',
    accentColor: '#10b981',
    tracks: [INITIAL_TRACKS[0], INITIAL_TRACKS[2], INITIAL_TRACKS[3], INITIAL_TRACKS[7], INITIAL_TRACKS[1]]
  },
  {
    id: 'playlist-discover',
    title: 'Discover Weekly',
    description: 'Your weekly mixtape of fresh music. Rewind any song anytime.',
    coverUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80',
    curator: 'Made for You',
    accentColor: '#8b5cf6',
    tracks: [INITIAL_TRACKS[1], INITIAL_TRACKS[4], INITIAL_TRACKS[6], INITIAL_TRACKS[0], INITIAL_TRACKS[5]]
  },
  {
    id: 'playlist-chill-lofi',
    title: 'Lofi Beats to Chill / Study',
    description: 'Cozy lo-fi beats, gentle raindrops and peaceful coffee shop vibes.',
    coverUrl: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=600&auto=format&fit=crop&q=80',
    curator: 'Spotify Editorial',
    accentColor: '#f59e0b',
    tracks: [INITIAL_TRACKS[1], INITIAL_TRACKS[5], INITIAL_TRACKS[4], INITIAL_TRACKS[6]]
  },
  {
    id: 'playlist-cyberpunk',
    title: 'Cyberpunk & Night Drive',
    description: 'High-octane electronic, synthwave and neon retro rhythms.',
    coverUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=600&auto=format&fit=crop&q=80',
    curator: 'Spotify',
    accentColor: '#06b6d4',
    tracks: [INITIAL_TRACKS[0], INITIAL_TRACKS[3], INITIAL_TRACKS[5], INITIAL_TRACKS[7]]
  },
  {
    id: 'playlist-liked-songs',
    title: 'Liked Songs',
    description: 'Your personal collection of favorite tracks.',
    coverUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80',
    curator: 'You',
    accentColor: '#6366f1',
    tracks: [INITIAL_TRACKS[0], INITIAL_TRACKS[1], INITIAL_TRACKS[2], INITIAL_TRACKS[3]]
  }
];

export const BROWSE_CATEGORIES = [
  { id: 'cat-pop', title: 'Pop', color: 'from-pink-600 to-rose-700', img: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&auto=format&fit=crop&q=80' },
  { id: 'cat-hiphop', title: 'Hip-Hop', color: 'from-amber-600 to-orange-700', img: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=300&auto=format&fit=crop&q=80' },
  { id: 'cat-dance', title: 'Dance / Electronic', color: 'from-cyan-600 to-blue-700', img: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=300&auto=format&fit=crop&q=80' },
  { id: 'cat-chill', title: 'Chill & Lo-Fi', color: 'from-emerald-600 to-teal-800', img: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=300&auto=format&fit=crop&q=80' },
  { id: 'cat-indie', title: 'Indie & Folk', color: 'from-purple-600 to-indigo-800', img: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=300&auto=format&fit=crop&q=80' },
  { id: 'cat-workout', title: 'Workout Energy', color: 'from-red-600 to-orange-600', img: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=300&auto=format&fit=crop&q=80' },
  { id: 'cat-focus', title: 'Focus & Study', color: 'from-blue-600 to-indigo-700', img: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=300&auto=format&fit=crop&q=80' },
  { id: 'cat-sleep', title: 'Sleep & Ambient', color: 'from-indigo-900 to-purple-950', img: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=300&auto=format&fit=crop&q=80' }
];
