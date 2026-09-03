import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  fraction,
  aligned,
  sum,
} from "../batch40-shared.js";
export type Input = Readonly<{
  readonly observedMuffinCavityVolumesMl: readonly number[];
  readonly callerBatterFillFractions: readonly number[];
  readonly observedBatterDensityGMl: number;
}>;
export type Output = Readonly<{
  readonly cavityBatterMassesG: readonly number[];
  readonly totalBatterMassG: number;
}>;
const inputFields = [
  {
    id: "observedMuffinCavityVolumesMl",
    label: "Observed muffin cavity volumes ml",
    kind: "numberList",
  },
  {
    id: "callerBatterFillFractions",
    label: "Caller batter fill fractions",
    kind: "numberList",
  },
  {
    id: "observedBatterDensityGMl",
    label: "Observed batter density g ml",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedMuffinCavityVolumesMl.forEach((v) =>
    positive(v, "observedMuffinCavityVolumesMl"),
  );
  positive(input.observedBatterDensityGMl, "observedBatterDensityGMl");
  input.callerBatterFillFractions.forEach((v) =>
    fraction(v, "callerBatterFillFractions"),
  );
  aligned(
    input.observedMuffinCavityVolumesMl,
    input.callerBatterFillFractions,
    "observedMuffinCavityVolumesMl",
  );
  const m = input.observedMuffinCavityVolumesMl.map(
    (v, i) =>
      v * input.callerBatterFillFractions[i] * input.observedBatterDensityGMl,
  );
  return { cavityBatterMassesG: m, totalBatterMassG: sum(m) };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedMuffinCavityVolumesMl: [100, 120],
  callerBatterFillFractions: [0.5, 0.75],
  observedBatterDensityGMl: 0.8,
} satisfies Input;
export const exampleOutput = {
  cavityBatterMassesG: [40, 72],
  totalBatterMassG: 112,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "cooking/muffin-batter-per-cup",
  title: "Cooking Muffin Batter Per Cup Calculator",
  description:
    "Heterogeneous measured muffin cavity volumes×explicit fill fractions×observed batter density; no universal tablespoon allocation. Caller establishes matching ingredient basis and method. Not food-safety, doneness, preservation or allergy certification.",
  inputs: inputFields,
  outputs: [
    {
      id: "cavityBatterMassesG",
      label: "Cavity batter masses g",
      kind: "numberList",
    },
    { id: "totalBatterMassG", label: "Total batter mass g", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      observedMuffinCavityVolumesMl:
        value.observedMuffinCavityVolumesMl as readonly number[],
      callerBatterFillFractions:
        value.callerBatterFillFractions as readonly number[],
      observedBatterDensityGMl: value.observedBatterDensityGMl as number,
    }),
});
export const run = tool.execute;
export default tool;
