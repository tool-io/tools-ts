import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { nonnegative, aligned } from "../shared.js";

export type Input = Readonly<{
  readonly lotIds: readonly string[];
  readonly measuredEuPerMl: readonly number[];
  readonly maximumEuPerMl: number;
}>;
export type Output = Readonly<{
  readonly exceedingLots: readonly string[];
  readonly maximumMeasuredEuPerMl: number;
  readonly allWithinLimit: boolean;
}>;
export const calculate = (input: Input): Output => {
  aligned(input.lotIds, input.measuredEuPerMl, "lotIds");
  input.measuredEuPerMl.forEach((v) => nonnegative(v, "measuredEuPerMl"));
  nonnegative(input.maximumEuPerMl, "maximumEuPerMl");
  if (new Set(input.lotIds).size !== input.lotIds.length)
    simpleError("lotIds", "Distinct lot IDs required.");
  const exceedingLots = input.lotIds.filter(
    (_, i) => input.measuredEuPerMl[i] > input.maximumEuPerMl,
  );
  let maximumMeasuredEuPerMl = 0;
  for (const value of input.measuredEuPerMl)
    maximumMeasuredEuPerMl = Math.max(maximumMeasuredEuPerMl, value);
  return {
    exceedingLots,
    maximumMeasuredEuPerMl,
    allWithinLimit: exceedingLots.length === 0,
  };
};
export const exampleInput = {
  lotIds: ["A", "B"],
  measuredEuPerMl: [0.1, 0.6],
  maximumEuPerMl: 0.5,
} satisfies Input;
export const exampleOutput = {
  exceedingLots: ["B"],
  maximumMeasuredEuPerMl: 0.6,
  allWithinLimit: false,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "virology/endotoxin-lot-limit-audit",
  title: "Endotoxin Lot Limit Audit",
  description:
    "Screen measured endotoxin concentrations for multiple lots against an explicitly supplied lot criterion.",
  inputs: [
    { id: "lotIds", label: "Lot ids", kind: "stringList" },
    { id: "measuredEuPerMl", label: "Measured eu per ml", kind: "numberList" },
    {
      id: "maximumEuPerMl",
      label: "Maximum eu per ml",
      kind: "number",
      minimum: 0,
    },
  ],
  outputs: [
    { id: "exceedingLots", label: "Exceeding lots", kind: "stringList" },
    {
      id: "maximumMeasuredEuPerMl",
      label: "Maximum measured eu per ml",
      kind: "number",
    },
    { id: "allWithinLimit", label: "All within limit", kind: "boolean" },
  ],
  calculate: (value) =>
    calculate({
      lotIds: value.lotIds as readonly string[],
      measuredEuPerMl: value.measuredEuPerMl as readonly number[],
      maximumEuPerMl: value.maximumEuPerMl as number,
    }),
});
export const run = tool.execute;
export default tool;
