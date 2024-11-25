"use client"
import { handleLogin } from "@/functions/auth";
import { decodeJWT } from "@/functions/decodeJWT";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function Home() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); // Para mostrar mensagens de erro
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Recupera os dados do usuário armazenados no localStorage
    const token = localStorage.getItem("user");

    if (!token) {
      setError("Usuário não encontrado.");
      console.log("Usuário não encontrado");
      toast.warning("Usuário não encontrado")
      return;
    }

    const user = decodeJWT(token);

    if (user && user.email === email && user.password === password) {
      await handleLogin(user)
      toast.success("Seja bem vindo ao sistema Germinare!")
      router.push("/dashboard");
    } else {
      toast.warning("Email ou senha inválidos.");
    }
  };

  //Não utilizei  BOOTSTRAP, POIS SOLICITOU O USO DO TAILWIND.
  return (
    <>
      <div className="flex w-full h-screen items-center justify-center flex-col">
        <h1 className="sm:text-7xl text-5xl">Germi<strong className="text-customOrange">nare</strong></h1>
        <section className="mt-6 flex flex-col items-center justify-center gap-4 sm:w-[600px] w-[90%]">
          <form 
            className="text-white pb-4 text-lg flex flex-col w-[90%] gap-4"
            onSubmit={handleSubmit}
          >
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
              Acessar
            </button>
          </form>

          <Link href="/signup" className="text-white">
            Não possui uma conta? Cadastre-se
          </Link>
        </section>
      </div>
    </>
  );
}
