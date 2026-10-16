import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, range } from "../batch52-shared.js";
export type Input = Readonly<{
  readonly observedPercent: number;
  readonly callerMinimum: number;
  readonly callerMaximum: number;
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "observedPercent", label: "Observed percent", kind: "number" },
  { id: "callerMinimum", label: "Caller minimum", kind: "number" },
  { id: "callerMaximum", label: "Caller maximum", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (i: Input) => {
  range([i.callerMinimum, i.callerMaximum], "bounds");
  return {
    withinCallerBounds:
      i.observedPercent >= i.callerMinimum &&
      i.observedPercent <= i.callerMaximum,
  };
};
export const calculate = (i: Input) => {
  validateInput(i, fields);
  return finish({ result: compute(i) });
};
export const example = {
  input: { observedPercent: 0.5, callerMinimum: 0, callerMaximum: 1 },
  output: { result: { withinCallerBounds: true } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "horticulture/urea-foliar-percent-safe-checker",
  title: "Urea Foliar Percent Safe Checker",
  description:
    "Caller-authorized foliar concentration screen only; does not establish phytotoxicity or safe application.",
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
