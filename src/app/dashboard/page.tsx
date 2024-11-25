"use client"
import { useEffect, useReducer, useRef, useState } from "react"
import fullDataJson from "../../../full_data.json";
import { Card } from "./components/card";
import Chart from "chart.js/auto";
import { CiSearch } from "react-icons/ci";
import { FaRedoAlt, FaSearch } from "react-icons/fa";

interface FullData {
  date: string;
  amount: string;
  transaction_type: string;
  currency: string;
  account: string;
  industry: string;
  state: string;
}

interface GroupedData {
  [year: number]: {
    deposit: number;
    withdraw: number;
  };
}

export default function Dashboard(){
  const stackedBarChartRef = useRef<Chart | null>(null);
  const lineChartRef = useRef<Chart | null>(null);
  const [chartsStackedBar, setChartsStackedBar] = useState<{ stackedBar: Chart | null }>({ stackedBar: null });
  const [chartsStackedLine, setChartsStackedLine] = useState<{ stackedBar: Chart | null }>({ stackedBar: null });
  const [fullData, setFullData] = useState<FullData[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedAccount, setSelectedAccount] = useState<string>("");
  const [selectedState, setSelectedState] = useState<string>("");

  const [summary, setSummary] = useState({
    receitas: 0,
    despesas: 0,
    saldoTotal: 0,
    transacoesPendentes: 0,
  });

  useEffect(() => {
    setFullData(fullDataJson as FullData[]);
    calcularResumo(fullDataJson as FullData[]);
  }, [])

  useEffect(() => {
    loadCharts();

    // Cleanup: destruir gráficos ao desmontar o componente
    return () => {
      if (stackedBarChartRef.current) {
        stackedBarChartRef.current.destroy();
        stackedBarChartRef.current = null;
      }
      if (lineChartRef.current) {
        lineChartRef.current.destroy();
        lineChartRef.current = null;
      }
    };
  }, [fullData]);

  function calcularResumo(data: FullData[]) {
    let receitas = 0;
    let despesas = 0;
    let saldoTotal = 0;
    let transacoesPendentes = 0; // Este cálculo depende de mais dados (ex. status da transação)

    data.forEach((transacao) => {
      const amount = parseFloat(transacao.amount);
      if (transacao.transaction_type === "deposit") {
        receitas += amount;
      } else if (transacao.transaction_type === "withdraw") {
        despesas += amount;
      }
    });

    saldoTotal = receitas - despesas;

    setSummary({
      receitas,
      despesas,
      saldoTotal,
      transacoesPendentes,
    });
  }

  const processData = (data: FullData[]) => {
    const groupedData: GroupedData = {};

    data.forEach((item) => {
      const year = new Date(item.date).getFullYear();
      const amount = parseFloat(item.amount);

      if (!groupedData[year]) {
        groupedData[year] = { deposit: 0, withdraw: 0 };
      }

      if (item.transaction_type === "deposit") {
        groupedData[year].deposit += amount;
      } else if (item.transaction_type === "withdraw") {
        groupedData[year].withdraw += amount;
      }
    });

    const years = Object.keys(groupedData).map(Number)
    const deposits = years.map((year) => groupedData[year].deposit);
    const withdrawals = years.map((year) => groupedData[year].withdraw);

    return { years, deposits, withdrawals };
  };

  const loadCharts = () => {
    
    const { years, deposits, withdrawals } = processData(fullData);

    const stackedBarChartElement = document.getElementById("stackedBarChart") as HTMLCanvasElement;
    const lineChartElement = document.getElementById("lineChart") as HTMLCanvasElement;

    if (stackedBarChartElement && lineChartElement) {

      if (stackedBarChartRef.current) {
        stackedBarChartRef.current.destroy();
      }
      if (lineChartRef.current) {
        lineChartRef.current.destroy();
      }

      // Gráfico de Barras Empilhadas
      stackedBarChartRef.current = new Chart(stackedBarChartElement, {
        type: "bar",
        data: {
          labels: years,
          datasets: [
            {
              label: "Deposits",
              data: deposits,
              backgroundColor: "rgba(75, 192, 192, 0.7)",
            },
            {
              label: "Withdrawals",
              data: withdrawals,
              backgroundColor: "rgba(255, 99, 132, 0.7)", 
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              labels: {
                color: "white",
              },
            },
          },
          scales: {
            y: {
              stacked: true,
            },
            x: {
              stacked: true,
            },
          },
        },
      });

      // Gráfico de Linhas
      lineChartRef.current = new Chart(lineChartElement, {
        type: "line",
        data: {
          labels: years,
          datasets: [
            {
              label: "Deposits",
              data: deposits,
              borderColor: "rgba(75, 192, 192, 1)",
              backgroundColor: "rgba(75, 192, 192, 0.2)",
              fill: true,
            },
            {
              label: "Withdrawals",
              data: withdrawals,
              borderColor: "rgba(255, 99, 132, 1)",
              backgroundColor: "rgba(255, 99, 132, 0.2)",
              fill: true,
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: "top",
            },
          },
          scales: {
            y: {
              beginAtZero: true,
            },
          },
        },
      });
    }
  };

  const applyFilters = () => {
    const filtered = fullData.filter((item) => {
      const matchesCategory = selectedCategory
        ? item.industry.toLowerCase().includes(selectedCategory.toLowerCase())
        : true;
      const matchesDate = selectedDate
        ? new Date(item.date).toISOString().slice(0, 10) === selectedDate
        : true;
      const matchesAccount = selectedAccount
        ? item.account.includes(selectedAccount)
        : true;
      const matchesState = selectedState
        ? item.state.toLowerCase().includes(selectedState.toLowerCase())
        : true;
  
      return matchesCategory && matchesDate && matchesAccount && matchesState;
    });

    setFullData(filtered || []);
    calcularResumo(filtered)
  };

  const resetFilters = () => {
    setSelectedCategory("");
    setSelectedDate("");
    setSelectedAccount("");
    setSelectedState("");
    setFullData(fullDataJson as FullData[]); // Retorna aos dados completos
    calcularResumo(fullDataJson as FullData[])
  };

  return(
    <div className="flex items-center justify-center flex-col">
      <section className="p-4 flex gap-4 flex-col max-w-7xl lg:w-7/12 w-5/6 items-center justify-center">
        <div className="flex flex-col lg:flex-row lg:justify-between w-full gap-5">
          {/* Filtro de Categoria */}
          <div className="flex justify-between w-full gap-5">
            <input
              type="text"
              placeholder="Pesquise por categoria"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="h-9 border-2 rounded-lg px-4 w-full"
            />
            <div className="flex gap-5">
              <button onClick={applyFilters} title="Pesquisar">
                <FaSearch className="text-white"/>  
              </button>
              <button onClick={resetFilters} title="Redefinir filtros">
                <FaRedoAlt className="text-white"/> 
              </button>
            </div>
          </div>

          {/* Filtro de Data */}
          <div className="flex justify-between w-full gap-5">
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="h-9 border-2 rounded-lg px-4 w-full"
            />

            <div className="flex gap-5">
              <button onClick={applyFilters} title="Pesquisar" className="cursor-pointer">
                <FaSearch className="text-white"/>  
              </button>
              <button onClick={resetFilters} title="Redefinir filtros">
                <FaRedoAlt className="text-white"/> 
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row lg:justify-between w-full gap-5">
          {/* Filtro de Conta */}
          <div className="flex justify-between w-full gap-5">
            <input
              placeholder="Pesquise por número da conta"
              value={selectedAccount}
              onChange={(e) => setSelectedAccount(e.target.value)}
              className="h-9 border-2 rounded-lg px-4 w-full"
            />
            <div className="flex gap-5">
              <button onClick={applyFilters} title="Pesquisar">
                <FaSearch className="text-white"/>  
              </button>
              <button onClick={resetFilters} title="Redefinir filtros">
                <FaRedoAlt className="text-white"/> 
              </button>
            </div>

          </div>
          {/* Filtro de Estado */}
          <div className="flex justify-between w-full gap-5">
            <input
              placeholder="Pesquise por estado"
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="h-9 border-2 rounded-lg px-4 w-full"
            />
            <div className="flex gap-5">
              <button onClick={applyFilters} title="Pesquisar">
                <FaSearch className="text-white"/>  
              </button>
              <button onClick={resetFilters} title="Redefinir filtros">
                <FaRedoAlt className="text-white"/> 
              </button>
            </div>
          </div>
        </div>
      </section>

      <Card summary={summary} />

      <div className="max-w-7xl lg:w-7/12 w-5/6 mx-auto px-4 flex flex-col items-start mb-20">
        <h2 className="text-white my-5 text-xl">Gráficos de Transações</h2>
        <div className="flex flex-col gap-12 lg:flex-row items-center justify-center">
          <div className="lg:w-96 lg:h-auto w-full responsive-chart-container">
            <canvas id="stackedBarChart"></canvas>
          </div>
          <div className="lg:w-96 lg:h-auto w-full responsive-chart-container">
            <canvas id="lineChart"></canvas>
          </div>
        </div>

      </div>

    </div>
  )
}