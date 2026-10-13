import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, range } from "../batch52-shared.js";
export type Input = Readonly<{
  readonly symbolSizeMm: number;
  readonly callerMinimum: number;
  readonly callerMaximum: number;
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "symbolSizeMm", label: "Symbol size mm", kind: "number" },
  { id: "callerMinimum", label: "Caller minimum", kind: "number" },
  { id: "callerMaximum", label: "Caller maximum", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (i: Input) => {
  range([i.callerMinimum, i.callerMaximum], "bounds");
  return {
    withinCallerBounds:
      i.symbolSizeMm >= i.callerMinimum && i.symbolSizeMm <= i.callerMaximum,
  };
};
export const calculate = (i: Input) => {
  validateInput(i, fields);
  return finish({ result: compute(i) });
};
export const example = {
  input: { symbolSizeMm: 1, callerMinimum: 0.5, callerMaximum: 5 },
  output: { result: { withinCallerBounds: true } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "cartography/symbol-minimum-legibility-checker",
  title: "Symbol Size Minimum mm Legibility Rule Checker",
  description:
    "Caller specification screen for symbolSizeMm only; not universal legibility, ADA compliance, print readiness or accessibility certification.",
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
