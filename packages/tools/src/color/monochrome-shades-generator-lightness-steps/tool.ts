import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  fromHsl,
  hue,
  fraction,
  bounded,
} from "../batch-shared.js";
export type Input = Readonly<{
  readonly hueDegrees: number;
  readonly saturationFraction: number;
  readonly lightnessStartFraction: number;
  readonly lightnessEndFraction: number;
  readonly stepCount: number;
}>;
export type Output = Readonly<{
  readonly lightnessFractions: readonly number[];
  readonly rgbStepRows: readonly (readonly number[])[];
}>;
const inputFields = [
  { id: "hueDegrees", label: "Hue degrees", kind: "number" },
  { id: "saturationFraction", label: "Saturation fraction", kind: "number" },
  {
    id: "lightnessStartFraction",
    label: "Lightness start fraction",
    kind: "number",
  },
  {
    id: "lightnessEndFraction",
    label: "Lightness end fraction",
    kind: "number",
  },
  { id: "stepCount", label: "Step count", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  fraction(input.saturationFraction, "saturationFraction");
  fraction(input.lightnessStartFraction, "lightnessStartFraction");
  fraction(input.lightnessEndFraction, "lightnessEndFraction");
  hue(input.hueDegrees);
  bounded(input.stepCount, "steps", 2, 128);
  const steps = Array.from(
    { length: input.stepCount },
    (_, i) =>
      input.lightnessStartFraction +
      ((input.lightnessEndFraction - input.lightnessStartFraction) * i) /
        (input.stepCount - 1),
  );
  return {
    lightnessFractions: steps,
    rgbStepRows: steps.map((l) =>
      fromHsl(input.hueDegrees, input.saturationFraction, l),
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  hueDegrees: 0,
  saturationFraction: 1,
  lightnessStartFraction: 0,
  lightnessEndFraction: 1,
  stepCount: 3,
} satisfies Input;
export const exampleOutput = {
  lightnessFractions: [0, 0.5, 1],
  rgbStepRows: [
    [0, 0, 0],
    [1, 0, 0],
    [1, 1, 1],
  ],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "color/monochrome-shades-generator-lightness-steps",
  title: "Monochrome Lightness Steps Generator",
  description:
    "Generate endpoint-inclusive bounded HSL lightness ladder retaining caller hue/saturation and allowing descending ramps; not perceptually uniform OKLCH steps or a guarantee of distinguishable colors.",
  inputs: inputFields,
  outputs: [
    {
      id: "lightnessFractions",
      label: "Lightness fractions",
      kind: "numberList",
    },
    { id: "rgbStepRows", label: "Rgb step rows", kind: "matrix" },
  ],
  calculate: (value) =>
    calculate({
      hueDegrees: value.hueDegrees as number,
      saturationFraction: value.saturationFraction as number,
      lightnessStartFraction: value.lightnessStartFraction as number,
      lightnessEndFraction: value.lightnessEndFraction as number,
      stepCount: value.stepCount as number,
    }),
});
export const run = tool.execute;
export default tool;
