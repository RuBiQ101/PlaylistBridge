'use client';

import Script from 'next/script';

interface GoogleAnalyticsProps {
  measurementId: string;
}

/**
 * GoogleAnalytics component — injects GA4 tracking scripts into the page.
 * Set NEXT_PUBLIC_GA_MEASUREMENT_ID in your Render environment variables (e.g. G-XXXXXXXXXX).
 */
export function GoogleAnalytics({ measurementId }: GoogleAnalyticsProps) {
  if (!measurementId) return null;

  return (
    <>
      {/* Load the GA4 gtag.js library */}
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
        strategy="afterInteractive"
      />
      {/* Initialize dataLayer and configure GA4 */}
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${measurementId}', {
            page_path: window.location.pathname,
          });
        `}
      </Script>
    </>
  );
}
