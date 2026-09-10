import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'PlaylistBridge - Migrate YouTube Music to Spotify',
  description: 'Seamlessly transfer and synchronize your playlists from YouTube Music to Spotify with intelligent metadata cleaning, fuzzy matching, and live real-time progress.',
  icons: {
    icon: '/logo.jpg',
    apple: '/logo.jpg',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-[#050811] text-slate-100 antialiased selection:bg-spotify selection:text-black overflow-x-hidden">
        {/* God-level Ambient Aurora Glass Backdrops */}
        <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900/40 via-[#050811] to-[#020408] -z-10" />
        <div className="fixed -top-32 left-1/4 w-[500px] h-[500px] bg-gradient-to-br from-emerald-500/12 via-teal-500/10 to-transparent rounded-full blur-[120px] pointer-events-none -z-10 animate-aurora-1 transform-gpu" />
        <div className="fixed top-1/3 -right-32 w-[450px] h-[450px] bg-gradient-to-bl from-indigo-500/10 via-purple-500/8 to-transparent rounded-full blur-[130px] pointer-events-none -z-10 animate-aurora-2 transform-gpu" />
        <div className="fixed -bottom-32 -left-20 w-[420px] h-[420px] bg-gradient-to-tr from-cyan-500/10 via-emerald-500/5 to-transparent rounded-full blur-[110px] pointer-events-none -z-10 animate-aurora-1 transform-gpu" />
        {children}
      </body>
    </html>
  );
}
