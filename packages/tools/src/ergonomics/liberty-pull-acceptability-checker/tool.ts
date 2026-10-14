import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, range } from "../batch52-shared.js";
export type Input = Readonly<{
  readonly observedPullN: number;
  readonly callerMinimum: number;
  readonly callerMaximum: number;
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "observedPullN", label: "Observed pull n", kind: "number" },
  { id: "callerMinimum", label: "Caller minimum", kind: "number" },
  { id: "callerMaximum", label: "Caller maximum", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (i: Input) => {
  range([i.callerMinimum, i.callerMaximum], "bounds");
  return {
    withinCallerBounds:
      i.observedPullN >= i.callerMinimum && i.observedPullN <= i.callerMaximum,
  };
};
export const calculate = (i: Input) => {
  validateInput(i, fields);
  return finish({ result: compute(i) });
};
export const example = {
  input: { observedPullN: 90, callerMinimum: 0, callerMaximum: 100 },
  output: { result: { withinCallerBounds: true } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "ergonomics/liberty-pull-acceptability-checker",
  title: "Liberty Mutual Pull Force Acceptability Checker",
  description:
    "Caller independently applicable pull-force limits, not universal acceptability or injury-safe design.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified result",
      kind: "object",

      schema: {
        type: "object",
        additionalProperties: false,
        properties: { withinCallerBounds: { type: "boolean" } },
        required: ["withinCallerBounds"],
      },
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
