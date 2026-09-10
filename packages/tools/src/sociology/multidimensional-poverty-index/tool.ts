import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  fraction,
  aligned,
  binary,
  sum,
} from "../batch46-shared.js";
export type Input = Readonly<{
  readonly independentlyClassifiedPovertyFlags: readonly number[];
  readonly verifiedDeprivationFractions: readonly number[];
  readonly matchedSurveyWeights: readonly number[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "independentlyClassifiedPovertyFlags",
    label: "Independently classified poverty flags",
    kind: "numberList",
  },
  {
    id: "verifiedDeprivationFractions",
    label: "Verified deprivation fractions",
    kind: "numberList",
  },
  {
    id: "matchedSurveyWeights",
    label: "Matched survey weights",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  aligned(
    input.independentlyClassifiedPovertyFlags,
    input.verifiedDeprivationFractions,
    "cohort",
  );
  aligned(
    input.independentlyClassifiedPovertyFlags,
    input.matchedSurveyWeights,
    "weights",
  );
  binary(input.independentlyClassifiedPovertyFlags, "poor");
  input.verifiedDeprivationFractions.forEach((v) => fraction(v, "deprivation"));
  input.matchedSurveyWeights.forEach((v) => nonnegative(v, "weight"));
  const t = positive(sum(input.matchedSurveyWeights), "total"),
    p = positive(
      sum(
        input.matchedSurveyWeights.map(
          (v, i) => v * input.independentlyClassifiedPovertyFlags[i],
        ),
      ),
      "poorweight",
    ),
    i = sum(
      input.matchedSurveyWeights.map(
        (v, i) =>
          v *
          input.independentlyClassifiedPovertyFlags[i] *
          input.verifiedDeprivationFractions[i],
      ),
    );
  return {
    observedHeadcountFraction: p / t,
    observedIntensityAmongPoor: i / p,
    conditionalMpi: i / t,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    independentlyClassifiedPovertyFlags: [1, 0, 1],
    verifiedDeprivationFractions: [0.5, 0.2, 0.75],
    matchedSurveyWeights: [1, 1, 2],
  },
  output: {
    result: {
      observedHeadcountFraction: 0.75,
      observedIntensityAmongPoor: 0.6666666666666666,
      conditionalMpi: 0.5,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "sociology/multidimensional-poverty-index",
  title: "Multidimensional Poverty Index Calculator",
  description:
    "Alkire-Foster style MPIfrom actual independently classified poor status, verified weighted deprivation fractions and compatible survey weights. Caller supplies applicable cutoff/domains; no invented deprivation facts or poverty classification.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated observation or qualified reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
