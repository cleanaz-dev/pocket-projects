import { NextResponse, NextRequest } from 'next/server'

// This function can be marked `async` if using `await` inside
export function proxy(request: NextRequest) {
  // Your proxy logic here
  
  // Example: Add custom headers
  const response = NextResponse.next()
  response.headers.set('x-custom-header', 'my-value')
  
  return response
}

// Optional: Configure which paths the proxy runs on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}