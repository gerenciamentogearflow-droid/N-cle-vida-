export function formatDate(dateStr: string): string {
  if (!dateStr) return '___ de _____________________ de 20____';
  
  const [year, month, day] = dateStr.split('-');
  const months = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  return `${day} de ${months[parseInt(month, 10) - 1]} de ${year}`;
}
