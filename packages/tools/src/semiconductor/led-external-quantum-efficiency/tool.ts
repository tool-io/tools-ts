import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch36-shared.js";
export type Input = Readonly<{
  readonly observedOpticalWatts: number;
  readonly observedLedCurrentAmps: number;
  readonly callerMatchedMeanPhotonEnergyJ: number;
  readonly callerElementaryChargeC: number;
}>;
export type Output = Readonly<{
  readonly observedExternalPhotonPerElectron: number;
}>;
const inputFields = [
  {
    id: "observedOpticalWatts",
    label: "Observed optical watts",
    kind: "number",
  },
  {
    id: "observedLedCurrentAmps",
    label: "Observed led current amps",
    kind: "number",
  },
  {
    id: "callerMatchedMeanPhotonEnergyJ",
    label: "Caller matched mean photon energy j",
    kind: "number",
  },
  {
    id: "callerElementaryChargeC",
    label: "Caller elementary charge c",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.observedLedCurrentAmps, "observedLedCurrentAmps");
  positive(
    input.callerMatchedMeanPhotonEnergyJ,
    "callerMatchedMeanPhotonEnergyJ",
  );
  positive(input.callerElementaryChargeC, "callerElementaryChargeC");
  nonnegative(input.observedOpticalWatts, "observedOpticalWatts");
  return {
    observedExternalPhotonPerElectron:
      ((input.observedOpticalWatts / input.callerMatchedMeanPhotonEnergyJ) *
        input.callerElementaryChargeC) /
      input.observedLedCurrentAmps,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedOpticalWatts: 1,
  observedLedCurrentAmps: 1,
  callerMatchedMeanPhotonEnergyJ: 2e-19,
  callerElementaryChargeC: 1.6e-19,
} satisfies Input;
export const exampleOutput = {
  observedExternalPhotonPerElectron: 0.8,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "semiconductor/led-external-quantum-efficiency",
  title: "Semiconductor LED External Quantum Efficiency Calculator",
  description:
    "Infer observed LED external quantum yield from actual power/current and independently matched spectral mean photon energy, not internal lifetime yield or wall-plug efficiency; no electrical/optical safety.",
  inputs: inputFields,
  outputs: [
    {
      id: "observedExternalPhotonPerElectron",
      label: "Observed external photon per electron",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedOpticalWatts: value.observedOpticalWatts as number,
      observedLedCurrentAmps: value.observedLedCurrentAmps as number,
      callerMatchedMeanPhotonEnergyJ:
        value.callerMatchedMeanPhotonEnergyJ as number,
      callerElementaryChargeC: value.callerElementaryChargeC as number,
    }),
});
export const run = tool.execute;
export default tool;
