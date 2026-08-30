import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";
import { nonnegative } from "../shared.js";

export type Input = Readonly<{
  readonly firstHomozygoteValue: number;
  readonly secondHomozygoteValue: number;
  readonly heterozygoteValue: number;
  readonly midpointTolerance: number;
}>;
export type Output = Readonly<{
  readonly homozygoteMidpoint: number;
  readonly midpointDeviation: number;
  readonly intermediateAndNearMidpoint: boolean;
}>;
export const calculate = (input: Input): Output => {
  nonnegative(input.midpointTolerance, "midpointTolerance");
  const low = Math.min(input.firstHomozygoteValue, input.secondHomozygoteValue),
    high = Math.max(input.firstHomozygoteValue, input.secondHomozygoteValue),
    homozygoteMidpoint = (low + high) / 2,
    midpointDeviation = Math.abs(input.heterozygoteValue - homozygoteMidpoint);
  return {
    homozygoteMidpoint,
    midpointDeviation,
    intermediateAndNearMidpoint:
      input.heterozygoteValue > low &&
      input.heterozygoteValue < high &&
      midpointDeviation <= input.midpointTolerance,
  };
};
export const exampleInput = {
  firstHomozygoteValue: 10,
  secondHomozygoteValue: 20,
  heterozygoteValue: 15,
  midpointTolerance: 1,
} satisfies Input;
export const exampleOutput = {
  homozygoteMidpoint: 15,
  midpointDeviation: 0,
  intermediateAndNearMidpoint: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "genetics/intermediate-heterozygote-screen",
  title: "Intermediate Heterozygote Screen",
  description:
    "Screen a measured heterozygote trait for an intermediate midpoint pattern.",
  inputs: [
    {
      id: "firstHomozygoteValue",
      label: "First homozygote value",
      kind: "number",
    },
    {
      id: "secondHomozygoteValue",
      label: "Second homozygote value",
      kind: "number",
    },
    { id: "heterozygoteValue", label: "Heterozygote value", kind: "number" },
    { id: "midpointTolerance", label: "Midpoint tolerance", kind: "number" },
  ],
  outputs: [
    { id: "homozygoteMidpoint", label: "Homozygote midpoint", kind: "number" },
    { id: "midpointDeviation", label: "Midpoint deviation", kind: "number" },
    {
      id: "intermediateAndNearMidpoint",
      label: "Intermediate and near midpoint",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      firstHomozygoteValue: value.firstHomozygoteValue as number,
      secondHomozygoteValue: value.secondHomozygoteValue as number,
      heterozygoteValue: value.heterozygoteValue as number,
      midpointTolerance: value.midpointTolerance as number,
    }),
});
export const run = tool.execute;
export default tool;
