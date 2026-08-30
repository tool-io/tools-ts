import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { positive, fraction, count } from "../shared.js";

export type Input = Readonly<{
  readonly initialPeriod: number;
  readonly targetPeriod: number;
  readonly periodReductionFractionPerPass: number;
  readonly maximumPasses: number;
}>;
export type Output = Readonly<{
  readonly requiredPasses: number;
  readonly projectedFinalPeriod: number;
}>;
export const calculate = (input: Input): Output => {
  positive(input.initialPeriod, "initialPeriod");
  positive(input.targetPeriod, "targetPeriod");
  fraction(
    input.periodReductionFractionPerPass,
    "periodReductionFractionPerPass",
  );
  count(input.maximumPasses, "maximumPasses", 1);
  if (
    input.targetPeriod > input.initialPeriod ||
    input.periodReductionFractionPerPass <= 0 ||
    input.periodReductionFractionPerPass >= 1
  )
    simpleError(
      "periodReductionFractionPerPass",
      "A decreasing-period target and a reduction fraction strictly between zero and one required.",
    );
  const raw =
      Math.log(input.targetPeriod / input.initialPeriod) /
      Math.log1p(-input.periodReductionFractionPerPass),
    requiredPasses = Math.max(
      0,
      Math.ceil(raw - Number.EPSILON * 8 * Math.max(1, Math.abs(raw))),
    );
  if (requiredPasses > input.maximumPasses)
    simpleError(
      "maximumPasses",
      "Estimated pass count exceeds the supplied campaign bound.",
    );
  return {
    requiredPasses,
    projectedFinalPeriod:
      input.initialPeriod *
      (1 - input.periodReductionFractionPerPass) ** requiredPasses,
  };
};
export const exampleInput = {
  initialPeriod: 100,
  targetPeriod: 25,
  periodReductionFractionPerPass: 0.5,
  maximumPasses: 10,
} satisfies Input;
export const exampleOutput = {
  requiredPasses: 2,
  projectedFinalPeriod: 25,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "celestial-mechanics/aerobraking-geometric-pass-count",
  title: "Aerobraking Geometric Pass Count",
  description:
    "Estimate passes under a supplied constant fractional period reduction; atmospheric and trajectory evolution are not inferred.",
  inputs: [
    { id: "initialPeriod", label: "Initial period", kind: "number" },
    { id: "targetPeriod", label: "Target period", kind: "number" },
    {
      id: "periodReductionFractionPerPass",
      label: "Period reduction fraction per pass",
      kind: "number",
    },
    { id: "maximumPasses", label: "Maximum passes", kind: "integer" },
  ],
  outputs: [
    { id: "requiredPasses", label: "Required passes", kind: "number" },
    {
      id: "projectedFinalPeriod",
      label: "Projected final period",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      initialPeriod: value.initialPeriod as number,
      targetPeriod: value.targetPeriod as number,
      periodReductionFractionPerPass:
        value.periodReductionFractionPerPass as number,
      maximumPasses: value.maximumPasses as number,
    }),
});
export const run = tool.execute;
export default tool;
