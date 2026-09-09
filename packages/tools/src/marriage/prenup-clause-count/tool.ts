import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  aligned,
  binary,
  sum,
  unique,
} from "../batch48-shared.js";
export type Input = Readonly<{
  readonly actualIndependentlyIdentifiedClauseIds: readonly string[];
  readonly clauseEvidenceKnownFlags: readonly number[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualIndependentlyIdentifiedClauseIds",
    label: "Actual independently identified clause ids",
    kind: "stringList",
  },
  {
    id: "clauseEvidenceKnownFlags",
    label: "Clause evidence known flags",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  unique(input.actualIndependentlyIdentifiedClauseIds, "clauses");
  aligned(
    input.actualIndependentlyIdentifiedClauseIds,
    input.clauseEvidenceKnownFlags,
    "known",
  );
  binary(input.clauseEvidenceKnownFlags, "known");
  return {
    knownIdentifiedClauseCount: sum(input.clauseEvidenceKnownFlags),
    unknownClauseIds: input.actualIndependentlyIdentifiedClauseIds.filter(
      (_, i) => !input.clauseEvidenceKnownFlags[i],
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualIndependentlyIdentifiedClauseIds: ["assets", "debts"],
    clauseEvidenceKnownFlags: [1, 0],
  },
  output: {
    result: { knownIdentifiedClauseCount: 1, unknownClauseIds: ["debts"] },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "marriage/prenup-clause-count",
  title: "Prenup Clause Count Tool",
  description:
    "Actual unique independently identified prenup clauses, unknowns retained; not parse legal enforceability, asset protection or clause completeness.",
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
