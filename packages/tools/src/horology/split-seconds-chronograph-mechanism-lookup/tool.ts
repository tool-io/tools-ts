import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

const rattrapanteEntries = {
  history: {
    keyDate: "1923",
    statement:
      "Patek Philippe states that it created a split-seconds wrist chronograph on special order in 1923, described as the first of its kind, after receiving a rattrapante patent in 1902.",
  },
  mechanism: {
    keyDate: "operating principle",
    statement:
      "A split-seconds mechanism starts two superimposed chronograph hands together, can stop one independently, and allows that hand to catch up with the continuing hand.",
  },
  reset: {
    keyDate: "reset stage",
    statement:
      "After intermediate times are recorded, the split hand is resynchronized and the chronograph mechanism is reset through its designated control sequence.",
  },
  resynchronization: {
    keyDate: "catch-up stage",
    statement:
      "Reactivating the rattrapante control releases the stopped split-seconds hand so it catches up with the still-running chronograph hand.",
  },
  startAndStop: {
    keyDate: "timing stage",
    statement:
      "The chronograph control starts both hands; the split control stops the split hand at an intermediate event while the main chronograph hand continues.",
  },
  useCase: {
    keyDate: "comparative timing",
    statement:
      "The split-seconds complication records intermediate event times from one common start, such as lap times, without stopping the total elapsed-time hand.",
  },
} as const;

export type RattrapanteFocus = keyof typeof rattrapanteEntries;

export type RattrapanteLookupInput = {
  readonly mechanismFocus: RattrapanteFocus;
};

export type RattrapanteLookupOutput = {
  readonly keyDate: string;
  readonly mechanismFocus: RattrapanteFocus;
  readonly verifiedStatement: string;
};

export const lookupSplitSecondsMechanism = (
  input: RattrapanteLookupInput,
): RattrapanteLookupOutput => {
  const entry = rattrapanteEntries[input.mechanismFocus];
  if (entry === undefined)
    simpleError(
      "mechanismFocus",
      "Split-seconds mechanism focus is not supported.",
      "unsupported_mechanism_focus",
    );
  return {
    keyDate: entry.keyDate,
    mechanismFocus: input.mechanismFocus,
    verifiedStatement: entry.statement,
  };
};

export const rattrapanteExample = {
  input: { mechanismFocus: "resynchronization" },
  output: {
    keyDate: "catch-up stage",
    mechanismFocus: "resynchronization",
    verifiedStatement:
      "Reactivating the rattrapante control releases the stopped split-seconds hand so it catches up with the still-running chronograph hand.",
  },
} satisfies ToolExample<RattrapanteLookupInput, RattrapanteLookupOutput>;

export const rattrapanteTool = createSimpleTool({
  calculate: (input) =>
    lookupSplitSecondsMechanism({
      mechanismFocus: input.mechanismFocus as RattrapanteFocus,
    }),
  description:
    "Return the purpose, start, split stop, catch-up, reset, mechanism, or documented history of a split-seconds rattrapante chronograph.",
  id: "horology/split-seconds-chronograph-mechanism-lookup",
  inputs: [
    {
      enum: [
        "useCase",
        "startAndStop",
        "resynchronization",
        "reset",
        "mechanism",
        "history",
      ],
      id: "mechanismFocus",
      kind: "string",
      label: "Split-seconds chronograph mechanism focus",
    },
  ],
  outputs: [
    { id: "keyDate", kind: "string", label: "Key date or operating stage" },
    {
      id: "mechanismFocus",
      kind: "string",
      label: "Split-seconds chronograph mechanism focus",
    },
    {
      id: "verifiedStatement",
      kind: "string",
      label: "Verified rattrapante statement",
    },
  ],
  title: "Split Seconds Chronograph Mechanism Lookup",
});

export const runRattrapante = rattrapanteTool.execute;
export default rattrapanteTool;
