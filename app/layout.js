import '../styles/global.css'; // Ensure this is correct

export const metadata = {
  title: 'Tori Metal App',
  icons: {
    icon: '/favicon.png', // Default favicon
    shortcut: '/favicon.png', // For older browsers
    apple: '/favicon.png', // Apple devices
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
