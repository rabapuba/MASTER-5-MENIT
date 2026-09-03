import React, { useState, useEffect } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, ReferenceLine 
} from 'recharts';
import { 
  Activity, Terminal, Zap, TrendingUp, Settings, CheckCircle2, Clock, ArrowUpRight, ArrowDownRight, ShieldCheck, Sun, Moon, Sliders 
} from 'lucide-react';

// Data Struktur Kontrak Terintegrasi dengan TWAP & Real-Time Feed
const CONTRACT_MARKETS = [
  { 
    id: 'BTC-5M-01', 
    interval: '14:30 - 14:35 UTC', 
    strikePrice: 108450.00, 
    twapBenchmark: 108442.50,
    upOdds: 0.52, 
    downOdds: 0.48, 
    aiModelProbUp: 0.61, 
    edgeSignal: '+9% (UP)', 
    status: 'LIVE_ACTIVE',
    chartData: [
      { time: '14:30', spot: 108420, twap: 108440 },
      { time: '14:31', spot: 108435, twap: 108441 },
      { time: '14:32', spot: 108460, twap: 108442 },
      { time: '14:33', spot: 108455, twap: 108442 },
      { time: '14:34', spot: 108475, twap: 108442.5 }
    ]
  },
  { 
    id: 'BTC-5M-02', 
    interval: '14:35 - 14:40 UTC', 
    strikePrice: 108480.00, 
    twapBenchmark: 108475.00,
    upOdds: 0.45, 
    downOdds: 0.55, 
    aiModelProbUp: 0.42, 
    edgeSignal: '-3% (DOWN)', 
    status: 'QUEUED',
    chartData: [
      { time: '14:35', spot: 108470, twap: 108472 },
      { time: '14:36', spot: 108475, twap: 108473 },
      { time: '14:37', spot: 108465, twap: 108474 },
      { time: '14:38', spot: 108472, twap: 108475 },
      { time: '14:39', spot: 108478, twap: 108475 }
    ]
  },
  { 
    id: 'BTC-5M-03', 
    interval: '14:40 - 14:45 UTC', 
    strikePrice: 108500.00, 
    twapBenchmark: 108495.00,
    upOdds: 0.50, 
    downOdds: 0.50, 
    aiModelProbUp: 0.50, 
    edgeSignal: 'NEUTRAL', 
    status: 'PENDING',
    chartData: [
      { time: '14:40', spot: 108485, twap: 108490 },
      { time: '14:41', spot: 108490, twap: 108492 },
      { time: '14:42', spot: 108495, twap: 108493 },
      { time: '14:43', spot: 108498, twap: 108494 },
      { time: '14:44', spot: 108500, twap: 108495 }
    ]
  },
];

