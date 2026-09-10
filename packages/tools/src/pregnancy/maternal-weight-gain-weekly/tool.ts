import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive } from "../batch47-shared.js";
export type Input = Readonly<{
  readonly previousMaternalWeightKg: number;
  readonly currentMaternalWeightKg: number;
  readonly elapsedWeeks: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "previousMaternalWeightKg",
    label: "Previous maternal weight kg",
    kind: "number",
  },
  {
    id: "currentMaternalWeightKg",
    label: "Current maternal weight kg",
    kind: "number",
  },
  { id: "elapsedWeeks", label: "Elapsed weeks", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  positive(input.previousMaternalWeightKg, "weight");
  positive(input.currentMaternalWeightKg, "weight");
  positive(input.elapsedWeeks, "weeks");
  return {
    signedMaternalWeightChangeKgPerWeek:
      (input.currentMaternalWeightKg - input.previousMaternalWeightKg) /
      input.elapsedWeeks,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    previousMaternalWeightKg: 60,
    currentMaternalWeightKg: 61,
    elapsedWeeks: 2,
  },
  output: { result: { signedMaternalWeightChangeKgPerWeek: 0.5 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "pregnancy/maternal-weight-gain-weekly",
  title: "Maternal Weekly Weight Gain Calculator",
  description:
    "Actual compatible maternal weight change per measured elapsed week, not recommended gain, fetal growth or inferred adiposity.",
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
