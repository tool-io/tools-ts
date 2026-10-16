import type { ToolExample } from "../../core/example.js";
import type { ToolExecutionContext } from "../../core/definition.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive } from "../batch51-shared.js";
export type Input = Readonly<{
  readonly actualLugInternalWidthMm: number;
  readonly actualStrapWidthMm: number;
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  {
    id: "actualLugInternalWidthMm",
    label: "Actual lug internal width mm",
    kind: "number",
  },
  { id: "actualStrapWidthMm", label: "Actual strap width mm", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input, context?: ToolExecutionContext) => {
  positive(input.actualLugInternalWidthMm, "actualLugInternalWidthMm");
  positive(input.actualStrapWidthMm, "actualStrapWidthMm");
  return { value: input.actualLugInternalWidthMm - input.actualStrapWidthMm };
};
export const calculate = (input: Input, context?: ToolExecutionContext) => {
  validateInput(input, fields);
  return finish({ result: compute(input, context) });
};
export const example = {
  input: { actualLugInternalWidthMm: 20, actualStrapWidthMm: 20 },
  output: { result: { value: 0 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "horology/lug-strap-width-check",
  title: "Lug Width to Strap Width Checker",
  description:
    "Signedactual lug-minusstrapfit-widthclearance ONLY,zeroequalwidth,not springbarengagement/structuralsafety. Actual independently established geometry,calibration,product/rubricedition,units and applicability;not provenance,identity,grade,safe procedure or operational/compliance approval.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified result",
      kind: "object",

      schema: {
        type: "object",
        additionalProperties: false,
        properties: { value: { type: "number" } },
        required: ["value"],
      },
    },
  ],
  calculate: (value, context) => calculate(value as unknown as Input, context),
});
export const run = tool.execute;
export default tool;
