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
  readonly signedLightnessPercentagePoints: number;
}>;
export type Output = Readonly<{
  readonly shiftedHsl: readonly number[];
  readonly shiftedRgb: readonly number[];
  readonly lightnessClamped: boolean;
}>;
const inputFields = [
  { id: "baseRgb", label: "Base rgb", kind: "numberList" },
  {
    id: "signedLightnessPercentagePoints",
    label: "Signed lightness percentage points",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  const v = hsl(input.baseRgb);
  if (Math.abs(input.signedLightnessPercentagePoints) > 100)
    simpleError(
      "shift",
      "Signed lightness percentage-point change bounded ±100 required.",
    );
  const raw = v[2] + input.signedLightnessPercentagePoints / 100,
    L = Math.max(0, Math.min(1, raw));
  return {
    shiftedHsl: [v[0], v[1], L],
    shiftedRgb: fromHsl(v[0], v[1], L),
    lightnessClamped: raw !== L,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  baseRgb: [1, 0, 0],
  signedLightnessPercentagePoints: 25,
} satisfies Input;
export const exampleOutput = {
  shiftedHsl: [0, 1, 0.75],
  shiftedRgb: [1, 0.5, 0.5],
  lightnessClamped: false,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "color/hsl-lightness-shift-percent",
  title: "HSL Lightness Shift Percent",
  description:
    "Adjust actual RGB through HSL using additive signed lightness percentage points, clipping only lightness and reporting clipping; not multiplicative brightness, CSS matrix filtering or perceptually uniform change.",
  inputs: inputFields,
  outputs: [
    { id: "shiftedHsl", label: "Shifted hsl", kind: "numberList" },
    { id: "shiftedRgb", label: "Shifted rgb", kind: "numberList" },
    { id: "lightnessClamped", label: "Lightness clamped", kind: "boolean" },
  ],
  calculate: (value) =>
    calculate({
      baseRgb: value.baseRgb as readonly number[],
      signedLightnessPercentagePoints:
        value.signedLightnessPercentagePoints as number,
    }),
});
export const run = tool.execute;
export default tool;
