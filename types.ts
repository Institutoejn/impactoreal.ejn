
import React from 'react';

export type UserRole = 'donor' | 'manager';

export interface NavItem {
  id: string;
  label: string;
  icon: React.ElementType;
}

export interface Aluno {
  id: string;
  nome: string;
  idade: number;
  bairro: string;
  curso: string;
  status: 'active' | 'pending';
  observacoes: string;
  foto_url?: string;
}

export interface Projeto {
  id: string;
  nome: string;
  descricao: string;
  meta_financeira: number;
  status: 'active' | 'finished';
  capa_url?: string;
}

export interface Transacao {
  id: string;
  date: string; // Mantido como date ou convertido para created_at se preferir, mas usando o schema solicitado
  descricao: string;
  categoria: 'Educação' | 'Infraestrutura' | 'Alimentação' | 'Doação' | 'Outros';
  tipo: 'in' | 'out';
  valor: number;
  projeto_id?: string;
  status?: 'pending' | 'confirmed';
  doador_email?: string;
  comprovante_url?: string;
}

export interface Perfil {
  id: string;
  email: string;
  nome: string;
  foto_url: string | null;
  bio: string;
  cargo: UserRole;
  linkedin: string;
  instagram: string;
}
