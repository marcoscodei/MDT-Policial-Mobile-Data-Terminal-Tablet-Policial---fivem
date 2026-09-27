import React from 'react';
import { useMdtStore } from '../store/useMdtStore';
import { PENAL_CODE } from '../types/mdt';
import { fetchNui } from '../utils/fetchNui';

export const AddRecordModal: React.FC = () => {
  const {
    isAddRecordOpen,
    setAddRecordOpen,
    selectedArticles,
    toggleArticle,
    clearSelectedArticles,
    selectedCitizen,
    officer,
  } = useMdtStore();

  if (!isAddRecordOpen || !selectedCitizen) return null;

  const totalMonths = selectedArticles.reduce((acc, curr) => acc + curr.months, 0);
  const totalFine = selectedArticles.reduce((acc, curr) => acc + curr.fine, 0);

  const handleSubmit = async () => {
    await fetchNui('createRecord', {
      citizenId: selectedCitizen.id,
      officerName: officer?.name,
      crimes: selectedArticles.map((a) => a.title),
      totalMonths,
      totalFine,
    });
    clearSelectedArticles();
    setAddRecordOpen(false);
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-slate-900/95 border border-slate-700/60 rounded-2xl p-6 w-full max-w-2xl text-slate-100 shadow-2xl space-y-6">
        <div className="flex justify-between items-center border-b border-slate-800 pb-3">
          <div>
            <h3 className="text-lg font-bold text-blue-400">Registrar Infração / Ficha Criminal</h3>
            <p className="text-xs text-slate-400">Cidadão: {selectedCitizen.name} ({selectedCitizen.document})</p>
          </div>
          <button
            onClick={() => setAddRecordOpen(false)}
            className="text-slate-400 hover:text-white transition text-sm font-bold"
          >
            ✕
          </button>
        </div>

        <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
          {PENAL_CODE.map((article) => {
            const isSelected = selectedArticles.some((a) => a.id === article.id);
            return (
              <div
                key={article.id}
                onClick={() => toggleArticle(article)}
                className={`p-3 rounded-xl border cursor-pointer transition-all flex justify-between items-center ${
                  isSelected
                    ? 'bg-blue-600/20 border-blue-500 text-blue-200 shadow-lg shadow-blue-500/10'
                    : 'bg-slate-800/40 border-slate-700/40 hover:bg-slate-800/80'
                }`}
              >
                <div>
                  <span className="font-mono text-xs font-bold text-blue-400 mr-2">
                    {article.code}
                  </span>
                  <span className="text-sm font-medium">{article.title}</span>
                </div>
                <div className="text-xs space-x-3 text-slate-400">
                  <span>{article.months} meses</span>
                  <span className="text-emerald-400 font-semibold">${article.fine.toLocaleString()}</span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="bg-slate-950/70 rounded-xl p-4 border border-slate-800 flex justify-between items-center">
          <div>
            <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Pena Total</p>
            <p className="text-2xl font-black text-amber-400">{totalMonths} <span className="text-sm font-normal text-slate-400">meses</span></p>
          </div>
          <div className="text-right">
            <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Fiança / Multa</p>
            <p className="text-2xl font-black text-emerald-400">${totalFine.toLocaleString()}</p>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <button
            onClick={() => setAddRecordOpen(false)}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-medium transition"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            disabled={selectedArticles.length === 0}
            className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-bold transition shadow-lg shadow-blue-600/30"
          >
            Confirmar Registro
          </button>
        </div>
      </div>
    </div>
  );
};