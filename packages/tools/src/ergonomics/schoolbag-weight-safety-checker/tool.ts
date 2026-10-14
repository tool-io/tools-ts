import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch52-shared.js";
export type Input = Readonly<{
  readonly bagKg: number;
  readonly bodyKg: number;
  readonly callerReviewPercent: number;
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "bagKg", label: "Bag kg", kind: "number" },
  { id: "bodyKg", label: "Body kg", kind: "number" },
  { id: "callerReviewPercent", label: "Caller review percent", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (i: Input) => {
  nonnegative(i.bagKg, "bag");
  positive(i.bodyKg, "body");
  nonnegative(i.callerReviewPercent, "limit");
  return {
    callerReviewFlag: (100 * i.bagKg) / i.bodyKg > i.callerReviewPercent,
  };
};
export const calculate = (i: Input) => {
  validateInput(i, fields);
  return finish({ result: compute(i) });
};
export const example = {
  input: { bagKg: 6, bodyKg: 40, callerReviewPercent: 10 },
  output: { result: { callerReviewFlag: true } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "ergonomics/schoolbag-weight-safety-checker",
  title: "School Bag Weight Percent Body Weight Safety Checker",
  description:
    "Observed schoolbag/body mass percentage screen against caller limit; not pediatric safety determination.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified result",
      kind: "object",

      schema: {
        type: "object",
        additionalProperties: false,
        properties: { callerReviewFlag: { type: "boolean" } },
        required: ["callerReviewFlag"],
      },
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
