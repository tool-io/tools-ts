import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch47-shared.js";
export type Input = Readonly<{
  readonly observedNuchalTranslucencyMm: number;
  readonly callerVerifiedMatchedGestationalMedian: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "observedNuchalTranslucencyMm",
    label: "Observed nuchal translucency mm",
    kind: "number",
  },
  {
    id: "callerVerifiedMatchedGestationalMedian",
    label: "Caller verified matched gestational median",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  nonnegative(input.observedNuchalTranslucencyMm, "numerator");
  positive(input.callerVerifiedMatchedGestationalMedian, "denominator");
  return {
    observedRatio:
      (1 * input.observedNuchalTranslucencyMm) /
      input.callerVerifiedMatchedGestationalMedian,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    observedNuchalTranslucencyMm: 2,
    callerVerifiedMatchedGestationalMedian: 4,
  },
  output: { result: { observedRatio: 0.5 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "pregnancy/nuchal-translucency-mom",
  title: "Nuchal Translucency MoM Calculator",
  description:
    "Actual biomarker multiple-of-median with independently matched gestational age, assay, units and maternal-factor convention. No marker identity or screening probability inferred. Independently measured compatible definitions/units required; ratio is not a diagnosis, efficacy measure or safety/clinical threshold.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Qualified observation, conditional calculation or reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
