"use client";

import { createJWT } from "@/functions/jwtToken";
import Link from "next/link";
import { redirect } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function Signup(){
  //Realizei um cadastro pelo localStorage com a validação para bater email e senha cadastrado.
  //Já que não tem back, decidi armazenar no localStorage
  //Poderia fazer com nextAuth, mas não achei na documentação algo que seja autenticação po user e password.
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const payload = { name, email, password };
    const jwt = createJWT(payload);
    
    toast.success("Usuário cadastrado com sucesso!")
    // Armazenando os dados no localStorage
    localStorage.setItem("user", jwt);
    redirect("/");
  };

  return(
    <div className="flex w-full h-screen items-center justify-center flex-col">
        <h1 className="sm:text-7xl text-5xl">Germi<strong className="text-customOrange">nare</strong></h1>

        <section className="mt-6 flex flex-col items-center justify-center gap-4 sm:w-[600px] w-[90%]">
          <h1 className="text-xl text-white font-bold">Criando sua conta</h1>
          <form 
            className="text-white pb-4 text-lg flex flex-col w-[90%] gap-4"
            onSubmit={handleSubmit}
          >
            <input 
              type="text"
              required
              name="name"
              placeholder="Digite seu nome..."
              className="h-10 border border-gray-600 rounded-lg px-4 bg-gray-900 text-white placeholder-gray-200"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input 
              type="email"
              required
              name="email"
              placeholder="Digite seu email..."
              className="h-10 border border-gray-600 rounded-lg px-4 bg-gray-900 text-white placeholder-gray-200"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input 
              type="password"
              required
              name="password"
              placeholder="**************"
              className="h-10 border border-gray-600 rounded-lg px-4 bg-gray-900 text-white placeholder-gray-200"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button
              type="submit"
              className="h-10 text-lg bg-customOrange text-white border-0 rounded-lg flex items-center justify-center hover:scale-105 transition-all duration-500"
            >
              Cadastrar
            </button>
          </form>

          <Link href="/" className="text-white">
            Já possui uma conta? Faça login.
          </Link>
        </section>
    </div>
  )
}