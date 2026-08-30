import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

const astronEntries = {
  accuracy: {
    keyDate: "1969",
    statement:
      "Seiko states that the Quartz Astron was accurate to within about plus or minus five seconds per month, roughly one hundred times the accuracy of a standard mechanical watch of the period.",
  },
  launch: {
    keyDate: "25 December 1969",
    statement:
      "Seiko states that it marketed the world's first quartz wristwatch, the Quartz Astron 35SQ, on 25 December 1969.",
  },
  name: {
    keyDate: "1969",
    statement:
      "Seiko explains that the name Astron was chosen for its connection to the space-age era and stars.",
  },
  oscillator: {
    keyDate: "caliber 35SQ",
    statement:
      "The Quartz Astron used an 8,192 Hz tuning-fork-form quartz oscillator and a stepper motor to drive the display.",
  },
  patents: {
    keyDate: "after launch",
    statement:
      "Seiko states that it opened its quartz-watch patents to the world, helping make the technology broadly available.",
  },
  prototype: {
    keyDate: "1967",
    statement:
      "Seiko states that a prototype small enough for a wristwatch was completed in 1967, followed by two years of refinement and launch preparation.",
  },
} as const;

export type AstronHistoryFocus = keyof typeof astronEntries;

export type AstronHistoryLookupInput = {
  readonly historyFocus: AstronHistoryFocus;
};

export type AstronHistoryLookupOutput = {
  readonly historyFocus: AstronHistoryFocus;
  readonly keyDate: string;
  readonly verifiedStatement: string;
};

export const lookupSeikoAstronHistory = (
  input: AstronHistoryLookupInput,
): AstronHistoryLookupOutput => {
  const entry = astronEntries[input.historyFocus];
  if (entry === undefined)
    simpleError(
      "historyFocus",
      "Seiko Astron history focus is not supported.",
      "unsupported_history_focus",
    );
  return {
    historyFocus: input.historyFocus,
    keyDate: entry.keyDate,
    verifiedStatement: entry.statement,
  };
};

export const astronHistoryExample = {
  input: { historyFocus: "launch" },
  output: {
    historyFocus: "launch",
    keyDate: "25 December 1969",
    verifiedStatement:
      "Seiko states that it marketed the world's first quartz wristwatch, the Quartz Astron 35SQ, on 25 December 1969.",
  },
} satisfies ToolExample<AstronHistoryLookupInput, AstronHistoryLookupOutput>;

export const astronHistoryTool = createSimpleTool({
  calculate: (input) =>
    lookupSeikoAstronHistory({
      historyFocus: input.historyFocus as AstronHistoryFocus,
    }),
  description:
    "Return Seiko's official prototype, launch, oscillator, accuracy, naming, or patent history for the 1969 Quartz Astron 35SQ.",
  id: "horology/seiko-astron-1969-launch-history-lookup",
  inputs: [
    {
      enum: [
        "prototype",
        "launch",
        "oscillator",
        "accuracy",
        "name",
        "patents",
      ],
      id: "historyFocus",
      kind: "string",
      label: "Seiko Astron history focus",
    },
  ],
  outputs: [
    { id: "historyFocus", kind: "string", label: "Seiko Astron history focus" },
    { id: "keyDate", kind: "string", label: "Key date or status" },
    {
      id: "verifiedStatement",
      kind: "string",
      label: "Verified Seiko Astron statement",
    },
  ],
  title: "Seiko Astron 1969 Launch History Lookup",
});

export const runAstronHistory = astronHistoryTool.execute;
export default astronHistoryTool;
