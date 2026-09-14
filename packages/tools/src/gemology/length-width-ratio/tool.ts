import type { ToolExample } from "../../core/example.js";
import type { ToolExecutionContext } from "../../core/definition.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive } from "../batch51-shared.js";
export type Input = Readonly<{
  readonly actualMeasuredLength: number;
  readonly actualMeasuredWidth: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualMeasuredLength",
    label: "Actual measured length",
    kind: "number",
  },
  { id: "actualMeasuredWidth", label: "Actual measured width", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (
  input: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  positive(input.actualMeasuredLength, "actualMeasuredLength");
  positive(input.actualMeasuredWidth, "actualMeasuredWidth");
  return { value: input.actualMeasuredLength / input.actualMeasuredWidth };
};
export const calculate = (
  input: Input,
  context?: ToolExecutionContext,
): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input, context) });
};
export const example = {
  input: { actualMeasuredLength: 4, actualMeasuredWidth: 2 },
  output: { result: { value: 2 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "gemology/length-width-ratio",
  title: "Length-to-Width Ratio Calculator",
  description:
    "Actualoutline length/widthratio,sameunits,no fancyshapeidentity. Actual independently established geometry,calibration,product/rubricedition,units and applicability;not provenance,identity,grade,safe procedure or operational/compliance approval.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified result",
      kind: "object",
    },
  ],
  calculate: (value, context) => calculate(value as unknown as Input, context),
});
export const run = tool.execute;
export default tool;
