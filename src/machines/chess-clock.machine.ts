import { setup } from "xstate";

import type { ChessClockContext, ChessClockEvent, ChessClockInput, ChessClockTag } from "../types";

export const chessClockMachine = setup({
  types: {
    context: {} as ChessClockContext,
    events: {} as ChessClockEvent,
    input: {} as ChessClockInput,
    tags: {} as ChessClockTag,
  },
  guards: {},
  actions: {},
  actors: {},
}).createMachine({
  id: 'zeitnot',
  context: ({ input }) => ({ /* TO-DO */ }),
  initial: 'idle',
  states: {
    idle: {},
  },
});