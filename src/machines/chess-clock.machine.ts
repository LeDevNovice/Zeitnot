import { assign, setup } from "xstate";

import type { ChessClockContext, ChessClockEvent, ChessClockInput, ChessClockTag, PlayerId, PlayerState, TimeControlConfig } from "../types";
import { DEFAULT_CONFIG } from "../utils/constants";

function createPlayerState(config: TimeControlConfig): PlayerState {
  return {
    timeRemaining: config.initialTime,
    movesPlayed: 0,
    turnStartedAt: 0,
    periodsRemaining: config.mode === 'byoyomi' ? config.byoyomiPeriods : 0,
    periodTimeRemaining: config.mode === 'byoyomi' ? config.byoyomiPeriodTime : 0,
    isFlagged: false,
  };
}

export const chessClockMachine = setup({
  types: {
    context: {} as ChessClockContext,
    events: {} as ChessClockEvent,
    input: {} as ChessClockInput,
    tags: {} as ChessClockTag,
  },
  guards: {
    isConfigValid: ({ context }) => {
      return context.config.initialTime > 0;
    },
  },
  actions: {
    applyConfig: assign(({ event }) => {
      if (event.type !== 'CONFIGURE') return {};

      const config: TimeControlConfig = { ...DEFAULT_CONFIG, ...event.config };
      return {
        config,
        playerA: createPlayerState(config),
        playerB: createPlayerState(config),
        winner: null,
        activePlayer: 'A' as PlayerId,
      };
    }),  
  },
  actors: {},
}).createMachine({
  id: 'zeitnot',
  context: ({ input }) => ({ /* TO-DO */ }),
  initial: 'idle',
  states: {
    idle: {
      on: {
        CONFIGURE: { target: 'configuring', actions: 'applyConfig' }
      }
    },
    configuring: {
      tags: ['configuring'],
      on: {
        CONFIGURE: { actions: 'applyConfig' },
        START: { target: 'ready', guard: 'isConfigValid' },
        RESET: { target: 'idle' },
      }
    },
  }
});