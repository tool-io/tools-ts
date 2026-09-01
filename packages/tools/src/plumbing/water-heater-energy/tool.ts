import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  fraction,
  aligned,
  sum,
  ordered,
} from "../batch35-shared.js";
export type Input = Readonly<{
  readonly observedDrawVolumesLiters: readonly number[];
  readonly observedColdFeedC: readonly number[];
  readonly callerDeliveredHotWaterC: readonly number[];
  readonly callerWaterHeatCapacityJLiterK: number;
  readonly callerHeaterEfficiencyFraction: number;
}>;
export type Output = Readonly<{
  readonly usefulDrawHeatJ: readonly number[];
  readonly totalUsefulDrawHeatKwh: number;
  readonly modeledInputHeatKwh: number;
}>;
const inputFields = [
  {
    id: "observedDrawVolumesLiters",
    label: "Observed draw volumes liters",
    kind: "numberList",
  },
  {
    id: "observedColdFeedC",
    label: "Observed cold feed c",
    kind: "numberList",
  },
  {
    id: "callerDeliveredHotWaterC",
    label: "Caller delivered hot water c",
    kind: "numberList",
  },
  {
    id: "callerWaterHeatCapacityJLiterK",
    label: "Caller water heat capacity j liter k",
    kind: "number",
  },
  {
    id: "callerHeaterEfficiencyFraction",
    label: "Caller heater efficiency fraction",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(
    input.callerWaterHeatCapacityJLiterK,
    "callerWaterHeatCapacityJLiterK",
  );
  positive(
    input.callerHeaterEfficiencyFraction,
    "callerHeaterEfficiencyFraction",
  );
  input.observedDrawVolumesLiters.forEach((v) =>
    nonnegative(v, "observedDrawVolumesLiters"),
  );
  fraction(
    input.callerHeaterEfficiencyFraction,
    "callerHeaterEfficiencyFraction",
  );
  aligned(
    input.observedDrawVolumesLiters,
    input.observedColdFeedC,
    "observedDrawVolumesLiters",
  );
  aligned(
    input.observedDrawVolumesLiters,
    input.callerDeliveredHotWaterC,
    "observedDrawVolumesLiters",
  );
  const energies = input.observedDrawVolumesLiters.map((v, i) => {
      ordered(input.observedColdFeedC[i], input.callerDeliveredHotWaterC[i]);
      return (
        v *
        input.callerWaterHeatCapacityJLiterK *
        (input.callerDeliveredHotWaterC[i] - input.observedColdFeedC[i])
      );
    }),
    heat = sum(energies) / 3600000;
  return {
    usefulDrawHeatJ: energies,
    totalUsefulDrawHeatKwh: heat,
    modeledInputHeatKwh: heat / input.callerHeaterEfficiencyFraction,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedDrawVolumesLiters: [10, 20],
  observedColdFeedC: [10, 20],
  callerDeliveredHotWaterC: [50, 50],
  callerWaterHeatCapacityJLiterK: 4200,
  callerHeaterEfficiencyFraction: 0.8,
} satisfies Input;
export const exampleOutput = {
  usefulDrawHeatJ: [1680000, 2520000],
  totalUsefulDrawHeatKwh: 1.1666666666666667,
  modeledInputHeatKwh: 1.4583333333333333,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "plumbing/water-heater-energy",
  title: "Plumbing Water Heater Energy Calculator",
  description:
    "Budget actual unequal hot-water draws/feed temperatures with delivered setpoints and caller efficiency, not single mass×temperature scalar, standby loss or heating safety instruction.",
  inputs: inputFields,
  outputs: [
    { id: "usefulDrawHeatJ", label: "Useful draw heat j", kind: "numberList" },
    {
      id: "totalUsefulDrawHeatKwh",
      label: "Total useful draw heat kwh",
      kind: "number",
    },
    {
      id: "modeledInputHeatKwh",
      label: "Modeled input heat kwh",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedDrawVolumesLiters:
        value.observedDrawVolumesLiters as readonly number[],
      observedColdFeedC: value.observedColdFeedC as readonly number[],
      callerDeliveredHotWaterC:
        value.callerDeliveredHotWaterC as readonly number[],
      callerWaterHeatCapacityJLiterK:
        value.callerWaterHeatCapacityJLiterK as number,
      callerHeaterEfficiencyFraction:
        value.callerHeaterEfficiencyFraction as number,
    }),
});
export const run = tool.execute;
export default tool;
