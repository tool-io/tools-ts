import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

const focusEntries = {
  attribution: {
    keyDate: "1976",
    statement:
      "George Daniels is credited with presenting the co-axial escapement in 1976.",
  },
  mechanism: {
    keyDate: "EP0018796",
    statement:
      "The documented mechanism is a co-axial lever escapement described in George Daniels's European patent family.",
  },
  patent: {
    keyDate: "1980-11-12",
    statement:
      "European patent application EP0018796A2, naming George Daniels as inventor, was published on 12 November 1980.",
  },
  serialProduction: {
    keyDate: "1996 / 1999",
    statement:
      "Fondation Haute Horlogerie records ETA series-production integration in 1996 and Omega adoption in 1999.",
  },
} as const;

export type CoAxialHistoryFocus = keyof typeof focusEntries;

export type CoAxialHistoryInput = {
  readonly historyFocus: CoAxialHistoryFocus;
};

export type CoAxialHistoryOutput = {
  readonly historyFocus: CoAxialHistoryFocus;
  readonly keyDate: string;
  readonly verifiedStatement: string;
};

export const lookupCoAxialDanielsHistory = (
  input: CoAxialHistoryInput,
): CoAxialHistoryOutput => {
  const entry = focusEntries[input.historyFocus];
  if (entry === undefined)
    simpleError(
      "historyFocus",
      "History focus is not supported.",
      "unsupported_history_focus",
    );
  return {
    historyFocus: input.historyFocus,
    keyDate: entry.keyDate,
    verifiedStatement: entry.statement,
  };
};

export const coAxialHistoryExample = {
  input: { historyFocus: "patent" },
  output: {
    historyFocus: "patent",
    keyDate: "1980-11-12",
    verifiedStatement:
      "European patent application EP0018796A2, naming George Daniels as inventor, was published on 12 November 1980.",
  },
} satisfies ToolExample<CoAxialHistoryInput, CoAxialHistoryOutput>;

export const coAxialHistoryTool = createSimpleTool({
  calculate: (input) =>
    lookupCoAxialDanielsHistory({
      historyFocus: input.historyFocus as CoAxialHistoryFocus,
    }),
  description:
    "Return a sourced historical fact about George Daniels's co-axial escapement attribution, patent, mechanism, or series production.",
  id: "horology/co-axial-daniels-history-lookup",
  inputs: [
    {
      enum: ["attribution", "mechanism", "patent", "serialProduction"],
      id: "historyFocus",
      kind: "string",
      label: "Co-axial history focus",
    },
  ],
  outputs: [
    { id: "historyFocus", kind: "string", label: "Co-axial history focus" },
    { id: "keyDate", kind: "string", label: "Key date or identifier" },
    {
      id: "verifiedStatement",
      kind: "string",
      label: "Verified historical statement",
    },
  ],
  title: "Co-Axial Daniels History Lookup",
});

export const runCoAxialHistory = coAxialHistoryTool.execute;
export default coAxialHistoryTool;
