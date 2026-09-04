import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  aligned,
  sum,
} from "../batch38-shared.js";
export type Input = Readonly<{
  readonly callerMatchedHeatingConductancesWK: readonly number[];
  readonly observedHeatingZoneTemperatureDifferencesK: readonly number[];
  readonly callerIndependentHeatingInternalWatts: readonly number[];
}>;
export type Output = Readonly<{ readonly signedTotalZoneLoadW: number }>;
const inputFields = [
  {
    id: "callerMatchedHeatingConductancesWK",
    label: "Caller matched heating conductances w k",
    kind: "numberList",
  },
  {
    id: "observedHeatingZoneTemperatureDifferencesK",
    label: "Observed heating zone temperature differences k",
    kind: "numberList",
  },
  {
    id: "callerIndependentHeatingInternalWatts",
    label: "Caller independent heating internal watts",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.callerMatchedHeatingConductancesWK.forEach((v) =>
    nonnegative(v, "callerMatchedHeatingConductancesWK"),
  );
  aligned(
    input.callerMatchedHeatingConductancesWK,
    input.observedHeatingZoneTemperatureDifferencesK,
    "callerMatchedHeatingConductancesWK",
  );
  aligned(
    input.callerMatchedHeatingConductancesWK,
    input.callerIndependentHeatingInternalWatts,
    "callerMatchedHeatingConductancesWK",
  );
  return {
    signedTotalZoneLoadW: sum(
      input.callerMatchedHeatingConductancesWK.map(
        (v, i) =>
          v * input.observedHeatingZoneTemperatureDifferencesK[i] +
          input.callerIndependentHeatingInternalWatts[i],
      ),
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerMatchedHeatingConductancesWK: [2, 3],
  observedHeatingZoneTemperatureDifferencesK: [4, 2],
  callerIndependentHeatingInternalWatts: [1, 2],
} satisfies Input;
export const exampleOutput = { signedTotalZoneLoadW: 17 } satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "engineering/hvac-heating-load",
  title: "HVAC Heating Load Calculator",
  description:
    "Sum distinct actual signed heating zones with independent conductance/temperature/internal-gain boundaries; not a single heat-flux formula or code building-load model. Caller independently establishes units, regime, calibration and applicability; this does not establish design-code compliance, authenticity, operational safety, treatment efficacy or a validated forecast.",
  inputs: inputFields,
  outputs: [
    {
      id: "signedTotalZoneLoadW",
      label: "Signed total zone load w",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      callerMatchedHeatingConductancesWK:
        value.callerMatchedHeatingConductancesWK as readonly number[],
      observedHeatingZoneTemperatureDifferencesK:
        value.observedHeatingZoneTemperatureDifferencesK as readonly number[],
      callerIndependentHeatingInternalWatts:
        value.callerIndependentHeatingInternalWatts as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
