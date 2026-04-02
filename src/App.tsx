/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo } from "react";
import { Thermometer, Droplets, Zap, CreditCard, Clock, Info } from "lucide-react";
import { motion } from "motion/react";

export default function App() {
  const [minTemp, setMinTemp] = useState<number>(15);
  const [maxTemp, setMaxTemp] = useState<number>(60);
  const [volume, setVolume] = useState<number>(50);
  const [power, setPower] = useState<number>(2);
  const [price, setPrice] = useState<number>(5.5);

  const results = useMemo(() => {
    const deltaT = Math.max(0, maxTemp - minTemp);
    // Q = m * c * deltaT
    // c = 4186 J/(kg*C)
    // 1L water = 1kg
    const energyJoules = volume * 4186 * deltaT;
    const energyKWh = energyJoules / 3600000;
    const timeHours = power > 0 ? energyKWh / power : 0;
    const cost = energyKWh * price;

    return {
      energyKWh: energyKWh.toFixed(2),
      timeMinutes: Math.round(timeHours * 60),
      timeHours: timeHours.toFixed(1),
      cost: cost.toFixed(2),
      deltaT
    };
  }, [minTemp, maxTemp, volume, power, price]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-4xl font-bold tracking-tight text-slate-800 mb-2"
          >
            Калькулятор нагрева воды
          </motion.h1>
          <p className="text-slate-500">Рассчитайте затраты энергии, времени и денег на нагрев воды</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Inputs Section */}
          <section className="lg:col-span-2 space-y-6 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Temperature Range */}
              <div className="space-y-4">
                <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                  <Thermometer className="w-4 h-4 text-blue-500" />
                  Температура (°C)
                </label>
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <span className="text-xs text-slate-400 block mb-1">От</span>
                    <input
                      type="number"
                      value={minTemp}
                      onChange={(e) => setMinTemp(Number(e.target.value))}
                      className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    />
                  </div>
                  <div className="flex-1">
                    <span className="text-xs text-slate-400 block mb-1">До</span>
                    <input
                      type="number"
                      value={maxTemp}
                      onChange={(e) => setMaxTemp(Number(e.target.value))}
                      className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    />
                  </div>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  value={maxTemp} 
                  onChange={(e) => setMaxTemp(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
              </div>

              {/* Volume */}
              <div className="space-y-4">
                <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                  <Droplets className="w-4 h-4 text-cyan-500" />
                  Объем воды (литры)
                </label>
                <input
                  type="number"
                  value={volume}
                  onChange={(e) => setVolume(Number(e.target.value))}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition-all"
                />
                <input 
                  type="range" 
                  min="1" 
                  max="500" 
                  value={volume} 
                  onChange={(e) => setVolume(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                />
              </div>

              {/* Power */}
              <div className="space-y-4">
                <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                  <Zap className="w-4 h-4 text-amber-500" />
                  Мощность ТЭНа (кВт)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={power}
                  onChange={(e) => setPower(Number(e.target.value))}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all"
                />
                <div className="flex gap-2">
                  {[1.5, 2, 2.5, 3].map((p) => (
                    <button
                      key={p}
                      onClick={() => setPower(p)}
                      className={`flex-1 py-1 text-xs rounded border transition-colors ${power === p ? 'bg-amber-500 text-white border-amber-500' : 'bg-white text-slate-600 border-slate-200 hover:border-amber-300'}`}
                    >
                      {p} кВт
                    </button>
                  ))}
                </div>
              </div>

              {/* Price */}
              <div className="space-y-4">
                <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                  <CreditCard className="w-4 h-4 text-emerald-500" />
                  Цена за 1 кВт⋅ч
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100">
              <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-xl text-blue-800 text-sm">
                <Info className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <p>
                  Расчет производится по формуле: Q = m × c × ΔT. <br/>
                  Удельная теплоемкость воды принята за 4186 Дж/(кг·°C). <br/>
                  КПД нагревателя принят за 100% (без учета теплопотерь).
                </p>
              </div>
            </div>
          </section>

          {/* Results Section */}
          <aside className="space-y-6">
            <motion.div 
              layout
              className="bg-slate-800 text-white p-8 rounded-3xl shadow-xl overflow-hidden relative"
            >
              <div className="relative z-10 space-y-8">
                <div>
                  <h2 className="text-slate-400 text-sm font-medium uppercase tracking-wider mb-1">Итоговая стоимость</h2>
                  <div className="text-5xl font-bold tabular-nums">
                    {results.cost} <span className="text-2xl font-normal text-slate-400">₽</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-6">
                  <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-500/20 rounded-lg">
                        <Zap className="w-5 h-5 text-blue-400" />
                      </div>
                      <span className="text-slate-300">Энергия</span>
                    </div>
                    <div className="text-xl font-semibold tabular-nums">{results.energyKWh} кВт⋅ч</div>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-amber-500/20 rounded-lg">
                        <Clock className="w-5 h-5 text-amber-400" />
                      </div>
                      <span className="text-slate-300">Время нагрева</span>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-semibold tabular-nums">
                        {results.timeMinutes >= 60 
                          ? `${results.timeHours} ч` 
                          : `${results.timeMinutes} мин`}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-4">
                  <div className="flex justify-between text-sm text-slate-400 mb-2">
                    <span>Разница температур</span>
                    <span>{results.deltaT}°C</span>
                  </div>
                  <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(100, results.deltaT)}%` }}
                      className="h-full bg-gradient-to-r from-blue-500 to-red-500"
                    />
                  </div>
                </div>
              </div>

              {/* Decorative background element */}
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-blue-500/10 blur-3xl rounded-full" />
            </motion.div>

            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
              <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
                <Info className="w-4 h-4 text-slate-400" />
                Советы
              </h3>
              <ul className="text-sm text-slate-600 space-y-3">
                <li className="flex gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 flex-shrink-0" />
                  Для экономии установите температуру 55-60°C — это снизит образование накипи.
                </li>
                <li className="flex gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 flex-shrink-0" />
                  Учитывайте, что реальное время нагрева может быть на 10-15% больше из-за теплопотерь.
                </li>
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
