import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly lastCloseTimestamp: string;
  readonly asOfTimestamp: string;
  readonly maximumAgeHours: number;
  readonly failedPipelineChecks: number;
}>;
export type Output = Readonly<{
  readonly dataAgeHours: number;
  readonly ageMarginHours: number;
  readonly fresh: boolean;
  readonly assuranceStatus: string;
}>;

export const calculate = (input: Input): Output => {
  const last = new Date(input.lastCloseTimestamp),
    asOf = new Date(input.asOfTimestamp);
  if (
    Number.isNaN(last.getTime()) ||
    Number.isNaN(asOf.getTime()) ||
    asOf < last
  )
    simpleError(
      "asOfTimestamp",
      "Timestamps must be valid and ordered.",
      "invalid_timestamps",
    );
  const dataAgeHours = (asOf.getTime() - last.getTime()) / 3600000,
    fresh = dataAgeHours <= input.maximumAgeHours;
  return {
    dataAgeHours,
    ageMarginHours: input.maximumAgeHours - dataAgeHours,
    fresh,
    assuranceStatus:
      input.failedPipelineChecks > 0 ? "failed" : fresh ? "current" : "stale",
  };
};

export const exampleInput = {
  lastCloseTimestamp: "2025-01-01T00:00:00Z",
  asOfTimestamp: "2025-01-01T06:00:00Z",
  maximumAgeHours: 8,
  failedPipelineChecks: 0,
} satisfies Input;
export const exampleOutput = {
  dataAgeHours: 6,
  ageMarginHours: 2,
  fresh: true,
  assuranceStatus: "current",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      lastCloseTimestamp: input.lastCloseTimestamp as string,
      asOfTimestamp: input.asOfTimestamp as string,
      maximumAgeHours: input.maximumAgeHours as number,
      failedPipelineChecks: input.failedPipelineChecks as number,
    }),
  description:
    "Measure continuous-close data freshness and pipeline-check status.",
  id: "auditing/continuous-close-freshness",
  inputs: [
    { id: "lastCloseTimestamp", label: "Last close timestamp", kind: "string" },
    { id: "asOfTimestamp", label: "As-of timestamp", kind: "string" },
    {
      id: "maximumAgeHours",
      label: "Maximum data age",
      kind: "number",
      minimum: 0,
      unit: "h",
    },
    {
      id: "failedPipelineChecks",
      label: "Failed assurance checks",
      kind: "integer",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "dataAgeHours",
      label: "Close data age",
      kind: "number",
      minimum: 0,
      unit: "h",
    },
    {
      id: "ageMarginHours",
      label: "Freshness margin",
      kind: "number",
      unit: "h",
    },
    { id: "fresh", label: "Data is fresh", kind: "boolean" },
    {
      id: "assuranceStatus",
      label: "Assurance status",
      kind: "string",
      enum: ["current", "stale", "failed"],
    },
  ],
  title: "Continuous-Close Freshness",
});

export const run = tool.execute;
export default tool;
