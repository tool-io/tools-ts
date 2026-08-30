import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  fraction,
} from "../shared.js";
export type Input = Readonly<{
  readonly windSpeedsMPerSecond: readonly number[];
  readonly coveragePowerCoefficient: number;
  readonly coverageExponent: number;
}>;
export type Output = Readonly<{
  readonly modelWhitecapFractions: readonly number[];
}>;
const inputFields = [
  {
    id: "windSpeedsMPerSecond",
    label: "Wind speeds m per second",
    kind: "numberList",
  },
  {
    id: "coveragePowerCoefficient",
    label: "Coverage power coefficient",
    kind: "number",
  },
  { id: "coverageExponent", label: "Coverage exponent", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.coverageExponent, "coverageExponent");
  input.windSpeedsMPerSecond.forEach((v) =>
    nonnegative(v, "windSpeedsMPerSecond"),
  );
  nonnegative(input.coveragePowerCoefficient, "coveragePowerCoefficient");
  return {
    modelWhitecapFractions: input.windSpeedsMPerSecond.map((u) =>
      fraction(
        input.coveragePowerCoefficient * u ** input.coverageExponent,
        "coverageModel",
      ),
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  windSpeedsMPerSecond: [0, 10, 20],
  coveragePowerCoefficient: 1e-5,
  coverageExponent: 3,
} satisfies Input;
export const exampleOutput = {
  modelWhitecapFractions: [0, 0.01, 0.08],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "oceanography/whitecap-coverage-wind-fraction",
  title: "Whitecap Coverage Wind Fraction",
  description:
    "Evaluate a supplied wind-power whitecap coverage calibration, rejecting fractions above one rather than clipping outside the model range; no sea-state or salinity-independent universal calibration.",
  inputs: inputFields,
  outputs: [
    {
      id: "modelWhitecapFractions",
      label: "Model whitecap fractions",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      windSpeedsMPerSecond: value.windSpeedsMPerSecond as readonly number[],
      coveragePowerCoefficient: value.coveragePowerCoefficient as number,
      coverageExponent: value.coverageExponent as number,
    }),
});
export const run = tool.execute;
export default tool;
