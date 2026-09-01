import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  bounded,
  aligned,
  sum,
} from "../batch34-shared.js";
export type Input = Readonly<{
  readonly observedHarvestMassesKgByBlock: readonly number[];
  readonly usableGondolaPayloadKg: number;
  readonly observedBlockAreasHa: readonly number[];
  readonly callerCanMixBlockFinalLoads: boolean;
}>;
export type Output = Readonly<{
  readonly requiredWholeGondolaLoads: number;
  readonly totalUsableLoadCapacityKg: number;
  readonly unusedFinalLoadCapacityKg: number;
  readonly pooledLoadsPerHarvestedHa: number;
}>;
const inputFields = [
  {
    id: "observedHarvestMassesKgByBlock",
    label: "Observed harvest masses kg by block",
    kind: "numberList",
  },
  {
    id: "usableGondolaPayloadKg",
    label: "Usable gondola payload kg",
    kind: "number",
  },
  {
    id: "observedBlockAreasHa",
    label: "Observed block areas ha",
    kind: "numberList",
  },
  {
    id: "callerCanMixBlockFinalLoads",
    label: "Caller can mix block final loads",
    kind: "boolean",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.usableGondolaPayloadKg, "usableGondolaPayloadKg");
  input.observedBlockAreasHa.forEach((v) =>
    positive(v, "observedBlockAreasHa"),
  );
  input.observedHarvestMassesKgByBlock.forEach((v) =>
    nonnegative(v, "observedHarvestMassesKgByBlock"),
  );
  aligned(
    input.observedHarvestMassesKgByBlock,
    input.observedBlockAreasHa,
    "observedHarvestMassesKgByBlock",
  );
  const mass = sum(input.observedHarvestMassesKgByBlock),
    loads = input.callerCanMixBlockFinalLoads
      ? Math.ceil(mass / input.usableGondolaPayloadKg)
      : sum(
          input.observedHarvestMassesKgByBlock.map((v) =>
            Math.ceil(v / input.usableGondolaPayloadKg),
          ),
        );
  bounded(loads, "loads", 0, 1000000);
  return {
    requiredWholeGondolaLoads: loads,
    totalUsableLoadCapacityKg: loads * input.usableGondolaPayloadKg,
    unusedFinalLoadCapacityKg: loads * input.usableGondolaPayloadKg - mass,
    pooledLoadsPerHarvestedHa: loads / sum(input.observedBlockAreasHa),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedHarvestMassesKgByBlock: [2000, 3000],
  usableGondolaPayloadKg: 1000,
  observedBlockAreasHa: [1, 2],
  callerCanMixBlockFinalLoads: false,
} satisfies Input;
export const exampleOutput = {
  requiredWholeGondolaLoads: 5,
  totalUsableLoadCapacityKg: 5000,
  unusedFinalLoadCapacityKg: 0,
  pooledLoadsPerHarvestedHa: 1.6666666666666667,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "viticulture/gondola-loads-per-hectare",
  title: "Gondola Loads Per Hectare Calculator",
  description:
    "Budget actual block harvest payloads/areas into whole gondola loads with explicit final-load mixing policy; not single lug division, weight capacity certification or guessed tonnes/hectare.",
  inputs: inputFields,
  outputs: [
    {
      id: "requiredWholeGondolaLoads",
      label: "Required whole gondola loads",
      kind: "number",
    },
    {
      id: "totalUsableLoadCapacityKg",
      label: "Total usable load capacity kg",
      kind: "number",
    },
    {
      id: "unusedFinalLoadCapacityKg",
      label: "Unused final load capacity kg",
      kind: "number",
    },
    {
      id: "pooledLoadsPerHarvestedHa",
      label: "Pooled loads per harvested ha",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedHarvestMassesKgByBlock:
        value.observedHarvestMassesKgByBlock as readonly number[],
      usableGondolaPayloadKg: value.usableGondolaPayloadKg as number,
      observedBlockAreasHa: value.observedBlockAreasHa as readonly number[],
      callerCanMixBlockFinalLoads: value.callerCanMixBlockFinalLoads as boolean,
    }),
});
export const run = tool.execute;
export default tool;
