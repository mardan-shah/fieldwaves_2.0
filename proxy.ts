import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Named export 'proxy' is required by Next.js 16+
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-pathname', pathname);

  // CSRF protection for Server Actions (POST requests)
  if (request.method === 'POST') {
    const origin = request.headers.get('origin');
    const host = request.headers.get('host');

    console.log(`[PROXY] POST request to ${pathname}`);
    console.log(`[PROXY] Origin: ${origin}, Host: ${host}`);

    // Block POST requests without an Origin header
    if (!origin) {
      console.log('[PROXY] ❌ Blocked: Missing origin header');
      return new NextResponse('Forbidden: Missing origin header', { status: 403 });
    }

    if (host) {
      const originUrl = new URL(origin);
      const expectedHost = host.split(':')[0];
      const actualHost = originUrl.hostname;

      console.log(`[PROXY] Checking: ${actualHost} vs ${expectedHost}`);

      // In production, strict origin match only
      const isProduction = process.env.NODE_ENV === 'production';
      const isLocalhost = actualHost === 'localhost' || expectedHost === 'localhost';

      if (actualHost !== expectedHost && !(isLocalhost && !isProduction)) {
        console.log(`[PROXY] ❌ CSRF blocked: ${actualHost} !== ${expectedHost}`);
        return new NextResponse('Forbidden: Origin mismatch', { status: 403 });
      }
      
      console.log(`[PROXY] ✅ CSRF check passed`);
    }
  }

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
