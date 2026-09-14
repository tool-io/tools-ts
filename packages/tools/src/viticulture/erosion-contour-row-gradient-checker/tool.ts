import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch52-shared.js";
export type Input = Readonly<{
  readonly signedRiseM: number;
  readonly horizontalRunM: number;
  readonly callerMaxAbsolutePercent: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "signedRiseM", label: "Signed rise m", kind: "number" },
  { id: "horizontalRunM", label: "Horizontal run m", kind: "number" },
  {
    id: "callerMaxAbsolutePercent",
    label: "Caller max absolute percent",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (i: Input): Readonly<Record<string, unknown>> => {
  positive(i.horizontalRunM, "run");
  nonnegative(i.callerMaxAbsolutePercent, "limit");
  return {
    callerReviewFlag:
      Math.abs((100 * i.signedRiseM) / i.horizontalRunM) >
      i.callerMaxAbsolutePercent,
  };
};
export const calculate = (i: Input): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i) });
};
export const example = {
  input: { signedRiseM: 2, horizontalRunM: 100, callerMaxAbsolutePercent: 1 },
  output: { result: { callerReviewFlag: true } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "viticulture/erosion-contour-row-gradient-checker",
  title: "Erosion Contour Row Gradient Checker",
  description:
    "Check observed absolute row gradient against a caller limit; no erosion or contour-design certification.",
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
