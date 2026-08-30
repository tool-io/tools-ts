import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

const betaEntries = {
  consortium: {
    keyDate: "1962",
    statement:
      "CSEM records that the Centre Electronique Horloger was founded with a consortium of twenty Swiss watch manufacturers to develop electronic watches.",
  },
  industrialLaunch: {
    keyDate: "1970 Basel Watch Fair",
    statement:
      "ETA states that the industrial Beta 21 caliber was presented at the 1970 Basel Watch Fair.",
  },
  productionVolume: {
    keyDate: "historical context",
    statement:
      "FHH reports that only about 6,000 Beta 21 calibers were produced before thinner, more efficient movements displaced it.",
  },
  prototypes: {
    keyDate: "1967",
    statement:
      "ETA and CSEM record that CEH prototypes Beta 1 and Beta 2 were presented in 1967, after quartz was selected for the electronic-watch program.",
  },
  sharedDevelopment: {
    keyDate: "consortium program",
    statement:
      "Beta 21 was a Swiss industry response to quartz timekeeping, developed through shared electronic-horology work rather than by one brand in isolation.",
  },
} as const;

export type Beta21HistoryFocus = keyof typeof betaEntries;

export type Beta21HistoryLookupInput = {
  readonly historyFocus: Beta21HistoryFocus;
};

export type Beta21HistoryLookupOutput = {
  readonly historyFocus: Beta21HistoryFocus;
  readonly keyDate: string;
  readonly verifiedStatement: string;
};

export const lookupBeta21History = (
  input: Beta21HistoryLookupInput,
): Beta21HistoryLookupOutput => {
  const entry = betaEntries[input.historyFocus];
  if (entry === undefined)
    simpleError(
      "historyFocus",
      "Beta 21 history focus is not supported.",
      "unsupported_history_focus",
    );
  return {
    historyFocus: input.historyFocus,
    keyDate: entry.keyDate,
    verifiedStatement: entry.statement,
  };
};

export const beta21HistoryExample = {
  input: { historyFocus: "consortium" },
  output: {
    historyFocus: "consortium",
    keyDate: "1962",
    verifiedStatement:
      "CSEM records that the Centre Electronique Horloger was founded with a consortium of twenty Swiss watch manufacturers to develop electronic watches.",
  },
} satisfies ToolExample<Beta21HistoryLookupInput, Beta21HistoryLookupOutput>;

export const beta21HistoryTool = createSimpleTool({
  calculate: (input) =>
    lookupBeta21History({
      historyFocus: input.historyFocus as Beta21HistoryFocus,
    }),
  description:
    "Return the official consortium, prototype, industrial-launch, production-volume, or Swiss-response history of the Beta 21 quartz caliber.",
  id: "horology/beta-21-swiss-quartz-history-lookup",
  inputs: [
    {
      enum: [
        "consortium",
        "prototypes",
        "industrialLaunch",
        "productionVolume",
        "sharedDevelopment",
      ],
      id: "historyFocus",
      kind: "string",
      label: "Beta 21 Swiss quartz history focus",
    },
  ],
  outputs: [
    {
      id: "historyFocus",
      kind: "string",
      label: "Beta 21 Swiss quartz history focus",
    },
    { id: "keyDate", kind: "string", label: "Key date or context" },
    {
      id: "verifiedStatement",
      kind: "string",
      label: "Verified Beta 21 statement",
    },
  ],
  title: "Beta 21 Swiss Quartz History Lookup",
});

export const runBeta21History = beta21HistoryTool.execute;
export default beta21HistoryTool;
