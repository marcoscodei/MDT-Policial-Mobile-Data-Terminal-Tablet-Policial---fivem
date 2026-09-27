import { create } from 'zustand';
import { Citizen, CitizenStatus } from '../types/mdt';

interface MdtState {
  isVisible: boolean;
  activeTab: 'citizens' | 'warrants' | 'penal' | 'reports';
  searchQuery: string;
  statusFilter: 'all' | CitizenStatus;
  selectedCitizenId: number | null;
  activeSubTab: 'overview' | 'records' | 'vehicles' | 'notes';
  isOffDuty: boolean;
  officersCount: number;
  citizens: Citizen[];

  setVisible: (visible: boolean) => void;
  setActiveTab: (tab: 'citizens' | 'warrants' | 'penal' | 'reports') => void;
  setSearchQuery: (query: string) => void;
  setStatusFilter: (filter: 'all' | CitizenStatus) => void;
  setSelectedCitizenId: (id: number | null) => void;
  setActiveSubTab: (tab: 'overview' | 'records' | 'vehicles' | 'notes') => void;
  toggleOffDuty: () => void;
  addNoteToCitizen: (id: number, note: string) => void;
  toggleCitizenStatus: (id: number, status: CitizenStatus) => void;
}

const MOCK_CITIZENS: Citizen[] = [
  {
    id: 101,
    name: 'Michael Smith',
    document: 'PAS-8820',
    gender: 'Masculino',
    job: 'Mecânico / Los Santos Customs',
    phone: '555-0192',
    bank: '$ 142,500',
    status: 'wanted',
    dangerLevel: 'high',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200',
    dob: '14/05/1996',
    licenses: ['Motorista', 'Porte de Arma (Revogada)'],
    vehicles: [
      { model: 'Elegy RH8', plate: '82LSP10', color: 'Preto Fosco', status: 'ok' },
      { model: 'Sultan RS', plate: '99KLS01', color: 'Vermelho', status: 'stolen' },
    ],
    records: [
      { id: 'REC-1', officer: 'Capitão Boni', crime: 'Assalto a Mão Armada', fine: 35000, jailTime: 40, date: '22/09/2026' },
      { id: 'REC-2', officer: 'Sgt. Silva', crime: 'Direção Perigosa', fine: 5000, jailTime: 0, date: '10/08/2026' },
    ],
    notes: 'Suspeito com conexões em roubos de carga na zona sul. Sempre armado.',
  },
  {
    id: 102,
    name: 'Gabriel Santos',
    document: 'PAS-3190',
    gender: 'Masculino',
    job: 'Empresário',
    phone: '555-8833',
    bank: '$ 1,200,000',
    status: 'clean',
    dangerLevel: 'low',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=200',
    dob: '02/11/1990',
    licenses: ['Motorista', 'Caça', 'Porte de Arma'],
    vehicles: [
      { model: 'Adder', plate: 'VIP7777', color: 'Branco Pérola', status: 'ok' },
    ],
    records: [],
    notes: 'Cidadão sem passagens. Cooperativo durante abordagens.',
  },
  {
    id: 103,
    name: 'Carlos Rivera',
    document: 'PAS-9941',
    gender: 'Masculino',
    job: 'Desempregado',
    phone: '555-4011',
    bank: '$ 12,300',
    status: 'arrested',
    dangerLevel: 'medium',
    avatar: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=200',
    dob: '19/08/1998',
    licenses: ['Motorista'],
    vehicles: [],
    records: [
      { id: 'REC-3', officer: 'Tenente Costa', crime: 'Tráfico de Entorpecentes', fine: 20000, jailTime: 50, date: '25/09/2026' }
    ],
    notes: 'Cumprindo pena na Penitenciária de Bolingbroke.',
  },
];

export const useMdtStore = create<MdtState>((set) => ({
  isVisible: true,
  activeTab: 'citizens',
  searchQuery: '',
  statusFilter: 'all',
  selectedCitizenId: 101,
  activeSubTab: 'overview',
  isOffDuty: false,
  officersCount: 12,
  citizens: MOCK_CITIZENS,

  setVisible: (visible) => set({ isVisible: visible }),
  setActiveTab: (activeTab) => set({ activeTab }),
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setStatusFilter: (statusFilter) => set({ statusFilter }),
  setSelectedCitizenId: (selectedCitizenId) => set({ selectedCitizenId }),
  setActiveSubTab: (activeSubTab) => set({ activeSubTab }),
  toggleOffDuty: () => set((state) => ({ isOffDuty: !state.isOffDuty })),
  addNoteToCitizen: (id, note) =>
    set((state) => ({
      citizens: state.citizens.map((c) => (c.id === id ? { ...c, notes: note } : c)),
    })),
  toggleCitizenStatus: (id, status) =>
    set((state) => ({
      citizens: state.citizens.map((c) => (c.id === id ? { ...c, status } : c)),
    })),
}));