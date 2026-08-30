import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  fraction,
} from "../shared.js";
export type Input = Readonly<{
  readonly coreVolumeCm3: number;
  readonly ovenDryMassGrams: number;
  readonly saturatedMassGrams: number;
  readonly drainedContainerCapacityMassGrams: number;
  readonly waterDensityGramsPerCm3: number;
}>;
export type Output = Readonly<{
  readonly dryBulkDensityGramsPerCm3: number;
  readonly measuredTotalPoreFraction: number;
  readonly containerCapacityWaterFraction: number;
  readonly airFilledPoreFraction: number;
}>;
const inputFields = [
  { id: "coreVolumeCm3", label: "Core volume cm3", kind: "number" },
  { id: "ovenDryMassGrams", label: "Oven dry mass grams", kind: "number" },
  { id: "saturatedMassGrams", label: "Saturated mass grams", kind: "number" },
  {
    id: "drainedContainerCapacityMassGrams",
    label: "Drained container capacity mass grams",
    kind: "number",
  },
  {
    id: "waterDensityGramsPerCm3",
    label: "Water density grams per cm3",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.coreVolumeCm3, "coreVolumeCm3");
  positive(input.waterDensityGramsPerCm3, "waterDensityGramsPerCm3");
  nonnegative(input.ovenDryMassGrams, "ovenDryMassGrams");
  nonnegative(input.saturatedMassGrams, "saturatedMassGrams");
  nonnegative(
    input.drainedContainerCapacityMassGrams,
    "drainedContainerCapacityMassGrams",
  );
  if (
    input.drainedContainerCapacityMassGrams < input.ovenDryMassGrams ||
    input.saturatedMassGrams < input.drainedContainerCapacityMassGrams
  )
    simpleError("masses", "Dry ≤ drained ≤ saturated core masses required.");
  const scale = input.waterDensityGramsPerCm3 * input.coreVolumeCm3,
    measuredTotalPoreFraction = fraction(
      (input.saturatedMassGrams - input.ovenDryMassGrams) / scale,
      "saturatedMassGrams",
    ),
    containerCapacityWaterFraction =
      (input.drainedContainerCapacityMassGrams - input.ovenDryMassGrams) /
      scale;
  return {
    dryBulkDensityGramsPerCm3: input.ovenDryMassGrams / input.coreVolumeCm3,
    measuredTotalPoreFraction,
    containerCapacityWaterFraction,
    airFilledPoreFraction:
      measuredTotalPoreFraction - containerCapacityWaterFraction,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  coreVolumeCm3: 100,
  ovenDryMassGrams: 20,
  saturatedMassGrams: 90,
  drainedContainerCapacityMassGrams: 60,
  waterDensityGramsPerCm3: 1,
} satisfies Input;
export const exampleOutput = {
  dryBulkDensityGramsPerCm3: 0.2,
  measuredTotalPoreFraction: 0.7,
  containerCapacityWaterFraction: 0.4,
  airFilledPoreFraction: 0.3,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "horticulture/substrate-bulk-density-porosity",
  title: "Substrate Bulk Density Porosity",
  description:
    "Derive substrate pore water/air partition from measured saturated and drained core masses; distinct from geology porosity inferred from assumed particle density, requiring full wetting and no core swelling.",
  inputs: inputFields,
  outputs: [
    {
      id: "dryBulkDensityGramsPerCm3",
      label: "Dry bulk density grams per cm3",
      kind: "number",
    },
    {
      id: "measuredTotalPoreFraction",
      label: "Measured total pore fraction",
      kind: "number",
    },
    {
      id: "containerCapacityWaterFraction",
      label: "Container capacity water fraction",
      kind: "number",
    },
    {
      id: "airFilledPoreFraction",
      label: "Air filled pore fraction",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      coreVolumeCm3: value.coreVolumeCm3 as number,
      ovenDryMassGrams: value.ovenDryMassGrams as number,
      saturatedMassGrams: value.saturatedMassGrams as number,
      drainedContainerCapacityMassGrams:
        value.drainedContainerCapacityMassGrams as number,
      waterDensityGramsPerCm3: value.waterDensityGramsPerCm3 as number,
    }),
});
export const run = tool.execute;
export default tool;
