
import React from 'react';

export type UserRole = 'donor' | 'manager';

export interface NavItem {
  id: string;
  label: string;
  icon: React.ElementType;
}

export interface DonorData {
  name: string;
  impactCount: number;
  totalInvested: number;
}

export interface Student {
  id: string;
  name: string;
  age: number;
  neighborhood: string;
  course: string;
  status: 'active' | 'pending';
  history: string;
  image?: string; // New field for student photo
}

export interface Project {
  id: string;
  title: string;
  description: string;
  goal: number;
  status: 'active' | 'finished';
  image?: string;
}

export interface Transaction {
  id: string;
  date: string;
  description: string;
  category: 'Educação' | 'Infraestrutura' | 'Alimentação' | 'Doação' | 'Outros';
  type: 'in' | 'out';
  amount: number;
  projectId?: string;
  status?: 'pending' | 'confirmed';
  proofImage?: string; // Field for transparency evidence
}

export interface Expense {
  id: string;
  category: string;
  amount: number;
  date: string;
  description: string;
}
