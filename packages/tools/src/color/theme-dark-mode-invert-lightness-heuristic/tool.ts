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
  fraction,
} from "../batch-shared.js";
export type Input = Readonly<{
  readonly baseRgb: readonly number[];
  readonly callerMinimumDarkModeLightness: number;
  readonly callerMaximumDarkModeLightness: number;
}>;
export type Output = Readonly<{
  readonly heuristicDarkHsl: readonly number[];
  readonly heuristicDarkRgb: readonly number[];
  readonly invertedLightnessClipped: boolean;
}>;
const inputFields = [
  { id: "baseRgb", label: "Base rgb", kind: "numberList" },
  {
    id: "callerMinimumDarkModeLightness",
    label: "Caller minimum dark mode lightness",
    kind: "number",
  },
  {
    id: "callerMaximumDarkModeLightness",
    label: "Caller maximum dark mode lightness",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  fraction(
    input.callerMinimumDarkModeLightness,
    "callerMinimumDarkModeLightness",
  );
  fraction(
    input.callerMaximumDarkModeLightness,
    "callerMaximumDarkModeLightness",
  );
  if (
    input.callerMinimumDarkModeLightness > input.callerMaximumDarkModeLightness
  )
    simpleError(
      "bounds",
      "Ordered caller HSL lightness clipping range required.",
    );
  const [h, s, l] = hsl(input.baseRgb),
    raw = 1 - l,
    L = Math.max(
      input.callerMinimumDarkModeLightness,
      Math.min(input.callerMaximumDarkModeLightness, raw),
    );
  return {
    heuristicDarkHsl: [h, s, L],
    heuristicDarkRgb: fromHsl(h, s, L),
    invertedLightnessClipped: L !== raw,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  baseRgb: [1, 0, 0],
  callerMinimumDarkModeLightness: 0.1,
  callerMaximumDarkModeLightness: 0.4,
} satisfies Input;
export const exampleOutput = {
  heuristicDarkHsl: [0, 1, 0.4],
  heuristicDarkRgb: [0.8, 0, 0],
  invertedLightnessClipped: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "color/theme-dark-mode-invert-lightness-heuristic",
  title: "Dark-Mode Lightness Inversion Heuristic",
  description:
    "Apply explicitly heuristic HSL lightness inversion and caller dark-mode bounds, retaining hue/saturation and clipping evidence; not accessible theming, contrast compliance or perceptual inversion.",
  inputs: inputFields,
  outputs: [
    { id: "heuristicDarkHsl", label: "Heuristic dark hsl", kind: "numberList" },
    { id: "heuristicDarkRgb", label: "Heuristic dark rgb", kind: "numberList" },
    {
      id: "invertedLightnessClipped",
      label: "Inverted lightness clipped",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      baseRgb: value.baseRgb as readonly number[],
      callerMinimumDarkModeLightness:
        value.callerMinimumDarkModeLightness as number,
      callerMaximumDarkModeLightness:
        value.callerMaximumDarkModeLightness as number,
    }),
});
export const run = tool.execute;
export default tool;
