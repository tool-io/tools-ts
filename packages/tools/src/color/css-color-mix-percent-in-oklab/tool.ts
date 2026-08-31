import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  rgb,
  encode,
  oklab,
  fromOklab,
  nonnegative,
  positive,
} from "../batch-shared.js";
export type Input = Readonly<{
  readonly firstRgb: readonly number[];
  readonly secondRgb: readonly number[];
  readonly firstWeightPercent: number;
  readonly secondWeightPercent: number;
}>;
export type Output = Readonly<{
  readonly mixedOklab: readonly number[];
  readonly mixedRgb: readonly number[];
  readonly resultAlpha: number;
  readonly clippedLinearChannelIndices: readonly number[];
}>;
const inputFields = [
  { id: "firstRgb", label: "First rgb", kind: "numberList" },
  { id: "secondRgb", label: "Second rgb", kind: "numberList" },
  { id: "firstWeightPercent", label: "First weight percent", kind: "number" },
  { id: "secondWeightPercent", label: "Second weight percent", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  nonnegative(input.firstWeightPercent, "firstWeightPercent");
  nonnegative(input.secondWeightPercent, "secondWeightPercent");
  rgb(input.firstRgb);
  rgb(input.secondRgb);
  if (input.firstWeightPercent > 100 || input.secondWeightPercent > 100)
    simpleError("weight", "Individual percentages in [0,100] required.");
  const total = positive(
      input.firstWeightPercent + input.secondWeightPercent,
      "weights",
    ),
    t = input.secondWeightPercent / total,
    a = oklab(input.firstRgb),
    b = oklab(input.secondRgb),
    mixed = a.map((v, i) => v * (1 - t) + b[i] * t),
    raw = fromOklab(mixed);
  return {
    mixedOklab: mixed,
    mixedRgb: raw.map((v) => encode(Math.max(0, Math.min(1, v)))),
    resultAlpha: Math.min(1, total / 100),
    clippedLinearChannelIndices: raw.flatMap((v, i) =>
      v < -1e-7 || v > 1 + 1e-7 ? [i] : [],
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  firstRgb: [0, 0, 0],
  secondRgb: [1, 1, 1],
  firstWeightPercent: 50,
  secondWeightPercent: 50,
} satisfies Input;
export const exampleOutput = {
  mixedOklab: [0.4999999967367731, 4.047640056459744e-11, 1.863695381354002e-8],
  mixedRgb: [0.3885728718975863, 0.3885728554029942, 0.38857281075518224],
  resultAlpha: 1,
  clippedLinearChannelIndices: [],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "color/css-color-mix-percent-in-oklab",
  title: "CSS color-mix Percent in OKLab",
  description:
    "Mix opaque gamma-sRGB colors in OKLab using CSS-style normalized weights and alpha reduction if total weight below 100%; explicit two weights, no missing components, premultiplied input alpha, hue interpolation or gamut-mapping certification.",
  inputs: inputFields,
  outputs: [
    { id: "mixedOklab", label: "Mixed oklab", kind: "numberList" },
    { id: "mixedRgb", label: "Mixed rgb", kind: "numberList" },
    { id: "resultAlpha", label: "Result alpha", kind: "number" },
    {
      id: "clippedLinearChannelIndices",
      label: "Clipped linear channel indices",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      firstRgb: value.firstRgb as readonly number[],
      secondRgb: value.secondRgb as readonly number[],
      firstWeightPercent: value.firstWeightPercent as number,
      secondWeightPercent: value.secondWeightPercent as number,
    }),
});
export const run = tool.execute;
export default tool;
