import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, fraction, interpolate } from "../shared.js";
export type Input = Readonly<{
  readonly calibrationTemperaturesC: readonly number[];
  readonly calibrationMeltFractions: readonly number[];
  readonly temperatureC: number;
}>;
export type Output = Readonly<{ readonly interpolatedMeltFraction: number }>;
const inputFields = [
  {
    id: "calibrationTemperaturesC",
    label: "Calibration temperatures c",
    kind: "numberList",
  },
  {
    id: "calibrationMeltFractions",
    label: "Calibration melt fractions",
    kind: "numberList",
  },
  { id: "temperatureC", label: "Temperature c", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.calibrationMeltFractions.forEach((v) =>
    fraction(v, "calibrationMeltFractions"),
  );
  if (
    input.calibrationMeltFractions.some(
      (v, i) => i > 0 && v < input.calibrationMeltFractions[i - 1],
    )
  )
    simpleError(
      "calibrationMeltFractions",
      "Nondecreasing fixed-pressure melt calibration required.",
    );
  return {
    interpolatedMeltFraction: interpolate(
      input.calibrationTemperaturesC,
      input.calibrationMeltFractions,
      input.temperatureC,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  calibrationTemperaturesC: [900, 1000, 1100],
  calibrationMeltFractions: [0, 0.2, 1],
  temperatureC: 1050,
} satisfies Input;
export const exampleOutput = { interpolatedMeltFraction: 0.6 } satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "volcanology/melt-fraction-solidus-liquidus-interpolation",
  title: "Melt Fraction Solidus Liquidus Interpolation",
  description:
    "Interpolate a supplied monotone melt-fraction/temperature calibration, preserving a nonlinear liquidus/solidus curve without extrapolation; not a universal rock phase diagram.",
  inputs: inputFields,
  outputs: [
    {
      id: "interpolatedMeltFraction",
      label: "Interpolated melt fraction",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      calibrationTemperaturesC:
        value.calibrationTemperaturesC as readonly number[],
      calibrationMeltFractions:
        value.calibrationMeltFractions as readonly number[],
      temperatureC: value.temperatureC as number,
    }),
});
export const run = tool.execute;
export default tool;
