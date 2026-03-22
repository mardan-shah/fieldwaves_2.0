"use client"

import Script from "next/script"

export default function GoogleAnalytics() {
  return (
    <>
      <Script 
        async 
        src="https://www.googletagmanager.com/gtag/js?id=G-N9W6MQTJ7C" 
        strategy="afterInteractive" 
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){window.dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-N9W6MQTJ7C');
        `}
      </Script>
    </>
  )
}
