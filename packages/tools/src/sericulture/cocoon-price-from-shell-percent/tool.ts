import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, nonnegative, interpolate } from "../shared.js";
export type Input = Readonly<{
  readonly shellPercentKnots: readonly number[];
  readonly pricePerKgKnots: readonly number[];
  readonly measuredShellPercent: number;
  readonly qualityMultiplier: number;
  readonly lotNetWeightKg: number;
}>;
export type Output = Readonly<{
  readonly calibratedPricePerKg: number;
  readonly estimatedLotValue: number;
}>;
const inputFields = [
  { id: "shellPercentKnots", label: "Shell percent knots", kind: "numberList" },
  { id: "pricePerKgKnots", label: "Price per kg knots", kind: "numberList" },
  {
    id: "measuredShellPercent",
    label: "Measured shell percent",
    kind: "number",
  },
  { id: "qualityMultiplier", label: "Quality multiplier", kind: "number" },
  { id: "lotNetWeightKg", label: "Lot net weight kg", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.pricePerKgKnots.forEach((v) => nonnegative(v, "pricePerKgKnots"));
  nonnegative(input.qualityMultiplier, "qualityMultiplier");
  nonnegative(input.lotNetWeightKg, "lotNetWeightKg");
  input.shellPercentKnots.forEach((v) => {
    nonnegative(v, "shellPercentKnots");
    if (v > 100)
      simpleError(
        "shellPercentKnots",
        "Shell percent within [0,100] required.",
      );
  });
  const calibratedPricePerKg =
    interpolate(
      input.shellPercentKnots,
      input.pricePerKgKnots,
      input.measuredShellPercent,
    ) * input.qualityMultiplier;
  return {
    calibratedPricePerKg,
    estimatedLotValue: calibratedPricePerKg * input.lotNetWeightKg,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  shellPercentKnots: [10, 20, 30],
  pricePerKgKnots: [2, 4, 8],
  measuredShellPercent: 25,
  qualityMultiplier: 0.9,
  lotNetWeightKg: 10,
} satisfies Input;
export const exampleOutput = {
  calibratedPricePerKg: 5.4,
  estimatedLotValue: 54,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "sericulture/cocoon-price-from-shell-percent",
  title: "Cocoon Price From Shell Percent",
  description:
    "Interpolate a supplied auction shell-percent price schedule and quality multiplier without market-price defaults or out-of-range extrapolation.",
  inputs: inputFields,
  outputs: [
    {
      id: "calibratedPricePerKg",
      label: "Calibrated price per kg",
      kind: "number",
    },
    { id: "estimatedLotValue", label: "Estimated lot value", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      shellPercentKnots: value.shellPercentKnots as readonly number[],
      pricePerKgKnots: value.pricePerKgKnots as readonly number[],
      measuredShellPercent: value.measuredShellPercent as number,
      qualityMultiplier: value.qualityMultiplier as number,
      lotNetWeightKg: value.lotNetWeightKg as number,
    }),
});
export const run = tool.execute;
export default tool;
