"use client"

import { deleteCookie } from "cookies-next";
import { LogOutIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export function Header(){

  const router = useRouter();

  async function handleLogout(){
    deleteCookie("session", { path: "/"})

    router.replace("/")
  }

  return(
    <header className="h-20">
      <div className="max-w-7xl h-20 mx-auto px-4 flex items-center justify-between">
        <Link href={"/dashboard"}>
          <h1 className="sm:text-4xl text-2xl">Germi<strong className="text-customOrange">nare</strong></h1>
        </Link>

        <nav className="flex items-center gap-4">
          <Link href={"/dashboard/home"} className="text-white hover:text-customOrange transition-colors duration-700">
            Home
          </Link>

          <form action={handleLogout}>
            <button type="submit" className="border-0 bg-transparent ml-4 hover:scale-[1.2] hover:transition-transform duration-700">
              <LogOutIcon size={24} color="#FFF" />
            </button>
          </form>
        </nav>
      </div>
    </header>
  )
}