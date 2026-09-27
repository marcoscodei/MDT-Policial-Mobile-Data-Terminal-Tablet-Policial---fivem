import React, { useState, useEffect } from 'react';
import { useMdtStore } from '../store/useMdtStore';
import { fetchNui } from '../utils/fetchNui';
import { CitizenStatus } from '../types/mdt';

export const MdtTablet: React.FC = () => {
  const {
    isVisible,
    setVisible,
    activeTab,
    setActiveTab,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    selectedCitizenId,
    setSelectedCitizenId,
    activeSubTab,
    setActiveSubTab,
    isOffDuty,
    toggleOffDuty,
    officersCount,
    citizens,
    addNoteToCitizen,
    toggleCitizenStatus,
  } = useMdtStore();

  const [timeStr, setTimeStr] = useState('');

  // Relógio digital em tempo real
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  if (!isVisible) return null;

  const selectedCitizen = citizens.find((c) => c.id === selectedCitizenId) || citizens[0];

  const filteredCitizens = citizens.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.document.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.id.toString().includes(searchQuery);

    const matchesStatus = statusFilter === 'all' || c.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="fixed inset-0 w-screen h-screen bg-[#080c14] text-slate-100 flex font-sans select-none overflow-hidden">
      
      {/* ================= SIDEBAR TÁTICA ESQUERDA ================= */}
      <aside className="w-64 bg-[#0d121f] border-r border-slate-800/80 flex flex-col justify-between p-4 z-20">
        <div className="space-y-6">
          
          {/* Logo Policial Futurista */}
          <div className="flex items-center gap-3 bg-[#131a2e] border border-cyan-500/30 p-3 rounded-2xl shadow-lg shadow-cyan-500/5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center font-black text-slate-950 text-lg shadow-md">
              PD
            </div>
            <div>
              <h1 className="font-extrabold text-sm tracking-wider text-white">LSPD TACTICAL</h1>
              <p className="text-[10px] text-cyan-400 font-mono tracking-widest">SYSTEM OS v5.0</p>
            </div>
          </div>

          {/* Relógio & Status do Agente */}
          <div className="bg-[#111728] border border-slate-800/80 rounded-xl p-3 space-y-2 text-xs">
            <div className="flex justify-between items-center font-mono text-cyan-400 text-sm font-bold">
              <span>{timeStr}</span>
              <span className="text-[10px] bg-cyan-950 text-cyan-300 border border-cyan-800 px-1.5 py-0.5 rounded">LIVE</span>
            </div>
            <div className="flex justify-between items-center text-slate-400 text-[11px] pt-1 border-t border-slate-800">
              <span>Unidades On-duty:</span>
              <strong className="text-white font-mono">{officersCount}</strong>
            </div>
          </div>

          {/* Navegação Principal */}
          <nav className="space-y-1.5">
            {[
              { id: 'citizens', label: 'Cidadãos / Dossiês', icon: '👤' },
              { id: 'warrants', label: 'Mandados Ativos', icon: '🚨' },
              { id: 'penal', label: 'Código Penal', icon: '⚖️' },
              { id: 'reports', label: 'Relatórios de Ocorrência', icon: '📋' },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as any)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  activeTab === item.id
                    ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg shadow-cyan-600/25 border border-cyan-400/30'
                    : 'text-slate-400 hover:bg-[#131929] hover:text-slate-200'
                }`}
              >
                <span className="text-sm">{item.icon}</span>
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Rodapé da Sidebar */}
        <div className="space-y-2 border-t border-slate-800/80 pt-3">
          <button
            onClick={toggleOffDuty}
            className={`w-full py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ${
              isOffDuty
                ? 'bg-amber-500/20 border border-amber-500/40 text-amber-400'
                : 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-400'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${isOffDuty ? 'bg-amber-400' : 'bg-emerald-400 animate-pulse'}`} />
            {isOffDuty ? 'FORA DE SERVIÇO' : 'EM PATRULHA'}
          </button>

          <button
            onClick={() => {
              setVisible(false);
              fetchNui('closeMdt');
            }}
            className="w-full bg-[#131929] hover:bg-red-500/20 hover:border-red-500/40 border border-slate-800 text-slate-400 hover:text-red-400 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2"
          >
            ENCERRAR SESSÃO <span className="bg-red-600 text-white text-[9px] px-1 rounded">ESC</span>
          </button>
        </div>
      </aside>

      {/* ================= CONTEÚDO PRINCIPAL (FEED DE DOSSIÊS) ================= */}
      <main className="flex-1 flex flex-col bg-[#080c14] overflow-hidden">
        
        {/* Barra Superior de Busca & Filtros */}
        <header className="bg-[#0d121f] border-b border-slate-800/80 p-4 flex items-center justify-between gap-4">
          <div className="flex-1 flex items-center gap-3 bg-[#131826] border border-slate-800 rounded-xl px-3.5 py-2">
            <span className="text-slate-500 text-sm">🔍</span>
            <input
              type="text"
              placeholder="Pesquisar cidadão por nome, passaporte ou ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent w-full text-xs text-slate-100 placeholder-slate-500 focus:outline-none"
            />
          </div>

          {/* Filtros Rápidos de Status */}
          <div className="flex bg-[#131826] border border-slate-800 rounded-xl p-1 gap-1 text-xs">
            {[
              { id: 'all', label: 'Todos' },
              { id: 'clean', label: 'Limpo' },
              { id: 'wanted', label: 'Procurado' },
              { id: 'arrested', label: 'Preso' },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setStatusFilter(f.id as any)}
                className={`px-3 py-1 rounded-lg font-medium transition ${
                  statusFilter === f.id
                    ? 'bg-cyan-500 text-slate-950 font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </header>

        {/* Grade de Cidadãos */}
        <div className="flex-1 p-4 overflow-y-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {filteredCitizens.map((citizen) => {
            const isSelected = selectedCitizen?.id === citizen.id;

            return (
              <div
                key={citizen.id}
                onClick={() => setSelectedCitizenId(citizen.id)}
                className={`bg-[#0e1424] border rounded-2xl p-4 cursor-pointer transition-all flex flex-col justify-between gap-3 relative overflow-hidden group ${
                  isSelected
                    ? 'border-cyan-500 shadow-lg shadow-cyan-500/10 ring-1 ring-cyan-500/50'
                    : 'border-slate-800/80 hover:border-slate-700 hover:bg-[#11192e]'
                }`}
              >
                {/* Linha Topo do Card */}
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <img src={citizen.avatar} alt="" className="w-11 h-11 rounded-xl object-cover border border-slate-700" />
                    <div>
                      <h3 className="font-bold text-sm text-white group-hover:text-cyan-400 transition">{citizen.name}</h3>
                      <p className="text-[11px] font-mono text-slate-400">ID: #{citizen.id} • {citizen.document}</p>
                    </div>
                  </div>

                  {/* Badge de Status */}
                  <span
                    className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider ${
                      citizen.status === 'wanted'
                        ? 'bg-red-500/20 text-red-400 border border-red-500/40 animate-pulse'
                        : citizen.status === 'arrested'
                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                        : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                    }`}
                  >
                    {citizen.status === 'wanted' ? 'PROCURADO' : citizen.status === 'arrested' ? 'PRESO' : 'LIMPO'}
                  </span>
                </div>

                {/* Detalhes do Card */}
                <div className="grid grid-cols-2 gap-2 text-[11px] bg-[#141c30]/60 p-2.5 rounded-xl border border-slate-800/60">
                  <div>
                    <span className="text-slate-500 block text-[9px] uppercase">Profissão</span>
                    <span className="text-slate-300 font-medium truncate block">{citizen.job}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[9px] uppercase">Telefone</span>
                    <span className="text-slate-300 font-mono block">{citizen.phone}</span>
                  </div>
                </div>

                <div className="flex justify-between items-center text-[10px] text-slate-400 pt-1 border-t border-slate-800/60">
                  <span>Veículos: <strong className="text-slate-200">{citizen.vehicles.length}</strong></span>
                  <span>Passagens: <strong className="text-slate-200">{citizen.records.length}</strong></span>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* ================= PAINEL DIREITO DE INSPEÇÃO DO DOSSIÊ (INSPECTOR) ================= */}
      {selectedCitizen && (
        <aside className="w-[420px] bg-[#0c111d] border-l border-slate-800/80 flex flex-col justify-between z-10">
          
          {/* Header do Dossiê */}
          <div className="p-5 border-b border-slate-800/80 bg-[#111728]/50 space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-mono tracking-widest text-cyan-400 bg-cyan-950/60 border border-cyan-800 px-2 py-0.5 rounded">
                DOSSIÊ TÁTICO POLICIAL
              </span>
              <span className="text-xs font-mono text-slate-500">NASC: {selectedCitizen.dob}</span>
            </div>

            <div className="flex gap-4 items-center">
              <img
                src={selectedCitizen.avatar}
                alt=""
                className="w-16 h-16 rounded-2xl object-cover border-2 border-cyan-500/40 shadow-lg shadow-cyan-500/10"
              />
              <div className="space-y-1">
                <h2 className="text-lg font-black text-white">{selectedCitizen.name}</h2>
                <p className="text-xs text-slate-400 font-mono">DOC: {selectedCitizen.document}</p>
                
                {/* Nível de Risco */}
                <div className="flex items-center gap-1.5 pt-1">
                  <span className="text-[10px] text-slate-400">Nível de Perigo:</span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.2 rounded ${
                      selectedCitizen.dangerLevel === 'high'
                        ? 'bg-red-600 text-white'
                        : selectedCitizen.dangerLevel === 'medium'
                        ? 'bg-amber-600 text-white'
                        : 'bg-slate-700 text-slate-300'
                    }`}
                  >
                    {selectedCitizen.dangerLevel.toUpperCase()}
                  </span>
                </div>
              </div>
            </div>

            {/* Ações Rápidas de Status */}
            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                onClick={() =>
                  toggleCitizenStatus(
                    selectedCitizen.id,
                    selectedCitizen.status === 'wanted' ? 'clean' : 'wanted'
                  )
                }
                className={`py-2 rounded-xl text-xs font-bold border transition ${
                  selectedCitizen.status === 'wanted'
                    ? 'bg-emerald-600/20 border-emerald-500/40 text-emerald-400 hover:bg-emerald-600/30'
                    : 'bg-red-600/20 border-red-500/40 text-red-400 hover:bg-red-600/30'
                }`}
              >
                {selectedCitizen.status === 'wanted' ? '✓ Remover Mandado' : '🚨 Marcar Procurado'}
              </button>

              <button
                onClick={() =>
                  toggleCitizenStatus(
                    selectedCitizen.id,
                    selectedCitizen.status === 'arrested' ? 'clean' : 'arrested'
                  )
                }
                className="py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 rounded-xl text-xs font-bold transition"
              >
                {selectedCitizen.status === 'arrested' ? 'Soltar Cidadão' : '🔒 Prender Cidadão'}
              </button>
            </div>
          </div>

          {/* Abas do Dossiê */}
          <div className="flex border-b border-slate-800/80 bg-[#0e1424]">
            {[
              { id: 'overview', label: 'Geral' },
              { id: 'records', label: 'Ficha Criminal' },
              { id: 'vehicles', label: 'Veículos' },
              { id: 'notes', label: 'Notas' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveSubTab(tab.id as any)}
                className={`flex-1 py-2.5 text-xs font-bold transition border-b-2 ${
                  activeSubTab === tab.id
                    ? 'border-cyan-500 text-cyan-400 bg-cyan-500/5'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Conteúdo das Abas */}
          <div className="flex-1 p-5 overflow-y-auto space-y-4 text-xs">
            {activeSubTab === 'overview' && (
              <div className="space-y-3">
                <div className="bg-[#13192a] border border-slate-800/80 p-3 rounded-xl space-y-2">
                  <div className="flex justify-between border-b border-slate-800 pb-1.5">
                    <span className="text-slate-400">Gênero</span>
                    <span className="text-slate-200 font-medium">{selectedCitizen.gender}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-800 pb-1.5">
                    <span className="text-slate-400">Ocupação / Emprego</span>
                    <span className="text-slate-200 font-medium">{selectedCitizen.job}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-800 pb-1.5">
                    <span className="text-slate-400">Telefone</span>
                    <span className="text-slate-200 font-mono">{selectedCitizen.phone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Saldo Bancário</span>
                    <span className="text-emerald-400 font-mono font-bold">{selectedCitizen.bank}</span>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Licenças Registradas</label>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedCitizen.licenses.map((lic, i) => (
                      <span key={i} className="bg-slate-800/80 border border-slate-700/60 px-2.5 py-1 rounded-lg text-slate-300 font-medium text-[11px]">
                        {lic}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeSubTab === 'records' && (
              <div className="space-y-2">
                {selectedCitizen.records.length === 0 ? (
                  <p className="text-center text-slate-500 py-6">Nenhuma infração registrada na ficha.</p>
                ) : (
                  selectedCitizen.records.map((rec) => (
                    <div key={rec.id} className="bg-[#13192a] border border-slate-800 p-3 rounded-xl space-y-1.5">
                      <div className="flex justify-between font-bold text-cyan-400">
                        <span>{rec.crime}</span>
                        <span className="text-slate-500 text-[10px]">{rec.date}</span>
                      </div>
                      <p className="text-[11px] text-slate-400">Oficial: {rec.officer}</p>
                      <div className="flex justify-between text-[11px] pt-1 border-t border-slate-800/60 font-mono">
                        <span className="text-amber-400">Pena: {rec.jailTime} meses</span>
                        <span className="text-emerald-400">Multa: ${rec.fine.toLocaleString()}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {activeSubTab === 'vehicles' && (
              <div className="space-y-2">
                {selectedCitizen.vehicles.length === 0 ? (
                  <p className="text-center text-slate-500 py-6">Nenhum veículo registrado no nome.</p>
                ) : (
                  selectedCitizen.vehicles.map((v, i) => (
                    <div key={i} className="bg-[#13192a] border border-slate-800 p-3 rounded-xl flex justify-between items-center">
                      <div>
                        <p className="font-bold text-white text-sm">{v.model}</p>
                        <p className="text-slate-400 text-[11px]">Cor: {v.color}</p>
                      </div>
                      <div className="text-right">
                        <span className="font-mono bg-slate-900 border border-slate-700 px-2 py-1 rounded text-cyan-400 font-bold text-xs block">
                          {v.plate}
                        </span>
                        {v.status === 'stolen' && (
                          <span className="text-[9px] font-bold text-red-400 block mt-1 uppercase">ALERTA DE ROUBO</span>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {activeSubTab === 'notes' && (
              <div className="space-y-2 h-full flex flex-col">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Anotações Confidenciais da Polícia</label>
                <textarea
                  value={selectedCitizen.notes}
                  onChange={(e) => addNoteToCitizen(selectedCitizen.id, e.target.value)}
                  placeholder="Escreva observações sobre abordagens, comportamentos e suspeitas..."
                  className="w-full h-48 bg-[#13192a] border border-slate-800 rounded-xl p-3 text-slate-200 text-xs focus:outline-none focus:border-cyan-500/50 resize-none"
                />
              </div>
            )}
          </div>

        </aside>
      )}

    </div>
  );
};