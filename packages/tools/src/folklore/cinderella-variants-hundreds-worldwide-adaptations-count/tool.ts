import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  aligned,
  unique,
  histogram,
} from "../batch44-shared.js";

export type Input = Readonly<{
  readonly callerDistinctEditionVariantIds: readonly string[];
  readonly callerIndependentlyAssignedTraditionLabels: readonly string[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "callerDistinctEditionVariantIds",
    label: "Caller distinct edition variant ids",
    kind: "stringList",
  },
  {
    id: "callerIndependentlyAssignedTraditionLabels",
    label: "Caller independently assigned tradition labels",
    kind: "stringList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  unique(input.callerDistinctEditionVariantIds, "distinctvariants");
  aligned(
    input.callerDistinctEditionVariantIds,
    input.callerIndependentlyAssignedTraditionLabels,
    "traditions",
  );
  const h = histogram(input.callerIndependentlyAssignedTraditionLabels);
  return {
    distinctDocumentedVariantCount:
      input.callerDistinctEditionVariantIds.length,
    traditionLabels: h.tokens,
    variantCountsByTradition: h.counts,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    callerDistinctEditionVariantIds: [
      "edition-a/variant-1",
      "edition-a/variant-2",
      "edition-b/variant-1",
    ],
    callerIndependentlyAssignedTraditionLabels: [
      "tradition-a",
      "tradition-a",
      "tradition-b",
    ],
  },
  output: {
    result: {
      distinctDocumentedVariantCount: 3,
      traditionLabels: ["tradition-a", "tradition-b"],
      variantCountsByTradition: [2, 1],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "folklore/cinderella-variants-hundreds-worldwide-adaptations-count",
  title: "Cinderella Variants Hundreds Worldwide Adaptations Count",
  description:
    "Count actual independently enumerated Cinderella variants under explicit edition-qualified ID sand caller tradition labels; no invented worldwide hundreds total or assumption that adaptations are independent oral witnesses.",
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
