import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  fraction,
  count,
} from "../shared.js";
export type Input = Readonly<{
  readonly boxCount: number;
  readonly layingsPerBox: number;
  readonly acceptedLayingFraction: number;
  readonly boxPurchaseCost: number;
  readonly sharedInspectionAndFreightCost: number;
}>;
export type Output = Readonly<{
  readonly expectedAcceptedLayings: number;
  readonly totalSeedCost: number;
  readonly costPerExpectedAcceptedLaying: number;
}>;
const inputFields = [
  { id: "boxCount", label: "Box count", kind: "integer" },
  { id: "layingsPerBox", label: "Layings per box", kind: "integer" },
  {
    id: "acceptedLayingFraction",
    label: "Accepted laying fraction",
    kind: "number",
  },
  { id: "boxPurchaseCost", label: "Box purchase cost", kind: "number" },
  {
    id: "sharedInspectionAndFreightCost",
    label: "Shared inspection and freight cost",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.boxCount, "boxCount");
  positive(input.layingsPerBox, "layingsPerBox");
  positive(input.acceptedLayingFraction, "acceptedLayingFraction");
  nonnegative(input.boxPurchaseCost, "boxPurchaseCost");
  nonnegative(
    input.sharedInspectionAndFreightCost,
    "sharedInspectionAndFreightCost",
  );
  fraction(input.acceptedLayingFraction, "acceptedLayingFraction");
  count(input.boxCount, "boxCount");
  count(input.layingsPerBox, "layingsPerBox");
  const expectedAcceptedLayings =
      input.boxCount * input.layingsPerBox * input.acceptedLayingFraction,
    totalSeedCost =
      input.boxCount * input.boxPurchaseCost +
      input.sharedInspectionAndFreightCost;
  return {
    expectedAcceptedLayings,
    totalSeedCost,
    costPerExpectedAcceptedLaying: totalSeedCost / expectedAcceptedLayings,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  boxCount: 10,
  layingsPerBox: 20,
  acceptedLayingFraction: 0.9,
  boxPurchaseCost: 30,
  sharedInspectionAndFreightCost: 60,
} satisfies Input;
export const exampleOutput = {
  expectedAcceptedLayings: 180,
  totalSeedCost: 360,
  costPerExpectedAcceptedLaying: 2,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "sericulture/dfl-box-unit-cost",
  title: "DFL Box Unit Cost",
  description:
    "Allocate DFL-box purchase and shared lot inspection/freight to expected accepted layings, not simply to purchased boxes; acceptance is an explicit scenario.",
  inputs: inputFields,
  outputs: [
    {
      id: "expectedAcceptedLayings",
      label: "Expected accepted layings",
      kind: "number",
    },
    { id: "totalSeedCost", label: "Total seed cost", kind: "number" },
    {
      id: "costPerExpectedAcceptedLaying",
      label: "Cost per expected accepted laying",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      boxCount: value.boxCount as number,
      layingsPerBox: value.layingsPerBox as number,
      acceptedLayingFraction: value.acceptedLayingFraction as number,
      boxPurchaseCost: value.boxPurchaseCost as number,
      sharedInspectionAndFreightCost:
        value.sharedInspectionAndFreightCost as number,
    }),
});
export const run = tool.execute;
export default tool;
