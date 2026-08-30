import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

const historyEntries = {
  bulletin: {
    keyDate: "1945–1967",
    statement:
      "The Observatory Chronometer Database identifies a Neuchâtel Bulletin de Marche with a mechanical wristwatch movement that passed the observatory competition.",
  },
  database: {
    keyDate: "1945–1967",
    statement:
      "The Observatory Chronometer Database covers the certified mechanical wristwatch entries submitted to the Neuchâtel observatory competition from 1945 through 1967.",
  },
  kewWatches: {
    keyDate: "late nineteenth century",
    statement:
      "Kew reports record formal watch trials with score classes and published daily-rate results; the report vocabulary and entry totals varied by period.",
  },
  kewTimeline: {
    keyDate: "1766–1915",
    statement:
      "Royal Observatory Greenwich records trial activity from H4 in 1766 and preserves published watch and chronometer rate records through 1915.",
  },
  neuchatelTrials: {
    keyDate: "1945–1967",
    statement:
      "The Neuchâtel competition tested submitted mechanical wristwatch movements under observatory competition rules before issuing certificates to qualifying entries.",
  },
  scopeCaution: {
    keyDate: "terminology",
    statement:
      "An observatory-trial Bulletin de Marche is a historical document and should not be treated as interchangeable with a modern COSC certificate.",
  },
} as const;

export type ObservatoryTrialHistoryFocus = keyof typeof historyEntries;

export type ObservatoryTrialHistoryInput = {
  readonly historyFocus: ObservatoryTrialHistoryFocus;
};

export type ObservatoryTrialHistoryOutput = {
  readonly historyFocus: ObservatoryTrialHistoryFocus;
  readonly keyDate: string;
  readonly verifiedStatement: string;
};

export const lookupObservatoryTrialHistory = (
  input: ObservatoryTrialHistoryInput,
): ObservatoryTrialHistoryOutput => {
  const entry = historyEntries[input.historyFocus];
  if (entry === undefined)
    simpleError(
      "historyFocus",
      "Observatory trial history focus is not supported.",
      "unsupported_history_focus",
    );
  return {
    historyFocus: input.historyFocus,
    keyDate: entry.keyDate,
    verifiedStatement: entry.statement,
  };
};

export const observatoryTrialHistoryExample = {
  input: { historyFocus: "kewTimeline" },
  output: {
    historyFocus: "kewTimeline",
    keyDate: "1766–1915",
    verifiedStatement:
      "Royal Observatory Greenwich records trial activity from H4 in 1766 and preserves published watch and chronometer rate records through 1915.",
  },
} satisfies ToolExample<
  ObservatoryTrialHistoryInput,
  ObservatoryTrialHistoryOutput
>;

export const observatoryTrialHistoryTool = createSimpleTool({
  calculate: (input) =>
    lookupObservatoryTrialHistory({
      historyFocus: input.historyFocus as ObservatoryTrialHistoryFocus,
    }),
  description:
    "Return a sourced Kew or Neuchâtel observatory-trial, certificate, database, or terminology fact.",
  id: "horology/observatory-trials-certificates-history-lookup",
  inputs: [
    {
      enum: [
        "kewTimeline",
        "kewWatches",
        "neuchatelTrials",
        "bulletin",
        "database",
        "scopeCaution",
      ],
      id: "historyFocus",
      kind: "string",
      label: "Observatory trial history focus",
    },
  ],
  outputs: [
    {
      id: "historyFocus",
      kind: "string",
      label: "Observatory trial history focus",
    },
    { id: "keyDate", kind: "string", label: "Key date or category" },
    {
      id: "verifiedStatement",
      kind: "string",
      label: "Verified observatory-trial statement",
    },
  ],
  title: "Observatory Trials Certificates History Lookup",
});

export const runObservatoryTrialHistory = observatoryTrialHistoryTool.execute;
export default observatoryTrialHistoryTool;
