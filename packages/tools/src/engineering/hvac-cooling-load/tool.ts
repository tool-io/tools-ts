import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  aligned,
  sum,
} from "../batch38-shared.js";
export type Input = Readonly<{
  readonly callerMatchedCoolingConductancesWK: readonly number[];
  readonly observedCoolingZoneTemperatureDifferencesK: readonly number[];
  readonly callerIndependentCoolingInternalWatts: readonly number[];
  readonly callerIndependentCondensedWaterKgSecond: readonly number[];
  readonly callerMatchedLatentHeatJKg: number;
}>;
export type Output = Readonly<{ readonly signedTotalZoneLoadW: number }>;
const inputFields = [
  {
    id: "callerMatchedCoolingConductancesWK",
    label: "Caller matched cooling conductances w k",
    kind: "numberList",
  },
  {
    id: "observedCoolingZoneTemperatureDifferencesK",
    label: "Observed cooling zone temperature differences k",
    kind: "numberList",
  },
  {
    id: "callerIndependentCoolingInternalWatts",
    label: "Caller independent cooling internal watts",
    kind: "numberList",
  },
  {
    id: "callerIndependentCondensedWaterKgSecond",
    label: "Caller independent condensed water kg second",
    kind: "numberList",
  },
  {
    id: "callerMatchedLatentHeatJKg",
    label: "Caller matched latent heat j kg",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.callerMatchedLatentHeatJKg, "latent heat");
  aligned(
    input.callerMatchedCoolingConductancesWK,
    input.callerIndependentCondensedWaterKgSecond,
    "latent zone exposures",
  );
  input.callerIndependentCondensedWaterKgSecond.forEach((v) =>
    nonnegative(v, "condensed water"),
  );
  input.callerMatchedCoolingConductancesWK.forEach((v) =>
    nonnegative(v, "callerMatchedCoolingConductancesWK"),
  );
  aligned(
    input.callerMatchedCoolingConductancesWK,
    input.observedCoolingZoneTemperatureDifferencesK,
    "callerMatchedCoolingConductancesWK",
  );
  aligned(
    input.callerMatchedCoolingConductancesWK,
    input.callerIndependentCoolingInternalWatts,
    "callerMatchedCoolingConductancesWK",
  );
  return {
    signedTotalZoneLoadW: sum(
      input.callerMatchedCoolingConductancesWK.map(
        (v, i) =>
          v * input.observedCoolingZoneTemperatureDifferencesK[i] +
          input.callerIndependentCoolingInternalWatts[i] +
          input.callerIndependentCondensedWaterKgSecond[i] *
            input.callerMatchedLatentHeatJKg,
      ),
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerMatchedCoolingConductancesWK: [2, 3],
  observedCoolingZoneTemperatureDifferencesK: [4, 2],
  callerIndependentCoolingInternalWatts: [1, 2],
  callerIndependentCondensedWaterKgSecond: [0, 0],
  callerMatchedLatentHeatJKg: 100,
} satisfies Input;
export const exampleOutput = { signedTotalZoneLoadW: 17 } satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "engineering/hvac-cooling-load",
  title: "HVAC Cooling Load Calculator",
  description:
    "Sum actual zone sensible conduction/internal gains AND independently established moisture-condensation latent cooling loads; materially different from heating-only sensible budget. Caller independently establishes units, boundary, calibration and applicability; not code building-load compliance or equipment sizing approval.",
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
      callerMatchedCoolingConductancesWK:
        value.callerMatchedCoolingConductancesWK as readonly number[],
      observedCoolingZoneTemperatureDifferencesK:
        value.observedCoolingZoneTemperatureDifferencesK as readonly number[],
      callerIndependentCoolingInternalWatts:
        value.callerIndependentCoolingInternalWatts as readonly number[],
      callerIndependentCondensedWaterKgSecond:
        value.callerIndependentCondensedWaterKgSecond as readonly number[],
      callerMatchedLatentHeatJKg: value.callerMatchedLatentHeatJKg as number,
    }),
});
export const run = tool.execute;
export default tool;
