import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, jenks } from "../batch52-shared.js";
export type Input = Readonly<{
  readonly observedValues: readonly number[];
  readonly classes: number;
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "observedValues", label: "Observed values", kind: "numberList" },
  { id: "classes", label: "Classes", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (i: Input) => {
  return jenks(i.observedValues, i.classes);
};
export const calculate = (i: Input) => {
  validateInput(i, fields);
  return finish({ result: compute(i) });
};
export const example = {
  input: { observedValues: [1, 2, 10, 11], classes: 2 },
  output: {
    result: {
      upperBounds: [2, 11],
      withinClassSquaredError: 1,
      classStartIndices: [0, 2],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "cartography/jenks-natural-breaks-simplified",
  title: "Jenks Natural Breaks Simplified Classifier",
  description:
    "Exact bounded one-dimensional dynamic-programming Jenks SSE partition, <=128 observations; deterministic earliest split ties, upper bounds may coincide.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: {
          upperBounds: { type: "array", items: { type: "number" } },
          withinClassSquaredError: { type: "number" },
          classStartIndices: { type: "array", items: { type: "integer" } },
        },
        required: [
          "upperBounds",
          "withinClassSquaredError",
          "classStartIndices",
        ],
      },
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
