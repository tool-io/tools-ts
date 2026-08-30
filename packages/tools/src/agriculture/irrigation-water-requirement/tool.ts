import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  fraction,
  aligned,
} from "../shared.js";
export type Input = Readonly<{
  readonly intervalCropWaterDemandsMm: readonly number[];
  readonly effectiveRainfallMm: readonly number[];
  readonly plannedAvailableStorageDrawMm: readonly number[];
  readonly applicationEfficiencies: readonly number[];
  readonly fieldAreaHa: number;
}>;
export type Output = Readonly<{
  readonly netIrrigationRequirementsMm: readonly number[];
  readonly grossIrrigationDepthsMm: readonly number[];
  readonly totalGrossIrrigationVolumeM3: number;
}>;
const inputFields = [
  {
    id: "intervalCropWaterDemandsMm",
    label: "Interval crop water demands mm",
    kind: "numberList",
  },
  {
    id: "effectiveRainfallMm",
    label: "Effective rainfall mm",
    kind: "numberList",
  },
  {
    id: "plannedAvailableStorageDrawMm",
    label: "Planned available storage draw mm",
    kind: "numberList",
  },
  {
    id: "applicationEfficiencies",
    label: "Application efficiencies",
    kind: "numberList",
  },
  { id: "fieldAreaHa", label: "Field area ha", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.applicationEfficiencies.forEach((v) =>
    positive(v, "applicationEfficiencies"),
  );
  input.intervalCropWaterDemandsMm.forEach((v) =>
    nonnegative(v, "intervalCropWaterDemandsMm"),
  );
  input.effectiveRainfallMm.forEach((v) =>
    nonnegative(v, "effectiveRainfallMm"),
  );
  input.plannedAvailableStorageDrawMm.forEach((v) =>
    nonnegative(v, "plannedAvailableStorageDrawMm"),
  );
  nonnegative(input.fieldAreaHa, "fieldAreaHa");
  input.applicationEfficiencies.forEach((v) =>
    fraction(v, "applicationEfficiencies"),
  );
  aligned(
    input.intervalCropWaterDemandsMm,
    input.effectiveRainfallMm,
    "intervalCropWaterDemandsMm",
  );
  aligned(
    input.intervalCropWaterDemandsMm,
    input.plannedAvailableStorageDrawMm,
    "intervalCropWaterDemandsMm",
  );
  aligned(
    input.intervalCropWaterDemandsMm,
    input.applicationEfficiencies,
    "intervalCropWaterDemandsMm",
  );
  const netIrrigationRequirementsMm = input.intervalCropWaterDemandsMm.map(
      (v, i) =>
        Math.max(
          0,
          v -
            input.effectiveRainfallMm[i] -
            input.plannedAvailableStorageDrawMm[i],
        ),
    ),
    grossIrrigationDepthsMm = netIrrigationRequirementsMm.map(
      (v, i) => v / input.applicationEfficiencies[i],
    );
  return {
    netIrrigationRequirementsMm,
    grossIrrigationDepthsMm,
    totalGrossIrrigationVolumeM3:
      10 *
      input.fieldAreaHa *
      grossIrrigationDepthsMm.reduce((a, b) => a + b, 0),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  intervalCropWaterDemandsMm: [20, 30],
  effectiveRainfallMm: [10, 5],
  plannedAvailableStorageDrawMm: [5, 0],
  applicationEfficiencies: [0.5, 1],
  fieldAreaHa: 2,
} satisfies Input;
export const exampleOutput = {
  netIrrigationRequirementsMm: [5, 25],
  grossIrrigationDepthsMm: [10, 25],
  totalGrossIrrigationVolumeM3: 700,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "agriculture/irrigation-water-requirement",
  title: "Agriculture Irrigation Water Requirement",
  description:
    "Balance caller interval crop demand with already-effective rainfall and planned available soil-storage draw, then convert to gross irrigation by supplied efficiency; no storage draw beyond caller availability or irrigation scheduling recommendation.",
  inputs: inputFields,
  outputs: [
    {
      id: "netIrrigationRequirementsMm",
      label: "Net irrigation requirements mm",
      kind: "numberList",
    },
    {
      id: "grossIrrigationDepthsMm",
      label: "Gross irrigation depths mm",
      kind: "numberList",
    },
    {
      id: "totalGrossIrrigationVolumeM3",
      label: "Total gross irrigation volume m3",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      intervalCropWaterDemandsMm:
        value.intervalCropWaterDemandsMm as readonly number[],
      effectiveRainfallMm: value.effectiveRainfallMm as readonly number[],
      plannedAvailableStorageDrawMm:
        value.plannedAvailableStorageDrawMm as readonly number[],
      applicationEfficiencies:
        value.applicationEfficiencies as readonly number[],
      fieldAreaHa: value.fieldAreaHa as number,
    }),
});
export const run = tool.execute;
export default tool;
