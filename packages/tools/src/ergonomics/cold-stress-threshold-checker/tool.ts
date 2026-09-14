import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, range } from "../batch52-shared.js";
export type Input = Readonly<{
  readonly independentlyEstablishedWindChillC: number;
  readonly callerMinimum: number;
  readonly callerMaximum: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "independentlyEstablishedWindChillC",
    label: "Independently established wind chill c",
    kind: "number",
  },
  { id: "callerMinimum", label: "Caller minimum", kind: "number" },
  { id: "callerMaximum", label: "Caller maximum", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (i: Input): Readonly<Record<string, unknown>> => {
  range([i.callerMinimum, i.callerMaximum], "bounds");
  return {
    withinCallerBounds:
      i.independentlyEstablishedWindChillC >= i.callerMinimum &&
      i.independentlyEstablishedWindChillC <= i.callerMaximum,
  };
};
export const calculate = (i: Input): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i) });
};
export const example = {
  input: {
    independentlyEstablishedWindChillC: -15,
    callerMinimum: -10,
    callerMaximum: 10,
  },
  output: { result: { withinCallerBounds: false } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "ergonomics/cold-stress-threshold-checker",
  title: "Cold Stress Wind Chill Work Exposure Threshold Checker",
  description:
    "Compare independently established wind chill to caller exposure-plan bounds; does not compute safe work duration.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified result",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
