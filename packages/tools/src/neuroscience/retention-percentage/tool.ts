import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  bounded,
} from "../batch49-shared.js";
export type Input = Readonly<{
  readonly actualRetainedEligibleItemCount: number;
  readonly actualInitiallyEligibleItemCount: number;
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  {
    id: "actualRetainedEligibleItemCount",
    label: "Actual retained eligible item count",
    kind: "number",
  },
  {
    id: "actualInitiallyEligibleItemCount",
    label: "Actual initially eligible item count",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input) => {
  bounded(
    input.actualRetainedEligibleItemCount,
    "actualRetainedEligibleItemCount",
    0,
    1000000,
  );
  bounded(
    input.actualInitiallyEligibleItemCount,
    "actualInitiallyEligibleItemCount",
    1,
    1000000,
  );
  if (
    input.actualRetainedEligibleItemCount >
    input.actualInitiallyEligibleItemCount
  )
    simpleError("counts", "Retained≤initial.");
  return {
    value:
      (100 * input.actualRetainedEligibleItemCount) /
      input.actualInitiallyEligibleItemCount,
  };
};
export const calculate = (input: Input) => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualRetainedEligibleItemCount: 2,
    actualInitiallyEligibleItemCount: 4,
  },
  output: { result: { value: 50 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "neuroscience/retention-percentage",
  title: "Retention Percentage Calculator",
  description:
    "Actual retention percentage of independently same qualified items, not infer neuro biological retention from unrelated means. Actual independently matched observations/units and protocol, not diagnosis, causal mechanism, clinical decision or validated individual prediction.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Actual calculation or qualified reference",
      kind: "object",

      schema: {
        type: "object",
        additionalProperties: false,
        properties: { value: { type: "number" } },
        required: ["value"],
      },
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
