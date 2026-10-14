import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  positive,
  finite,
} from "../batch49-shared.js";
export type Input = Readonly<{
  readonly callerVerifiedAdjustmentFactors: readonly number[];
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  {
    id: "callerVerifiedAdjustmentFactors",
    label: "Caller verified adjustment factors",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input) => {
  if (!input.callerVerifiedAdjustmentFactors.length)
    simpleError(
      "callerVerifiedAdjustmentFactors",
      "Actual nonempty observations.",
    );
  input.callerVerifiedAdjustmentFactors.forEach((v) =>
    positive(v, "callerVerifiedAdjustmentFactors"),
  );
  return {
    value: input.callerVerifiedAdjustmentFactors.reduce(
      (a, b) => finite(a * b),
      1,
    ),
  };
};
export const calculate = (input: Input) => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { callerVerifiedAdjustmentFactors: [0.5, 1.2] },
  output: { result: { value: 0.6 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "engineering/glulam-adjustment-factors",
  title: "Glulam Adjustment Factor Calculator",
  description:
    "Product of explicitly independently compatible glulam adjustment factors; no duplicated overlapping factors or code factors selected here. Actual independently established compatible SI units/model context; conditional arithmetic, not code compliance, engineering design or safe operation approval.",
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
