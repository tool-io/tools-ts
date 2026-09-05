import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  aligned,
  sum,
} from "../batch37-shared.js";
export type Input = Readonly<{
  readonly observedElectrowinningPowerKw: readonly number[];
  readonly observedRunHours: readonly number[];
  readonly observedAuxiliaryEnergyKwh: readonly number[];
  readonly observedDepositedMetalKg: readonly number[];
}>;
export type Output = Readonly<{
  readonly observedTotalPlantKwh: number;
  readonly observedMeteredKwhPerKg: number;
}>;
const inputFields = [
  {
    id: "observedElectrowinningPowerKw",
    label: "Observed electrowinning power kw",
    kind: "numberList",
  },
  { id: "observedRunHours", label: "Observed run hours", kind: "numberList" },
  {
    id: "observedAuxiliaryEnergyKwh",
    label: "Observed auxiliary energy kwh",
    kind: "numberList",
  },
  {
    id: "observedDepositedMetalKg",
    label: "Observed deposited metal kg",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedRunHours.forEach((v) => positive(v, "observedRunHours"));
  input.observedDepositedMetalKg.forEach((v) =>
    positive(v, "observedDepositedMetalKg"),
  );
  input.observedElectrowinningPowerKw.forEach((v) =>
    nonnegative(v, "observedElectrowinningPowerKw"),
  );
  input.observedAuxiliaryEnergyKwh.forEach((v) =>
    nonnegative(v, "observedAuxiliaryEnergyKwh"),
  );
  aligned(
    input.observedElectrowinningPowerKw,
    input.observedRunHours,
    "observedElectrowinningPowerKw",
  );
  aligned(
    input.observedElectrowinningPowerKw,
    input.observedAuxiliaryEnergyKwh,
    "observedElectrowinningPowerKw",
  );
  aligned(
    input.observedElectrowinningPowerKw,
    input.observedDepositedMetalKg,
    "observedElectrowinningPowerKw",
  );
  const energy = sum(
    input.observedElectrowinningPowerKw.map(
      (v, i) =>
        v * input.observedRunHours[i] + input.observedAuxiliaryEnergyKwh[i],
    ),
  );
  return {
    observedTotalPlantKwh: energy,
    observedMeteredKwhPerKg: energy / sum(input.observedDepositedMetalKg),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedElectrowinningPowerKw: [10, 20],
  observedRunHours: [1, 2],
  observedAuxiliaryEnergyKwh: [2, 3],
  observedDepositedMetalKg: [5, 10],
} satisfies Input;
export const exampleOutput = {
  observedTotalPlantKwh: 55,
  observedMeteredKwhPerKg: 3.6666666666666665,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "mining/electrowinning-power-consumption-mining",
  title: "Electrowinning Power Consumption Calculator",
  description:
    "Audit actual metered electrowinning plus auxiliary energy versus weighed deposited metal, distinct from Faraday-predicted DC/grid energy. Caller independently verifies units, applicability and matching conditions; no operational recipe, safety certification, causal efficacy or legal/resource classification is inferred.",
  inputs: inputFields,
  outputs: [
    {
      id: "observedTotalPlantKwh",
      label: "Observed total plant kwh",
      kind: "number",
    },
    {
      id: "observedMeteredKwhPerKg",
      label: "Observed metered kwh per kg",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedElectrowinningPowerKw:
        value.observedElectrowinningPowerKw as readonly number[],
      observedRunHours: value.observedRunHours as readonly number[],
      observedAuxiliaryEnergyKwh:
        value.observedAuxiliaryEnergyKwh as readonly number[],
      observedDepositedMetalKg:
        value.observedDepositedMetalKg as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
