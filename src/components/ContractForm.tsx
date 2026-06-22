import React from 'react';
import { ContractData } from '../types';

interface Props {
  data: ContractData;
  onChange: (data: ContractData) => void;
  onPrint: () => void;
}

export function ContractForm({ data, onChange, onPrint }: Props) {
  const handleChange = (section: keyof ContractData, field: string, value: string) => {
    let finalValue = value;

    if (field === 'cpf') {
      const numeric = value.replace(/\D/g, '');
      const limited = numeric.slice(0, 11);
      if (limited.length > 0) {
        finalValue = limited.replace(/(\d{3})(\d{1,3})?(\d{1,3})?(\d{1,2})?/, (match, p1, p2, p3, p4) => {
          let res = p1;
          if (p2) res += `.${p2}`;
          if (p3) res += `.${p3}`;
          if (p4) res += `-${p4}`;
          return res;
        });
      } else {
        finalValue = '';
      }
    }

    if (field === 'rg') {
      finalValue = value.slice(0, 14);
    }

    onChange({
      ...data,
      [section]: {
        ...(data[section] as any),
        [field]: finalValue
      }
    });
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ ...data, data_assinatura: e.target.value });
  };

  return (
    <div className="space-y-8 print:hidden p-6 bg-white shadow rounded-xl">
      <div>
        <h2 className="text-xl font-bold mb-4 text-emerald-800">1. Dados do Contratante</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input type="text" placeholder="Nome Completo" value={data.contratante.nome} onChange={e => handleChange('contratante', 'nome', e.target.value)} className="input-field" />
          <input type="text" placeholder="RG (Identidade)" value={data.contratante.rg} onChange={e => handleChange('contratante', 'rg', e.target.value)} className="input-field" />
          <input type="text" inputMode="numeric" placeholder="CPF" value={data.contratante.cpf} onChange={e => handleChange('contratante', 'cpf', e.target.value)} className="input-field" />
          <input type="text" placeholder="Endereço (Rua)" value={data.contratante.endereco} onChange={e => handleChange('contratante', 'endereco', e.target.value)} className="input-field" />
          <input type="text" inputMode="numeric" placeholder="Número" value={data.contratante.numero} onChange={e => handleChange('contratante', 'numero', e.target.value)} className="input-field" />
          <input type="text" placeholder="Bairro" value={data.contratante.bairro} onChange={e => handleChange('contratante', 'bairro', e.target.value)} className="input-field" />
          <input type="text" placeholder="Cidade / Estado" value={data.contratante.cidade} onChange={e => handleChange('contratante', 'cidade', e.target.value)} className="input-field" />
          <input type="text" placeholder="Grau de Parentesco com o Acolhido" value={data.contratante.grau_parentesco} onChange={e => handleChange('contratante', 'grau_parentesco', e.target.value)} className="input-field" />
        </div>
      </div>

      <div>
        <h2 className="text-xl font-bold mb-4 text-emerald-800">2. Dados do Acolhido</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input type="text" placeholder="Nome Completo" value={data.acolhido.nome} onChange={e => handleChange('acolhido', 'nome', e.target.value)} className="input-field" />
          <input type="text" inputMode="numeric" placeholder="CPF" value={data.acolhido.cpf} onChange={e => handleChange('acolhido', 'cpf', e.target.value)} className="input-field" />
          <input type="text" placeholder="Endereço (Rua)" value={data.acolhido.endereco} onChange={e => handleChange('acolhido', 'endereco', e.target.value)} className="input-field" />
          <input type="text" inputMode="numeric" placeholder="Número" value={data.acolhido.numero} onChange={e => handleChange('acolhido', 'numero', e.target.value)} className="input-field" />
          <input type="text" placeholder="Bairro" value={data.acolhido.bairro} onChange={e => handleChange('acolhido', 'bairro', e.target.value)} className="input-field" />
          <input type="text" placeholder="Cidade / Estado" value={data.acolhido.cidade} onChange={e => handleChange('acolhido', 'cidade', e.target.value)} className="input-field" />
        </div>
      </div>

      <div>
        <h2 className="text-xl font-bold mb-4 text-emerald-800">3. Tratamento e Valores</h2>
        <p className="text-sm text-gray-500 mb-4">Se não houver entrada, deixe em branco. O número de parcelas deve ser o correspondente ao prazo (ex: 6 meses). Deixe o prazo em branco se for variável/indeterminado.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input type="text" inputMode="numeric" placeholder="Prazo do Tratamento (dias) Ex: 180" value={data.tratamento.prazo_dias} onChange={e => handleChange('tratamento', 'prazo_dias', e.target.value)} className="input-field" />
          <input type="text" inputMode="numeric" placeholder="Valor Total do Tratamento (R$)" value={data.tratamento.valor_total} onChange={e => handleChange('tratamento', 'valor_total', e.target.value)} className="input-field" />
          <input type="text" inputMode="numeric" placeholder="Valor da Entrada (R$)" value={data.tratamento.valor_entrada} onChange={e => handleChange('tratamento', 'valor_entrada', e.target.value)} className="input-field" />
          <input type="text" inputMode="numeric" placeholder="Quantidade de Parcelas (Ex: 05)" value={data.tratamento.num_parcelas} onChange={e => handleChange('tratamento', 'num_parcelas', e.target.value)} className="input-field" />
          <input type="text" inputMode="numeric" placeholder="Valor da Parcela (R$)" value={data.tratamento.valor_parcela} onChange={e => handleChange('tratamento', 'valor_parcela', e.target.value)} className="input-field" />
        </div>
      </div>

      <div>
        <h2 className="text-xl font-bold mb-4 text-emerald-800">4. Questionário (Declaração)</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">1 - O Acolhido já teve pensamentos de autoextermínio?</label>
            <input type="text" value={data.questionario.q1} onChange={e => handleChange('questionario', 'q1', e.target.value)} className="input-field w-full" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">2 - O Acolhido já teve comportamentos agressivos contra familiares ou terceiros?</label>
            <input type="text" value={data.questionario.q2} onChange={e => handleChange('questionario', 'q2', e.target.value)} className="input-field w-full" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">3 - O Acolhido já realizou autolesão não suicida?</label>
            <input type="text" value={data.questionario.q3} onChange={e => handleChange('questionario', 'q3', e.target.value)} className="input-field w-full" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">4 - O Acolhido tem alguma alergia? Se sim, qual?</label>
            <input type="text" value={data.questionario.q4} onChange={e => handleChange('questionario', 'q4', e.target.value)} className="input-field w-full" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">5 - O Acolhido já fugiu de alguma instituição?</label>
            <input type="text" value={data.questionario.q5} onChange={e => handleChange('questionario', 'q5', e.target.value)} className="input-field w-full" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">6 - O Acolhido já cometeu algum ato criminoso? Se sim, qual?</label>
            <input type="text" value={data.questionario.q6} onChange={e => handleChange('questionario', 'q6', e.target.value)} className="input-field w-full" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">7 - O Acolhido sempre cumpriu o tempo total dos tratamentos feitos anteriormente? Se não, por qual motivo?</label>
            <input type="text" value={data.questionario.q7} onChange={e => handleChange('questionario', 'q7', e.target.value)} className="input-field w-full" />
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-bold mb-4 text-emerald-800">5. Data de Assinatura</h2>
        <input type="date" value={data.data_assinatura} onChange={handleDateChange} className="input-field" />
      </div>

      <div className="pt-4 flex justify-between items-center border-t border-gray-100">
        <p className="text-sm text-gray-500">Revise os dados antes de gerar o contrato.</p>
        <button 
          onClick={onPrint}
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-3 px-6 rounded-lg transition shadow flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
          Ver / Gerar Contrato
        </button>
      </div>
    </div>
  );
}
