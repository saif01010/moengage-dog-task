import {  NextResponse } from 'next/server';
export { default } from 'next-auth/middleware';

export const config = {
  matcher: ['/sign-in', '/sign-up', '/search','/saveList'],
};

export async function middleware(request) {
  const url = request.nextUrl;
  const token = request.cookies.get('next-auth.session-token')?.value ||request.cookies.get('__Secure-next-auth.session-token')?.value|| '';
  // console.log(token);

  const isPublicPath = url.pathname === '/sign-in' || url.pathname === '/sign-up';

  if (isPublicPath && token) {
    return NextResponse.redirect(new URL('/home', request.url));
  }

  if (!isPublicPath && !token) {
    return NextResponse.redirect(new URL('/sign-in', request.url));
  }

  if(!isPublicPath && token){
    return 
  }

  return NextResponse.next();
}
