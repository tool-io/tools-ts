import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, positive } from "../shared.js";
export type Input = Readonly<{
  readonly offResonanceHz: readonly number[];
  readonly effectivePhaseHzPerPixel: number;
  readonly phasePixelMm: number;
}>;
export type Output = Readonly<{
  readonly signedShiftPixels: readonly number[];
  readonly signedDisplacementsMm: readonly number[];
}>;
const inputFields = [
  {
    id: "offResonanceHz",
    label: "Off resonance hz",
    kind: "numberList",
    unit: "Hz",
  },
  {
    id: "effectivePhaseHzPerPixel",
    label: "Effective phase hz per pixel",
    kind: "number",
  },
  { id: "phasePixelMm", label: "Phase pixel mm", kind: "number", unit: "mm" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  if (!input.offResonanceHz.length)
    simpleError(
      "offResonanceHz",
      "Nonempty off-resonance map samples required.",
    );
  positive(input.effectivePhaseHzPerPixel, "effectivePhaseHzPerPixel");
  positive(input.phasePixelMm, "phasePixelMm");
  const signedShiftPixels = input.offResonanceHz.map(
    (v) => v / input.effectivePhaseHzPerPixel,
  );
  return {
    signedShiftPixels,
    signedDisplacementsMm: signedShiftPixels.map((v) => v * input.phasePixelMm),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  offResonanceHz: [-50, 0, 50],
  effectivePhaseHzPerPixel: 10,
  phasePixelMm: 2,
} satisfies Input;
export const exampleOutput = {
  signedShiftPixels: [-5, 0, 5],
  signedDisplacementsMm: [-10, 0, 10],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "mri/off-resonance-phase-encode-displacement",
  title: "Susceptibility Artifact Shift",
  description:
    "Estimate EPI phase-direction displacement from a measured off-resonance map and effective reconstructed phase bandwidth; susceptibility source fields and nonlinear pile-up are not solved.",
  inputs: inputFields,
  outputs: [
    {
      id: "signedShiftPixels",
      label: "Signed shift pixels",
      kind: "numberList",
    },
    {
      id: "signedDisplacementsMm",
      label: "Signed displacements mm",
      kind: "numberList",
      unit: "mm",
    },
  ],
  calculate: (value) =>
    calculate({
      offResonanceHz: value.offResonanceHz as readonly number[],
      effectivePhaseHzPerPixel: value.effectivePhaseHzPerPixel as number,
      phasePixelMm: value.phasePixelMm as number,
    }),
});
export const run = tool.execute;
export default tool;
