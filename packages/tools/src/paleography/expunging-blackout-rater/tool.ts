import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ExpungingBlackoutRaterInput = {
  readonly totalLineCount: number;
  readonly expungedLineCount: number;
  readonly wholeEntryExpunged?: boolean;
};

export type ExpungingBlackoutRaterOutput = {
  readonly expungedSharePercent: number;
  readonly severityBand:
    | "untouched"
    | "spot_expunging"
    | "partial_expunging"
    | "wholesale_expunging";
  readonly fullyBlackedOut: boolean;
};

export const calculateExpungingBlackoutRater = (
  input: ExpungingBlackoutRaterInput,
): ExpungingBlackoutRaterOutput => {
  if (!(
    Number.isSafeInteger(input.totalLineCount) && input.totalLineCount >= 1
  ))
    return simpleError(
      "totalLineCount",
      "Count at least one line in the entry.",
      "invalid_count",
    );
  if (!(
    Number.isSafeInteger(input.expungedLineCount) &&
    input.expungedLineCount >= 0 &&
    input.expungedLineCount <= input.totalLineCount
  ))
    return simpleError(
      "expungedLineCount",
      "Expunged lines must be integers between 0 and the total line count.",
      "invalid_count",
    );
  const wholeEntryExpunged = input.wholeEntryExpunged ?? false;
  const expungedSharePercent =
    (input.expungedLineCount / input.totalLineCount) * 100;
  return {
    expungedSharePercent,
    severityBand:
      expungedSharePercent === 0
        ? "untouched"
        : expungedSharePercent < 10
          ? "spot_expunging"
          : expungedSharePercent <= 50
            ? "partial_expunging"
            : "wholesale_expunging",
    fullyBlackedOut: wholeEntryExpunged || expungedSharePercent === 100,
  };
};

export const expungingBlackoutRaterExample = {
  input: { totalLineCount: 60, expungedLineCount: 9 },
  output: {
    expungedSharePercent: 15,
    severityBand: "partial_expunging",
    fullyBlackedOut: false,
  },
} satisfies ToolExample<
  ExpungingBlackoutRaterInput,
  ExpungingBlackoutRaterOutput
>;

export const expungingBlackoutRaterTool = createSimpleTool({
  id: "paleography/expunging-blackout-rater",
  title: "Expunging Blackout Rater",
  description:
    "Rate how heavily an entry was expunged under the stated rule: share of lines blacked out banded as untouched (0%), spot (<10%), partial (10-50%) or wholesale (>50%), with fullyBlackedOut set when every line is struck or the observer declares whole-entry erasure.",
  inputs: [
    {
      description: "Lines in the affected entry or record.",
      id: "totalLineCount",
      kind: "integer",
      label: "Total lines",
      minimum: 1,
    },
    {
      description: "Lines obscured by expunging strokes.",
      id: "expungedLineCount",
      kind: "integer",
      label: "Expunged lines",
      minimum: 0,
    },
    {
      default: false,
      description:
        "True when the observer records the whole entry as blacked out.",
      id: "wholeEntryExpunged",
      kind: "boolean",
      label: "Whole entry expunged",
    },
  ],
  outputs: [
    {
      description: "Expunged lines as a percentage of all lines.",
      id: "expungedSharePercent",
      kind: "number",
      label: "Expunged %",
    },
    {
      description: "Severity band from the stated thresholds.",
      id: "severityBand",
      enum: [
        "untouched",
        "spot_expunging",
        "partial_expunging",
        "wholesale_expunging",
      ],
      kind: "string",
      label: "Severity band",
    },
    {
      description: "True when nothing legible remains by count or declaration.",
      id: "fullyBlackedOut",
      kind: "boolean",
      label: "Fully blacked out",
    },
  ],
  calculate: (input) =>
    calculateExpungingBlackoutRater({
      expungedLineCount: input.expungedLineCount as number,
      totalLineCount: input.totalLineCount as number,
      wholeEntryExpunged: input.wholeEntryExpunged as boolean,
    }),
});

export const runExpungingBlackoutRater = expungingBlackoutRaterTool.execute;
export default expungingBlackoutRaterTool;
