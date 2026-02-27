export type Track = {
  title: string;
  artist: string;
  youtubeId: string; // The ?v= part of the YouTube URL
};

export type MusicCategory = {
  id: string;
  label: string;
  description?: string; // A short insight, e.g. "This gets me in the zone"
  tracks: Track[];
};

const music: MusicCategory[] = [
  {
    id: "fav-band",
    label: "My Fav Bands",
    description: "Metallica. Enough said.",
    tracks: [
      { title: "Master of Puppets", artist: "Metallica", youtubeId: "E0ozmU9cJDg" },
      { title: "Whole Lotta Love", artist: "Led Zeppelin", youtubeId: "HQmmM_qwG4k" },
      { title: "The Number of the Beast", artist: "Iron Maiden", youtubeId: "WxnN05vOuSM" },
      { title: "Chop Suey!", artist: "System of a Down", youtubeId: "CSvFpBOe8eY" },
    ],
  },
  {
    id: "from-dad",
    label: "From Dad",
    description: "Songs I grew up hearing from my old man",
    tracks: [
      { title: "Mr. Tambourine Man", artist: "Bob Dylan", youtubeId: "oecX_1pqxk0" },
      { title: "How to Make Gravy", artist: "Paul Kelly", youtubeId: "iYqIF2XkqKU" },
      { title: "Harvest Moon", artist: "Neil Young", youtubeId: "n2MtEsrcTTs" },
    ],
  },
  {
    id: "from-mum",
    label: "From Mum",
    description: "Mum's go-to tracks that stuck with me",
    tracks: [
      { title: "Bohemian Rhapsody", artist: "Queen", youtubeId: "fJ9rUzIMcZQ" },
    ],
  },
  {
    id: "underappreciated",
    label: "Underappreciated",
    description: "Deserves way more recognition",
    tracks: [
      { title: "Into the Abyss", artist: "Hilltop Hoods", youtubeId: "Z_JV26Adon8" },
      { title: "Ghost Love Score", artist: "Nightwish", youtubeId: "47e_961OQWE" },
      { title: "The Nights", artist: "Avicii", youtubeId: "H78YW7ycuwI" },
      { title: "Phantom of the Opera", artist: "Floor Jansen", youtubeId: "plCScjvDOJM" },
    ],
  },
  {
    id: "how-i-work",
    label: "How I Work",
    description: "Focus mode, deep work, get it done",
    tracks: [
      { title: "Deep Chill Music", artist: "Chill Vibes", youtubeId: "tmgM00yas78" },
    ],
  },
];

export default music;
