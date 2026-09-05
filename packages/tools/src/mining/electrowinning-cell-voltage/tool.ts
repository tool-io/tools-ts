import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  aligned,
} from "../batch37-shared.js";
export type Input = Readonly<{
  readonly observedElectrodePotentialDifferencesV: readonly number[];
  readonly observedAnodeOverpotentialsV: readonly number[];
  readonly observedCathodeOverpotentialMagnitudesV: readonly number[];
  readonly observedCurrentAmps: readonly number[];
  readonly observedIndependentElectrolyteOhms: readonly number[];
}>;
export type Output = Readonly<{
  readonly reconciledElectrowinningCellVolts: readonly number[];
}>;
const inputFields = [
  {
    id: "observedElectrodePotentialDifferencesV",
    label: "Observed electrode potential differences v",
    kind: "numberList",
  },
  {
    id: "observedAnodeOverpotentialsV",
    label: "Observed anode overpotentials v",
    kind: "numberList",
  },
  {
    id: "observedCathodeOverpotentialMagnitudesV",
    label: "Observed cathode overpotential magnitudes v",
    kind: "numberList",
  },
  {
    id: "observedCurrentAmps",
    label: "Observed current amps",
    kind: "numberList",
  },
  {
    id: "observedIndependentElectrolyteOhms",
    label: "Observed independent electrolyte ohms",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedAnodeOverpotentialsV.forEach((v) =>
    nonnegative(v, "observedAnodeOverpotentialsV"),
  );
  input.observedCathodeOverpotentialMagnitudesV.forEach((v) =>
    nonnegative(v, "observedCathodeOverpotentialMagnitudesV"),
  );
  input.observedCurrentAmps.forEach((v) =>
    nonnegative(v, "observedCurrentAmps"),
  );
  input.observedIndependentElectrolyteOhms.forEach((v) =>
    nonnegative(v, "observedIndependentElectrolyteOhms"),
  );
  aligned(
    input.observedElectrodePotentialDifferencesV,
    input.observedAnodeOverpotentialsV,
    "observedElectrodePotentialDifferencesV",
  );
  aligned(
    input.observedElectrodePotentialDifferencesV,
    input.observedCathodeOverpotentialMagnitudesV,
    "observedElectrodePotentialDifferencesV",
  );
  aligned(
    input.observedElectrodePotentialDifferencesV,
    input.observedCurrentAmps,
    "observedElectrodePotentialDifferencesV",
  );
  aligned(
    input.observedElectrodePotentialDifferencesV,
    input.observedIndependentElectrolyteOhms,
    "observedElectrodePotentialDifferencesV",
  );
  return {
    reconciledElectrowinningCellVolts:
      input.observedElectrodePotentialDifferencesV.map(
        (v, i) =>
          v +
          input.observedAnodeOverpotentialsV[i] +
          input.observedCathodeOverpotentialMagnitudesV[i] +
          input.observedCurrentAmps[i] *
            input.observedIndependentElectrolyteOhms[i],
      ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedElectrodePotentialDifferencesV: [1, 2],
  observedAnodeOverpotentialsV: [0.1, 0.2],
  observedCathodeOverpotentialMagnitudesV: [0.2, 0.3],
  observedCurrentAmps: [10, 20],
  observedIndependentElectrolyteOhms: [0.01, 0.02],
} satisfies Input;
export const exampleOutput = {
  reconciledElectrowinningCellVolts: [1.4, 2.9],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "mining/electrowinning-cell-voltage",
  title: "Electrowinning Cell Voltage Calculator",
  description:
    "Reconcile actual electrowinning potential/overpotential/electrolyte-ohmic budget, not rectifier Faraday mass energy or electrochemical operation instructions. Caller independently verifies units, applicability and matching conditions; no operational recipe, safety certification, causal efficacy or legal/resource classification is inferred.",
  inputs: inputFields,
  outputs: [
    {
      id: "reconciledElectrowinningCellVolts",
      label: "Reconciled electrowinning cell volts",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      observedElectrodePotentialDifferencesV:
        value.observedElectrodePotentialDifferencesV as readonly number[],
      observedAnodeOverpotentialsV:
        value.observedAnodeOverpotentialsV as readonly number[],
      observedCathodeOverpotentialMagnitudesV:
        value.observedCathodeOverpotentialMagnitudesV as readonly number[],
      observedCurrentAmps: value.observedCurrentAmps as readonly number[],
      observedIndependentElectrolyteOhms:
        value.observedIndependentElectrolyteOhms as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
