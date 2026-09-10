import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  aligned,
  binary,
  positive,
  sum,
  unique,
} from "../batch48-shared.js";
export type Input = Readonly<{
  readonly actualAssessedTroglobiteTaxonIds: readonly string[];
  readonly independentlyQualifiedEndemicFlags: readonly number[];
  readonly endemismEvidenceKnownFlags: readonly number[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualAssessedTroglobiteTaxonIds",
    label: "Actual assessed troglobite taxon ids",
    kind: "stringList",
  },
  {
    id: "independentlyQualifiedEndemicFlags",
    label: "Independently qualified endemic flags",
    kind: "numberList",
  },
  {
    id: "endemismEvidenceKnownFlags",
    label: "Endemism evidence known flags",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  unique(input.actualAssessedTroglobiteTaxonIds, "taxa");
  aligned(
    input.actualAssessedTroglobiteTaxonIds,
    input.independentlyQualifiedEndemicFlags,
    "endemism",
  );
  aligned(
    input.actualAssessedTroglobiteTaxonIds,
    input.endemismEvidenceKnownFlags,
    "known",
  );
  binary(input.independentlyQualifiedEndemicFlags, "endemic");
  binary(input.endemismEvidenceKnownFlags, "known");
  const t = positive(sum(input.endemismEvidenceKnownFlags), "known-taxa"),
    n = sum(
      input.independentlyQualifiedEndemicFlags.map(
        (v, i) => v * input.endemismEvidenceKnownFlags[i],
      ),
    );
  return {
    knownEndemicTaxonCount: n,
    knownAssessedTaxonCount: t,
    knownEndemicTaxonPercent: (100 * n) / t,
    unknownTaxonIds: input.actualAssessedTroglobiteTaxonIds.filter(
      (_, i) => !input.endemismEvidenceKnownFlags[i],
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualAssessedTroglobiteTaxonIds: ["a", "b", "c"],
    independentlyQualifiedEndemicFlags: [1, 0, 1],
    endemismEvidenceKnownFlags: [1, 1, 0],
  },
  output: {
    result: {
      knownEndemicTaxonCount: 1,
      knownAssessedTaxonCount: 2,
      knownEndemicTaxonPercent: 50,
      unknownTaxonIds: ["c"],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "speleology/troglobite-endemism-index",
  title: "Troglobite Endemism Index Assemblage Scorer",
  description:
    "Actual independently qualified cave assemblage known-endemic taxon percentage, unknown taxonomy/endemism retained. Not abundance-weighted biodiversity, true global endemism or species identification.",
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
