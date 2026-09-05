import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  fraction,
  aligned,
  sum,
} from "../batch37-shared.js";
export type Input = Readonly<{
  readonly observedMatchedFeedAssayFractions: readonly number[];
  readonly observedMatchedConcentrateAssayFractions: readonly number[];
  readonly observedTrialRepresentedFeedTonnes: readonly number[];
}>;
export type Output = Readonly<{
  readonly observedTrialEnrichmentRatios: readonly number[];
  readonly feedWeightedAssayEnrichmentRatio: number;
}>;
const inputFields = [
  {
    id: "observedMatchedFeedAssayFractions",
    label: "Observed matched feed assay fractions",
    kind: "numberList",
  },
  {
    id: "observedMatchedConcentrateAssayFractions",
    label: "Observed matched concentrate assay fractions",
    kind: "numberList",
  },
  {
    id: "observedTrialRepresentedFeedTonnes",
    label: "Observed trial represented feed tonnes",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedMatchedFeedAssayFractions.forEach((v) =>
    positive(v, "observedMatchedFeedAssayFractions"),
  );
  input.observedTrialRepresentedFeedTonnes.forEach((v) =>
    nonnegative(v, "observedTrialRepresentedFeedTonnes"),
  );
  input.observedMatchedFeedAssayFractions.forEach((v) =>
    fraction(v, "observedMatchedFeedAssayFractions"),
  );
  input.observedMatchedConcentrateAssayFractions.forEach((v) =>
    fraction(v, "observedMatchedConcentrateAssayFractions"),
  );
  aligned(
    input.observedMatchedFeedAssayFractions,
    input.observedMatchedConcentrateAssayFractions,
    "observedMatchedFeedAssayFractions",
  );
  aligned(
    input.observedMatchedFeedAssayFractions,
    input.observedTrialRepresentedFeedTonnes,
    "observedMatchedFeedAssayFractions",
  );
  const called = sum(
    input.observedMatchedFeedAssayFractions.map(
      (v, i) => v * input.observedTrialRepresentedFeedTonnes[i],
    ),
  );
  positive(called, "represented feed metal");
  return {
    observedTrialEnrichmentRatios:
      input.observedMatchedConcentrateAssayFractions.map(
        (v, i) => v / input.observedMatchedFeedAssayFractions[i],
      ),
    feedWeightedAssayEnrichmentRatio:
      sum(
        input.observedMatchedConcentrateAssayFractions.map(
          (v, i) => v * input.observedTrialRepresentedFeedTonnes[i],
        ),
      ) / called,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedMatchedFeedAssayFractions: [0.1, 0.2],
  observedMatchedConcentrateAssayFractions: [0.3, 0.4],
  observedTrialRepresentedFeedTonnes: [1, 2],
} satisfies Input;
export const exampleOutput = {
  observedTrialEnrichmentRatios: [3, 2],
  feedWeightedAssayEnrichmentRatio: 2.2,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "mining/enrichment-ratio",
  title: "Enrichment Ratio Calculator",
  description:
    "Audit observed matched-trial enrichment without solving concentrate mass balance or pooling trials as physical products. Caller independently verifies units, applicability and matching conditions; no operational recipe, safety certification, causal efficacy or legal/resource classification is inferred.",
  inputs: inputFields,
  outputs: [
    {
      id: "observedTrialEnrichmentRatios",
      label: "Observed trial enrichment ratios",
      kind: "numberList",
    },
    {
      id: "feedWeightedAssayEnrichmentRatio",
      label: "Feed weighted assay enrichment ratio",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedMatchedFeedAssayFractions:
        value.observedMatchedFeedAssayFractions as readonly number[],
      observedMatchedConcentrateAssayFractions:
        value.observedMatchedConcentrateAssayFractions as readonly number[],
      observedTrialRepresentedFeedTonnes:
        value.observedTrialRepresentedFeedTonnes as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
