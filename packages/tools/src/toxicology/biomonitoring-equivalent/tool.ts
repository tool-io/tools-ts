import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch48-shared.js";
export type Input = Readonly<{
  readonly callerIndependentlyValidatedBiomarkerReferenceConcentration: number;
  readonly matchedExternalDoseReference: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "callerIndependentlyValidatedBiomarkerReferenceConcentration",
    label: "Caller independently validated biomarker reference concentration",
    kind: "number",
  },
  {
    id: "matchedExternalDoseReference",
    label: "Matched external dose reference",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  nonnegative(
    input.callerIndependentlyValidatedBiomarkerReferenceConcentration,
    "numerator",
  );
  positive(input.matchedExternalDoseReference, "denominator");
  return {
    observedRatio:
      (1 * input.callerIndependentlyValidatedBiomarkerReferenceConcentration) /
      input.matchedExternalDoseReference,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    callerIndependentlyValidatedBiomarkerReferenceConcentration: 2,
    matchedExternalDoseReference: 4,
  },
  output: { result: { observedRatio: 0.5 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "toxicology/biomonitoring-equivalent",
  title: "Biomonitoring Equivalent Calculator",
  description:
    "Independently established biomonitoring-reference/external-dose relationship only; not clinical exposure diagnosis. Actual independently matched quantities/units required; not infer causal effect, clinical guidance or safe design.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Qualified observed calculation or explicit reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
