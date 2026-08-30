import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive, nonnegative } from "../shared.js";
export type Input = Readonly<{
  readonly marketableHarvestKg: number;
  readonly consumedBlueWaterM3: number;
  readonly consumedGreenWaterM3: number;
}>;
export type Output = Readonly<{
  readonly totalConsumedWaterM3: number;
  readonly physicalConsumedWaterProductivityKgPerM3: number;
  readonly blueWaterShareOfConsumption: number;
}>;
const inputFields = [
  { id: "marketableHarvestKg", label: "Marketable harvest kg", kind: "number" },
  {
    id: "consumedBlueWaterM3",
    label: "Consumed blue water m3",
    kind: "number",
  },
  {
    id: "consumedGreenWaterM3",
    label: "Consumed green water m3",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  nonnegative(input.marketableHarvestKg, "marketableHarvestKg");
  nonnegative(input.consumedBlueWaterM3, "consumedBlueWaterM3");
  nonnegative(input.consumedGreenWaterM3, "consumedGreenWaterM3");
  const totalConsumedWaterM3 = positive(
    input.consumedBlueWaterM3 + input.consumedGreenWaterM3,
    "consumedWater",
  );
  return {
    totalConsumedWaterM3,
    physicalConsumedWaterProductivityKgPerM3:
      input.marketableHarvestKg / totalConsumedWaterM3,
    blueWaterShareOfConsumption:
      input.consumedBlueWaterM3 / totalConsumedWaterM3,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  marketableHarvestKg: 1000,
  consumedBlueWaterM3: 100,
  consumedGreenWaterM3: 300,
} satisfies Input;
export const exampleOutput = {
  totalConsumedWaterM3: 400,
  physicalConsumedWaterProductivityKgPerM3: 2.5,
  blueWaterShareOfConsumption: 0.25,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "agriculture/water-productivity",
  title: "Agriculture Water Productivity",
  description:
    "Calculate marketable output per independently measured total consumptive blue/green water, retaining source share; withdrawals/recycled water are not automatically counted as consumption.",
  inputs: inputFields,
  outputs: [
    {
      id: "totalConsumedWaterM3",
      label: "Total consumed water m3",
      kind: "number",
    },
    {
      id: "physicalConsumedWaterProductivityKgPerM3",
      label: "Physical consumed water productivity kg per m3",
      kind: "number",
    },
    {
      id: "blueWaterShareOfConsumption",
      label: "Blue water share of consumption",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      marketableHarvestKg: value.marketableHarvestKg as number,
      consumedBlueWaterM3: value.consumedBlueWaterM3 as number,
      consumedGreenWaterM3: value.consumedGreenWaterM3 as number,
    }),
});
export const run = tool.execute;
export default tool;
