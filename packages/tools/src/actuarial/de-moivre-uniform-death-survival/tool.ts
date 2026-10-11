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
  readonly callerIndependentTerminalAge: number;
  readonly actualAttainedAge: number;
  readonly actualFutureYears: number;
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  {
    id: "callerIndependentTerminalAge",
    label: "Caller independent terminal age",
    kind: "number",
  },
  { id: "actualAttainedAge", label: "Actual attained age", kind: "number" },
  { id: "actualFutureYears", label: "Actual future years", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input, context?: ToolExecutionContext) => {
  positive(input.callerIndependentTerminalAge, "callerIndependentTerminalAge");
  nonnegative(input.actualAttainedAge, "actualAttainedAge");
  nonnegative(input.actualFutureYears, "actualFutureYears");
  if (
    input.actualAttainedAge >= input.callerIndependentTerminalAge ||
    input.actualFutureYears >
      input.callerIndependentTerminalAge - input.actualAttainedAge
  )
    simpleError("ages", "Declaredx<ω,t≤ω−x.");
  return {
    value:
      (input.callerIndependentTerminalAge -
        input.actualAttainedAge -
        input.actualFutureYears) /
      (input.callerIndependentTerminalAge - input.actualAttainedAge),
  };
};
export const calculate = (input: Input, context?: ToolExecutionContext) => {
  validateInput(input, fields);
  return finish({ result: compute(input, context) });
};
export const example = {
  input: {
    callerIndependentTerminalAge: 100,
    actualAttainedAge: 40,
    actualFutureYears: 30,
  },
  output: { result: { value: 0.5 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "actuarial/de-moivre-uniform-death-survival",
  title: "De Moivre Uniform Death Survival Calculator",
  description:
    "DeMoivrelinearuniform-lifetimeconditional survival(\u03c9\u2212x\u2212t)/(\u03c9\u2212x),0\u2264x<\u03c9,0\u2264t\u2264\u03c9\u2212x. Actual independently applicable qualified life-table/model/rate assumptions,not a diagnosis,individual death prediction,published mortalitytable,contractquote or guaranteed financialresult.",
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
