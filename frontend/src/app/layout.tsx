import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'IndustrialIQ AI - Enterprise Product Intelligence',
  description: 'AI-powered product intelligence for smarter industrial commerce.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="light">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600;700&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
        <script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              tailwind.config = {
                darkMode: "class",
                theme: {
                  extend: {
                    colors: {
                      'on-secondary-container': '#fefcff',
                      'on-tertiary-fixed': '#001f26',
                      'inverse-primary': '#bec6e0',
                      'on-primary-fixed-variant': '#3f465c',
                      'primary': '#000000',
                      'primary-fixed': '#dae2fd',
                      'tertiary-fixed-dim': '#4cd7f6',
                      'surface-bright': '#fcf8fa',
                      'outline': '#76777d',
                      'surface-variant': '#e4e2e4',
                      'on-surface-variant': '#45464d',
                      'surface-dim': '#dcd9db',
                      'tertiary-fixed': '#acedff',
                      'secondary-fixed-dim': '#adc6ff',
                      'secondary-fixed': '#d8e2ff',
                      'outline-variant': '#c6c6cd',
                      'surface-container': '#f0edef',
                      'surface-container-lowest': '#ffffff',
                      'surface': '#fcf8fa',
                      'on-background': '#1b1b1d',
                      'background': '#fcf8fa',
                      'secondary': '#0058be',
                      'surface-container-low': '#f6f3f5',
                      'primary-fixed-dim': '#bec6e0',
                      'on-error': '#ffffff',
                      'error': '#ba1a1a',
                      'surface-tint': '#565e74',
                      'inverse-on-surface': '#f3f0f2',
                      'error-container': '#ffdad6',
                      'surface-container-high': '#eae7e9',
                      'secondary-container': '#2170e4',
                      'on-primary-container': '#7c839b',
                      'on-tertiary': '#ffffff',
                      'inverse-surface': '#303032',
                      'primary-container': '#131b2e',
                      'on-secondary-fixed-variant': '#004395',
                      'on-primary': '#ffffff',
                      'on-tertiary-fixed-variant': '#004e5c',
                      'on-error-container': '#93000a',
                      'surface-container-highest': '#e4e2e4',
                      'on-secondary': '#ffffff',
                      'on-primary-fixed': '#131b2e',
                      'on-surface': '#1b1b1d',
                      'on-tertiary-container': '#0090a9',
                      'tertiary': '#000000',
                      'on-secondary-fixed': '#001a42',
                      'tertiary-container': '#001f26'
                    }
                  }
                }
              }
            `,
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
