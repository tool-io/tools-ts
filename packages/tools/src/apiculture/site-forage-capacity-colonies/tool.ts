import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  fraction,
  count,
  aligned,
} from "../shared.js";
export type Input = Readonly<{
  readonly habitatSeasonalNectarKg: readonly number[];
  readonly accessibleFractions: readonly number[];
  readonly competingAndEcologicalReserveKg: number;
  readonly seasonalForageNeedKgPerColony: number;
}>;
export type Output = Readonly<{
  readonly netAllocatableForageKg: number;
  readonly modelWholeColonyCapacity: number;
}>;
const inputFields = [
  {
    id: "habitatSeasonalNectarKg",
    label: "Habitat seasonal nectar kg",
    kind: "numberList",
  },
  {
    id: "accessibleFractions",
    label: "Accessible fractions",
    kind: "numberList",
  },
  {
    id: "competingAndEcologicalReserveKg",
    label: "Competing and ecological reserve kg",
    kind: "number",
  },
  {
    id: "seasonalForageNeedKgPerColony",
    label: "Seasonal forage need kg per colony",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(
    input.seasonalForageNeedKgPerColony,
    "seasonalForageNeedKgPerColony",
  );
  input.habitatSeasonalNectarKg.forEach((v) =>
    nonnegative(v, "habitatSeasonalNectarKg"),
  );
  nonnegative(
    input.competingAndEcologicalReserveKg,
    "competingAndEcologicalReserveKg",
  );
  input.accessibleFractions.forEach((v) => fraction(v, "accessibleFractions"));
  aligned(
    input.habitatSeasonalNectarKg,
    input.accessibleFractions,
    "habitatSeasonalNectarKg",
  );
  const netAllocatableForageKg =
    input.habitatSeasonalNectarKg.reduce(
      (s, v, i) => s + v * input.accessibleFractions[i],
      0,
    ) - input.competingAndEcologicalReserveKg;
  return {
    netAllocatableForageKg,
    modelWholeColonyCapacity: count(
      Math.floor(
        Math.max(0, netAllocatableForageKg) /
          input.seasonalForageNeedKgPerColony,
      ),
      "modelWholeColonyCapacity",
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  habitatSeasonalNectarKg: [100, 200],
  accessibleFractions: [0.5, 0.5],
  competingAndEcologicalReserveKg: 50,
  seasonalForageNeedKgPerColony: 20,
} satisfies Input;
export const exampleOutput = {
  netAllocatableForageKg: 100,
  modelWholeColonyCapacity: 5,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "apiculture/site-forage-capacity-colonies",
  title: "Site Forage Capacity Colonies",
  description:
    "Screen seasonal colony capacity from supplied habitat nectar access and competing/ecological reserves; negative forage budget is retained and forage timing or pollination adequacy is not inferred.",
  inputs: inputFields,
  outputs: [
    {
      id: "netAllocatableForageKg",
      label: "Net allocatable forage kg",
      kind: "number",
    },
    {
      id: "modelWholeColonyCapacity",
      label: "Model whole colony capacity",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      habitatSeasonalNectarKg:
        value.habitatSeasonalNectarKg as readonly number[],
      accessibleFractions: value.accessibleFractions as readonly number[],
      competingAndEcologicalReserveKg:
        value.competingAndEcologicalReserveKg as number,
      seasonalForageNeedKgPerColony:
        value.seasonalForageNeedKgPerColony as number,
    }),
});
export const run = tool.execute;
export default tool;
