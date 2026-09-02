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
  readonly ovenDryFineSoilMassKg: readonly number[];
  readonly intactCoreVolumesM3: readonly number[];
  readonly excludedCoarseFragmentVolumesM3: readonly number[];
}>;
export type Output = Readonly<{
  readonly fineEarthBulkDensitiesKgM3: readonly number[];
  readonly pooledFineEarthBulkDensityKgM3: number;
}>;
const inputFields = [
  {
    id: "ovenDryFineSoilMassKg",
    label: "Oven dry fine soil mass kg",
    kind: "numberList",
  },
  {
    id: "intactCoreVolumesM3",
    label: "Intact core volumes m3",
    kind: "numberList",
  },
  {
    id: "excludedCoarseFragmentVolumesM3",
    label: "Excluded coarse fragment volumes m3",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.intactCoreVolumesM3.forEach((v) => positive(v, "intactCoreVolumesM3"));
  input.ovenDryFineSoilMassKg.forEach((v) =>
    nonnegative(v, "ovenDryFineSoilMassKg"),
  );
  input.excludedCoarseFragmentVolumesM3.forEach((v) =>
    nonnegative(v, "excludedCoarseFragmentVolumesM3"),
  );
  aligned(
    input.ovenDryFineSoilMassKg,
    input.intactCoreVolumesM3,
    "ovenDryFineSoilMassKg",
  );
  aligned(
    input.ovenDryFineSoilMassKg,
    input.excludedCoarseFragmentVolumesM3,
    "ovenDryFineSoilMassKg",
  );
  const v = input.intactCoreVolumesM3.map((x, i) =>
    positive(
      x - input.excludedCoarseFragmentVolumesM3[i],
      "fine-earth core volume",
    ),
  );
  return {
    fineEarthBulkDensitiesKgM3: input.ovenDryFineSoilMassKg.map(
      (m, i) => m / v[i],
    ),
    pooledFineEarthBulkDensityKgM3: sum(input.ovenDryFineSoilMassKg) / sum(v),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  ovenDryFineSoilMassKg: [1, 2],
  intactCoreVolumesM3: [0.001, 0.002],
  excludedCoarseFragmentVolumesM3: [0, 0.001],
} satisfies Input;
export const exampleOutput = {
  fineEarthBulkDensitiesKgM3: [1000, 2000],
  pooledFineEarthBulkDensityKgM3: 1500,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "agriculture/soil-bulk-density",
  title: "Agriculture Soil Bulk Density Calculator",
  description:
    "Actual oven-dry fine-earth core density corrected for excluded coarse-fragment volume, pooled unequal cores distinct from single mass/volume. Caller independently establishes units, regime, calibration and applicability; this does not establish design-code compliance, authenticity, operational safety, treatment efficacy or a validated forecast.",
  inputs: inputFields,
  outputs: [
    {
      id: "fineEarthBulkDensitiesKgM3",
      label: "Fine earth bulk densities kg m3",
      kind: "numberList",
    },
    {
      id: "pooledFineEarthBulkDensityKgM3",
      label: "Pooled fine earth bulk density kg m3",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      ovenDryFineSoilMassKg: value.ovenDryFineSoilMassKg as readonly number[],
      intactCoreVolumesM3: value.intactCoreVolumesM3 as readonly number[],
      excludedCoarseFragmentVolumesM3:
        value.excludedCoarseFragmentVolumesM3 as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
