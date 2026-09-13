import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  bounded,
} from "../batch50-shared.js";
export type Input = Readonly<{
  readonly actualSingleParentEligibleHouseholdCount: number;
  readonly actualEligibleHouseholdCount: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualSingleParentEligibleHouseholdCount",
    label: "Actual single parent eligible household count",
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
    input.actualSingleParentEligibleHouseholdCount,
    "actualSingleParentEligibleHouseholdCount",
    0,
    1000000,
  );
  bounded(
    input.actualEligibleHouseholdCount,
    "actualEligibleHouseholdCount",
    1,
    1000000,
  );
  if (
    input.actualSingleParentEligibleHouseholdCount >
    input.actualEligibleHouseholdCount
  )
    simpleError("counts", "Actualsubset≤denominator.");
  return {
    value:
      (100 * input.actualSingleParentEligibleHouseholdCount) /
      input.actualEligibleHouseholdCount,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualSingleParentEligibleHouseholdCount: 2,
    actualEligibleHouseholdCount: 4,
  },
  output: { result: { value: 50.0 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "sociology/single-parent-household-percentage",
  title: "Single Parent Household Percentage Calculator",
  description:
    "Actual single-parent household percentage. Independently matched complete reference population/period/definition; not automated person classification, causal effect, safety or individual identity.",
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
