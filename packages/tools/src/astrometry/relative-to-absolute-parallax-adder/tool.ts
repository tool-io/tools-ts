import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish } from "../batch41-shared.js";
export type Input = Readonly<{
  readonly relativeParallaxMas: number;
  readonly independentlyCalibratedAbsoluteCorrectionMas: number;
}>;
export type Output = Readonly<{
  readonly correctedAbsoluteParallaxMas: number;
}>;
const inputFields = [
  { id: "relativeParallaxMas", label: "Relative parallax mas", kind: "number" },
  {
    id: "independentlyCalibratedAbsoluteCorrectionMas",
    label: "Independently calibrated absolute correction mas",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return {
    correctedAbsoluteParallaxMas:
      input.relativeParallaxMas +
      input.independentlyCalibratedAbsoluteCorrectionMas,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  relativeParallaxMas: -1,
  independentlyCalibratedAbsoluteCorrectionMas: 0.2,
} satisfies Input;
export const exampleOutput = {
  correctedAbsoluteParallaxMas: -0.8,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "astrometry/relative-to-absolute-parallax-adder",
  title: "Relative Parallax to Absolute Correction Adder",
  description:
    "Add independently measured field relative-to-absolute correction, preserving nonpositive results; distinct from subtraction of catalog source zero point, no distance inversion. Caller independently establishes frames, units, epoch, covariance and instrument context; not an identity, association or astrometric quality certification.",
  inputs: inputFields,
  outputs: [
    {
      id: "correctedAbsoluteParallaxMas",
      label: "Corrected absolute parallax mas",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      relativeParallaxMas: value.relativeParallaxMas as number,
      independentlyCalibratedAbsoluteCorrectionMas:
        value.independentlyCalibratedAbsoluteCorrectionMas as number,
    }),
});
export const run = tool.execute;
export default tool;
