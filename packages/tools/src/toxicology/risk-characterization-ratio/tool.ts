import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch48-shared.js";
export type Input = Readonly<{
  readonly actualMatchedExposureEstimate: number;
  readonly callerIndependentlyDerivedEffectReference: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualMatchedExposureEstimate",
    label: "Actual matched exposure estimate",
    kind: "number",
  },
  {
    id: "callerIndependentlyDerivedEffectReference",
    label: "Caller independently derived effect reference",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  nonnegative(input.actualMatchedExposureEstimate, "numerator");
  positive(input.callerIndependentlyDerivedEffectReference, "denominator");
  return {
    observedRatio:
      (1 * input.actualMatchedExposureEstimate) /
      input.callerIndependentlyDerivedEffectReference,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualMatchedExposureEstimate: 2,
    callerIndependentlyDerivedEffectReference: 4,
  },
  output: { result: { observedRatio: 0.5 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "toxicology/risk-characterization-ratio",
  title: "Risk Characterization Ratio Calculator",
  description:
    "Actual risk-characterization exposure/effect reference ratio for independently matched route, endpoint, population, duration. Actual independently matched quantities/units required; not infer causal effect, clinical guidance or safe design.",
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
