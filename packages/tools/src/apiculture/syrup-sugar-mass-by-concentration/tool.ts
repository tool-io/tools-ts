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
  readonly desiredVolumeLiters: number;
  readonly finalDensityKgPerLiter: number;
  readonly targetSucroseMassFraction: number;
  readonly rawSugarSucroseFraction: number;
}>;
export type Output = Readonly<{
  readonly totalSyrupMassKg: number;
  readonly rawSugarMassKg: number;
  readonly addedWaterMassKg: number;
}>;
const inputFields = [
  { id: "desiredVolumeLiters", label: "Desired volume liters", kind: "number" },
  {
    id: "finalDensityKgPerLiter",
    label: "Final density kg per liter",
    kind: "number",
  },
  {
    id: "targetSucroseMassFraction",
    label: "Target sucrose mass fraction",
    kind: "number",
  },
  {
    id: "rawSugarSucroseFraction",
    label: "Raw sugar sucrose fraction",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.finalDensityKgPerLiter, "finalDensityKgPerLiter");
  positive(input.rawSugarSucroseFraction, "rawSugarSucroseFraction");
  nonnegative(input.desiredVolumeLiters, "desiredVolumeLiters");
  fraction(input.targetSucroseMassFraction, "targetSucroseMassFraction");
  fraction(input.rawSugarSucroseFraction, "rawSugarSucroseFraction");
  if (input.targetSucroseMassFraction > input.rawSugarSucroseFraction)
    simpleError(
      "targetSucroseMassFraction",
      "Target exceeds raw-sugar sucrose fraction.",
    );
  const totalSyrupMassKg =
      input.desiredVolumeLiters * input.finalDensityKgPerLiter,
    rawSugarMassKg =
      (totalSyrupMassKg * input.targetSucroseMassFraction) /
      input.rawSugarSucroseFraction;
  return {
    totalSyrupMassKg,
    rawSugarMassKg,
    addedWaterMassKg: totalSyrupMassKg - rawSugarMassKg,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  desiredVolumeLiters: 10,
  finalDensityKgPerLiter: 1.2,
  targetSucroseMassFraction: 0.6,
  rawSugarSucroseFraction: 0.9,
} satisfies Input;
export const exampleOutput = {
  totalSyrupMassKg: 12,
  rawSugarMassKg: 8,
  addedWaterMassKg: 4,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "apiculture/syrup-sugar-mass-by-concentration",
  title: "Syrup Sugar Mass By Concentration",
  description:
    "Plan sucrose-mass concentration from desired final volume/density and raw-sugar purity; impurities remain in the mixture and no season-specific feeding recipe is embedded.",
  inputs: inputFields,
  outputs: [
    { id: "totalSyrupMassKg", label: "Total syrup mass kg", kind: "number" },
    { id: "rawSugarMassKg", label: "Raw sugar mass kg", kind: "number" },
    { id: "addedWaterMassKg", label: "Added water mass kg", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      desiredVolumeLiters: value.desiredVolumeLiters as number,
      finalDensityKgPerLiter: value.finalDensityKgPerLiter as number,
      targetSucroseMassFraction: value.targetSucroseMassFraction as number,
      rawSugarSucroseFraction: value.rawSugarSucroseFraction as number,
    }),
});
export const run = tool.execute;
export default tool;
