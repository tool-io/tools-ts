import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  linearFit,
} from "../batch36-shared.js";
export type Input = Readonly<{
  readonly observedVcselDriveAmps: readonly number[];
  readonly observedVcselOpticalWatts: readonly number[];
  readonly callerMatchedPhotonEnergyEv: number;
}>;
export type Output = Readonly<{
  readonly extractedVcselDifferentialQuantumEfficiency: number;
  readonly measuredVcselSlopeWattsAmp: number;
  readonly fitRSquared: number;
}>;
const inputFields = [
  {
    id: "observedVcselDriveAmps",
    label: "Observed vcsel drive amps",
    kind: "numberList",
  },
  {
    id: "observedVcselOpticalWatts",
    label: "Observed vcsel optical watts",
    kind: "numberList",
  },
  {
    id: "callerMatchedPhotonEnergyEv",
    label: "Caller matched photon energy ev",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.callerMatchedPhotonEnergyEv, "callerMatchedPhotonEnergyEv");
  input.observedVcselDriveAmps.forEach((v) =>
    nonnegative(v, "observedVcselDriveAmps"),
  );
  input.observedVcselOpticalWatts.forEach((v) =>
    nonnegative(v, "observedVcselOpticalWatts"),
  );
  const fit = linearFit(
    input.observedVcselDriveAmps,
    input.observedVcselOpticalWatts,
  );
  return {
    extractedVcselDifferentialQuantumEfficiency:
      fit.slope / input.callerMatchedPhotonEnergyEv,
    measuredVcselSlopeWattsAmp: fit.slope,
    fitRSquared: fit.rSquared,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedVcselDriveAmps: [1, 2, 3],
  observedVcselOpticalWatts: [1, 3, 5],
  callerMatchedPhotonEnergyEv: 2,
} satisfies Input;
export const exampleOutput = {
  extractedVcselDifferentialQuantumEfficiency: 1,
  measuredVcselSlopeWattsAmp: 2,
  fitRSquared: 1,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "semiconductor/vcsel-differential-efficiency",
  title: "Semiconductor Vcsel Differential Efficiency Calculator",
  description:
    "Extract actual multi-point VCSEL optical slope and inverse differential quantum yield, photon energy eV numerically watts/amp; not forward laser slope efficiency model.",
  inputs: inputFields,
  outputs: [
    {
      id: "extractedVcselDifferentialQuantumEfficiency",
      label: "Extracted vcsel differential quantum efficiency",
      kind: "number",
    },
    {
      id: "measuredVcselSlopeWattsAmp",
      label: "Measured vcsel slope watts amp",
      kind: "number",
    },
    { id: "fitRSquared", label: "Fit r squared", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      observedVcselDriveAmps: value.observedVcselDriveAmps as readonly number[],
      observedVcselOpticalWatts:
        value.observedVcselOpticalWatts as readonly number[],
      callerMatchedPhotonEnergyEv: value.callerMatchedPhotonEnergyEv as number,
    }),
});
export const run = tool.execute;
export default tool;
