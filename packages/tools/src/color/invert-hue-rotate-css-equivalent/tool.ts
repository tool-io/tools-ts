import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  rgb,
  hue,
  applyMatrix,
  fraction,
} from "../batch-shared.js";
export type Input = Readonly<{
  readonly baseRgb: readonly number[];
  readonly invertFraction: number;
  readonly hueRotateDegrees: number;
}>;
export type Output = Readonly<{
  readonly filteredRgb: readonly number[];
  readonly clippedChannelIndices: readonly number[];
}>;
const inputFields = [
  { id: "baseRgb", label: "Base rgb", kind: "numberList" },
  { id: "invertFraction", label: "Invert fraction", kind: "number" },
  { id: "hueRotateDegrees", label: "Hue rotate degrees", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  fraction(input.invertFraction, "invertFraction");
  rgb(input.baseRgb);
  const c = input.baseRgb.map(
      (v) => v * (1 - input.invertFraction) + (1 - v) * input.invertFraction,
    ),
    t = (hue(input.hueRotateDegrees) * Math.PI) / 180,
    co = Math.cos(t),
    si = Math.sin(t),
    m = [
      [
        0.213 + 0.787 * co - 0.213 * si,
        0.715 - 0.715 * co - 0.715 * si,
        0.072 - 0.072 * co + 0.928 * si,
      ],
      [
        0.213 - 0.213 * co + 0.143 * si,
        0.715 + 0.285 * co + 0.14 * si,
        0.072 - 0.072 * co - 0.283 * si,
      ],
      [
        0.213 - 0.213 * co - 0.787 * si,
        0.715 - 0.715 * co + 0.715 * si,
        0.072 + 0.928 * co + 0.072 * si,
      ],
    ],
    r = applyMatrix(c, m);
  return {
    filteredRgb: r.rgbChannels,
    clippedChannelIndices: r.clippedChannelIndices,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  baseRgb: [1, 0, 0],
  invertFraction: 1,
  hueRotateDegrees: 180,
} satisfies Input;
export const exampleOutput = {
  filteredRgb: [1, 0.574, 0.574],
  clippedChannelIndices: [0],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "color/invert-hue-rotate-css-equivalent",
  title: "CSS hue-rotate Invert Equivalent",
  description:
    "Apply CSS-style invert then gamma-domain hue-rotate matrix in stated order, clipping/reporting output channels; HSL hue rotation is not generally equivalent. No claim about other filter order or browser color-management pipelines.",
  inputs: inputFields,
  outputs: [
    { id: "filteredRgb", label: "Filtered rgb", kind: "numberList" },
    {
      id: "clippedChannelIndices",
      label: "Clipped channel indices",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      baseRgb: value.baseRgb as readonly number[],
      invertFraction: value.invertFraction as number,
      hueRotateDegrees: value.hueRotateDegrees as number,
    }),
});
export const run = tool.execute;
export default tool;
