import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch53-shared.js";

export type Input = Readonly<{ moi: number; callerSingleStepMinimum: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "moi", label: "Moi", kind: "number" },
  {
    id: "callerSingleStepMinimum",
    label: "Caller single step minimum",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (
  i: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  nonnegative(i.moi, "moi");
  positive(i.callerSingleStepMinimum, "threshold");
  return {
    regimeScreen:
      i.moi >= i.callerSingleStepMinimum
        ? "high-moi-single-step-candidate"
        : "low-moi-multicycle-candidate",
    experimentDesignConfirmed: false,
  };
};
export const calculate = (i: Input, context?: ToolExecutionContext): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i, context) });
};
export const example = {
  input: { moi: 5, callerSingleStepMinimum: 3 },
  output: {
    result: {
      regimeScreen: "high-moi-single-step-candidate",
      experimentDesignConfirmed: false,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "virology/moi-regime-singlestep-classifier",
  title: "Multi-Cycle vs Single-Step MOI Regime Classifier",
  description:
    "Compare MOI with an independently chosen design boundary; replication-cycle regime also depends on timing and host conditions.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified evidence",
      kind: "object",
    },
  ],
  calculate: (v, context) => calculate(v as unknown as Input, context),
});
export const run = tool.execute;
export default tool;
