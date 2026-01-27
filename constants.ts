
export const SECRET_CODE = "ruby";

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
    text: "9 September 2025. Hari itu jadi hari yang paling spesial karena aku bisa bilang bahwa kamu special buat aku.",
    image: "/images/jadian.jpg",
    caption: "The start of our chapter.",
    secretMessage: "Semua berawal dari sini"
  },
  {
    id: 2,
    heading: "Rasa Sayang",
    text: "Makasih sayang udah dateng dan memilih untuk tetap tinggal. Aku ngerasa hidupku jadi lebih berwanra sejak ada kamu. Semoga langkah kita ke depan selalu bareng, apa pun yang terjadi, kita hadapi sama-sama.",
    image: "/images/bilvin (13).webp",
    caption: "You are my everything.",
    secretMessage: "You stole my heart"
  },
  {
    id: 3,
    heading: "The luckiest guy",
    text: "Aku kadang jadi suka mikir, kok bisa ya kamu milih aku? Di antara banyaknya cowo yang lebih baik dari aku, you choose to stand by me. That simple fact makes me feel like the luckiest guy, every single time.",
    image: "/images/gif1.gif",
    caption: "Grateful is an understatement.",
    secretMessage: "You are my everything"
  },
  {
    id: 4,
    heading: "Rumah",
    text: "Ada hari-hari di mana aku lagi ngerasa bosen dan capek sama rutinitas sehari hari. Tapi pas denger suara kamu atau liat foto kamu aja, itu udah cukup bikin semuanya jadi lebih baik. You are my safe space, tempat aku pulang.",
    image: "/images/bilvin (18).webp",
    caption: "My peace in the chaos.",
    secretMessage: "I miss you everyday"
  },
  {
    id: 5,
    heading: "Little moments",
    text: "Bukan cuma momen besar yang aku suka, tapi justru hal-hal kecil sangat berarti saat bareng kamu. Chat random kita, jokes receh yang cuma kita yang ngerti. Itu cukup bikin hari aku yang berat jadi ringan lagi.",
    image: "/images/gif5.gif",
    caption: "It's the little things that matter.",
    secretMessage: "You make me happy"
  },
  {
    id: 6,
    heading: "Someday",
    text: "Aku nggak tahu tentang masa depan, tapi di kepala aku, ada gambaran kita berdua. Someday, kita berdiri berdua di pelaminan, ngebangun rumah yang hangat diatas atap yang sama, dan hidup bahagia selamanya.",
    image: "/images/bilvin (26).webp",
    caption: "Our future, InshaAllah.",
    secretMessage: "You are my goal of life"
  },
  {
    id: 7,
    heading: "Forever",
    text: "Makasih ya sayang, kamu udah ada di sini. Perjalanan kita mungkin masih panjang, tapi selama tangan aku kamu genggam, aku siap jalan sejauh apa pun. I love you, more than words can say.",
    image: "/images/bilvin (12).webp",
    caption: "Just you and me.",
    secretMessage: "Till jannah, aamiin"
  },
  {
    id: 9,
    heading: "Tentang Sabar",
    text: "Aku tau hubungan kita ngga selalu mulus. Kadang ada naik turun, kadang juga ada salah paham. Tapi makasih ya sayang, kamu tetap sabar dan mau diajak diskusi bareng. Aku bersyukur banget punya kamu.",
    image: "/images/bilvin (10).webp",
    caption: "Patiently growing together.",
    secretMessage: "Kamu adalah kekuatan aku"
  },
  {
    id: 11,
    heading: "Stay with me",
    text: "Setiap hari sama kamu adalah anugerah buat aku. I promise to always be by your side, through thick and thin (kaya kenal lagu siapa yaaa 😜).",
    image: "/images/gif5.gif",
    caption: "Always together.",
    secretMessage: "Forever & Always"
  },
  {
    id: 12,
    heading: "Married Soon",
    text: "Tunggu aku ya sayangg.. aku akan jemput kamu kerumah kita, dan jadiin kamu istri aku, tempat aku pulang dan rumah untuk aku selamanya..",
    image: "/images/married.png",
    caption: "You complete me.",
    secretMessage: "Love you endlessly"
  }
];
export interface MilestoneData {
  id: number;
  date: string;
  title: string;
  description: string;
  icon: string;
}

export const MILESTONES: MilestoneData[] = [
  {
    id: 1,
    date: "9 September 2025",
    title: "Hari Jadian",
    description: "Hari dimana aku nemuin kebahagiaan baru dalam hidup.",
    icon: "❤️"
  },
  {
    id: 2,
    date: "Setiap Hari",
    title: "Jatuh Cinta",
    description: "Setiap hari aku sayang sama kamu.",
    icon: "📅"
  },
  {
    id: 3,
    date: "Masa Depan",
    title: "Hari Pernikahan",
    description: "Hari paling spesial di hidupku, hari dimana kita menikah dan jadi satu keluarga.",
    icon: "💍"
  }
];

export const CLOSING_MESSAGE = {
  recipient: "Dear My Bilqis Tazqia Qalby,",
  body: "Terimakasih yaa sayangg udah mau nerima aku jadi bagian dari hidup kamu. Aku bersyukur banget punya kamu. Let's make more memories, let's fight through the bad days, and cherish the good ones. I’ll keep trying to be the best for you and our future.",
  signature: "Created with so much love by your KEVIN"
};

export interface Song {
  title: string;
  artist: string;
  file: string; // filename in /public/music/
}

export const PLAYLIST: Song[] = [
  {
    title: "Stuck",
    artist: "LANY",
    file: "LANY_Stuck.mp3"
  },
  {
    title: "anything 4 u",
    artist: "LANY",
    file: "LANY_anything_4_u.mp3"
  },
  {
    title: "The Archer",
    artist: "Taylor Swift",
    file: "Taylor_Swift_The_Archer.mp3"
  },
  {
    title: "My Sweet Baby",
    artist: "ONE OK ROCK",
    file: "ONE_OK_ROCK_My_Sweet_Baby.mp3"
  }
];
