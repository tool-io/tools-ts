import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

const indicatorEntries = {
  history: {
    keyDate: "18 May 1879",
    statement:
      "A. Lange & Söhne states that its patent No. 9349 described a pocket-watch device for recognizing whether the watch was wound or unwound and indicating time remaining before complete unwinding.",
  },
  meaning: {
    keyDate: "operating meaning",
    statement:
      "An UP/DOWN display is a winding-state indicator that warns when the watch is approaching an unwound stop, rather than a universal estimate of remaining hours across all pocket watches.",
  },
  operation: {
    keyDate: "differential train",
    statement:
      "The display uses a separate train to compare the mainspring state with running time, moving between winding and unwinding indications as the mechanism operates.",
  },
  terminology: {
    keyDate: "history scope",
    statement:
      "UP/DOWN is a specific historic display name; other pocket watches used different power-reserve and up-and-down indicators with different mechanisms and scales.",
  },
} as const;

export type UpDownIndicatorFocus = keyof typeof indicatorEntries;

export type UpDownIndicatorLookupInput = {
  readonly indicatorFocus: UpDownIndicatorFocus;
};

export type UpDownIndicatorLookupOutput = {
  readonly indicatorFocus: UpDownIndicatorFocus;
  readonly keyDate: string;
  readonly verifiedStatement: string;
};

export const lookupPocketWatchUpDownIndicator = (
  input: UpDownIndicatorLookupInput,
): UpDownIndicatorLookupOutput => {
  const entry = indicatorEntries[input.indicatorFocus];
  if (entry === undefined)
    simpleError(
      "indicatorFocus",
      "UP/DOWN indicator focus is not supported.",
      "unsupported_indicator_focus",
    );
  return {
    indicatorFocus: input.indicatorFocus,
    keyDate: entry.keyDate,
    verifiedStatement: entry.statement,
  };
};

export const upDownIndicatorExample = {
  input: { indicatorFocus: "history" },
  output: {
    indicatorFocus: "history",
    keyDate: "18 May 1879",
    verifiedStatement:
      "A. Lange & Söhne states that its patent No. 9349 described a pocket-watch device for recognizing whether the watch was wound or unwound and indicating time remaining before complete unwinding.",
  },
} satisfies ToolExample<
  UpDownIndicatorLookupInput,
  UpDownIndicatorLookupOutput
>;

export const upDownIndicatorTool = createSimpleTool({
  calculate: (input) =>
    lookupPocketWatchUpDownIndicator({
      indicatorFocus: input.indicatorFocus as UpDownIndicatorFocus,
    }),
  description:
    "Return the patent history, winding-state meaning, differential-train operation, or terminology scope of a pocket-watch UP/DOWN indicator.",
  id: "horology/pocket-watch-up-down-power-indicator-lookup",
  inputs: [
    {
      enum: ["history", "meaning", "operation", "terminology"],
      id: "indicatorFocus",
      kind: "string",
      label: "Pocket watch UP/DOWN indicator focus",
    },
  ],
  outputs: [
    {
      id: "indicatorFocus",
      kind: "string",
      label: "Pocket watch UP/DOWN indicator focus",
    },
    { id: "keyDate", kind: "string", label: "Key date or context" },
    {
      id: "verifiedStatement",
      kind: "string",
      label: "Verified UP/DOWN statement",
    },
  ],
  title: "Pocket Watch Up Down Power Indicator Lookup",
});

export const runUpDownIndicator = upDownIndicatorTool.execute;
export default upDownIndicatorTool;
