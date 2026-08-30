import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  aligned,
} from "../shared.js";
export type Input = Readonly<{
  readonly layerAshThicknessesMm: readonly number[];
  readonly layerDryBulkDensitiesKgPerM3: readonly number[];
  readonly retainedWaterKgPerM2: number;
  readonly gravityMPerSecondSquared: number;
}>;
export type Output = Readonly<{
  readonly dryAshMassLoadingKgPerM2: number;
  readonly wetMassLoadingKgPerM2: number;
  readonly totalWeightLoadingPa: number;
}>;
const inputFields = [
  {
    id: "layerAshThicknessesMm",
    label: "Layer ash thicknesses mm",
    kind: "numberList",
  },
  {
    id: "layerDryBulkDensitiesKgPerM3",
    label: "Layer dry bulk densities kg per m3",
    kind: "numberList",
  },
  {
    id: "retainedWaterKgPerM2",
    label: "Retained water kg per m2",
    kind: "number",
  },
  {
    id: "gravityMPerSecondSquared",
    label: "Gravity m per second squared",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.layerDryBulkDensitiesKgPerM3.forEach((v) =>
    positive(v, "layerDryBulkDensitiesKgPerM3"),
  );
  positive(input.gravityMPerSecondSquared, "gravityMPerSecondSquared");
  input.layerAshThicknessesMm.forEach((v) =>
    nonnegative(v, "layerAshThicknessesMm"),
  );
  nonnegative(input.retainedWaterKgPerM2, "retainedWaterKgPerM2");
  aligned(
    input.layerAshThicknessesMm,
    input.layerDryBulkDensitiesKgPerM3,
    "layerAshThicknessesMm",
  );
  const dryAshMassLoadingKgPerM2 = input.layerAshThicknessesMm.reduce(
      (s, v, i) => s + (v / 1000) * input.layerDryBulkDensitiesKgPerM3[i],
      0,
    ),
    wetMassLoadingKgPerM2 =
      dryAshMassLoadingKgPerM2 + input.retainedWaterKgPerM2;
  return {
    dryAshMassLoadingKgPerM2,
    wetMassLoadingKgPerM2,
    totalWeightLoadingPa:
      wetMassLoadingKgPerM2 * input.gravityMPerSecondSquared,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  layerAshThicknessesMm: [10, 20],
  layerDryBulkDensitiesKgPerM3: [1000, 500],
  retainedWaterKgPerM2: 5,
  gravityMPerSecondSquared: 10,
} satisfies Input;
export const exampleOutput = {
  dryAshMassLoadingKgPerM2: 20,
  wetMassLoadingKgPerM2: 25,
  totalWeightLoadingPa: 250,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "volcanology/ashfall-load-thickness-conversion",
  title: "Ashfall Load Thickness Conversion",
  description:
    "Convert distinct dry ash layers and independently retained water into surface mass/weight load; dry bulk density includes pores, and structural capacity or collapse is not assessed.",
  inputs: inputFields,
  outputs: [
    {
      id: "dryAshMassLoadingKgPerM2",
      label: "Dry ash mass loading kg per m2",
      kind: "number",
    },
    {
      id: "wetMassLoadingKgPerM2",
      label: "Wet mass loading kg per m2",
      kind: "number",
    },
    {
      id: "totalWeightLoadingPa",
      label: "Total weight loading pa",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      layerAshThicknessesMm: value.layerAshThicknessesMm as readonly number[],
      layerDryBulkDensitiesKgPerM3:
        value.layerDryBulkDensitiesKgPerM3 as readonly number[],
      retainedWaterKgPerM2: value.retainedWaterKgPerM2 as number,
      gravityMPerSecondSquared: value.gravityMPerSecondSquared as number,
    }),
});
export const run = tool.execute;
export default tool;
