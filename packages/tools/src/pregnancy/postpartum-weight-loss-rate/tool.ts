import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive } from "../batch47-shared.js";
export type Input = Readonly<{
  readonly previousObservedPostpartumWeightKg: number;
  readonly currentObservedPostpartumWeightKg: number;
  readonly elapsedDays: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "previousObservedPostpartumWeightKg",
    label: "Previous observed postpartum weight kg",
    kind: "number",
  },
  {
    id: "currentObservedPostpartumWeightKg",
    label: "Current observed postpartum weight kg",
    kind: "number",
  },
  { id: "elapsedDays", label: "Elapsed days", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  positive(input.previousObservedPostpartumWeightKg, "weight");
  positive(input.currentObservedPostpartumWeightKg, "weight");
  positive(input.elapsedDays, "days");
  return {
    signedObservedWeightLossKgPerWeek:
      (7 *
        (input.previousObservedPostpartumWeightKg -
          input.currentObservedPostpartumWeightKg)) /
      input.elapsedDays,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    previousObservedPostpartumWeightKg: 70,
    currentObservedPostpartumWeightKg: 68,
    elapsedDays: 14,
  },
  output: { result: { signedObservedWeightLossKgPerWeek: 1 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "pregnancy/postpartum-weight-loss-rate",
  title: "Postpartum Weight Loss Rate Calculator",
  description:
    "Actual signed postpartum loss rate between independently comparable measurements; fluid shifts and recovery matter. Not a weight-loss target, diet plan or body-composition inference.",
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
