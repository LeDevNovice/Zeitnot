export type GamePhase =
  | 'idle'
  | 'configuring'
  | 'ready'
  | 'playing'
  | 'paused'
  | 'flagged'
  | 'ended';

export type PlayerId = 'A' | 'B';

export interface PlayerState {
  readonly timeRemaining: number;
  readonly movesPlayed: number;
  readonly turnStartedAt: number;
  readonly periodsRemaining: number;
  readonly periodTimeRemaining: number;
  readonly isFlagged: boolean;
}

export type ChessClockEvent =
  | { type: 'CONFIGURE'; config: TimeControlConfig }
  | { type: 'START' }
  | { type: 'PRESS_CLOCK' }
  | { type: 'PAUSE' }
  | { type: 'RESUME' }
  | { type: 'TICK'; now: number }
  | { type: 'FLAG'; player: PlayerId }
  | { type: 'RESET' };

export interface ChessClockContext {
  readonly config: TimeControlConfig;
  readonly activePlayer: PlayerId;
  readonly playerA: PlayerState;
  readonly playerB: PlayerState;
  readonly lastTickAt: number;
  readonly isLowTime: boolean;
  readonly lowTimeThreshold: number;
  readonly winner: PlayerId | null;
}

export interface ChessClockInput {
  config?: Partial<TimeControlConfig>;
  lowTimeThreshold?: number;
}

export type ChessClockTag =
  | 'active'
  | 'lowTime'
  | 'flagged'
  | 'paused'
  | 'configuring';

export type TimeControlMode =
  | 'sudden_death'
  | 'fischer'
  | 'bronstein'
  | 'byoyomi'
  | 'hourglass';

export interface TimeControlConfig {
  readonly mode: TimeControlMode;
  readonly initialTime: number;
  readonly increment: number;
  readonly byoyomiPeriodTime: number;
  readonly byoyomiPeriods: number;
}

export interface UITimeControlInfo {
  readonly label: string;
  readonly description: string;
  readonly icon: string;
}

export interface UIPreset {
  readonly name: string;
  readonly config: TimeControlConfig;
}