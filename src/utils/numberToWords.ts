export function numberToWordsPTBR(numero: number): string {
  if (numero === 0) return 'zero reais';

  const unidades = ['', 'um', 'dois', 'três', 'quatro', 'cinco', 'seis', 'sete', 'oito', 'nove'];
  const dezenas10 = ['dez', 'onze', 'doze', 'treze', 'quatorze', 'quinze', 'dezesseis', 'dezessete', 'dezoito', 'dezenove'];
  const dezenas = ['', 'dez', 'vinte', 'trinta', 'quarenta', 'cinquenta', 'sessenta', 'setenta', 'oitenta', 'noventa'];
  const centenas = ['', 'cento', 'duzentos', 'trezentos', 'quatrocentos', 'quinhentos', 'seiscentos', 'setecentos', 'oitocentos', 'novecentos'];

  // Handle up to millions
  const getGroupText = (num: number): string => {
    if (num === 0) return '';
    if (num === 100) return 'cem';

    let parts = [];
    const c = Math.floor(num / 100);
    const d = Math.floor((num % 100) / 10);
    const u = num % 10;

    if (c > 0) parts.push(centenas[c]);

    if (d === 1) {
      parts.push(dezenas10[u]);
    } else {
      if (d > 1) parts.push(dezenas[d]);
      if (u > 0) parts.push(unidades[u]);
    }

    return parts.join(' e ');
  };

  const formater = new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const [inteiroStr, decimalStr] = formater.format(numero).split('.');
  
  const inteiroInteiro = parseInt(inteiroStr.replace(/,/g, ''), 10);
  const decimal = parseInt(decimalStr || '0', 10);

  let extenso = '';

  if (inteiroInteiro > 0) {
    const milhoes = Math.floor(inteiroInteiro / 1000000);
    const milhares = Math.floor((inteiroInteiro % 1000000) / 1000);
    const rest = inteiroInteiro % 1000;

    let parts = [];
    if (milhoes > 0) {
      parts.push(getGroupText(milhoes) + (milhoes === 1 ? ' milhão' : ' milhões'));
    }
    if (milhares > 0) {
      parts.push(getGroupText(milhares) + ' mil');
    }
    if (rest > 0) {
      if (parts.length > 0 && rest < 100) {
        parts.push('e ' + getGroupText(rest));
      } else if (parts.length > 0 && rest % 100 === 0) {
         parts.push('e ' + getGroupText(rest));
      } else {
        parts.push(getGroupText(rest));
      }
    }

    extenso = parts.join(parts.length > 1 && rest > 0 && rest < 100 ? ' e ' : ', ').replace(/, e /g, ' e ');
    
    // adjust for "mil e"
    if (parts.length > 1 && parts[parts.length - 2].endsWith('mil') && rest > 0 && rest < 100) {
       // already handled via 'e' insertion logic above
    }

    extenso += inteiroInteiro === 1 ? ' real' : ' reais';
  }

  if (decimal > 0) {
    const centavosText = getGroupText(decimal) + (decimal === 1 ? ' centavo' : ' centavos');
    extenso += (inteiroInteiro > 0 ? ' e ' : '') + centavosText;
  }

  return extenso.trim();
}
