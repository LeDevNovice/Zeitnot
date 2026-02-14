// timeRatio(), isInLowTime()

export function formatTime(ms: number, showTenths = false): string {
  if (ms <= 0) return showTenths ? '0:00.0' : '0:00';

  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const tenths = Math.floor((ms % 1000) / 100);

  const secStr = seconds.toString().padStart(2, '0');

  if (hours > 0) {
    const minStr = minutes.toString().padStart(2, '0');
    return `${hours}:${minStr}:${secStr}`;
  }

  const base = `${minutes}:${secStr}`;

  if (showTenths && ms < 60_000) {
    return `${base}.${tenths}`;
  }

  return base;
}

export function formatDuration(ms: number): string {
  if (ms <= 0) return '0s';

  const totalSeconds = ms / 1000;

  if (totalSeconds < 60) {
    return `${totalSeconds}s`;
  }

  const minutes = Math.floor(totalSeconds / 60);
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (hours > 0) {
    return remainingMinutes > 0 ? `${hours}h${remainingMinutes}` : `${hours}h`;
  }

  return `${minutes}min`;
}

export function formatPresetLabel(config: {
  mode: string;
  initialTime: number;
  increment: number;
  byoyomiPeriods?: number;
  byoyomiPeriodTime?: number;
}): string {
  const minutes = config.initialTime / 60_000;
  const displayMin = minutes >= 1 ? minutes.toString() : `${config.initialTime / 1000}s`;

  switch (config.mode) {
    case 'fischer':
    case 'bronstein': {
      const inc = config.increment / 1000;
      return `${displayMin}+${inc}`;
    }
    case 'byoyomi': {
      const periods = config.byoyomiPeriods ?? 0;
      const periodTime = (config.byoyomiPeriodTime ?? 0) / 1000;
      return `${displayMin}+${periods}×${periodTime}s`;
    }
    case 'sudden_death':
      return `${displayMin}+0`;
    case 'hourglass':
      return `⏳${displayMin}`;
    default:
      return displayMin;
  }
}

export function timeRatio(remaining: number, initial: number): number {
  if (initial <= 0) return 0;
  return Math.max(0, Math.min(1, remaining / initial));
}

export function isInLowTime(
  timeRemaining: number,
  threshold: number,
  mode: string,
  periodsRemaining?: number,
): boolean {
  if (mode === 'byoyomi') {
    return timeRemaining <= 0 && (periodsRemaining ?? 0) <= 1;
  }
  return timeRemaining > 0 && timeRemaining <= threshold;
}