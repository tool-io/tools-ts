import type { ToolExample } from "../../core/example.js";
import type { ToolExecutionContext } from "../../core/definition.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive } from "../batch51-shared.js";
export type Input = Readonly<{
  readonly actualMaximumCranialBreadth: number;
  readonly actualMaximumCranialLength: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualMaximumCranialBreadth",
    label: "Actual maximum cranial breadth",
    kind: "number",
  },
  {
    id: "actualMaximumCranialLength",
    label: "Actual maximum cranial length",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (
  input: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  positive(input.actualMaximumCranialBreadth, "actualMaximumCranialBreadth");
  positive(input.actualMaximumCranialLength, "actualMaximumCranialLength");
  return {
    value:
      (100 * input.actualMaximumCranialBreadth) /
      input.actualMaximumCranialLength,
  };
};
export const calculate = (
  input: Input,
  context?: ToolExecutionContext,
): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input, context) });
};
export const example = {
  input: { actualMaximumCranialBreadth: 8, actualMaximumCranialLength: 10 },
  output: { result: { value: 80 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "archaeology/cranial-index-cephalic",
  title: "Cranial Index Calculator",
  description:
    "Measuredcranialbreadth/lengthindexONLY,not ancestry,personality,intelligenceor sensitivegroupclassification. Actual independently established geometry,calibration,product/rubricedition,units and applicability;not provenance,identity,grade,safe procedure or operational/compliance approval.",
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
