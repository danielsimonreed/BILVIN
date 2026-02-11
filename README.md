# 💖 BILVIN - Our Digital Love Story

<div align="center">
  <img src="public/android-chrome-512x512.png" alt="BILVIN Logo" width="120" height="120" style="border-radius: 20px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);" />
  <br/>
  <br/>
  
  [![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
  [![Vite](https://img.shields.io/badge/Vite-5.0-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.0-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
  [![Supabase](https://img.shields.io/badge/Supabase-Backend-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)
  [![Framer Motion](https://img.shields.io/badge/Framer_Motion-Animation-0055FF?style=for-the-badge&logo=framer&logoColor=white)](https://www.framer.com/motion/)

  <p align="center">
    <b>A PWA-enabled personal space for cherishing memories, tracking milestones, and planning the future together.</b>
  </p>
</div>

---

## ✨ Features

Based on the components and structure, the application includes the following features:

### 📅 Relationship Timeline (`Timeline.tsx`)
- Visual journey of key relationship milestones.
- Custom events and dates tracking.
- Beautiful vertical layout with animations.

### 💫 Joint Wishlist (`WishlistPage.tsx`)
- Collaborative wishlist for future plans (Travel, Couple goals, Life milestones).
- **Budget Tracking**: Smart formatting for currency (e.g., Rp. 1.5 jt, Rp. 1 m).
- **Categories**: Filter by Travel, Couple, Life, etc.
- **Drag & Drop**: Reorder wishes easily.
- **Status Updates**: Mark wishes as completed with celebration effects 🎉.
- **Supabase Integration**: Real-time syncing between devices.

### 📸 Photo Gallery (`Gallery.tsx`)
- A curated collection of photo memories.
- Masonry or grid layout for beautiful photo viewing.

### 🎵 Music Player (`MusicPage.tsx`)
- Integrated music player for setting the vibe.
- Floating controls to keep music playing while navigating (`FloatingMusicControl.tsx`).
- Background listening support.

### 💌 Secret Messages (`SecretMessagePage.tsx`)
- A special section for hidden or surprise messages.
- Protected by a "Secret Gate" or specific interactions.

### 🎙️ Voice Messages (`VoiceMessagePage.tsx`)
- Listen to or record personal voice notes.
- A more intimate way to communicate.

### 📱 PWA Support
- Installable on mobile devices (iOS/Android).
- Offline capabilities for viewing cached content.

---

## 🛠️ Tech Stack

- **Frontend**: React (v19), TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS (presumed based on class names like `bg-rose-500`)
- **Animations**: Framer Motion
- **Backend/Database**: Supabase
- **Icons**: Lucide React / Heroicons (implied)
- **deployment**: Vercel (recommended)

---

## 🚀 Getting Started

Follow these steps to run the project locally:

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/BILVIN.git
   cd BILVIN
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment Variables**
   Create a `.env` file in the root directory and add your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```
   *(See `.env.example` for reference)*

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open in browser**
   Navigate to `http://localhost:5173` to view the app.

---

## 📂 Project Structure

```bash
BILVIN/
├── components/         # React components (Pages & UI elements)
│   ├── BottomNav.tsx   # Mobile-style navigation
│   ├── Gallery.tsx     # Photo grid
│   ├── WishlistPage.tsx # Core feature: Wishes
│   ├── MusicPage.tsx   # Audio player
│   └── ...
├── lib/
│   └── supabase.ts     # Supabase client configuration
├── public/             # Static assets (images, icons)
├── App.tsx             # Main application entry
├── index.css           # Global styles & Tailwind directives
└── vite.config.ts      # Vite configuration
```

---

## � Credits

Created with ❤️ by **Kevin** for **Bilqis**.

> *"Every moment with you is a wish come true."*

---

<div align="center">
  <sub>Built with modern web technologies 2026</sub>
</div>
