import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, vector3 } from "../batch41-shared.js";
export type Input = Readonly<{
  readonly referenceLab: readonly number[];
  readonly sampleLab: readonly number[];
}>;
export type Output = Readonly<{ readonly deltaECie76: number }>;
const inputFields = [
  { id: "referenceLab", label: "Reference lab", kind: "numberList" },
  { id: "sampleLab", label: "Sample lab", kind: "numberList" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  vector3(input.referenceLab, "referenceLab");
  vector3(input.sampleLab, "sampleLab");
  return {
    deltaECie76: Math.hypot(
      ...input.referenceLab.map((v, i) => v - input.sampleLab[i]),
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  referenceLab: [50, 3, 4],
  sampleLab: [50, 0, 0],
} satisfies Input;
export const exampleOutput = { deltaECie76: 5 } satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "color/delta-e-cie76",
  title: "Delta E CIE76 Calculator",
  description:
    "CIE76 Euclidean distance on directly supplied same-white CIELAB coordinates, unlike existing s RGB hex→Lab conversion. Explicit declared color space/reference and caller applicability; not spectral equivalence, pigment mixing, press readiness or accessibility certification.",
  inputs: inputFields,
  outputs: [{ id: "deltaECie76", label: "Delta e cie76", kind: "number" }],
  calculate: (value) =>
    calculate({
      referenceLab: value.referenceLab as readonly number[],
      sampleLab: value.sampleLab as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
