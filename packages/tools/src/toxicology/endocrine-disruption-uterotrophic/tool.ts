import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  aligned,
  positive,
  nonnegative,
} from "../batch48-shared.js";
export type Input = Readonly<{
  readonly actualIndependentlyMeasuredTissueMassesMg: readonly number[];
  readonly matchedIndependentlyMeasuredBodyMassesGrams: readonly number[];
  readonly callerVerifiedMatchedControlNormalizedMassMgPerGram: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualIndependentlyMeasuredTissueMassesMg",
    label: "Actual independently measured tissue masses mg",
    kind: "numberList",
  },
  {
    id: "matchedIndependentlyMeasuredBodyMassesGrams",
    label: "Matched independently measured body masses grams",
    kind: "numberList",
  },
  {
    id: "callerVerifiedMatchedControlNormalizedMassMgPerGram",
    label: "Caller verified matched control normalized mass mg per gram",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  aligned(
    input.actualIndependentlyMeasuredTissueMassesMg,
    input.matchedIndependentlyMeasuredBodyMassesGrams,
    "animals",
  );
  input.actualIndependentlyMeasuredTissueMassesMg.forEach((v) =>
    nonnegative(v, "tissuemass"),
  );
  input.matchedIndependentlyMeasuredBodyMassesGrams.forEach((v) =>
    positive(v, "bodymass"),
  );
  positive(
    input.callerVerifiedMatchedControlNormalizedMassMgPerGram,
    "control",
  );
  const r = input.actualIndependentlyMeasuredTissueMassesMg.map(
    (v, i) => v / input.matchedIndependentlyMeasuredBodyMassesGrams[i],
  );
  return {
    observedBodyNormalizedTissueMassesMgPerGram: r,
    observedNormalizedMassFoldChanges: r.map(
      (v) => v / input.callerVerifiedMatchedControlNormalizedMassMgPerGram,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualIndependentlyMeasuredTissueMassesMg: [100, 200],
    matchedIndependentlyMeasuredBodyMassesGrams: [10, 20],
    callerVerifiedMatchedControlNormalizedMassMgPerGram: 5,
  },
  output: {
    result: {
      observedBodyNormalizedTissueMassesMgPerGram: [10, 10],
      observedNormalizedMassFoldChanges: [2, 2],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "toxicology/endocrine-disruption-uterotrophic",
  title: "Uterotrophic Endocrine Disruption Calculator",
  description:
    "actual uterotrophic uterine-mass normalized comparison with independently identified species/sex, tissues and assay conditions. Does not infer hormonal mechanism, statistical effect significance or guideline-positive outcome; animal procedures outside scope.",
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
