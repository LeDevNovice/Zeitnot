import { assign, fromCallback, setup } from "xstate";

import type { ChessClockContext, ChessClockEvent, ChessClockInput, ChessClockTag, PlayerId, PlayerState, TimeControlConfig } from "../types";
import { DEFAULT_CONFIG, TICK_INTERVAL } from "../utils/constants";

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

function getActivePlayer(ctx: ChessClockContext): PlayerState {
  return ctx.activePlayer === 'A' ? ctx.playerA : ctx.playerB;
}

function activeKey(ctx: ChessClockContext): 'playerA' | 'playerB' {
  return ctx.activePlayer === 'A' ? 'playerA' : 'playerB';
}

function isTimeExhausted(player: PlayerState, mode: string): boolean {
  if (mode === 'byoyomi') {
    return player.timeRemaining <= 0
      && player.periodsRemaining <= 0
      && player.periodTimeRemaining <= 0;
  }
  return player.timeRemaining <= 0;
}

const tickActor = fromCallback<ChessClockEvent>(({ sendBack }) => {
  const interval = setInterval(() => {
    sendBack({ type: 'TICK', now: performance.now() });
  }, TICK_INTERVAL);

  return () => {
    clearInterval(interval);
  };
});

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
    isTimeUp: ({ context }) => {
      return isTimeExhausted(getActivePlayer(context), context.config.mode);
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
    
    startTurn: assign(({ context }) => {
      const now = performance.now();
      return {
        lastTickAt: now,
        [activeKey(context)]: {
          ...getActivePlayer(context),
          turnStartedAt: now,
        },
      };
    }),

    resetClock: assign(({ context }) => ({
      playerA: createPlayerState(context.config),
      playerB: createPlayerState(context.config),
      activePlayer: 'A' as PlayerId,
      winner: null,
      isLowTime: false,
      lastTickAt: 0,
    })),

    processTick: assign(({ context, event }) => {
      if (event.type !== 'TICK') return {};
      const delta = event.now - context.lastTickAt;
      const player = { ...getActivePlayer(context) };
      player.timeRemaining = Math.max(0, player.timeRemaining - delta);
      if (player.timeRemaining <= 0) player.isFlagged = true;
      return { lastTickAt: event.now, [activeKey(context)]: player };
    }),

    setFlag: assign(({ context }) => {
      const key = activeKey(context);
      const player: PlayerState = { ...getActivePlayer(context) };

      (player as any).isFlagged = true;
      (player as any).timeRemaining = 0;

      const winner: PlayerId = context.activePlayer === 'A' ? 'B' : 'A';

      return {
        [key]: player,
        winner,
      };
    }),
  },
  actors: {
    tickActor,
  },
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
    ready: {
      on: {
        PRESS_CLOCK: { target: 'playing', actions: 'startTurn' },
        CONFIGURE: { target: 'configuring', actions: 'applyConfig' },
        RESET: { target: 'idle', actions: 'resetClock' },
      }
    },
    playing: {
      invoke: {
        id: 'ticker',
        src: 'tickActor',
      },
      on: {
        TICK: [
          {
            guard: 'isTimeUp',
            target: 'flagged',
            actions: ['processTick', 'setFlag'],
          },
          {
            actions: 'processTick',
          },
        ],
      }
    },
    flagged: {
      tags: ['flagged'],
      on: { RESET: { target: 'idle', actions: 'resetClock' } },
    }
  }
});