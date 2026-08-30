import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

const huygensEntries = {
  attribution: {
    keyDate: "1656",
    statement:
      "The Smithsonian records that Christiaan Huygens patented the first working pendulum clock in 1656; Galileo had earlier investigated the near-constant period of a pendulum.",
  },
  balanceSpring: {
    keyDate: "later work",
    statement:
      "The Smithsonian credits Huygens with later devising a balance spring, a separate portable-watch regulator distinct from the pendulum clock.",
  },
  invention: {
    keyDate: "1656",
    statement:
      "Huygens applied the pendulum as the regulator of a clock, converting a known physical oscillation into a practical timekeeping mechanism.",
  },
  patent: {
    keyDate: "1657",
    statement:
      "The American Physical Society dates Huygens's patent of the first pendulum clock to 16 June 1657, one year after the 1656 invention.",
  },
  seaLimitation: {
    keyDate: "historical",
    statement:
      "Sea trials showed that an ordinary pendulum clock could not maintain accurate time on a heaving ship's deck, motivating marine-chronometer alternatives.",
  },
} as const;

export type HuygensHistoryFocus = keyof typeof huygensEntries;

export type HuygensHistoryLookupInput = {
  readonly historyFocus: HuygensHistoryFocus;
};

export type HuygensHistoryLookupOutput = {
  readonly historyFocus: HuygensHistoryFocus;
  readonly keyDate: string;
  readonly verifiedStatement: string;
};

export const lookupChristiaanHuygensHistory = (
  input: HuygensHistoryLookupInput,
): HuygensHistoryLookupOutput => {
  const entry = huygensEntries[input.historyFocus];
  if (entry === undefined)
    simpleError(
      "historyFocus",
      "Christiaan Huygens history focus is not supported.",
      "unsupported_history_focus",
    );
  return {
    historyFocus: input.historyFocus,
    keyDate: entry.keyDate,
    verifiedStatement: entry.statement,
  };
};

export const huygensHistoryExample = {
  input: { historyFocus: "patent" },
  output: {
    historyFocus: "patent",
    keyDate: "1657",
    verifiedStatement:
      "The American Physical Society dates Huygens's patent of the first pendulum clock to 16 June 1657, one year after the 1656 invention.",
  },
} satisfies ToolExample<HuygensHistoryLookupInput, HuygensHistoryLookupOutput>;

export const huygensHistoryTool = createSimpleTool({
  calculate: (input) =>
    lookupChristiaanHuygensHistory({
      historyFocus: input.historyFocus as HuygensHistoryFocus,
    }),
  description:
    "Return a Smithsonian or APS-verified fact about Huygens's 1656 pendulum clock, 1657 patent, Galileo distinction, balance spring, or marine limitation.",
  id: "horology/christiaan-huygens-pendulum-history-lookup",
  inputs: [
    {
      enum: [
        "invention",
        "patent",
        "attribution",
        "balanceSpring",
        "seaLimitation",
      ],
      id: "historyFocus",
      kind: "string",
      label: "Christiaan Huygens pendulum history focus",
    },
  ],
  outputs: [
    {
      id: "historyFocus",
      kind: "string",
      label: "Christiaan Huygens pendulum history focus",
    },
    { id: "keyDate", kind: "string", label: "Key date or context" },
    {
      id: "verifiedStatement",
      kind: "string",
      label: "Verified Huygens statement",
    },
  ],
  title: "Christiaan Huygens Pendulum History Lookup",
});

export const runHuygensHistory = huygensHistoryTool.execute;
export default huygensHistoryTool;
