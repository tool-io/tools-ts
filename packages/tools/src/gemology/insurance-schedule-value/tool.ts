import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, nonnegative, aligned } from "../shared.js";
export type Input = Readonly<{
  readonly declaredItemReplacementValues: readonly number[];
  readonly declaredItemScheduleLimits: readonly number[];
  readonly declaredScheduleAggregateLimit: number;
}>;
export type Output = Readonly<{
  readonly itemValueAboveScheduleLimits: readonly number[];
  readonly totalModeledScheduleCoverage: number;
  readonly totalUncoveredDeclaredValue: number;
}>;
const inputFields = [
  {
    id: "declaredItemReplacementValues",
    label: "Declared item replacement values",
    kind: "numberList",
  },
  {
    id: "declaredItemScheduleLimits",
    label: "Declared item schedule limits",
    kind: "numberList",
  },
  {
    id: "declaredScheduleAggregateLimit",
    label: "Declared schedule aggregate limit",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.declaredItemReplacementValues.forEach((v) =>
    nonnegative(v, "declaredItemReplacementValues"),
  );
  input.declaredItemScheduleLimits.forEach((v) =>
    nonnegative(v, "declaredItemScheduleLimits"),
  );
  nonnegative(
    input.declaredScheduleAggregateLimit,
    "declaredScheduleAggregateLimit",
  );
  aligned(
    input.declaredItemReplacementValues,
    input.declaredItemScheduleLimits,
    "declaredItemReplacementValues",
  );
  const itemValueAboveScheduleLimits = input.declaredItemReplacementValues.map(
      (v, i) => Math.max(0, v - input.declaredItemScheduleLimits[i]),
    ),
    totalModeledScheduleCoverage = Math.min(
      input.declaredScheduleAggregateLimit,
      input.declaredItemReplacementValues.reduce(
        (s, v, i) => s + Math.min(v, input.declaredItemScheduleLimits[i]),
        0,
      ),
    );
  return {
    itemValueAboveScheduleLimits,
    totalModeledScheduleCoverage,
    totalUncoveredDeclaredValue:
      input.declaredItemReplacementValues.reduce((a, b) => a + b, 0) -
      totalModeledScheduleCoverage,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  declaredItemReplacementValues: [100, 200],
  declaredItemScheduleLimits: [80, 300],
  declaredScheduleAggregateLimit: 250,
} satisfies Input;
export const exampleOutput = {
  itemValueAboveScheduleLimits: [20, 0],
  totalModeledScheduleCoverage: 250,
  totalUncoveredDeclaredValue: 50,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "gemology/insurance-schedule-value",
  title: "Insurance Schedule Value",
  description:
    "Audit declared item and aggregate schedule limits against caller replacement inventories; no policy exclusions, deductibles, binding coverage or insurance advice are inferred.",
  inputs: inputFields,
  outputs: [
    {
      id: "itemValueAboveScheduleLimits",
      label: "Item value above schedule limits",
      kind: "numberList",
    },
    {
      id: "totalModeledScheduleCoverage",
      label: "Total modeled schedule coverage",
      kind: "number",
    },
    {
      id: "totalUncoveredDeclaredValue",
      label: "Total uncovered declared value",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      declaredItemReplacementValues:
        value.declaredItemReplacementValues as readonly number[],
      declaredItemScheduleLimits:
        value.declaredItemScheduleLimits as readonly number[],
      declaredScheduleAggregateLimit:
        value.declaredScheduleAggregateLimit as number,
    }),
});
export const run = tool.execute;
export default tool;
