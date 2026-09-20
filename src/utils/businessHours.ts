export interface BusinessStatus {
  isOpen: boolean;
  statusText: 'Aberto agora' | 'Fechado agora';
  detailText: string; // e.g., "Abre hoje às 16:00", "Fecha às 11:00", "Abre terça às 07:30"
  fullText: string;   // e.g., "Fechado • Abre hoje às 16:00"
  colorClass: string;
}

/**
 * Recanto 7 Operating Hours:
 * - Segunda: Fechado
 * - Terça: 07:30 às 11:00
 * - Quarta a Sábado: 07:30 às 11:00 e 16:00 às 20:00
 * - Domingo: 07:30 às 11:00
 */
export function getRecantoStatus(currentDate: Date = new Date()): BusinessStatus {
  // Use local time
  const day = currentDate.getDay(); // 0 = Domingo, 1 = Segunda, 2 = Terça, 3 = Quarta, 4 = Quinta, 5 = Sexta, 6 = Sábado
  const hours = currentDate.getHours();
  const minutes = currentDate.getMinutes();
  const currentTotalMinutes = hours * 60 + minutes;

  const minMorningOpen = 7 * 60 + 30; // 07:30 -> 450
  const minMorningClose = 11 * 60;     // 11:00 -> 660
  const minAfternoonOpen = 16 * 60;    // 16:00 -> 960
  const minAfternoonClose = 20 * 60;   // 20:00 -> 1200

  // Domingo (0)
  if (day === 0) {
    if (currentTotalMinutes < minMorningOpen) {
      return {
        isOpen: false,
        statusText: 'Fechado agora',
        detailText: 'Abre hoje às 07:30',
        fullText: 'Fechado • Abre hoje às 07:30',
        colorClass: 'bg-amber-100 text-amber-900 border-amber-300',
      };
    }
    if (currentTotalMinutes >= minMorningOpen && currentTotalMinutes < minMorningClose) {
      return {
        isOpen: true,
        statusText: 'Aberto agora',
        detailText: 'Fecha às 11:00',
        fullText: 'Aberto agora • Fecha às 11:00',
        colorClass: 'bg-emerald-100 text-emerald-900 border-emerald-300',
      };
    }
    // After 11:00 on Sunday -> Monday closed, opens Tuesday 07:30
    return {
      isOpen: false,
      statusText: 'Fechado agora',
      detailText: 'Abre terça-feira às 07:30',
      fullText: 'Fechado • Abre terça às 07:30',
      colorClass: 'bg-stone-100 text-stone-700 border-stone-300',
    };
  }

  // Segunda-feira (1): Fechado o dia todo
  if (day === 1) {
    return {
      isOpen: false,
      statusText: 'Fechado agora',
      detailText: 'Abre terça-feira às 07:30',
      fullText: 'Fechado • Abre terça às 07:30',
      colorClass: 'bg-stone-100 text-stone-700 border-stone-300',
    };
  }

  // Terça-feira (2): 07:30 às 11:00
  if (day === 2) {
    if (currentTotalMinutes < minMorningOpen) {
      return {
        isOpen: false,
        statusText: 'Fechado agora',
        detailText: 'Abre hoje às 07:30',
        fullText: 'Fechado • Abre hoje às 07:30',
        colorClass: 'bg-amber-100 text-amber-900 border-amber-300',
      };
    }
    if (currentTotalMinutes >= minMorningOpen && currentTotalMinutes < minMorningClose) {
      return {
        isOpen: true,
        statusText: 'Aberto agora',
        detailText: 'Fecha às 11:00',
        fullText: 'Aberto agora • Fecha às 11:00',
        colorClass: 'bg-emerald-100 text-emerald-900 border-emerald-300',
      };
    }
    // After 11:00 on Tuesday -> opens Wednesday 07:30
    return {
      isOpen: false,
      statusText: 'Fechado agora',
      detailText: 'Abre quarta-feira às 07:30',
      fullText: 'Fechado • Abre quarta às 07:30',
      colorClass: 'bg-stone-100 text-stone-700 border-stone-300',
    };
  }

  // Quarta (3), Quinta (4), Sexta (5), Sábado (6)
  if (day >= 3 && day <= 6) {
    if (currentTotalMinutes < minMorningOpen) {
      return {
        isOpen: false,
        statusText: 'Fechado agora',
        detailText: 'Abre hoje às 07:30',
        fullText: 'Fechado • Abre hoje às 07:30',
        colorClass: 'bg-amber-100 text-amber-900 border-amber-300',
      };
    }
    if (currentTotalMinutes >= minMorningOpen && currentTotalMinutes < minMorningClose) {
      return {
        isOpen: true,
        statusText: 'Aberto agora',
        detailText: 'Fecha às 11:00 (reabre às 16:00)',
        fullText: 'Aberto agora • Fecha às 11:00',
        colorClass: 'bg-emerald-100 text-emerald-900 border-emerald-300',
      };
    }
    if (currentTotalMinutes >= minMorningClose && currentTotalMinutes < minAfternoonOpen) {
      return {
        isOpen: false,
        statusText: 'Fechado agora',
        detailText: 'Abre hoje às 16:00',
        fullText: 'Fechado • Abre hoje às 16:00',
        colorClass: 'bg-amber-100 text-amber-900 border-amber-300',
      };
    }
    if (currentTotalMinutes >= minAfternoonOpen && currentTotalMinutes < minAfternoonClose) {
      return {
        isOpen: true,
        statusText: 'Aberto agora',
        detailText: 'Fecha às 20:00',
        fullText: 'Aberto agora • Fecha às 20:00',
        colorClass: 'bg-emerald-100 text-emerald-900 border-emerald-300',
      };
    }
    // After 20:00
    if (day === 6) {
      // Saturday after 20:00 -> opens Sunday 07:30
      return {
        isOpen: false,
        statusText: 'Fechado agora',
        detailText: 'Abre domingo às 07:30',
        fullText: 'Fechado • Abre domingo às 07:30',
        colorClass: 'bg-stone-100 text-stone-700 border-stone-300',
      };
    }
    // Wed, Thu, Fri after 20:00 -> opens tomorrow 07:30
    return {
      isOpen: false,
      statusText: 'Fechado agora',
      detailText: 'Abre amanhã às 07:30',
      fullText: 'Fechado • Abre amanhã às 07:30',
      colorClass: 'bg-stone-100 text-stone-700 border-stone-300',
    };
  }

  // Fallback
  return {
    isOpen: false,
    statusText: 'Fechado agora',
    detailText: 'Consulte horários da semana',
    fullText: 'Fechado agora',
    colorClass: 'bg-stone-100 text-stone-700 border-stone-300',
  };
}
