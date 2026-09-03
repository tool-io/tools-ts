import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, pick, simpleError } from "../batch43-shared.js";

export type Input = Readonly<{
  readonly annotatedArticleFeatures: readonly string[];
  readonly annotatedNounFeatures: readonly string[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "annotatedArticleFeatures",
    label: "Annotated article features",
    kind: "stringList",
  },
  {
    id: "annotatedNounFeatures",
    label: "Annotated noun features",
    kind: "stringList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  if (
    input.annotatedArticleFeatures.length !== 3 ||
    input.annotatedNounFeatures.length !== 3
  )
    simpleError(
      "features",
      "Case, number, gender independently annotated triples.",
    );
  for (const v of [
    input.annotatedArticleFeatures,
    input.annotatedNounFeatures,
  ]) {
    pick(
      v[0],
      { nominative: 1, genitive: 1, dative: 1, accusative: 1 },
      "case",
    );
    pick(v[1], { singular: 1, dual: 1, plural: 1 }, "number");
    pick(v[2], { masculine: 1, feminine: 1, neuter: 1 }, "gender");
  }
  const indices = input.annotatedArticleFeatures.flatMap((v, i) =>
    v === input.annotatedNounFeatures[i] ? [] : [i],
  );
  return {
    featureAgreement: !indices.length,
    mismatchedFeatureIndices: indices,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    annotatedArticleFeatures: ["nominative", "singular", "feminine"],
    annotatedNounFeatures: ["nominative", "singular", "feminine"],
  },
  output: { result: { featureAgreement: true, mismatchedFeatureIndices: [] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "classics/greek-article-paradigm-agreement-checker",
  title: "Greek Article Paradigm Agreement Checker",
  description:
    "Check independently established Ancient Greek article/noun case-number-gender agreement; no inflection recognition or exclusion of contextual syntax exceptions.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated observation or reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
