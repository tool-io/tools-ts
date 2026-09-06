import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive } from "../batch42-shared.js";
export type Input = Readonly<{
  readonly previousMatchedIndex: number;
  readonly currentMatchedIndex: number;
}>;
export type Output = Readonly<{ readonly yearOverYearPercent: number }>;
const inputFields = [
  {
    id: "previousMatchedIndex",
    label: "Previous matched index",
    kind: "number",
  },
  { id: "currentMatchedIndex", label: "Current matched index", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.previousMatchedIndex, "previousMatchedIndex");
  positive(input.currentMatchedIndex, "currentMatchedIndex");
  return {
    yearOverYearPercent:
      100 * (input.currentMatchedIndex / input.previousMatchedIndex - 1),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  previousMatchedIndex: 100,
  currentMatchedIndex: 110,
} satisfies Input;
export const exampleOutput = { yearOverYearPercent: 10 } satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "philately/price-index-change-yoy",
  title: "Price Realized Index Change Year-over-Year Calculator",
  description:
    "Compute same-basket, adjacent-year index change; caller supplies matched periods and basket. Caller independently verifies observations, reference edition, units and applicability; not a grading-service certificate, authentication, conservation treatment, actual market price or legal/insurance entitlement.",
  inputs: inputFields,
  outputs: [
    {
      id: "yearOverYearPercent",
      label: "Year over year percent",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      previousMatchedIndex: value.previousMatchedIndex as number,
      currentMatchedIndex: value.currentMatchedIndex as number,
    }),
});
export const run = tool.execute;
export default tool;
