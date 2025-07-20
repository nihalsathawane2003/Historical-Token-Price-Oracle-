import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Historical Price Oracle',
  description: 'Fetch historical token prices via Node.js and Redis',
};
 
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
