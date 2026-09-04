import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, fraction } from "../batch38-shared.js";
export type Input = Readonly<{
  readonly normalizedSpatialFrequencies: readonly number[];
}>;
export type Output = Readonly<{
  readonly circularIncoherentDiffractionMtf: readonly number[];
}>;
const inputFields = [
  {
    id: "normalizedSpatialFrequencies",
    label: "Normalized spatial frequencies",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.normalizedSpatialFrequencies.forEach((v) =>
    fraction(v, "normalizedSpatialFrequencies"),
  );
  return {
    circularIncoherentDiffractionMtf: input.normalizedSpatialFrequencies.map(
      (v) => (2 / Math.PI) * (Math.acos(v) - v * Math.sqrt(1 - v * v)),
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  normalizedSpatialFrequencies: [0, 0.5, 1],
} satisfies Input;
export const exampleOutput = {
  circularIncoherentDiffractionMtf: [1, 0.3910022189557706, 0],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "engineering/mtf-diffraction-limited",
  title: "Diffraction-Limited MTF Calculator",
  description:
    "Ideal unobscured circular pupil INCOHERENT diffraction MTF with normalized frequency0–1; not coherent transfer, aberrations or measured optical quality. Caller independently establishes units, regime, calibration and applicability; this does not establish design-code compliance, authenticity, operational safety, treatment efficacy or a validated forecast.",
  inputs: inputFields,
  outputs: [
    {
      id: "circularIncoherentDiffractionMtf",
      label: "Circular incoherent diffraction mtf",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      normalizedSpatialFrequencies:
        value.normalizedSpatialFrequencies as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
