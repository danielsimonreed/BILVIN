
export const SECRET_CODE = "bicanosaurus";

export interface TimelineData {
  id: number;
  heading: string;
  text: string;
  image: string;
  caption: string;
  secretMessage: string;
}

export const TIMELINE_STEPS: TimelineData[] = [
  {
    id: 1,
    heading: "Awal cerita kita",
    text: "9 September 2025. Hari itu mungkin kelihatan biasa buat orang lain, tapi buat aku, itu hari dimana semesta rasanya berpihak sama aku. Saat kamu bilang 'iya', rasanya kayak ada kepingan puzzle yang akhirnya ketemu rumahnya.",
    image: "/images/photos1.jpg",
    caption: "The start of our chapter.",
    secretMessage: "I love you so much ❤️"
  },
  {
    id: 2,
    heading: "Jatuh Hati",
    text: "Sebenernya sebelum tanggal itu pun, aku udah lama ngerasa ada yang beda. Cara kamu senyum, cara kamu cerita soal hal-hal kecil... pelan-pelan bikin aku sadar kalau aku nggak mau kehilangan momen-momen itu. I knew I wanted to be with you.",
    image: "/images/photos2.jpg",
    caption: "Falling for you, slowly but surely.",
    secretMessage: "You stole my heart"
  },
  {
    id: 3,
    heading: "The luckiest guy",
    text: "Aku sering mikir malem-malem, kok bisa ya kamu milih aku? Di antara banyaknya orang, you chose to stand by me. That simple fact makes me feel like the luckiest guy in the room, every single time.",
    image: "/images/photos3.jpg",
    caption: "Grateful is an understatement.",
    secretMessage: "You are my everything"
  },
  {
    id: 4,
    heading: "Rumah",
    text: "Ada hari-hari di mana dunia rasanya berisik dan capek banget. Tapi pas denger suara kamu atau liat foto kamu, semuanya jadi tenang lagi. Kamu itu kayak tempat berteduh, my safe space, tempat aku pulang.",
    image: "/images/photos4.jpg",
    caption: "My peace in the chaos.",
    secretMessage: "I miss you everyday"
  },
  {
    id: 5,
    heading: "Little moments",
    text: "Bukan cuma momen besar yang aku suka, tapi justru hal-hal kecil. Chat random kita, jokes receh yang cuma kita yang ngerti, atau diem-dieman di telpon tapi tetep nyaman. Itu cukup bikin hari aku yang berat jadi ringan lagi.",
    image: "/images/photos5.jpg",
    caption: "It's the little things that matter.",
    secretMessage: "You make me happy"
  },
  {
    id: 6,
    heading: "Someday",
    text: "Aku nggak tahu detail masa depan bakal kayak apa, tapi di kepala aku, ada gambaran kita berdua. Someday, kita berdiri bareng di pelaminan, membangun rumah yang hangat, dan menua sambil ketawa-ketawa kayak sekarang.",
    image: "/images/photos6.jpg",
    caption: "Our future, InshaAllah.",
    secretMessage: "Forever yours 💍"
  },
  {
    id: 7,
    heading: "My Promise",
    text: "Aku nggak janji bakal sempurna, karena aku pasti punya salah. Tapi aku janji bakal terus berusaha. Berusaha ngertiin kamu, jaga hati kamu, dengerin keluh kesah kamu, dan tumbuh jadi laki-laki yang bisa kamu banggakan.",
    image: "/images/photos7.jpg",
    caption: "Growing together, always.",
    secretMessage: "Aku sayang kamu, Bilqis"
  },
  {
    id: 8,
    heading: "To Infinity",
    text: "Terima kasih sudah ada di sini. Perjalanan kita mungkin masih panjang, tapi selama tangan aku kamu genggam, aku siap jalan sejauh apa pun. I love you, more than words can say.",
    image: "/images/photos8.jpg",
    caption: "Just you and me.",
    secretMessage: "Till jannah, aamiin"
  },
  {
    id: 9,
    heading: "Tentang Sabar",
    text: "Hubungan itu nggak selalu mulus, aku tau. Tapi makasih ya udah sabar ngadepin aku. Even when things get tough, you stay. Itu yang bikin aku makin yakin, we can get through anything together.",
    image: "/images/photos9.jpg",
    caption: "Patiently growing together.",
    secretMessage: "You are my strength 💪"
  },
  {
    id: 10,
    heading: "Simple Happiness",
    text: "Aku belajar kalau bahagia itu nggak harus mewah. Cukup liat notif dari kamu, denger ketawa kamu, atau sekadar tau kalau kamu baik-baik aja. That's enough to make my day brighter.",
    image: "/images/photos10.jpg",
    caption: "You are my joy.",
    secretMessage: "Bahagiaku itu kamu ❤️"
  },
  {
    id: 11,
    heading: "Stay with me",
    text: "Setiap hari bersamamu adalah anugerah. I promise to always be by your side, through thick and thin.",
    image: "/images/photos11.jpg",
    caption: "Always together.",
    secretMessage: "Forever & Always"
  },
  {
    id: 12,
    heading: "My Person",
    text: "You are my favorite person, my best friend, and my love. I can't imagine life without you.",
    image: "/images/photo12.jpg",
    caption: "You complete me.",
    secretMessage: "Love you endlessly"
  }
];

export const CLOSING_MESSAGE = {
  recipient: "Dear Bilqis Tazqia Qalby,",
  body: "Terima kasih sudah nerima aku jadi bagian hidup kamu. Aku cuma mau bilang: aku bersyukur banget punya kamu. Let's make more memories, let's fight through the bad days, and cherish the good ones. I’ll keep trying to be the best for you.",
  signature: "Created with love by your BILVIN 🦕"
};

export interface Song {
  title: string;
  artist: string;
  file: string; // filename in /public/music/
}

export const PLAYLIST: Song[] = [
  {
    title: "My Sweet Baby",
    artist: "ONE OK ROCK",
    file: "ONE OK ROCK - My Sweet Baby.mp3"
  },
  {
    title: "Sempurna",
    artist: "Andra & The Backbone",
    file: "Andra & The Backbone - Sempurna.mp3"
  },
  {
    title: "Bukti",
    artist: "Virgoun",
    file: "Virgoun - Bukti.mp3"
  },
  {
    title: "Teman Hidup",
    artist: "Tulus",
    file: "Tulus - Teman Hidup.mp3"
  }
];
