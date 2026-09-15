import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, angle } from "../batch53-shared.js";

export type Input = Readonly<{
  observedRin: number;
  callerAcceptableMinimum: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "observedRin", label: "Observed rin", kind: "number" },
  {
    id: "callerAcceptableMinimum",
    label: "Caller acceptable minimum",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (
  i: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  angle(i.observedRin, "RIN", 1, 10);
  angle(i.callerAcceptableMinimum, "minimum", 1, 10);
  return {
    atOrAboveSuppliedMinimum: i.observedRin >= i.callerAcceptableMinimum,
    rinEstimatedFromPeaks: false,
  };
};
export const calculate = (i: Input, context?: ToolExecutionContext): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i, context) });
};
export const example = {
  input: { observedRin: 8, callerAcceptableMinimum: 7 },
  output: {
    result: { atOrAboveSuppliedMinimum: true, rinEstimatedFromPeaks: false },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "transcriptomics/rin-band-profile-classifier",
  title: "RNA Integrity Number RIN 1-10 Band Profile Classifier",
  description:
    "Screen an independently instrument-established RIN on its 1–10 scale; does not infer the proprietary RIN from rRNA peak ratios.",
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
