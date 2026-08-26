import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type VacatDotSeriesCounterInput = {
  readonly text: string;
  readonly minimumDots?: number;
};

export type VacatDotSeriesCounterOutput = {
  readonly seriesCount: number;
  readonly longestSeries: number;
  readonly totalDots: number;
};

export const calculateVacatDotSeriesCounter = (
  input: VacatDotSeriesCounterInput,
): VacatDotSeriesCounterOutput => {
  const minimumDots = input.minimumDots ?? 3;
  if (!(Number.isInteger(minimumDots) && minimumDots >= 1))
    return simpleError(
      "minimumDots",
      "Minimum dots must be a positive integer.",
      "invalid_minimum",
    );
  let seriesCount = 0;
  let longestSeries = 0;
  let totalDots = 0;
  let runLength = 0;
  for (let i = 0; i <= input.text.length; i += 1) {
    const ch = i < input.text.length ? input.text[i] : "";
    if (ch === "." || ch === "\u00B7") runLength += 1;
    else if (runLength > 0) {
      totalDots += runLength;
      longestSeries = Math.max(longestSeries, runLength);
      if (runLength >= minimumDots) seriesCount += 1;
      runLength = 0;
    }
  }
  return { seriesCount, longestSeries, totalDots };
};

export const vacatDotSeriesCounterExample = {
  input: { text: "DIS MANIBVS \u00B7\u00B7\u00B7 VSLM ..." },
  output: { seriesCount: 2, longestSeries: 3, totalDots: 6 },
} satisfies ToolExample<
  VacatDotSeriesCounterInput,
  VacatDotSeriesCounterOutput
>;

export const vacatDotSeriesCounterTool = createSimpleTool({
  id: "epigraphy/vacat-dot-series-counter",
  title: "Vacat Dot Series Length Counter",
  description:
    "Count runs of dot characters ('.' or middle dot U+00B7) recording vacant spaces in a transcription, tallying series at or above a minimum length (default 3 dots), the longest series, and the total dot count.",
  inputs: [
    {
      description: "Transcription containing vacat dot series.",
      id: "text",
      kind: "string",
      label: "Text",
    },
    {
      default: 3,
      description: "Minimum number of dots qualifying a run as a vacat series.",
      id: "minimumDots",
      kind: "integer",
      label: "Minimum dots",
      minimum: 1,
    },
  ],
  outputs: [
    {
      description: "Number of dot series meeting the minimum.",
      id: "seriesCount",
      kind: "integer",
      label: "Series",
    },
    {
      description: "Length in dots of the longest run.",
      id: "longestSeries",
      kind: "integer",
      label: "Longest",
    },
    {
      description: "Total number of dot characters.",
      id: "totalDots",
      kind: "integer",
      label: "Total dots",
    },
  ],
  calculate: (input) =>
    calculateVacatDotSeriesCounter(
      input as unknown as VacatDotSeriesCounterInput,
    ),
});

export const runVacatDotSeriesCounter = vacatDotSeriesCounterTool.execute;
export default vacatDotSeriesCounterTool;
