import { formatarMoeda } from "@/functions/formatarValor";

interface Summary{
  receitas: number;
  despesas: number;
  saldoTotal: number;
  transacoesPendentes: number;
}

export function Card({ summary }: { summary: Summary }){
  return(
    <main className="max-w-3xl lg:w-7/12 w-5/6 mx-auto my-5 py-0 flex bg-slate-900 rounded-lg gap-4 pr-4">
      <div className="w-3 bg-customOrange rounded-s-lg"></div>
      <section>
        <article className="text-white">
          <h2 className="text-xl">Resumo Germinare</h2>

          <span>Exibindo informações referente as receitas, despesas, transações pendentes e saldo total.</span>
        </article>

        <section className="flex gap-4 flex-col mt-5 mb-5">
          <div>
            <span className="text-white">Receitas: </span>
            <p className="text-white">{formatarMoeda(summary.receitas)}</p>
          </div>
          <div>
            <span className="text-white">Despesas: </span>
            <p className="text-white">{formatarMoeda(summary.despesas)}</p>
          </div>
          <div>
            <span className="text-white">Saldo Total: </span>
            <p className="text-white">{formatarMoeda(summary.saldoTotal)}</p>
          </div>
          <div>
            <span className="text-white">Transações Pendentes: </span>
            <p className="text-white">{formatarMoeda(summary.transacoesPendentes)}</p>
          </div>
        </section>
      </section>
    </main>
  )
}