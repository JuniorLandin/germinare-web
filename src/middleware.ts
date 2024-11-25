import { NextRequest, NextResponse } from "next/server";
import { getCookieServer } from "./lib/cookieServer";


export async function middleware(req: NextRequest) {

  const {pathname} = req.nextUrl

  if(pathname.startsWith("/_next") || pathname === "/"){
    return NextResponse.next();
  }

  const token = await getCookieServer();

  if(pathname.startsWith("/dashboard")){
    if(!token){
      return NextResponse.redirect(new URL("/", req.url))
    }
  }

  return NextResponse.next();
}


async function validateToken(token: string | null){
  if (!token) {
    console.log("Token inválido ou ausente");
    return false;
  }
  try {
    const user = JSON.parse(token);

    // Verifique se o token possui os campos necessários
    if (!user.email || !user.password) {
      return false
    }

    return true
  } catch (error) {
    console.log("Erro ao parsear o token:", error);
    return false
  }
}