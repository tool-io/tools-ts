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
  readonly deliveredWetGrapeMassesKg: readonly number[];
  readonly pairedDrySurfaceSampleMassesKg: readonly number[];
  readonly pairedWetSurfaceSampleMassesKg: readonly number[];
}>;
export type Output = Readonly<{
  readonly inferredSurfaceWaterFractions: readonly number[];
  readonly surfaceWaterCorrectedGrapeMassesKg: readonly number[];
  readonly estimatedTotalSurfaceWaterKg: number;
}>;
const inputFields = [
  {
    id: "deliveredWetGrapeMassesKg",
    label: "Delivered wet grape masses kg",
    kind: "numberList",
  },
  {
    id: "pairedDrySurfaceSampleMassesKg",
    label: "Paired dry surface sample masses kg",
    kind: "numberList",
  },
  {
    id: "pairedWetSurfaceSampleMassesKg",
    label: "Paired wet surface sample masses kg",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.pairedWetSurfaceSampleMassesKg.forEach((v) =>
    positive(v, "pairedWetSurfaceSampleMassesKg"),
  );
  input.deliveredWetGrapeMassesKg.forEach((v) =>
    nonnegative(v, "deliveredWetGrapeMassesKg"),
  );
  input.pairedDrySurfaceSampleMassesKg.forEach((v) =>
    nonnegative(v, "pairedDrySurfaceSampleMassesKg"),
  );
  aligned(
    input.deliveredWetGrapeMassesKg,
    input.pairedDrySurfaceSampleMassesKg,
    "deliveredWetGrapeMassesKg",
  );
  aligned(
    input.deliveredWetGrapeMassesKg,
    input.pairedWetSurfaceSampleMassesKg,
    "deliveredWetGrapeMassesKg",
  );
  const f = input.pairedDrySurfaceSampleMassesKg.map(
      (v, i) =>
        1 -
        fraction(
          v / input.pairedWetSurfaceSampleMassesKg[i],
          "pairedSurfaceSample",
        ),
    ),
    mass = input.deliveredWetGrapeMassesKg.map((v, i) => v * (1 - f[i]));
  return {
    inferredSurfaceWaterFractions: f,
    surfaceWaterCorrectedGrapeMassesKg: mass,
    estimatedTotalSurfaceWaterKg:
      input.deliveredWetGrapeMassesKg.reduce((a, b) => a + b, 0) -
      mass.reduce((a, b) => a + b, 0),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  deliveredWetGrapeMassesKg: [100, 200],
  pairedDrySurfaceSampleMassesKg: [9, 18],
  pairedWetSurfaceSampleMassesKg: [10, 20],
} satisfies Input;
export const exampleOutput = {
  inferredSurfaceWaterFractions: [0.1, 0.1],
  surfaceWaterCorrectedGrapeMassesKg: [90, 180],
  estimatedTotalSurfaceWaterKg: 30,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "viticulture/harvest-morning-dew-correction-weight",
  title: "Harvest Morning Dew Correction Weight",
  description:
    "Correct delivered grapes using caller paired before/after **surface drying** samples; unlike internal wet/dry moisture conversion, model assumes no juice/berry dry-matter loss and dew representativeness remains caller responsibility.",
  inputs: inputFields,
  outputs: [
    {
      id: "inferredSurfaceWaterFractions",
      label: "Inferred surface water fractions",
      kind: "numberList",
    },
    {
      id: "surfaceWaterCorrectedGrapeMassesKg",
      label: "Surface water corrected grape masses kg",
      kind: "numberList",
    },
    {
      id: "estimatedTotalSurfaceWaterKg",
      label: "Estimated total surface water kg",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      deliveredWetGrapeMassesKg:
        value.deliveredWetGrapeMassesKg as readonly number[],
      pairedDrySurfaceSampleMassesKg:
        value.pairedDrySurfaceSampleMassesKg as readonly number[],
      pairedWetSurfaceSampleMassesKg:
        value.pairedWetSurfaceSampleMassesKg as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
