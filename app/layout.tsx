import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'PlaylistBridge - Migrate YouTube Music to Spotify',
  description: 'Seamlessly transfer and synchronize your playlists from YouTube Music to Spotify with intelligent metadata cleaning, fuzzy matching, and live real-time progress.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-[#090D16] text-slate-100 antialiased selection:bg-spotify selection:text-black">
        <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900/60 via-[#080B14] to-[#04060A] -z-10" />
        <div className="fixed -top-40 -left-40 w-96 h-96 bg-youtube/10 rounded-full blur-3xl pointer-events-none -z-10" />
        <div className="fixed -top-40 -right-40 w-96 h-96 bg-spotify/15 rounded-full blur-3xl pointer-events-none -z-10" />
        {children}
      </body>
    </html>
  );
}
