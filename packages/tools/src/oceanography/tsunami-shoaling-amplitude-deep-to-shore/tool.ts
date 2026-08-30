import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  fraction,
} from "../shared.js";
export type Input = Readonly<{
  readonly referenceAmplitudeM: number;
  readonly referenceDepthM: number;
  readonly shoreDepthM: number;
  readonly referenceRayWidthM: number;
  readonly shoreRayWidthM: number;
  readonly retainedEnergyFluxFraction: number;
}>;
export type Output = Readonly<{
  readonly shoaledAmplitudeM: number;
  readonly amplitudeMultiplier: number;
}>;
const inputFields = [
  { id: "referenceAmplitudeM", label: "Reference amplitude m", kind: "number" },
  { id: "referenceDepthM", label: "Reference depth m", kind: "number" },
  { id: "shoreDepthM", label: "Shore depth m", kind: "number" },
  { id: "referenceRayWidthM", label: "Reference ray width m", kind: "number" },
  { id: "shoreRayWidthM", label: "Shore ray width m", kind: "number" },
  {
    id: "retainedEnergyFluxFraction",
    label: "Retained energy flux fraction",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.referenceDepthM, "referenceDepthM");
  positive(input.shoreDepthM, "shoreDepthM");
  positive(input.referenceRayWidthM, "referenceRayWidthM");
  positive(input.shoreRayWidthM, "shoreRayWidthM");
  nonnegative(input.referenceAmplitudeM, "referenceAmplitudeM");
  fraction(input.retainedEnergyFluxFraction, "retainedEnergyFluxFraction");
  const amplitudeMultiplier =
    (input.referenceDepthM / input.shoreDepthM) ** 0.25 *
    Math.sqrt(
      (input.referenceRayWidthM / input.shoreRayWidthM) *
        input.retainedEnergyFluxFraction,
    );
  return {
    shoaledAmplitudeM: input.referenceAmplitudeM * amplitudeMultiplier,
    amplitudeMultiplier,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  referenceAmplitudeM: 1,
  referenceDepthM: 100,
  shoreDepthM: 1,
  referenceRayWidthM: 100,
  shoreRayWidthM: 25,
  retainedEnergyFluxFraction: 1,
} satisfies Input;
export const exampleOutput = {
  shoaledAmplitudeM: 6.324555320336759,
  amplitudeMultiplier: 6.324555320336759,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "oceanography/tsunami-shoaling-amplitude-deep-to-shore",
  title: "Tsunami Shoaling Amplitude Deep To Shore",
  description:
    "Apply linear long-wave Green shoaling plus supplied ray-width and energy-loss factors; excludes breaking, resonance and inundation and does not certify tsunami hazard.",
  inputs: inputFields,
  outputs: [
    { id: "shoaledAmplitudeM", label: "Shoaled amplitude m", kind: "number" },
    {
      id: "amplitudeMultiplier",
      label: "Amplitude multiplier",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      referenceAmplitudeM: value.referenceAmplitudeM as number,
      referenceDepthM: value.referenceDepthM as number,
      shoreDepthM: value.shoreDepthM as number,
      referenceRayWidthM: value.referenceRayWidthM as number,
      shoreRayWidthM: value.shoreRayWidthM as number,
      retainedEnergyFluxFraction: value.retainedEnergyFluxFraction as number,
    }),
});
export const run = tool.execute;
export default tool;
