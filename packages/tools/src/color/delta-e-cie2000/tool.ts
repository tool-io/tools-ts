import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, delta2000 } from "../batch-shared.js";
export type Input = Readonly<{
  readonly firstLab: readonly number[];
  readonly secondLab: readonly number[];
  readonly lightnessFactor: number;
  readonly chromaFactor: number;
  readonly hueFactor: number;
}>;
export type Output = Readonly<{ readonly ciede2000Difference: number }>;
const inputFields = [
  { id: "firstLab", label: "First lab", kind: "numberList" },
  { id: "secondLab", label: "Second lab", kind: "numberList" },
  { id: "lightnessFactor", label: "Lightness factor", kind: "number" },
  { id: "chromaFactor", label: "Chroma factor", kind: "number" },
  { id: "hueFactor", label: "Hue factor", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return {
    ciede2000Difference: delta2000(
      input.firstLab,
      input.secondLab,
      input.lightnessFactor,
      input.chromaFactor,
      input.hueFactor,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  firstLab: [50, 2.6772, -79.7751],
  secondLab: [50, 0, -82.7485],
  lightnessFactor: 1,
  chromaFactor: 1,
  hueFactor: 1,
} satisfies Input;
export const exampleOutput = {
  ciede2000Difference: 2.0424596801565764,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "color/delta-e-cie2000",
  title: "Delta E CIE2000 Calculator",
  description:
    "Compute CIEDE2000 with explicit positive parametric factors and same-white CIELAB inputs; supports neutral chroma and hue wrap, not a spectral color-match or universal perceptibility judgement.",
  inputs: inputFields,
  outputs: [
    {
      id: "ciede2000Difference",
      label: "Ciede2000 difference",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      firstLab: value.firstLab as readonly number[],
      secondLab: value.secondLab as readonly number[],
      lightnessFactor: value.lightnessFactor as number,
      chromaFactor: value.chromaFactor as number,
      hueFactor: value.hueFactor as number,
    }),
});
export const run = tool.execute;
export default tool;
