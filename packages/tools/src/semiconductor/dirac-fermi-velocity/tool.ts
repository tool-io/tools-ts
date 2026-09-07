import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  linearFit,
} from "../batch36-shared.js";
export type Input = Readonly<{
  readonly observedDiracWavevectorsPerM: readonly number[];
  readonly observedDiracBranchEnergiesJ: readonly number[];
  readonly callerHbarJs: number;
}>;
export type Output = Readonly<{
  readonly signedFittedDiracVelocityMSecond: number;
  readonly diracSlopeFitRSquared: number;
}>;
const inputFields = [
  {
    id: "observedDiracWavevectorsPerM",
    label: "Observed dirac wavevectors per m",
    kind: "numberList",
  },
  {
    id: "observedDiracBranchEnergiesJ",
    label: "Observed dirac branch energies j",
    kind: "numberList",
  },
  { id: "callerHbarJs", label: "Caller hbar js", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.callerHbarJs, "callerHbarJs");
  const fit = linearFit(
    input.observedDiracWavevectorsPerM,
    input.observedDiracBranchEnergiesJ,
  );
  return {
    signedFittedDiracVelocityMSecond: fit.slope / input.callerHbarJs,
    diracSlopeFitRSquared: fit.rSquared,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedDiracWavevectorsPerM: [0, 1, 2],
  observedDiracBranchEnergiesJ: [1, 3, 5],
  callerHbarJs: 2,
} satisfies Input;
export const exampleOutput = {
  signedFittedDiracVelocityMSecond: 1,
  diracSlopeFitRSquared: 1,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "semiconductor/dirac-fermi-velocity",
  title: "Semiconductor Dirac Fermi Velocity Calculator",
  description:
    "Extract actual linear Dirac branch group velocity (1/ℏ) dE/dk in explicit SI conventions, not isotropic Fermi-energy velocity or branch crossing identification.",
  inputs: inputFields,
  outputs: [
    {
      id: "signedFittedDiracVelocityMSecond",
      label: "Signed fitted dirac velocity m second",
      kind: "number",
    },
    {
      id: "diracSlopeFitRSquared",
      label: "Dirac slope fit r squared",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedDiracWavevectorsPerM:
        value.observedDiracWavevectorsPerM as readonly number[],
      observedDiracBranchEnergiesJ:
        value.observedDiracBranchEnergiesJ as readonly number[],
      callerHbarJs: value.callerHbarJs as number,
    }),
});
export const run = tool.execute;
export default tool;
