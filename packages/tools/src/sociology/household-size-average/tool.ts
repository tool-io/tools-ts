import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, bounded } from "../batch50-shared.js";
export type Input = Readonly<{
  readonly actualHouseholdResidentCount: number;
  readonly actualEligibleHouseholdCount: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualHouseholdResidentCount",
    label: "Actual household resident count",
    kind: "number",
  },
  {
    id: "actualEligibleHouseholdCount",
    label: "Actual eligible household count",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  bounded(
    input.actualHouseholdResidentCount,
    "actualHouseholdResidentCount",
    0,
    1000000,
  );
  bounded(
    input.actualEligibleHouseholdCount,
    "actualEligibleHouseholdCount",
    1,
    1000000,
  );
  return {
    value:
      (1 * input.actualHouseholdResidentCount) /
      input.actualEligibleHouseholdCount,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { actualHouseholdResidentCount: 2, actualEligibleHouseholdCount: 4 },
  output: { result: { value: 0.5 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "sociology/household-size-average",
  title: "Average Household Size Calculator",
  description:
    "Actual mean household size residents/households. Independently matched complete reference population/period/definition; not automated person classification, causal effect, safety or individual identity.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Actual calculation or qualified reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
