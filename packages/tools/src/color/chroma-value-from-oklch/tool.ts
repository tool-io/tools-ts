import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish } from "../batch41-shared.js";
export type Input = Readonly<{
  readonly oklabA: number;
  readonly oklabB: number;
}>;
export type Output = Readonly<{ readonly oklchChroma: number }>;
const inputFields = [
  { id: "oklabA", label: "Oklab a", kind: "number" },
  { id: "oklabB", label: "Oklab b", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return { oklchChroma: Math.hypot(input.oklabA, input.oklabB) };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = { oklabA: 0.03, oklabB: 0.04 } satisfies Input;
export const exampleOutput = { oklchChroma: 0.05 } satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "color/chroma-value-from-oklch",
  title: "Chroma Value From OKLCH",
  description:
    "OKLCH chroma from directly supplied OKL ab opponent axes, not Lab chroma or arbitrary gamma RGB saturation. Explicit declared color space/reference and caller applicability; not spectral equivalence, pigment mixing, press readiness or accessibility certification.",
  inputs: inputFields,
  outputs: [{ id: "oklchChroma", label: "Oklch chroma", kind: "number" }],
  calculate: (value) =>
    calculate({
      oklabA: value.oklabA as number,
      oklabB: value.oklabB as number,
    }),
});
export const run = tool.execute;
export default tool;
