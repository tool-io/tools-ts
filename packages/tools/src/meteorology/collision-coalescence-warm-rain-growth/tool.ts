import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  fraction,
} from "../shared.js";

export type Input = Readonly<{
  readonly initialCollectorRadiusM: number;
  readonly cloudLiquidWaterKgPerM3: number;
  readonly collectionEfficiencyFraction: number;
  readonly relativeFallSpeedMPerSecond: number;
  readonly collectionDurationSeconds: number;
  readonly liquidDensityKgPerM3: number;
}>;
export type Output = Readonly<{
  readonly constantFluxRadiusGrowthMPerSecond: number;
  readonly modelFinalCollectorRadiusM: number;
  readonly modelCollectedLiquidMassKg: number;
}>;
const inputFields = [
  {
    id: "initialCollectorRadiusM",
    label: "Initial collector radius m",
    kind: "number",
  },
  {
    id: "cloudLiquidWaterKgPerM3",
    label: "Cloud liquid water kg per m3",
    kind: "number",
  },
  {
    id: "collectionEfficiencyFraction",
    label: "Collection efficiency fraction",
    kind: "number",
  },
  {
    id: "relativeFallSpeedMPerSecond",
    label: "Relative fall speed m per second",
    kind: "number",
  },
  {
    id: "collectionDurationSeconds",
    label: "Collection duration seconds",
    kind: "number",
  },
  {
    id: "liquidDensityKgPerM3",
    label: "Liquid density kg per m3",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.initialCollectorRadiusM, "initialCollectorRadiusM");
  positive(input.liquidDensityKgPerM3, "liquidDensityKgPerM3");
  nonnegative(input.cloudLiquidWaterKgPerM3, "cloudLiquidWaterKgPerM3");
  nonnegative(input.relativeFallSpeedMPerSecond, "relativeFallSpeedMPerSecond");
  nonnegative(input.collectionDurationSeconds, "collectionDurationSeconds");
  fraction(input.collectionEfficiencyFraction, "collectionEfficiencyFraction");
  const constantFluxRadiusGrowthMPerSecond =
      (input.collectionEfficiencyFraction *
        input.cloudLiquidWaterKgPerM3 *
        input.relativeFallSpeedMPerSecond) /
      (4 * input.liquidDensityKgPerM3),
    modelFinalCollectorRadiusM =
      input.initialCollectorRadiusM +
      constantFluxRadiusGrowthMPerSecond * input.collectionDurationSeconds;
  const r = input.initialCollectorRadiusM,
    dr = modelFinalCollectorRadiusM - r;
  return {
    constantFluxRadiusGrowthMPerSecond,
    modelFinalCollectorRadiusM,
    modelCollectedLiquidMassKg:
      ((4 * Math.PI * input.liquidDensityKgPerM3) / 3) *
      dr *
      (3 * r * r + 3 * r * dr + dr * dr),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  initialCollectorRadiusM: 0.001,
  cloudLiquidWaterKgPerM3: 0.001,
  collectionEfficiencyFraction: 0.5,
  relativeFallSpeedMPerSecond: 2,
  collectionDurationSeconds: 100,
  liquidDensityKgPerM3: 1000,
} satisfies Input;
export const exampleOutput = {
  constantFluxRadiusGrowthMPerSecond: 2.5e-7,
  modelFinalCollectorRadiusM: 0.001025,
  modelCollectedLiquidMassKg: 3.220786968399041e-7,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "meteorology/collision-coalescence-warm-rain-growth",
  title: "Collision Coalescence Warm Rain Growth",
  description:
    "Integrate ideal spherical collector growth under constant relative fall speed, liquid content and efficiency, conserving gained liquid mass; no droplet spectrum, changing fall speed or rain onset prediction.",
  inputs: inputFields,
  outputs: [
    {
      id: "constantFluxRadiusGrowthMPerSecond",
      label: "Constant flux radius growth m per second",
      kind: "number",
    },
    {
      id: "modelFinalCollectorRadiusM",
      label: "Model final collector radius m",
      kind: "number",
    },
    {
      id: "modelCollectedLiquidMassKg",
      label: "Model collected liquid mass kg",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      initialCollectorRadiusM: value.initialCollectorRadiusM as number,
      cloudLiquidWaterKgPerM3: value.cloudLiquidWaterKgPerM3 as number,
      collectionEfficiencyFraction:
        value.collectionEfficiencyFraction as number,
      relativeFallSpeedMPerSecond: value.relativeFallSpeedMPerSecond as number,
      collectionDurationSeconds: value.collectionDurationSeconds as number,
      liquidDensityKgPerM3: value.liquidDensityKgPerM3 as number,
    }),
});
export const run = tool.execute;
export default tool;
