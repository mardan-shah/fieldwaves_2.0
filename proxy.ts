import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  // CSRF protection for Server Actions (POST requests)
  if (request.method === 'POST') {
    const origin = request.headers.get('origin');
    const host = request.headers.get('host');

    // Block POST requests without an Origin header
    if (!origin) {
      return new NextResponse('Forbidden', { status: 403 });
    }

    if (host) {
      const originUrl = new URL(origin);
      const expectedHost = host.split(':')[0];
      const actualHost = originUrl.hostname;

      // In production, strict origin match only
      const isProduction = process.env.NODE_ENV === 'production';
      const isLocalhost = actualHost === 'localhost' || expectedHost === 'localhost';

      if (actualHost !== expectedHost && !(isLocalhost && !isProduction)) {
        return new NextResponse('Forbidden', { status: 403 });
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
