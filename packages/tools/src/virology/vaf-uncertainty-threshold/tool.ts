import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { positive, fraction, count } from "../shared.js";

export type Input = Readonly<{
  readonly alternateReads: number;
  readonly totalReads: number;
  readonly normalZ: number;
  readonly frequencyThreshold: number;
}>;
export type Output = Readonly<{
  readonly observedVaf: number;
  readonly wilsonLower: number;
  readonly wilsonUpper: number;
  readonly thresholdEvidence: string;
}>;
export const calculate = (input: Input): Output => {
  count(input.alternateReads, "alternateReads");
  count(input.totalReads, "totalReads", 1);
  positive(input.normalZ, "normalZ");
  fraction(input.frequencyThreshold, "frequencyThreshold");
  if (input.alternateReads > input.totalReads)
    simpleError("alternateReads", "Alternate reads cannot exceed total depth.");
  const n = input.totalReads,
    p = input.alternateReads / n,
    z2 = input.normalZ ** 2,
    denominator = 1 + z2 / n,
    center = (p + z2 / (2 * n)) / denominator,
    half =
      (input.normalZ * Math.sqrt((p * (1 - p)) / n + z2 / (4 * n * n))) /
      denominator,
    wilsonLower = Math.max(0, center - half),
    wilsonUpper = Math.min(1, center + half);
  return {
    observedVaf: p,
    wilsonLower,
    wilsonUpper,
    thresholdEvidence:
      wilsonLower >= input.frequencyThreshold
        ? "above"
        : wilsonUpper < input.frequencyThreshold
          ? "below"
          : "uncertain",
  };
};
export const exampleInput = {
  alternateReads: 5,
  totalReads: 10,
  normalZ: 1,
  frequencyThreshold: 0.4,
} satisfies Input;
export const exampleOutput = {
  observedVaf: 0.5,
  wilsonLower: 0.34924432771111824,
  wilsonUpper: 0.6507556722888818,
  thresholdEvidence: "uncertain",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "virology/vaf-uncertainty-threshold",
  title: "VAF Uncertainty Threshold",
  description:
    "Screen a variant-frequency threshold using Wilson uncertainty bounds from read counts; reads are assumed independent and error-free.",
  inputs: [
    {
      id: "alternateReads",
      label: "Alternate reads",
      kind: "integer",
      minimum: 0,
    },
    { id: "totalReads", label: "Total reads", kind: "integer", minimum: 1 },
    { id: "normalZ", label: "Normal z", kind: "number" },
    {
      id: "frequencyThreshold",
      label: "Frequency threshold",
      kind: "number",
      minimum: 0,
      maximum: 1,
    },
  ],
  outputs: [
    { id: "observedVaf", label: "Observed vaf", kind: "number" },
    { id: "wilsonLower", label: "Wilson lower", kind: "number" },
    { id: "wilsonUpper", label: "Wilson upper", kind: "number" },
    { id: "thresholdEvidence", label: "Threshold evidence", kind: "string" },
  ],
  calculate: (value) =>
    calculate({
      alternateReads: value.alternateReads as number,
      totalReads: value.totalReads as number,
      normalZ: value.normalZ as number,
      frequencyThreshold: value.frequencyThreshold as number,
    }),
});
export const run = tool.execute;
export default tool;
