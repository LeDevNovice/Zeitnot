import type { TimeControlConfig, TimeControlMode, UIPreset, UITimeControlInfo } from "../types";

export const TICK_INTERVAL = 100;
export const DEFAULT_LOW_TIME_THRESHOLD = 30_000;

export const DEFAULT_CONFIG: TimeControlConfig = {
  mode: 'fischer',
  initialTime: 5 * 60_000,
  increment: 3_000,
  byoyomiPeriodTime: 30_000,
  byoyomiPeriods: 3,
};

export const TIME_CONTROL_MODES: Record<TimeControlMode, UITimeControlInfo> = {
  sudden_death: {
    label: 'Sudden Death',
    description: 'Temps fixe, pas d\'incrément',
    icon: '⚔️',
  },
  fischer: {
    label: 'Fischer',
    description: '+X secondes par coup joué',
    icon: '♔',
  },
  bronstein: {
    label: 'Bronstein',
    description: 'Récupère le temps dépensé (plafonné)',
    icon: '⏱️',
  },
  byoyomi: {
    label: 'Byoyomi',
    description: 'Périodes de temps renouvelables (Go)',
    icon: '⛩️',
  },
  hourglass: {
    label: 'Hourglass',
    description: 'Ton temps perdu va à l\'adversaire',
    icon: '⏳',
  },
};

export const PRESETS: readonly UIPreset[] = [
  {
    name: 'Bullet 1+0',
    config: {
      mode: 'sudden_death',
      initialTime: 60_000,
      increment: 0,
      byoyomiPeriodTime: 0,
      byoyomiPeriods: 0,
    },
  },
  {
    name: 'Blitz 3+2',
    config: {
      mode: 'fischer',
      initialTime: 3 * 60_000,
      increment: 2_000,
      byoyomiPeriodTime: 0,
      byoyomiPeriods: 0,
    },
  },
  {
    name: 'Blitz 5+3',
    config: {
      mode: 'fischer',
      initialTime: 5 * 60_000,
      increment: 3_000,
      byoyomiPeriodTime: 0,
      byoyomiPeriods: 0,
    },
  },
  {
    name: 'Rapid 10+5',
    config: {
      mode: 'fischer',
      initialTime: 10 * 60_000,
      increment: 5_000,
      byoyomiPeriodTime: 0,
      byoyomiPeriods: 0,
    },
  },
  {
    name: 'Rapid 15+10',
    config: {
      mode: 'fischer',
      initialTime: 15 * 60_000,
      increment: 10_000,
      byoyomiPeriodTime: 0,
      byoyomiPeriods: 0,
    },
  },
  {
    name: 'Classical 90+30',
    config: {
      mode: 'fischer',
      initialTime: 90 * 60_000,
      increment: 30_000,
      byoyomiPeriodTime: 0,
      byoyomiPeriods: 0,
    },
  },
  {
    name: 'Bronstein 5+5',
    config: {
      mode: 'bronstein',
      initialTime: 5 * 60_000,
      increment: 5_000,
      byoyomiPeriodTime: 0,
      byoyomiPeriods: 0,
    },
  },
  {
    name: 'Byoyomi 10m+3×30s',
    config: {
      mode: 'byoyomi',
      initialTime: 10 * 60_000,
      increment: 0,
      byoyomiPeriodTime: 30_000,
      byoyomiPeriods: 3,
    },
  },
  {
    name: 'Hourglass 5min',
    config: {
      mode: 'hourglass',
      initialTime: 5 * 60_000,
      increment: 0,
      byoyomiPeriodTime: 0,
      byoyomiPeriods: 0,
    },
  },
] as const;

export const CONFIG_LIMITS = {
  time: { min: 0.5, max: 180, step: 0.5 },    // en minutes
  increment: { min: 0, max: 60, step: 1 },      // en secondes
  byoyomiPeriods: { min: 1, max: 10, step: 1 },
  byoyomiTime: { min: 5, max: 120, step: 5 },   // en secondes
} as const;