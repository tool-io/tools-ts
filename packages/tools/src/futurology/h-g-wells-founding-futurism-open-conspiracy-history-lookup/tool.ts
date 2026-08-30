import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

const wellsHistory = {
  caution:
    "Historical influence does not establish that later technological or social patterns were correctly anticipated.",
  legacy:
    "The work helped establish speculative fiction as a way to examine institutions, technologies, and possible futures.",
  openConspiracy:
    "The recurring conflict between openness and organized control remains a useful lens for studying power and information.",
  practice:
    "Use speculative scenarios to reveal assumptions and consequences, then test them against evidence rather than treating fiction as prediction.",
} as const;

export type WellsHistoryFocus = keyof typeof wellsHistory;

export type WellsHistoryInput = {
  readonly focus: WellsHistoryFocus;
};

export type WellsHistoryOutput = {
  readonly focus: WellsHistoryFocus;
  readonly historyEntry: string;
};

export const lookupHgWellsFoundingFuturism = (
  input: WellsHistoryInput,
): WellsHistoryOutput => ({
  focus: input.focus,
  historyEntry: wellsHistory[input.focus],
});

export const hgWellsFoundingFuturismExample = {
  input: { focus: "openConspiracy" },
  output: {
    focus: "openConspiracy",
    historyEntry:
      "The recurring conflict between openness and organized control remains a useful lens for studying power and information.",
  },
} satisfies ToolExample<WellsHistoryInput, WellsHistoryOutput>;

export const hgWellsFoundingFuturismTool = createSimpleTool({
  calculate: (input) =>
    lookupHgWellsFoundingFuturism({ focus: input.focus as WellsHistoryFocus }),
  description:
    "Look up a concise historical, practice, legacy, or verification entry about H. G. Wells as an early futurist.",
  id: "futurology/h-g-wells-founding-futurism-open-conspiracy-history-lookup",
  inputs: [
    {
      enum: ["practice", "openConspiracy", "legacy", "caution"],
      id: "focus",
      kind: "string",
      label: "History focus",
    },
  ],
  outputs: [
    { id: "focus", kind: "string", label: "History focus" },
    { id: "historyEntry", kind: "string", label: "Futurism history entry" },
  ],
  title: "H G Wells Founding Futurism Open Conspiracy History Lookup",
});

export const runHgWellsFoundingFuturism = hgWellsFoundingFuturismTool.execute;
export default hgWellsFoundingFuturismTool;
