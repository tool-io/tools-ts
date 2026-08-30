import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

const historyEntries = {
  contact: {
    fact: "Cylinder escapements are frictional-rest escapements: the escape tooth remains in sliding contact with the cylinder during part of the balance cycle.",
    keyDate: "mechanism",
  },
  history: {
    fact: "Britannica records a 1695 patent associated with Edward Barlow, William Houghton, and Thomas Tompion, followed by George Graham's later refinement.",
    keyDate: "1695",
  },
  limitation: {
    fact: "Continuous frictional rest increases wear and was a reason cylinder escapement movements required frequent cleaning.",
    keyDate: "service implication",
  },
  performance: {
    fact: "Detached escapements generally improved on cylinder behavior by freeing the oscillator from continuous contact for much of its cycle.",
    keyDate: "comparison",
  },
} as const;

export type CylinderHistoryFocus = keyof typeof historyEntries;

export type CylinderHistoryInput = {
  readonly historyFocus: CylinderHistoryFocus;
};

export type CylinderHistoryOutput = {
  readonly fact: string;
  readonly historyFocus: CylinderHistoryFocus;
  readonly keyDate: string;
};

export const lookupCylinderEscapementHistory = (
  input: CylinderHistoryInput,
): CylinderHistoryOutput => {
  const entry = historyEntries[input.historyFocus];
  if (entry === undefined)
    simpleError(
      "historyFocus",
      "History focus is not supported.",
      "unsupported_history_focus",
    );
  return {
    fact: entry.fact,
    historyFocus: input.historyFocus,
    keyDate: entry.keyDate,
  };
};

export const cylinderHistoryExample = {
  input: { historyFocus: "history" },
  output: {
    fact: "Britannica records a 1695 patent associated with Edward Barlow, William Houghton, and Thomas Tompion, followed by George Graham's later refinement.",
    historyFocus: "history",
    keyDate: "1695",
  },
} satisfies ToolExample<CylinderHistoryInput, CylinderHistoryOutput>;

export const cylinderHistoryTool = createSimpleTool({
  calculate: (input) =>
    lookupCylinderEscapementHistory({
      historyFocus: input.historyFocus as CylinderHistoryFocus,
    }),
  description:
    "Return a sourced history, contact-mode, performance, or service fact about the cylinder escapement.",
  id: "horology/cylinder-escapement-frictional-rest-history-lookup",
  inputs: [
    {
      enum: ["history", "contact", "performance", "limitation"],
      id: "historyFocus",
      kind: "string",
      label: "Cylinder escapement history focus",
    },
  ],
  outputs: [
    { id: "fact", kind: "string", label: "Verified escapement fact" },
    {
      id: "historyFocus",
      kind: "string",
      label: "Cylinder escapement history focus",
    },
    { id: "keyDate", kind: "string", label: "Key date or category" },
  ],
  title: "Cylinder Escapement Frictional Rest History Lookup",
});

export const runCylinderHistory = cylinderHistoryTool.execute;
export default cylinderHistoryTool;
