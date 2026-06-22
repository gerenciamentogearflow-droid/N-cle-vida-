export interface ContractData {
  id?: string;
  createdAt?: string;
  contratante: {
    nome: string;
    rg: string;
    cpf: string;
    endereco: string;
    numero: string;
    bairro: string;
    cidade: string;
    grau_parentesco: string;
  };
  acolhido: {
    nome: string;
    cpf: string;
    endereco: string;
    numero: string;
    bairro: string;
    cidade: string;
  };
  tratamento: {
    prazo_dias: string;
    valor_total: string;
    valor_entrada: string;
    num_parcelas: string; // string so it can represent blank or value
    valor_parcela: string;
  };
  questionario: {
    q1: string;
    q2: string;
    q3: string;
    q4: string;
    q5: string;
    q6: string;
    q7: string;
  };
  data_assinatura: string;
}

export const initialContractData: ContractData = {
  contratante: { nome: '', rg: '', cpf: '', endereco: '', numero: '', bairro: '', cidade: '', grau_parentesco: '' },
  acolhido: { nome: '', cpf: '', endereco: '', numero: '', bairro: '', cidade: '' },
  tratamento: { prazo_dias: '180', valor_total: '', valor_entrada: '', num_parcelas: '', valor_parcela: '' },
  questionario: { q1: '', q2: '', q3: '', q4: '', q5: '', q6: '', q7: '' },
  data_assinatura: new Date().toISOString().split('T')[0]
};