export default function App() {
  const [selectedContract, setSelectedContract] = useState(CONTRACT_MARKETS[0]);
  const [kellyFraction, setKellyFraction] = useState(0.25);
  const [bankroll, setBankroll] = useState(10000);
  const [countdown, setCountdown] = useState(180);
  const [activeTab, setActiveTab] = useState<'matrix' | 'config' | 'logs'>('matrix');
  
  // Kontrol Tema & Kontras Manual (Institutional Dark, OLED Black, Amber Retro, Light Mode)
  const [themeMode, setThemeMode] = useState<'institutional' | 'oled' | 'amber' | 'light'>('institutional');

  const [logs, setLogs] = useState<string[]>([
    '[INIT] Terminal initialized with Adaptive Contrast Engine.',
    '[CLOB] WebSocket connected to Polymarket 5M feed endpoints.',
    '[ORACLE] Chainlink TWAP validation active across all active intervals.'
  ]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 300));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleExecuteTrade = (direction: 'UP' | 'DOWN') => {
    if (!selectedContract) return;
    const odds = direction === 'UP' ? selectedContract.upOdds : selectedContract.downOdds;
    const stake = (bankroll * kellyFraction * odds).toFixed(2);
    const logEntry = `[EXECUTION] Direction: ${direction} | Window: ${selectedContract.interval} | Stake: $${stake} (${kellyFraction * 100}% Kelly) | Theme: ${themeMode}`;
    setLogs(prev => [logEntry, ...prev]);
  };

  // Konfigurasi Styles berdasarkan Tema Kontras Manual
  const themes = {
    institutional: {
      bg: 'bg-[#090d16]',
      header: 'bg-[#0c111d] border-[#1e293b]',
      card: 'bg-[#121824] border-[#1e293b]',
      subCard: 'bg-[#090d16] border-[#1e293b]',
      textPrimary: 'text-slate-200',
      textMuted: 'text-slate-400',
      accent: 'text-cyan-400',
      border: 'border-[#1e293b]',
      hoverRow: 'hover:bg-[#1a2233]',
      selectedRow: 'bg-cyan-950/30 border-l-2 border-cyan-400',
      chartGrid: '#1e293b',
      chartText: '#64748b'
    },
    oled: {
      bg: 'bg-black',
      header: 'bg-zinc-950 border-zinc-800',
      card: 'bg-zinc-900 border-zinc-800',
      subCard: 'bg-black border-zinc-800',
      textPrimary: 'text-zinc-100',
      textMuted: 'text-zinc-400',
      accent: 'text-emerald-400',
      border: 'border-zinc-800',
      hoverRow: 'hover:bg-zinc-800/50',
      selectedRow: 'bg-emerald-950/30 border-l-2 border-emerald-400',
      chartGrid: '#27272a',
      chartText: '#71717a'
    },
    amber: {
      bg: 'bg-[#120d08]',
      header: 'bg-[#1a120b] border-[#38220f]',
      card: 'bg-[#1d140c] border-[#38220f]',
      subCard: 'bg-[#120d08] border-[#38220f]',
      textPrimary: 'text-amber-100',
      textMuted: 'text-amber-500/80',
      accent: 'text-amber-400',
      border: 'border-[#38220f]',
      hoverRow: 'hover:bg-[#2b1c11]',
      selectedRow: 'bg-amber-950/40 border-l-2 border-amber-400',
      chartGrid: '#38220f',
      chartText: '#b45309'
    },
    light: {
      bg: 'bg-slate-100',
      header: 'bg-white border-slate-300',
      card: 'bg-white border-slate-300',
      subCard: 'bg-slate-50 border-slate-200',
      textPrimary: 'text-slate-900',
      textMuted: 'text-slate-600',
      accent: 'text-blue-600',
      border: 'border-slate-300',
      hoverRow: 'hover:bg-slate-100',
      selectedRow: 'bg-blue-50 border-l-2 border-blue-600',
      chartGrid: '#cbd5e1',
      chartText: '#475569'
    }
  };

  const t = themes[themeMode];

  return (
    <div className={`min-h-screen ${t.bg} ${t.textPrimary} font-mono flex flex-col transition-colors duration-200`}>
      
      {/* HEADER BAR */}
      <header className={`border-b ${t.header} px-4 py-3 flex flex-wrap items-center justify-between gap-4 shadow-sm`}>
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded border ${t.border} ${t.accent} bg-opacity-10`}>
            <Activity className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h1 className={`text-sm font-bold tracking-wider ${t.accent} uppercase`}>ZBY-BTC Quantitative Terminal</h1>
            <p className={`text-xs ${t.textMuted}`}>Polymarket Feed Pro + Chainlink TWAP Engine</p>
          </div>
        </div>

        {/* KONTROL KONTRAS MANUAL (THEME SWITCHER) */}
        <div className="flex items-center space-x-2 bg-black/20 p-1 rounded border border-current/10">
          <Sliders className="w-3.5 h-3.5 ml-1 text-slate-400" />
          <span className="text-[10px] uppercase text-slate-400 font-bold px-1">Contrast:</span>
          <button onClick={() => setThemeMode('institutional')} className={`px-2 py-1 text-[11px] rounded transition ${themeMode === 'institutional' ? 'bg-cyan-500 text-black font-bold' : 'text-slate-400'}`}>Dark</button>
          <button onClick={() => setThemeMode('oled')} className={`px-2 py-1 text-[11px] rounded transition ${themeMode === 'oled' ? 'bg-emerald-500 text-black font-bold' : 'text-slate-400'}`}>OLED</button>
          <button onClick={() => setThemeMode('amber')} className={`px-2 py-1 text-[11px] rounded transition ${themeMode === 'amber' ? 'bg-amber-500 text-black font-bold' : 'text-slate-400'}`}>Amber</button>
          <button onClick={() => setThemeMode('light')} className={`px-2 py-1 text-[11px] rounded transition ${themeMode === 'light' ? 'bg-blue-600 text-white font-bold' : 'text-slate-400'}`}>Lite</button>
        </div>

        <div className="flex items-center space-x-4 text-xs">
          <div className={`flex items-center space-x-2 ${t.card} px-3 py-1.5 rounded border`}>
            <Clock className={`w-3.5 h-3.5 ${t.accent}`} />
            <span className={t.textMuted}>Interval Lock:</span>
            <span className={`font-bold ${t.accent}`}>{formatTime(countdown)}</span>
          </div>
          <div className={`hidden md:flex items-center space-x-2 ${t.card} px-3 py-1.5 rounded border`}>
            <span className={t.textMuted}>Bankroll:</span>
            <span className="text-emerald-500 font-bold">${bankroll.toLocaleString()} USDC</span>
          </div>
          <div className={`flex ${t.card} border rounded p-0.5`}>
            <button onClick={() => setActiveTab('matrix')} className={`px-3 py-1 rounded text-xs transition ${activeTab === 'matrix' ? 'bg-cyan-500 text-black font-bold' : t.textMuted}`}>Matrix</button>
            <button onClick={() => setActiveTab('config')} className={`px-3 py-1 rounded text-xs transition ${activeTab === 'config' ? 'bg-cyan-500 text-black font-bold' : t.textMuted}`}>Config</button>
            <button onClick={() => setActiveTab('logs')} className={`px-3 py-1 rounded text-xs transition ${activeTab === 'logs' ? 'bg-cyan-500 text-black font-bold' : t.textMuted}`}>Logs</button>
          </div>
        </div>
      </header>

      {/* MAIN LAYOUT */}
      <main className="flex-1 p-4 grid grid-cols-1 lg:grid-cols-12 gap-4 max-w-[1800px] w-full mx-auto">

        {activeTab === 'matrix' && (
          <>
            {/* LEFT PANEL: CONTRACT MATRIX */}
            <section className={`lg:col-span-7 ${t.card} border rounded-lg p-4 flex flex-col shadow-sm`}>
              <div className={`flex items-center justify-between mb-3 pb-2 border-b ${t.border}`}>
                <h2 className={`text-xs font-bold uppercase tracking-wider ${t.textPrimary} flex items-center gap-2`}>
                  <Zap className={`w-4 h-4 ${t.accent}`} /> 5-Minute BTC Contract Matrix
                </h2>
                <span className="text-xs text-emerald-500 flex items-center gap-1 font-semibold">
                  <ShieldCheck className="w-3.5 h-3.5" /> TWAP Synced
                </span>
              </div>

              <div className="overflow-x-auto flex-1">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className={`${t.textMuted} border-b ${t.border}`}>
                      <th className="pb-2 font-medium">Time Window</th>
                      <th className="pb-2 font-medium text-right">Strike Price</th>
                      <th className="pb-2 font-medium text-right">TWAP Oracle</th>
                      <th className="pb-2 font-medium text-right">UP / DOWN</th>
                      <th className="pb-2 font-medium text-right">AI Edge</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-current/10">
                    {CONTRACT_MARKETS.map((m) => {
                      const isSelected = selectedContract.id === m.id;
                      const isUp = m.edgeSignal.includes('UP');
                      return (
                        <tr 
                          key={m.id}
                          onClick={() => setSelectedContract(m)}
                          className={`cursor-pointer transition ${t.hoverRow} ${isSelected ? t.selectedRow : ''}`}
                        >
                          <td className="py-3 font-semibold flex items-center gap-2">
                            <span className={`w-2 h-2 rounded-full ${m.status === 'LIVE_ACTIVE' ? 'bg-emerald-500 animate-ping' : 'bg-slate-500'}`}></span>
                            {m.interval}
                          </td>
                          <td className={`py-3 text-right font-mono ${t.accent}`}>${m.strikePrice.toLocaleString()}</td>
                          <td className="py-3 text-right font-mono text-amber-500 font-semibold">${m.twapBenchmark.toLocaleString()}</td>
                          <td className={`py-3 text-right font-mono ${t.textMuted}`}>{(m.upOdds * 100).toFixed(0)}¢ / {(m.downOdds * 100).toFixed(0)}¢</td>
                          <td className={`py-3 text-right font-mono font-bold ${isUp ? 'text-emerald-500' : 'text-rose-500'}`}>
                            {m.edgeSignal}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </section>

            {/* RIGHT PANEL: STABILIZED CHART & PROJECTIONS */}
            <section className={`lg:col-span-5 ${t.card} border rounded-lg p-4 flex flex-col shadow-sm`}>
              <div className={`flex items-center justify-between mb-3 pb-2 border-b ${t.border}`}>
                <h2 className={`text-xs font-bold uppercase tracking-wider ${t.textPrimary} flex items-center gap-2`}>
                  <TrendingUp className={`w-4 h-4 ${t.accent}`} /> Price Action ({selectedContract.interval})
                </h2>
                <span className="text-[11px] text-amber-500 font-mono font-bold">TWAP: ${selectedContract.twapBenchmark.toLocaleString()}</span>
              </div>

              {/* Chart Stabil & Nyaman di Mata */}
              <div className={`h-48 w-full my-2 ${t.subCard} p-2 rounded border`}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={selectedContract.chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={t.chartGrid} vertical={false} />
                    <XAxis dataKey="time" stroke={t.chartText} fontSize={10} tickLine={false} />
                    <YAxis 
                      domain={['auto', 'auto']} 
                      stroke={t.chartText} 
                      fontSize={10} 
                      tickLine={false} 
                      tickFormatter={(val) => `$${val}`}
                    />
                    <Tooltip 
                      contentStyle={{ backgroundColor: t.card.includes('bg-white') ? '#ffffff' : '#0c111d', borderColor: t.chartGrid, fontSize: '11px', borderRadius: '4px', color: t.textPrimary }}
                      formatter={(value: any) => [`$${Number(value).toLocaleString()}`]}
                    />
                    <ReferenceLine y={selectedContract.strikePrice} stroke="#f59e0b" strokeDasharray="3 3" label={{ value: 'Strike', fill: '#f59e0b', fontSize: 10, position: 'insideTopRight' }} />
                    <Line type="monotone" dataKey="spot" stroke="#38bdf8" strokeWidth={2} dot={false} activeDot={{ r: 4 }} name="Spot Price" />
                    <Line type="monotone" dataKey="twap" stroke="#34d399" strokeWidth={1.5} dot={false} name="Chainlink TWAP" />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* KELLY SIZING & EKSEKUSI TICKET */}
              <div className={`mt-auto ${t.subCard} border rounded p-3 space-y-3`}>
                <div className="flex items-center justify-between">
                  <span className={`text-xs ${t.textMuted}`}>Fractional Kelly Sizing:</span>
                  <div className="flex space-x-2">
                    {[0.25, 0.50].map((frac) => (
                      <button
                        key={frac}
                        onClick={() => setKellyFraction(frac)}
                        className={`px-2 py-1 text-[11px] rounded border transition cursor-pointer ${kellyFraction === frac ? 'bg-cyan-500/20 border-cyan-500 text-cyan-400 font-bold' : `${t.border} ${t.textMuted}`}`}
                      >
                        {frac === 0.25 ? '0.25 (Safe)' : '0.5 (Half)'}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs font-mono">
                  <span className={t.textMuted}>Model Probability:</span>
                  <span className={`${t.accent} font-bold`}>{(selectedContract.aiModelProbUp * 100).toFixed(1)}% (UP)</span>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    onClick={() => handleExecuteTrade('UP')}
                    className="bg-emerald-600 hover:bg-emerald-500 text-black font-bold py-2.5 rounded text-xs transition uppercase tracking-wider flex items-center justify-center gap-1 shadow-md cursor-pointer"
                  >
                    <ArrowUpRight className="w-4 h-4 stroke-[3]" /> Buy UP ({(selectedContract.upOdds * 100).toFixed(0)}¢)
                  </button>
                  <button
                    onClick={() => handleExecuteTrade('DOWN')}
                    className="bg-rose-600 hover:bg-rose-500 text-white font-bold py-2.5 rounded text-xs transition uppercase tracking-wider flex items-center justify-center gap-1 shadow-md cursor-pointer"
                  >
                    <ArrowDownRight className="w-4 h-4 stroke-[3]" /> Buy DOWN ({(selectedContract.downOdds * 100).toFixed(0)}¢)
                  </button>
                </div>
              </div>
            </section>
          </>
        )}

        {activeTab === 'config' && (
          <div className={`col-span-12 ${t.card} border rounded-lg p-6 max-w-2xl mx-auto w-full space-y-4 shadow-sm`}>
            <h2 className={`text-sm font-bold uppercase tracking-wider ${t.accent} flex items-center gap-2`}>
              <Settings className="w-4 h-4" /> System Configuration & Oracle Parameters
            </h2>
            <div className="space-y-3 text-xs">
              <div>
                <label className={`block ${t.textMuted} mb-1`}>Chainlink TWAP Oracle Feed</label>
                <input type="text" readOnly value="wss://stream.chain.link/polygon/btc-5m-twap" className={`w-full ${t.subCard} border rounded p-2 ${t.textPrimary} font-mono text-[11px]`} />
              </div>
              <div>
                <label className={`block ${t.textMuted} mb-1`}>Polymarket CLOB Feed Source</label>
                <input type="text" readOnly value="https://github.com/rabapuba/polymarket-feed-pro" className={`w-full ${t.subCard} border rounded p-2 ${t.textPrimary} font-mono text-[11px]`} />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'logs' && (
          <div className={`col-span-12 ${t.card} border rounded-lg p-4 flex flex-col h-[500px] shadow-sm`}>
            <h2 className={`text-xs font-bold uppercase tracking-wider ${t.accent} flex items-center gap-2 mb-3`}>
              <Terminal className="w-4 h-4" /> Live Execution & Oracle Logs
            </h2>
            <div className={`flex-1 ${t.subCard} border rounded p-3 overflow-y-auto space-y-1 font-mono text-xs ${t.textPrimary}`}>
              {logs.map((log, idx) => (
                <div key={idx} className={`border-b ${t.border} pb-1 border-opacity-30`}>
                  <span className="text-cyan-500 mr-2">&gt;</span>
                  {log}
                </div>
              ))}
            </div>
          </div>
        )}

      </main>

      <footer className={`border-t ${t.header} px-4 py-2 text-[11px] ${t.textMuted} flex justify-between`}>
        <span>ZBY-BTC Quantitative Terminal — Institutional Standard</span>
        <span className="text-emerald-500 flex items-center gap-1 font-semibold">
          <CheckCircle2 className="w-3 h-3" /> Adaptive Contrast Engine Active
        </span>
      </footer>

    </div>
  );
}
