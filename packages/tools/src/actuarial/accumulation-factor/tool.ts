import type { ToolExample } from "../../core/example.js";
import type { ToolExecutionContext } from "../../core/definition.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  expFinite,
} from "../batch51-shared.js";
export type Input = Readonly<{
  readonly callerActualConstantForceOfInterest: number;
  readonly actualYears: number;
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  {
    id: "callerActualConstantForceOfInterest",
    label: "Caller actual constant force of interest",
    kind: "number",
  },
  { id: "actualYears", label: "Actual years", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input, context?: ToolExecutionContext) => {
  nonnegative(input.actualYears, "actualYears");
  return {
    value: expFinite(
      input.callerActualConstantForceOfInterest * input.actualYears,
    ),
  };
};
export const calculate = (input: Input, context?: ToolExecutionContext) => {
  validateInput(input, fields);
  return finish({ result: compute(input, context) });
};
export const example = {
  input: { callerActualConstantForceOfInterest: 1, actualYears: 1 },
  output: { result: { value: 2.718281828459045 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "actuarial/accumulation-factor",
  title: "Accumulation Factor Calculator",
  description:
    "Actualconstantforceaccumulatione^(\u03b4t),not selectinterestforecast Actual independently applicable qualified life-table/model/rate assumptions,not a diagnosis,individual death prediction,published mortalitytable,contractquote or guaranteed financialresult.",
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
