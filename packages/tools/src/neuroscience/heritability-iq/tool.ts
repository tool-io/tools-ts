import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, simpleError } from "../batch49-shared.js";
export type Input = Readonly<{
  readonly actualMonozygoticWithinPairCorrelation: number;
  readonly actualDizygoticWithinPairCorrelation: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualMonozygoticWithinPairCorrelation",
    label: "Actual monozygotic within pair correlation",
    kind: "number",
  },
  {
    id: "actualDizygoticWithinPairCorrelation",
    label: "Actual dizygotic within pair correlation",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  if (
    Math.abs(input.actualMonozygoticWithinPairCorrelation) > 1 ||
    Math.abs(input.actualDizygoticWithinPairCorrelation) > 1
  )
    simpleError("correlations", "Actualcorrelations−1…1.");
  return {
    value:
      2 *
      (input.actualMonozygoticWithinPairCorrelation -
        input.actualDizygoticWithinPairCorrelation),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualMonozygoticWithinPairCorrelation: 0.6,
    actualDizygoticWithinPairCorrelation: 0.3,
  },
  output: { result: { value: 0.6 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "neuroscience/heritability-iq",
  title: "IQ Heritability Calculator",
  description:
    "Falconer twin variance illustration h\u00b2=2(rMZ\u2212rDZ), actual cohort traits, unclippedestimate under strong independent equal environment/additivity assumptions. Not individual IQ genetic percentage, ancestry ranking, causality or direct additive variance measurement. Actual independently matched observations/units and protocol, not diagnosis, causal mechanism, clinical decision or validated individual prediction.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Actual calculation or qualified reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
