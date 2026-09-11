import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  bounded,
  positive,
  nonnegative,
} from "../batch47-shared.js";
export type Input = Readonly<{
  readonly actualSupplyQuantity: number;
  readonly actualMeasuredRemainderQuantity: number;
  readonly independentlyMeasuredSpillQuantity: number;
  readonly actualAnimalCount: number;
  readonly actualElapsedDays: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualSupplyQuantity",
    label: "Actual supply quantity",
    kind: "number",
  },
  {
    id: "actualMeasuredRemainderQuantity",
    label: "Actual measured remainder quantity",
    kind: "number",
  },
  {
    id: "independentlyMeasuredSpillQuantity",
    label: "Independently measured spill quantity",
    kind: "number",
  },
  { id: "actualAnimalCount", label: "Actual animal count", kind: "number" },
  { id: "actualElapsedDays", label: "Actual elapsed days", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  [
    input.actualSupplyQuantity,
    input.actualMeasuredRemainderQuantity,
    input.independentlyMeasuredSpillQuantity,
  ].forEach((v) => nonnegative(v, "actual-inventory"));
  bounded(input.actualAnimalCount, "animal-count", 1, 10000000);
  positive(input.actualElapsedDays, "days");
  const q =
    input.actualSupplyQuantity -
    input.actualMeasuredRemainderQuantity -
    input.independentlyMeasuredSpillQuantity;
  if (q < 0)
    simpleError("inventory", "Actual remainder and spills within supply.");
  return {
    conditionalObservedConsumedQuantity: q,
    conditionalObservedQuantityPerAnimalPerDay:
      q / input.actualAnimalCount / input.actualElapsedDays,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualSupplyQuantity: 1000,
    actualMeasuredRemainderQuantity: 200,
    independentlyMeasuredSpillQuantity: 100,
    actualAnimalCount: 10,
    actualElapsedDays: 1,
  },
  output: {
    result: {
      conditionalObservedConsumedQuantity: 700,
      conditionalObservedQuantityPerAnimalPerDay: 70,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "veterinary/poultry-feed-consumption-daily",
  title: "Daily Poultry Feed Consumption Calculator",
  description:
    "Actual poultry-feed consumption grams supply\u2212remainder\u2212independently measured spills divided by actual animal-days, assuming actual complete disjoint accounting. Not recommended intake, individual intake or infer heat/disease effects.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Qualified observation, conditional calculation or reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
