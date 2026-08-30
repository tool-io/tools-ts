import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, nonnegative, aligned } from "../shared.js";
export type Input = Readonly<{
  readonly oreTonnesByPeriod: readonly number[];
  readonly requiredWasteOreRatios: readonly number[];
  readonly prestrippedWasteCreditTonnes: number;
  readonly totalMaterialCapacityTonnesByPeriod: readonly number[];
}>;
export type Output = Readonly<{
  readonly newWasteTonnesByPeriod: readonly number[];
  readonly totalMaterialTonnesByPeriod: readonly number[];
  readonly capacityMarginsTonnesByPeriod: readonly number[];
  readonly allPeriodsWithinCapacity: boolean;
}>;
const inputFields = [
  {
    id: "oreTonnesByPeriod",
    label: "Ore tonnes by period",
    kind: "numberList",
  },
  {
    id: "requiredWasteOreRatios",
    label: "Required waste ore ratios",
    kind: "numberList",
  },
  {
    id: "prestrippedWasteCreditTonnes",
    label: "Prestripped waste credit tonnes",
    kind: "number",
  },
  {
    id: "totalMaterialCapacityTonnesByPeriod",
    label: "Total material capacity tonnes by period",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.oreTonnesByPeriod.forEach((v) => nonnegative(v, "oreTonnesByPeriod"));
  input.requiredWasteOreRatios.forEach((v) =>
    nonnegative(v, "requiredWasteOreRatios"),
  );
  nonnegative(
    input.prestrippedWasteCreditTonnes,
    "prestrippedWasteCreditTonnes",
  );
  input.totalMaterialCapacityTonnesByPeriod.forEach((v) =>
    nonnegative(v, "totalMaterialCapacityTonnesByPeriod"),
  );
  aligned(
    input.oreTonnesByPeriod,
    input.requiredWasteOreRatios,
    "oreTonnesByPeriod",
  );
  aligned(
    input.oreTonnesByPeriod,
    input.totalMaterialCapacityTonnesByPeriod,
    "oreTonnesByPeriod",
  );
  let credit = input.prestrippedWasteCreditTonnes;
  const newWasteTonnesByPeriod = input.oreTonnesByPeriod.map((v, i) => {
      const required = v * input.requiredWasteOreRatios[i],
        used = Math.min(credit, required);
      credit -= used;
      return required - used;
    }),
    totalMaterialTonnesByPeriod = newWasteTonnesByPeriod.map(
      (v, i) => v + input.oreTonnesByPeriod[i],
    ),
    capacityMarginsTonnesByPeriod = totalMaterialTonnesByPeriod.map(
      (v, i) => input.totalMaterialCapacityTonnesByPeriod[i] - v,
    );
  return {
    newWasteTonnesByPeriod,
    totalMaterialTonnesByPeriod,
    capacityMarginsTonnesByPeriod,
    allPeriodsWithinCapacity: capacityMarginsTonnesByPeriod.every(
      (v) => v >= 0,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  oreTonnesByPeriod: [100, 100],
  requiredWasteOreRatios: [2, 3],
  prestrippedWasteCreditTonnes: 50,
  totalMaterialCapacityTonnesByPeriod: [300, 350],
} satisfies Input;
export const exampleOutput = {
  newWasteTonnesByPeriod: [150, 300],
  totalMaterialTonnesByPeriod: [250, 400],
  capacityMarginsTonnesByPeriod: [50, -50],
  allPeriodsWithinCapacity: false,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "mining/stripping-schedule",
  title: "Stripping Schedule",
  description:
    "Apply prestripped waste credit sequentially to fixed ore/stripping schedule and screen capacities; does not optimize precedences or silently reschedule.",
  inputs: inputFields,
  outputs: [
    {
      id: "newWasteTonnesByPeriod",
      label: "New waste tonnes by period",
      kind: "numberList",
    },
    {
      id: "totalMaterialTonnesByPeriod",
      label: "Total material tonnes by period",
      kind: "numberList",
    },
    {
      id: "capacityMarginsTonnesByPeriod",
      label: "Capacity margins tonnes by period",
      kind: "numberList",
    },
    {
      id: "allPeriodsWithinCapacity",
      label: "All periods within capacity",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      oreTonnesByPeriod: value.oreTonnesByPeriod as readonly number[],
      requiredWasteOreRatios: value.requiredWasteOreRatios as readonly number[],
      prestrippedWasteCreditTonnes:
        value.prestrippedWasteCreditTonnes as number,
      totalMaterialCapacityTonnesByPeriod:
        value.totalMaterialCapacityTonnesByPeriod as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
