/** @type {import('next').NextConfig} */
const nextConfig = {
  cacheComponents: true,
  turbopack: {},
  typescript: {
    ignoreBuildErrors: false,
  },
  images: {
    unoptimized: true,
  },
  experimental: {
    mcpServer: true,
    workerThreads: false,
    cpus: 1
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          { key: "Content-Security-Policy", value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://static.cloudflareinsights.com; style-src 'self' 'unsafe-inline'; img-src 'self' https://r2.fieldwaves.com https://s3.fieldwaves.com https://*.r2.cloudflarestorage.com https://image.thum.io https://picsum.photos https://fastly.picsum.photos https://www.googletagmanager.com https://www.google-analytics.com data: blob:; font-src 'self' data:; connect-src 'self' https://www.google-analytics.com https://stats.g.doubleclick.net https://cloudflareinsights.com; frame-ancestors 'none';" },
        ]
      }
    ]
  },
}

export default nextConfig
