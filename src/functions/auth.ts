"use server"
import { cookies } from "next/headers";

interface User{
  email: string;
  password: string;
}

export async function handleLogin(user: User) {
  const currentDate = new Date();
  const expirationDate = new Date(currentDate.getTime() + 60 * 60 * 24 * 1000); 
  const cookieStore = await cookies();

  // Serialize o objeto user para uma string
  const userString = JSON.stringify(user);

  // Definir o cookie com o valor serializado
  cookieStore.set("session", userString, {
    expires: expirationDate, 
    path: "/",
    httpOnly: false,
    secure: process.env.NODE_ENV === "production",
  });
}