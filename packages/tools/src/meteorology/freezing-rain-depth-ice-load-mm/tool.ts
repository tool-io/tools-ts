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
  readonly freezingRainLiquidDepthMm: number;
  readonly catchEfficiencyFraction: number;
  readonly frozenRetainedFraction: number;
  readonly liquidWaterDensityKgPerM3: number;
  readonly iceDensityKgPerM3: number;
  readonly exposedCollectionAreaM2: number;
}>;
export type Output = Readonly<{
  readonly modelIceMassPerAreaKgPerM2: number;
  readonly modelEquivalentUniformIceThicknessMm: number;
  readonly modelTotalCollectedIceMassKg: number;
}>;
const inputFields = [
  {
    id: "freezingRainLiquidDepthMm",
    label: "Freezing rain liquid depth mm",
    kind: "number",
  },
  {
    id: "catchEfficiencyFraction",
    label: "Catch efficiency fraction",
    kind: "number",
  },
  {
    id: "frozenRetainedFraction",
    label: "Frozen retained fraction",
    kind: "number",
  },
  {
    id: "liquidWaterDensityKgPerM3",
    label: "Liquid water density kg per m3",
    kind: "number",
  },
  { id: "iceDensityKgPerM3", label: "Ice density kg per m3", kind: "number" },
  {
    id: "exposedCollectionAreaM2",
    label: "Exposed collection area m2",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.liquidWaterDensityKgPerM3, "liquidWaterDensityKgPerM3");
  positive(input.iceDensityKgPerM3, "iceDensityKgPerM3");
  nonnegative(input.freezingRainLiquidDepthMm, "freezingRainLiquidDepthMm");
  nonnegative(input.exposedCollectionAreaM2, "exposedCollectionAreaM2");
  fraction(input.catchEfficiencyFraction, "catchEfficiencyFraction");
  fraction(input.frozenRetainedFraction, "frozenRetainedFraction");
  const modelIceMassPerAreaKgPerM2 =
    (input.freezingRainLiquidDepthMm / 1000) *
    input.liquidWaterDensityKgPerM3 *
    input.catchEfficiencyFraction *
    input.frozenRetainedFraction;
  return {
    modelIceMassPerAreaKgPerM2,
    modelEquivalentUniformIceThicknessMm:
      (1000 * modelIceMassPerAreaKgPerM2) / input.iceDensityKgPerM3,
    modelTotalCollectedIceMassKg:
      modelIceMassPerAreaKgPerM2 * input.exposedCollectionAreaM2,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  freezingRainLiquidDepthMm: 10,
  catchEfficiencyFraction: 0.5,
  frozenRetainedFraction: 0.8,
  liquidWaterDensityKgPerM3: 1000,
  iceDensityKgPerM3: 800,
  exposedCollectionAreaM2: 2,
} satisfies Input;
export const exampleOutput = {
  modelIceMassPerAreaKgPerM2: 4,
  modelEquivalentUniformIceThicknessMm: 5,
  modelTotalCollectedIceMassKg: 8,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "meteorology/freezing-rain-depth-ice-load-mm",
  title: "Freezing Rain Depth Ice Load MM",
  description:
    "Account supplied liquid-equivalent freezing rain, collection/retention and ice density into equivalent uniform ice load/thickness; not radial wire growth, structural capacity or travel safety.",
  inputs: inputFields,
  outputs: [
    {
      id: "modelIceMassPerAreaKgPerM2",
      label: "Model ice mass per area kg per m2",
      kind: "number",
    },
    {
      id: "modelEquivalentUniformIceThicknessMm",
      label: "Model equivalent uniform ice thickness mm",
      kind: "number",
    },
    {
      id: "modelTotalCollectedIceMassKg",
      label: "Model total collected ice mass kg",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      freezingRainLiquidDepthMm: value.freezingRainLiquidDepthMm as number,
      catchEfficiencyFraction: value.catchEfficiencyFraction as number,
      frozenRetainedFraction: value.frozenRetainedFraction as number,
      liquidWaterDensityKgPerM3: value.liquidWaterDensityKgPerM3 as number,
      iceDensityKgPerM3: value.iceDensityKgPerM3 as number,
      exposedCollectionAreaM2: value.exposedCollectionAreaM2 as number,
    }),
});
export const run = tool.execute;
export default tool;
