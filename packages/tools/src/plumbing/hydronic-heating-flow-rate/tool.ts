import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  aligned,
  sum,
} from "../batch35-shared.js";
export type Input = Readonly<{
  readonly observedZoneHeatWatts: readonly number[];
  readonly callerFluidVolumetricHeatCapacityJLiterK: readonly number[];
  readonly callerZoneSupplyReturnDeltaC: readonly number[];
}>;
export type Output = Readonly<{
  readonly requiredHydronicZoneLitersMinute: readonly number[];
  readonly totalHydronicLitersMinute: number;
}>;
const inputFields = [
  {
    id: "observedZoneHeatWatts",
    label: "Observed zone heat watts",
    kind: "numberList",
  },
  {
    id: "callerFluidVolumetricHeatCapacityJLiterK",
    label: "Caller fluid volumetric heat capacity j liter k",
    kind: "numberList",
  },
  {
    id: "callerZoneSupplyReturnDeltaC",
    label: "Caller zone supply return delta c",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.callerFluidVolumetricHeatCapacityJLiterK.forEach((v) =>
    positive(v, "callerFluidVolumetricHeatCapacityJLiterK"),
  );
  input.callerZoneSupplyReturnDeltaC.forEach((v) =>
    positive(v, "callerZoneSupplyReturnDeltaC"),
  );
  input.observedZoneHeatWatts.forEach((v) =>
    nonnegative(v, "observedZoneHeatWatts"),
  );
  aligned(
    input.observedZoneHeatWatts,
    input.callerFluidVolumetricHeatCapacityJLiterK,
    "observedZoneHeatWatts",
  );
  aligned(
    input.observedZoneHeatWatts,
    input.callerZoneSupplyReturnDeltaC,
    "observedZoneHeatWatts",
  );
  const flows = input.observedZoneHeatWatts.map(
    (v, i) =>
      (60 * v) /
      input.callerFluidVolumetricHeatCapacityJLiterK[i] /
      input.callerZoneSupplyReturnDeltaC[i],
  );
  return {
    requiredHydronicZoneLitersMinute: flows,
    totalHydronicLitersMinute: sum(flows),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedZoneHeatWatts: [1000, 2000],
  callerFluidVolumetricHeatCapacityJLiterK: [4000, 4000],
  callerZoneSupplyReturnDeltaC: [10, 20],
} satisfies Input;
export const exampleOutput = {
  requiredHydronicZoneLitersMinute: [1.5, 1.5],
  totalHydronicLitersMinute: 3,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "plumbing/hydronic-heating-flow-rate",
  title: "Plumbing Hydronic Heating Flow Rate Calculator",
  description:
    "Budget independently supplied hydronic zone heat/delta-temperature/fluid calibrations, sum parallel zone flow; no boiler-output-only alias or balance/comfort guarantee.",
  inputs: inputFields,
  outputs: [
    {
      id: "requiredHydronicZoneLitersMinute",
      label: "Required hydronic zone liters minute",
      kind: "numberList",
    },
    {
      id: "totalHydronicLitersMinute",
      label: "Total hydronic liters minute",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedZoneHeatWatts: value.observedZoneHeatWatts as readonly number[],
      callerFluidVolumetricHeatCapacityJLiterK:
        value.callerFluidVolumetricHeatCapacityJLiterK as readonly number[],
      callerZoneSupplyReturnDeltaC:
        value.callerZoneSupplyReturnDeltaC as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
