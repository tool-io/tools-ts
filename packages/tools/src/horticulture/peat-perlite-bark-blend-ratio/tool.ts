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
  readonly targetSettledBlendLiters: number;
  readonly peatPerliteBarkLooseVolumeWeights: readonly number[];
  readonly ingredientDryBulkDensitiesKgPerLiter: readonly number[];
  readonly ingredientWaterMassesKgPerLooseLiter: readonly number[];
  readonly settledToLooseVolumeFraction: number;
}>;
export type Output = Readonly<{
  readonly ingredientLooseVolumesLiters: readonly number[];
  readonly totalDryMassKg: number;
  readonly totalWaterMassKg: number;
  readonly settledDryBulkDensityKgPerLiter: number;
}>;
const inputFields = [
  {
    id: "targetSettledBlendLiters",
    label: "Target settled blend liters",
    kind: "number",
  },
  {
    id: "peatPerliteBarkLooseVolumeWeights",
    label: "Peat perlite bark loose volume weights",
    kind: "numberList",
  },
  {
    id: "ingredientDryBulkDensitiesKgPerLiter",
    label: "Ingredient dry bulk densities kg per liter",
    kind: "numberList",
  },
  {
    id: "ingredientWaterMassesKgPerLooseLiter",
    label: "Ingredient water masses kg per loose liter",
    kind: "numberList",
  },
  {
    id: "settledToLooseVolumeFraction",
    label: "Settled to loose volume fraction",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.settledToLooseVolumeFraction, "settledToLooseVolumeFraction");
  nonnegative(input.targetSettledBlendLiters, "targetSettledBlendLiters");
  input.peatPerliteBarkLooseVolumeWeights.forEach((v) =>
    nonnegative(v, "peatPerliteBarkLooseVolumeWeights"),
  );
  input.ingredientDryBulkDensitiesKgPerLiter.forEach((v) =>
    nonnegative(v, "ingredientDryBulkDensitiesKgPerLiter"),
  );
  input.ingredientWaterMassesKgPerLooseLiter.forEach((v) =>
    nonnegative(v, "ingredientWaterMassesKgPerLooseLiter"),
  );
  fraction(input.settledToLooseVolumeFraction, "settledToLooseVolumeFraction");
  if (
    input.peatPerliteBarkLooseVolumeWeights.length !== 3 ||
    input.ingredientDryBulkDensitiesKgPerLiter.length !== 3 ||
    input.ingredientWaterMassesKgPerLooseLiter.length !== 3
  )
    simpleError(
      "ingredients",
      "Three ordered peat/perlite/bark ingredients required.",
    );
  positive(input.targetSettledBlendLiters, "targetSettledBlendLiters");
  const sum = positive(
      input.peatPerliteBarkLooseVolumeWeights.reduce((a, b) => a + b, 0),
      "weights",
    ),
    ingredientLooseVolumesLiters = input.peatPerliteBarkLooseVolumeWeights.map(
      (v) =>
        ((input.targetSettledBlendLiters / input.settledToLooseVolumeFraction) *
          v) /
        sum,
    ),
    totalDryMassKg = ingredientLooseVolumesLiters.reduce(
      (s, v, i) => s + v * input.ingredientDryBulkDensitiesKgPerLiter[i],
      0,
    ),
    totalWaterMassKg = ingredientLooseVolumesLiters.reduce(
      (s, v, i) => s + v * input.ingredientWaterMassesKgPerLooseLiter[i],
      0,
    );
  return {
    ingredientLooseVolumesLiters,
    totalDryMassKg,
    totalWaterMassKg,
    settledDryBulkDensityKgPerLiter:
      totalDryMassKg / input.targetSettledBlendLiters,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  targetSettledBlendLiters: 100,
  peatPerliteBarkLooseVolumeWeights: [2, 1, 1],
  ingredientDryBulkDensitiesKgPerLiter: [0.1, 0.05, 0.2],
  ingredientWaterMassesKgPerLooseLiter: [0.2, 0, 0.1],
  settledToLooseVolumeFraction: 0.8,
} satisfies Input;
export const exampleOutput = {
  ingredientLooseVolumesLiters: [62.5, 31.25, 31.25],
  totalDryMassKg: 14.0625,
  totalWaterMassKg: 15.625,
  settledDryBulkDensityKgPerLiter: 0.140625,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "horticulture/peat-perlite-bark-blend-ratio",
  title: "Peat Perlite Bark Blend Ratio Mixer",
  description:
    "Scale caller peat/perlite/bark loose-volume ratios to a calibrated settled blend volume and balance dry/water masses; no additive pore-volume, pH or fertility guarantee.",
  inputs: inputFields,
  outputs: [
    {
      id: "ingredientLooseVolumesLiters",
      label: "Ingredient loose volumes liters",
      kind: "numberList",
    },
    { id: "totalDryMassKg", label: "Total dry mass kg", kind: "number" },
    { id: "totalWaterMassKg", label: "Total water mass kg", kind: "number" },
    {
      id: "settledDryBulkDensityKgPerLiter",
      label: "Settled dry bulk density kg per liter",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      targetSettledBlendLiters: value.targetSettledBlendLiters as number,
      peatPerliteBarkLooseVolumeWeights:
        value.peatPerliteBarkLooseVolumeWeights as readonly number[],
      ingredientDryBulkDensitiesKgPerLiter:
        value.ingredientDryBulkDensitiesKgPerLiter as readonly number[],
      ingredientWaterMassesKgPerLooseLiter:
        value.ingredientWaterMassesKgPerLooseLiter as readonly number[],
      settledToLooseVolumeFraction:
        value.settledToLooseVolumeFraction as number,
    }),
});
export const run = tool.execute;
export default tool;
