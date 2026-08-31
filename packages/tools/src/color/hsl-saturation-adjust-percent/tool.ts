import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  hsl,
  fromHsl,
  bounded,
} from "../batch-shared.js";
export type Input = Readonly<{
  readonly baseRgb: readonly number[];
  readonly signedSaturationPercentagePoints: number;
}>;
export type Output = Readonly<{
  readonly adjustedHsl: readonly number[];
  readonly adjustedRgb: readonly number[];
  readonly saturationClamped: boolean;
}>;
const inputFields = [
  { id: "baseRgb", label: "Base rgb", kind: "numberList" },
  {
    id: "signedSaturationPercentagePoints",
    label: "Signed saturation percentage points",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  const v = hsl(input.baseRgb);
  if (Math.abs(input.signedSaturationPercentagePoints) > 100)
    simpleError(
      "shift",
      "Signed saturation percentage-point change bounded ±100 required.",
    );
  const raw = v[1] + input.signedSaturationPercentagePoints / 100,
    S = Math.max(0, Math.min(1, raw));
  return {
    adjustedHsl: [v[0], S, v[2]],
    adjustedRgb: fromHsl(v[0], S, v[2]),
    saturationClamped: raw !== S,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  baseRgb: [1, 0, 0],
  signedSaturationPercentagePoints: -50,
} satisfies Input;
export const exampleOutput = {
  adjustedHsl: [0, 0.5, 0.5],
  adjustedRgb: [0.75, 0.25, 0.25],
  saturationClamped: false,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "color/hsl-saturation-adjust-percent",
  title: "HSL Saturation Adjust Percent",
  description:
    "Adjust actual RGB saturation by signed HSL percentage points with explicit clipping flag; achromatic input uses canonical hue zero and no arbitrary latent hue is inferred.",
  inputs: inputFields,
  outputs: [
    { id: "adjustedHsl", label: "Adjusted hsl", kind: "numberList" },
    { id: "adjustedRgb", label: "Adjusted rgb", kind: "numberList" },
    { id: "saturationClamped", label: "Saturation clamped", kind: "boolean" },
  ],
  calculate: (value) =>
    calculate({
      baseRgb: value.baseRgb as readonly number[],
      signedSaturationPercentagePoints:
        value.signedSaturationPercentagePoints as number,
    }),
});
export const run = tool.execute;
export default tool;
