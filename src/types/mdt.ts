export type DangerLevel = 'low' | 'medium' | 'high';
export type CitizenStatus = 'clean' | 'wanted' | 'arrested';

export interface Vehicle {
  model: string;
  plate: string;
  color: string;
  status: 'ok' | 'stolen';
}

export interface CriminalRecord {
  id: string;
  officer: string;
  crime: string;
  fine: number;
  jailTime: number;
  date: string;
}

export interface Citizen {
  id: number;
  name: string;
  document: string;
  gender: string;
  job: string;
  phone: string;
  bank: string;
  status: CitizenStatus;
  dangerLevel: DangerLevel;
  avatar: string;
  dob: string;
  licenses: string[];
  vehicles: Vehicle[];
  records: CriminalRecord[];
  notes: string;
}