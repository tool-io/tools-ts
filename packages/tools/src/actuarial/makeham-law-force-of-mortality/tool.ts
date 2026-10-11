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
  readonly callerMakehamA: number;
  readonly callerGompertzB: number;
  readonly callerGompertzC: number;
  readonly actualAgeYears: number;
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "callerMakehamA", label: "Caller makeham a", kind: "number" },
  { id: "callerGompertzB", label: "Caller gompertz b", kind: "number" },
  { id: "callerGompertzC", label: "Caller gompertz c", kind: "number" },
  { id: "actualAgeYears", label: "Actual age years", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input, context?: ToolExecutionContext) => {
  nonnegative(input.callerMakehamA, "callerMakehamA");
  positive(input.callerGompertzB, "callerGompertzB");
  positive(input.callerGompertzC, "callerGompertzC");
  nonnegative(input.actualAgeYears, "actualAgeYears");
  if (input.callerGompertzC <= 1) simpleError("c", "Actualc>1.");
  return {
    value:
      input.callerMakehamA +
      input.callerGompertzB * input.callerGompertzC ** input.actualAgeYears,
  };
};
export const calculate = (input: Input, context?: ToolExecutionContext) => {
  validateInput(input, fields);
  return finish({ result: compute(input, context) });
};
export const example = {
  input: {
    callerMakehamA: 0.01,
    callerGompertzB: 0.01,
    callerGompertzC: 2,
    actualAgeYears: 2,
  },
  output: { result: { value: 0.05 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "actuarial/makeham-law-force-of-mortality",
  title: "Makeham Law Force of Mortality Calculator",
  description:
    "DeclaredMakeham\u03bc(x)=A+B c^x,c>1,compatibleinverseyears,not GompertzwithoutA. Actual independently applicable qualified life-table/model/rate assumptions,not a diagnosis,individual death prediction,published mortalitytable,contractquote or guaranteed financialresult.",
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
