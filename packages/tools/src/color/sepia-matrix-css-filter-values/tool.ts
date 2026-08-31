import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  rgb,
  multiply,
  fraction,
} from "../batch-shared.js";
export type Input = Readonly<{
  readonly baseRgb: readonly number[];
  readonly sepiaFraction: number;
}>;
export type Output = Readonly<{
  readonly sepiaRgb: readonly number[];
  readonly clippedChannelIndices: readonly number[];
}>;
const inputFields = [
  { id: "baseRgb", label: "Base rgb", kind: "numberList" },
  { id: "sepiaFraction", label: "Sepia fraction", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  fraction(input.sepiaFraction, "sepiaFraction");
  rgb(input.baseRgb);
  const full = multiply(
      [
        [0.393, 0.769, 0.189],
        [0.349, 0.686, 0.168],
        [0.272, 0.534, 0.131],
      ],
      input.baseRgb,
    ),
    raw = input.baseRgb.map((v, i) => v + (full[i] - v) * input.sepiaFraction);
  return {
    sepiaRgb: raw.map((v) => Math.max(0, Math.min(1, v))),
    clippedChannelIndices: raw.flatMap((v, i) => (v < 0 || v > 1 ? [i] : [])),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  baseRgb: [1, 0, 0],
  sepiaFraction: 1,
} satisfies Input;
export const exampleOutput = {
  sepiaRgb: [0.393, 0.349, 0.272],
  clippedChannelIndices: [],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "color/sepia-matrix-css-filter-values",
  title: "Sepia Matrix CSS Filter Values",
  description:
    "Apply CSS sepia matrix interpolated with identity in gamma-sRGB, exposing output clipping; artistic filter not historical film emulsion or a perceptual color correction.",
  inputs: inputFields,
  outputs: [
    { id: "sepiaRgb", label: "Sepia rgb", kind: "numberList" },
    {
      id: "clippedChannelIndices",
      label: "Clipped channel indices",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      baseRgb: value.baseRgb as readonly number[],
      sepiaFraction: value.sepiaFraction as number,
    }),
});
export const run = tool.execute;
export default tool;
