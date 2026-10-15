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
  readonly actualMeasuredDraft: number;
  readonly callerActualWaterDensity: number;
  readonly callerActualIceDensity: number;
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "actualMeasuredDraft", label: "Actual measured draft", kind: "number" },
  {
    id: "callerActualWaterDensity",
    label: "Caller actual water density",
    kind: "number",
  },
  {
    id: "callerActualIceDensity",
    label: "Caller actual ice density",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input, context?: ToolExecutionContext) => {
  nonnegative(input.actualMeasuredDraft, "actualMeasuredDraft");
  positive(input.callerActualWaterDensity, "callerActualWaterDensity");
  positive(input.callerActualIceDensity, "callerActualIceDensity");
  if (input.callerActualIceDensity >= input.callerActualWaterDensity)
    simpleError("density", "Declaredfloatingiceρice<ρwater.");
  return {
    value:
      (input.actualMeasuredDraft * input.callerActualWaterDensity) /
      input.callerActualIceDensity,
  };
};
export const calculate = (input: Input, context?: ToolExecutionContext) => {
  validateInput(input, fields);
  return finish({ result: compute(input, context) });
};
export const example = {
  input: {
    actualMeasuredDraft: 1,
    callerActualWaterDensity: 2,
    callerActualIceDensity: 1,
  },
  output: { result: { value: 2 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "glaciology/flotation-thickness-draft",
  title: "Flotation Thickness Draft Calculator",
  description:
    "Floatinguniformhydrostatictotalthicknessdraft\u00d7\u03c1water/\u03c1ice,not suppliedthicknessdraftfractionforcecheck. Actual independent units,calibration,measurement definitions/coverage and model applicability;not a climate forecast,causal determination,geodesy operation or safe travel/design approval.",
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
