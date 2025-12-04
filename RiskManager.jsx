import React, { useState, useEffect } from "react";
import { Moon, Sun, AlertTriangle, TrendingUp, Activity } from "lucide-react";

export default function RiskManager() {
  // --- Estados ---
  const [initialBalance, setInitialBalance] = useState(100000);
  const [currentBalance, setCurrentBalance] = useState(100000);
  // 'specialCondition' para estados no-matemáticos (inestabilidad, profit_drawdown, normal)
  const [specialCondition, setSpecialCondition] = useState("normal");
  const [category, setCategory] = useState("A+");
  const [darkMode, setDarkMode] = useState(false);

  const categories = ["A+", "A", "B+", "B", "C"];

  // --- Cálculos ---
  const calcPercent = () => {
    if (!initialBalance || Number.isNaN(initialBalance)) return 0;
    return ((currentBalance - initialBalance) / initialBalance) * 100;
  };

  const percent = Number(calcPercent());

  // --- Etapa y color ---
  const getStageInfo = () => {
    if (specialCondition === "emotionally_unstable") {
      return {
        name: "Inestabilidad Emocional",
        colorClass: "bg-gray-400 border-gray-500 text-white",
        barColor: "bg-gray-400",
        id: "emotional",
      };
    }

    if (specialCondition === "profit_drawdown") {
      return {
        name: "Etapa Profit (Drawdown)",
        colorClass: "bg-pink-400 border-pink-500 text-white",
        barColor: "bg-pink-400",
        id: "profit_drawdown",
      };
    }

    // Profit
    if (percent > 10)
      return {
        name: "Etapa 3 Profit (+10%)",
        colorClass: "bg-purple-600 border-purple-700 text-white",
        barColor: "bg-purple-600",
        id: "profit_3",
      };
    if (percent >= 5)
      return {
        name: "Etapa 2 Profit (5% a 10%)",
        colorClass: "bg-green-500 border-green-600 text-white",
        barColor: "bg-green-500",
        id: "profit_2",
      };
    if (percent >= 0)
      return {
        name: "Etapa 1 Profit (0% a 5%)",
        colorClass: "bg-blue-500 border-blue-600 text-white",
        barColor: "bg-blue-500",
        id: "profit_1",
      };

    // Drawdown
    if (percent <= -6.9)
      return {
        name: "Etapa 3 Drawdown (Crítico)",
        colorClass: "bg-red-600 border-red-700 text-white",
        barColor: "bg-red-600",
        id: "drawdown_3",
      };
    if (percent <= -5.5)
      return {
        name: "Etapa 2 Drawdown",
        colorClass: "bg-orange-500 border-orange-600 text-white",
        barColor: "bg-orange-500",
        id: "drawdown_2",
      };

    return {
      name: "Etapa 1 Drawdown",
      colorClass: "bg-yellow-400 border-yellow-500 text-black",
      barColor: "bg-yellow-400",
      id: "drawdown_1",
    };
  };

  const stageInfo = getStageInfo();

  // --- Sizing ---
  const getSizing = () => {
    if (specialCondition === "emotionally_unstable") {
      return { "A+": 0.17, A: 0.15, "B+": 0.12, B: 0.1, C: 0 }[category];
    }

    if (specialCondition === "profit_drawdown") {
      return { "A+": 0.5, A: 0.3, "B+": 0.25, B: 0.2, C: 0 }[category];
    }

    if (percent > 10) return { "A+": 2, A: 1, "B+": 0.8, B: 0.5, C: 0 }[category];

    if (percent >= 0) return { "A+": 1.5, A: 1, "B+": 0.8, B: 0.5, C: 0 }[category];

    if (percent >= -4.5) return { "A+": 1.5, A: 1, "B+": 0.8, B: 0.5, C: 0 }[category];
    if (percent >= -6.5) return { "A+": 0.5, A: 0.3, "B+": 0.25, B: 0.2, C: 0 }[category];
    if (percent >= -6.9) return { "A+": 0.25, A: 0.2, "B+": 0.18, B: 0.15, C: 0 }[category];
    if (percent >= -10) return { "A+": 0.17, A: 0.15, "B+": 0.12, B: 0.1, C: 0 }[category];

    return 0;
  };

  const sizing = getSizing();

  // --- Tema ---
  const theme = {
    bg: darkMode ? "bg-gray-900" : "bg-gray-50",
    cardBg: darkMode ? "bg-gray-800" : "bg-white",
    text: darkMode ? "text-gray-100" : "text-gray-800",
    input: darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300 text-gray-900",
    subText: darkMode ? "text-gray-400" : "text-gray-500",
  };

  // --- Helpers UI ---
  const clamp = (v, min, max) => Math.max(min, Math.min(max, v));

  // width for progress bar: convert percent to a 0..100 scale for visual
  // We'll show positive to the right, negative to the left using two bars.
  const posWidth = percent > 0 ? clamp(percent, 0, 100) : 0;
  const negWidth = percent < 0 ? clamp(Math.abs(percent), 0, 100) : 0;

  return (
    <div className={`min-h-screen flex items-center justify-center p-6 transition-colors duration-300 ${theme.bg} ${theme.text}`}>
      <div className={`w-full max-w-2xl shadow-xl rounded-3xl overflow-hidden border transition-colors ${darkMode ? "border-gray-700" : "border-gray-200"} ${theme.cardBg}`}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b" style={{ borderColor: darkMode ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)" }}>
          <div className="flex items-center gap-3">
            <Activity className="w-6 h-6" />
            <h3 className="text-lg font-semibold">Risk Manager</h3>
            <span className={`ml-2 px-2 py-0.5 text-sm rounded-full ${stageInfo.colorClass.split(" ").slice(0,1).join(" ")}`}></span>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-sm">
              <span className={theme.subText}>Theme</span>
              <button
                onClick={() => setDarkMode((d) => !d)}
                className="p-2 rounded-md border"
                aria-label="Toggle theme"
              >
                {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>
            </div>

            <select
              value={specialCondition}
              onChange={(e) => setSpecialCondition(e.target.value)}
              className={`p-2 rounded-md border ${theme.input}`}
              aria-label="Special condition"
            >
              <option value="normal">Normal</option>
              <option value="emotionally_unstable">Inestabilidad Emocional</option>
              <option value="profit_drawdown">Profit (Drawdown)</option>
            </select>
          </div>
        </div>

        {/* Body */}
        <div className="p-6">
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium">Balance Inicial</label>
              <input
                type="number"
                value={initialBalance}
                onChange={(e) => setInitialBalance(Number(e.target.value))}
                className={`mt-2 w-full p-3 rounded-xl border ${theme.input}`}
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Balance Actual</label>
              <input
                type="number"
                value={currentBalance}
                onChange={(e) => setCurrentBalance(Number(e.target.value))}
                className={`mt-2 w-full p-3 rounded-xl border ${theme.input}`}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium">Categoría</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)} className={`mt-2 w-full p-3 rounded-xl border ${theme.input}`}>
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium">Etapa (automática)</label>
              <div className="mt-2 p-3 rounded-xl border flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium">{stageInfo.name}</div>
                  <div className="text-xs text-gray-500">{percent.toFixed(2)}%</div>
                </div>
                <div className="ml-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${stageInfo.colorClass.split(" ")[0]}`}>
                    {/* icon */}
                    {stageInfo.id.startsWith("profit") ? <TrendingUp className="w-5 h-5" /> : stageInfo.id.startsWith("drawdown") ? <AlertTriangle className="w-5 h-5" /> : <Activity className="w-5 h-5" />}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Barra de progreso con lado positivo y negativo */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Barra de Progreso del % de la Cuenta</label>
            <div className={`w-full h-6 rounded-full relative bg-gray-200 overflow-hidden ${darkMode ? "bg-gray-700" : "bg-gray-200"}`}>
              {/* Negative bar (left) */}
              <div
                className={`absolute left-0 top-0 bottom-0 ${percent < 0 ? stageInfo.barColor : ""}`}
                style={{ width: `${negWidth}%`, transformOrigin: "left" }}
              />

              {/* Positive bar (right) */}
              <div
                className={`absolute right-0 top-0 bottom-0 ${percent > 0 ? stageInfo.barColor : ""}`}
                style={{ width: `${posWidth}%`, transformOrigin: "right" }}
              />

              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <span className="text-sm font-medium">{percent.toFixed(2)}%</span>
              </div>
            </div>
          </div>

          {/* Resultados */}
          <div className={`${stageInfo.colorClass} p-4 rounded-2xl text-center`}> 
            <h4 className="text-lg font-bold">Resultados</h4>
            <p className="mt-2">% Cambio: <strong>{percent.toFixed(2)}%</strong></p>
            <p className="mt-1">Sizing / Riesgo: <strong>{sizing}%</strong></p>
            <p className="mt-1 text-sm">Categoría: <strong>{category}</strong></p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t text-xs text-gray-500" style={{ borderColor: darkMode ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.04)" }}>
          Hecho con ❤️ — Ajusta valores para ver cambios en tiempo real.
        </div>
      </div>
    </div>
  );
}
