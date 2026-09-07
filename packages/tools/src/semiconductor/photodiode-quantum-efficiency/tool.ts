import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch36-shared.js";
export type Input = Readonly<{
  readonly observedIlluminatedCurrentAmps: number;
  readonly observedDarkCurrentAmps: number;
  readonly observedIncidentOpticalWatts: number;
  readonly callerMatchedPhotonEnergyJ: number;
  readonly callerElementaryChargeC: number;
}>;
export type Output = Readonly<{
  readonly signedDarkSubtractedPhotodiodeQuantumYield: number;
}>;
const inputFields = [
  {
    id: "observedIlluminatedCurrentAmps",
    label: "Observed illuminated current amps",
    kind: "number",
  },
  {
    id: "observedDarkCurrentAmps",
    label: "Observed dark current amps",
    kind: "number",
  },
  {
    id: "observedIncidentOpticalWatts",
    label: "Observed incident optical watts",
    kind: "number",
  },
  {
    id: "callerMatchedPhotonEnergyJ",
    label: "Caller matched photon energy j",
    kind: "number",
  },
  {
    id: "callerElementaryChargeC",
    label: "Caller elementary charge c",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.observedIncidentOpticalWatts, "observedIncidentOpticalWatts");
  positive(input.callerMatchedPhotonEnergyJ, "callerMatchedPhotonEnergyJ");
  positive(input.callerElementaryChargeC, "callerElementaryChargeC");
  nonnegative(
    input.observedIlluminatedCurrentAmps,
    "observedIlluminatedCurrentAmps",
  );
  nonnegative(input.observedDarkCurrentAmps, "observedDarkCurrentAmps");
  return {
    signedDarkSubtractedPhotodiodeQuantumYield:
      (((input.observedIlluminatedCurrentAmps - input.observedDarkCurrentAmps) /
        input.callerElementaryChargeC) *
        input.callerMatchedPhotonEnergyJ) /
      input.observedIncidentOpticalWatts,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedIlluminatedCurrentAmps: 0.5,
  observedDarkCurrentAmps: 0.1,
  observedIncidentOpticalWatts: 1,
  callerMatchedPhotonEnergyJ: 2e-19,
  callerElementaryChargeC: 1.6e-19,
} satisfies Input;
export const exampleOutput = {
  signedDarkSubtractedPhotodiodeQuantumYield: 0.5,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "semiconductor/photodiode-quantum-efficiency",
  title: "Semiconductor Photodiode Quantum Efficiency Calculator",
  description:
    "Infer actual dark-subtracted photodiode photon/electron yield, retain negative/above-one measurement evidence, distinct from forward responsivity formula; no detector calibration guarantee.",
  inputs: inputFields,
  outputs: [
    {
      id: "signedDarkSubtractedPhotodiodeQuantumYield",
      label: "Signed dark subtracted photodiode quantum yield",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedIlluminatedCurrentAmps:
        value.observedIlluminatedCurrentAmps as number,
      observedDarkCurrentAmps: value.observedDarkCurrentAmps as number,
      observedIncidentOpticalWatts:
        value.observedIncidentOpticalWatts as number,
      callerMatchedPhotonEnergyJ: value.callerMatchedPhotonEnergyJ as number,
      callerElementaryChargeC: value.callerElementaryChargeC as number,
    }),
});
export const run = tool.execute;
export default tool;
