import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

const accutronEntries = {
  accuracy: {
    keyDate: "1960",
    statement:
      "Bulova states that the original Accutron was accurate to within one minute per month, a major claim in 1960.",
  },
  distinction: {
    keyDate: "technical distinction",
    statement:
      "The Accutron used a tuning fork and electronic drive rather than a mechanical balance wheel, distinguishing it from both mechanical and quartz watches.",
  },
  launch: {
    keyDate: "1960",
    statement:
      "Bulova identifies 1960 as the introduction of the Accutron, the world's first fully electronic watch.",
  },
  oscillator: {
    keyDate: "original movement",
    statement:
      "Royal Museums Greenwich describes a tiny tuning fork vibrating 360 times per second and maintained by a transistorized circuit and battery.",
  },
  spaceView: {
    keyDate: "original collection",
    statement:
      "RMG describes Spaceview versions as having a transparent dial that exposed the tuning-fork movement, originally used to demonstrate the technology and later sold as a model.",
  },
} as const;

export type AccutronHistoryFocus = keyof typeof accutronEntries;

export type AccutronHistoryLookupInput = {
  readonly historyFocus: AccutronHistoryFocus;
};

export type AccutronHistoryLookupOutput = {
  readonly historyFocus: AccutronHistoryFocus;
  readonly keyDate: string;
  readonly verifiedStatement: string;
};

export const lookupBulovaAccutronHistory = (
  input: AccutronHistoryLookupInput,
): AccutronHistoryLookupOutput => {
  const entry = accutronEntries[input.historyFocus];
  if (entry === undefined)
    simpleError(
      "historyFocus",
      "Bulova Accutron history focus is not supported.",
      "unsupported_history_focus",
    );
  return {
    historyFocus: input.historyFocus,
    keyDate: entry.keyDate,
    verifiedStatement: entry.statement,
  };
};

export const accutronHistoryExample = {
  input: { historyFocus: "oscillator" },
  output: {
    historyFocus: "oscillator",
    keyDate: "original movement",
    verifiedStatement:
      "Royal Museums Greenwich describes a tiny tuning fork vibrating 360 times per second and maintained by a transistorized circuit and battery.",
  },
} satisfies ToolExample<
  AccutronHistoryLookupInput,
  AccutronHistoryLookupOutput
>;

export const accutronHistoryTool = createSimpleTool({
  calculate: (input) =>
    lookupBulovaAccutronHistory({
      historyFocus: input.historyFocus as AccutronHistoryFocus,
    }),
  description:
    "Return Bulova or Royal Museums Greenwich facts about the 1960 Accutron launch, 360 Hz tuning fork, accuracy, distinction, and Spaceview dial.",
  id: "horology/bulova-accutron-tuning-fork-history-lookup",
  inputs: [
    {
      enum: ["launch", "oscillator", "accuracy", "distinction", "spaceView"],
      id: "historyFocus",
      kind: "string",
      label: "Bulova Accutron history focus",
    },
  ],
  outputs: [
    {
      id: "historyFocus",
      kind: "string",
      label: "Bulova Accutron history focus",
    },
    { id: "keyDate", kind: "string", label: "Key date or status" },
    {
      id: "verifiedStatement",
      kind: "string",
      label: "Verified Accutron statement",
    },
  ],
  title: "Bulova Accutron Tuning Fork History Lookup",
});

export const runAccutronHistory = accutronHistoryTool.execute;
export default accutronHistoryTool;
