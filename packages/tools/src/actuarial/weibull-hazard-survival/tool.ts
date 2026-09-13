import type { ToolExample } from "../../core/example.js";
import type { ToolExecutionContext } from "../../core/definition.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  expFinite,
  survival,
} from "../batch51-shared.js";
export type Input = Readonly<{
  readonly actualAge: number;
  readonly callerWeibullScale: number;
  readonly callerWeibullShape: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "actualAge", label: "Actual age", kind: "number" },
  { id: "callerWeibullScale", label: "Caller weibull scale", kind: "number" },
  { id: "callerWeibullShape", label: "Caller weibull shape", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (
  input: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  positive(input.callerWeibullScale, "scale");
  positive(input.callerWeibullShape, "shape");
  positive(input.actualAge, "age");
  const r = input.actualAge / input.callerWeibullScale;
  return {
    hazard:
      (input.callerWeibullShape / input.callerWeibullScale) *
      r ** (input.callerWeibullShape - 1),
    survival: expFinite(-(r ** input.callerWeibullShape)),
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
  input: { actualAge: 2, callerWeibullScale: 2, callerWeibullShape: 2 },
  output: { result: { hazard: 1, survival: 0.36787944117144233 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "actuarial/weibull-hazard-survival",
  title: "Weibull Hazard Survival Calculator",
  description:
    "QualifiedWeibull\u03bc=(k/\u03bb)(x/\u03bb)^(k\u22121),S=e^\u2212(x/\u03bb)^k,positive-agebranch/no zero-age singularity or silentunderflow. Actual independently applicable qualified life-table/model/rate assumptions,not a diagnosis,individual death prediction,published mortalitytable,contractquote or guaranteed financialresult.",
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
