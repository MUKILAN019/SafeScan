import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  
  const token = req.cookies.get("token")?.value;


  if (!token && req.nextUrl.pathname !== "/auth/signin" && req.nextUrl.pathname !== "/auth/signup") {
    return NextResponse.redirect(new URL("/auth/signin", req.url));
  }

  return NextResponse.next(); 
}


export const config = {
  matcher: ["/","/auth/signin", "/auth/signup","/api/fraud-data"], 
};
