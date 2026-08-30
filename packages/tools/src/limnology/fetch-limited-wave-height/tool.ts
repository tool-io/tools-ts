import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive, nonnegative } from "../shared.js";
export type Input = Readonly<{
  readonly windSpeedMPerSecond: number;
  readonly fetchM: number;
  readonly gravityMPerSecondSquared: number;
  readonly heightCoefficient: number;
  readonly growthCoefficient: number;
  readonly fetchExponent: number;
}>;
export type Output = Readonly<{
  readonly predictedSignificantWaveHeightM: number;
}>;
const inputFields = [
  {
    id: "windSpeedMPerSecond",
    label: "Wind speed m per second",
    kind: "number",
  },
  { id: "fetchM", label: "Fetch m", kind: "number" },
  {
    id: "gravityMPerSecondSquared",
    label: "Gravity m per second squared",
    kind: "number",
  },
  { id: "heightCoefficient", label: "Height coefficient", kind: "number" },
  { id: "growthCoefficient", label: "Growth coefficient", kind: "number" },
  { id: "fetchExponent", label: "Fetch exponent", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.windSpeedMPerSecond, "windSpeedMPerSecond");
  positive(input.gravityMPerSecondSquared, "gravityMPerSecondSquared");
  positive(input.heightCoefficient, "heightCoefficient");
  positive(input.growthCoefficient, "growthCoefficient");
  positive(input.fetchExponent, "fetchExponent");
  nonnegative(input.fetchM, "fetchM");
  return {
    predictedSignificantWaveHeightM:
      ((input.heightCoefficient * input.windSpeedMPerSecond ** 2) /
        input.gravityMPerSecondSquared) *
      Math.tanh(
        input.growthCoefficient *
          ((input.gravityMPerSecondSquared * input.fetchM) /
            input.windSpeedMPerSecond ** 2) **
            input.fetchExponent,
      ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  windSpeedMPerSecond: 10,
  fetchM: 1000,
  gravityMPerSecondSquared: 10,
  heightCoefficient: 0.283,
  growthCoefficient: 0.0125,
  fetchExponent: 0.42,
} satisfies Input;
export const exampleOutput = {
  predictedSignificantWaveHeightM: 0.24412693366179736,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "limnology/fetch-limited-wave-height",
  title: "Fetch Limited Wave Height",
  description:
    "Evaluate a supplied deep-water fetch-limited bulk wave-growth correlation; wind reference height, duration, shallow-water limits and calibration applicability are external.",
  inputs: inputFields,
  outputs: [
    {
      id: "predictedSignificantWaveHeightM",
      label: "Predicted significant wave height m",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      windSpeedMPerSecond: value.windSpeedMPerSecond as number,
      fetchM: value.fetchM as number,
      gravityMPerSecondSquared: value.gravityMPerSecondSquared as number,
      heightCoefficient: value.heightCoefficient as number,
      growthCoefficient: value.growthCoefficient as number,
      fetchExponent: value.fetchExponent as number,
    }),
});
export const run = tool.execute;
export default tool;
