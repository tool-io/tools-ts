import type { ToolExample } from "../../core/example.js";
import type { ToolExecutionContext } from "../../core/definition.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  positive,
  nonnegative,
} from "../batch51-shared.js";
export type Input = Readonly<{
  readonly actualTransverseDiameter: number;
  readonly actualDistance: number;
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  {
    id: "actualTransverseDiameter",
    label: "Actual transverse diameter",
    kind: "number",
  },
  { id: "actualDistance", label: "Actual distance", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input, context?: ToolExecutionContext) => {
  nonnegative(input.actualTransverseDiameter, "actualTransverseDiameter");
  positive(input.actualDistance, "actualDistance");
  if (input.actualTransverseDiameter / input.actualDistance > 0.1)
    simpleError("ratio", "D/d≤.1small-anglebranch.");
  return {
    value:
      (206264.80624709636 * input.actualTransverseDiameter) /
      input.actualDistance,
  };
};
export const calculate = (input: Input, context?: ToolExecutionContext) => {
  validateInput(input, fields);
  return finish({ result: compute(input, context) });
};
export const example = {
  input: { actualTransverseDiameter: 1, actualDistance: 1000 },
  output: { result: { value: 206.26480624709637 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "astronomy/small-angle-formula-arcseconds",
  title: "Small Angle Formula Arcseconds Calculator",
  description:
    "Restricted small-anglelinear\u03b8arcsec=D/d\u00d7206264.80624709636,D/d\u22640.1,theoreticalerrornot exactatanor spherearcsin. Actual independent model/unit/frame/epoch/calibration and applicable measurement established;not precise ephemeris,forecast,geodesy operation,identity or safety approval.",
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
