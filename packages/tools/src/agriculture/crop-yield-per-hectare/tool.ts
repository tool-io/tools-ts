import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  aligned,
} from "../shared.js";
export type Input = Readonly<{
  readonly harvestedMarketableMassKg: readonly number[];
  readonly harvestedAreasHa: readonly number[];
}>;
export type Output = Readonly<{
  readonly plotMarketableYieldsKgPerHa: readonly number[];
  readonly pooledMarketableYieldKgPerHa: number;
}>;
const inputFields = [
  {
    id: "harvestedMarketableMassKg",
    label: "Harvested marketable mass kg",
    kind: "numberList",
  },
  { id: "harvestedAreasHa", label: "Harvested areas ha", kind: "numberList" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.harvestedAreasHa.forEach((v) => positive(v, "harvestedAreasHa"));
  input.harvestedMarketableMassKg.forEach((v) =>
    nonnegative(v, "harvestedMarketableMassKg"),
  );
  aligned(
    input.harvestedMarketableMassKg,
    input.harvestedAreasHa,
    "harvestedMarketableMassKg",
  );
  return {
    plotMarketableYieldsKgPerHa: input.harvestedMarketableMassKg.map(
      (v, i) => v / input.harvestedAreasHa[i],
    ),
    pooledMarketableYieldKgPerHa:
      input.harvestedMarketableMassKg.reduce((a, b) => a + b, 0) /
      input.harvestedAreasHa.reduce((a, b) => a + b, 0),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  harvestedMarketableMassKg: [1000, 3000],
  harvestedAreasHa: [1, 2],
} satisfies Input;
export const exampleOutput = {
  plotMarketableYieldsKgPerHa: [1000, 1500],
  pooledMarketableYieldKgPerHa: 1333.3333333333333,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "agriculture/crop-yield-per-hectare",
  title: "Agriculture Crop Yield Per Hectare",
  description:
    "Pool actual marketable harvest inventories by harvested area, retaining plot yields instead of averaging unequal areas; masses must share a declared moisture/grade basis.",
  inputs: inputFields,
  outputs: [
    {
      id: "plotMarketableYieldsKgPerHa",
      label: "Plot marketable yields kg per ha",
      kind: "numberList",
    },
    {
      id: "pooledMarketableYieldKgPerHa",
      label: "Pooled marketable yield kg per ha",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      harvestedMarketableMassKg:
        value.harvestedMarketableMassKg as readonly number[],
      harvestedAreasHa: value.harvestedAreasHa as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
