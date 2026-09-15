import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive } from "../batch53-shared.js";

export type Input = Readonly<{
  observedMassDa: number;
  theoreticalMassDa: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "observedMassDa", label: "Observed mass da", kind: "number" },
  { id: "theoreticalMassDa", label: "Theoretical mass da", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (
  i: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  positive(i.observedMassDa, "observed");
  positive(i.theoreticalMassDa, "theoretical");
  return {
    signedErrorPpm:
      (1e6 * (i.observedMassDa - i.theoreticalMassDa)) / i.theoreticalMassDa,
  };
};
export const calculate = (i: Input, context?: ToolExecutionContext): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i, context) });
};
export const example = {
  input: { observedMassDa: 100.001, theoreticalMassDa: 100 },
  output: { result: { signedErrorPpm: 10 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "proteomics/peptide-mass-error-ppm-calculator",
  title: "Peptide ppm Mass Error Observed versus Theoretical Calculator",
  description:
    "Compute signed relative peptide mass error against the theoretical mass; not an absolute-error replacement or a match-confidence score.",
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
