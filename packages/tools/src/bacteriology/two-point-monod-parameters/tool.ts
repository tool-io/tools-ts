import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { positive, ordered } from "../shared.js";

export type Input = Readonly<{
  readonly substrateConcentrations: readonly number[];
  readonly specificGrowthRates: readonly number[];
}>;
export type Output = Readonly<{
  readonly maximumGrowthRatePerHour: number;
  readonly halfSaturationConcentration: number;
}>;
export const calculate = (input: Input): Output => {
  if (
    input.substrateConcentrations.length !== 2 ||
    input.specificGrowthRates.length !== 2
  )
    simpleError(
      "substrateConcentrations",
      "Exactly two positive substrate/growth observations required.",
    );
  ordered(input.substrateConcentrations, "substrateConcentrations");
  input.substrateConcentrations.forEach((v) =>
    positive(v, "substrateConcentrations"),
  );
  input.specificGrowthRates.forEach((v) => positive(v, "specificGrowthRates"));
  const [s1, s2] = input.substrateConcentrations,
    [u1, u2] = input.specificGrowthRates,
    denominator = u1 * s2 - u2 * s1;
  positive(denominator, "specificGrowthRates");
  const halfSaturationConcentration = (s1 * s2 * (u2 - u1)) / denominator;
  positive(halfSaturationConcentration, "specificGrowthRates");
  const maximumGrowthRatePerHour =
    (u1 * (halfSaturationConcentration + s1)) / s1;
  return { maximumGrowthRatePerHour, halfSaturationConcentration };
};
export const exampleInput = {
  substrateConcentrations: [1, 3],
  specificGrowthRates: [0.2, 0.3],
} satisfies Input;
export const exampleOutput = {
  maximumGrowthRatePerHour: 0.4,
  halfSaturationConcentration: 1,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "bacteriology/two-point-monod-parameters",
  title: "Two Point Monod Parameters",
  description:
    "Solve the exact two-point Monod model for mu-max and Ks, rejecting observations that imply nonpositive saturation parameters.",
  inputs: [
    {
      id: "substrateConcentrations",
      label: "Substrate concentrations",
      kind: "numberList",
    },
    {
      id: "specificGrowthRates",
      label: "Specific growth rates",
      kind: "numberList",
    },
  ],
  outputs: [
    {
      id: "maximumGrowthRatePerHour",
      label: "Maximum growth rate per hour",
      kind: "number",
    },
    {
      id: "halfSaturationConcentration",
      label: "Half saturation concentration",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      substrateConcentrations:
        value.substrateConcentrations as readonly number[],
      specificGrowthRates: value.specificGrowthRates as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
