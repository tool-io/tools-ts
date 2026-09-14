import type { ToolExample } from "../../core/example.js";
import type { ToolExecutionContext } from "../../core/definition.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  bounded,
  sum,
} from "../batch51-shared.js";
export type Input = Readonly<{
  readonly actualQualifiedTaxonCounts: readonly number[];
  readonly actualWithoutReplacementRarefactionN: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualQualifiedTaxonCounts",
    label: "Actual qualified taxon counts",
    kind: "numberList",
  },
  {
    id: "actualWithoutReplacementRarefactionN",
    label: "Actual without replacement rarefaction n",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (
  input: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  if (!input.actualQualifiedTaxonCounts.length)
    simpleError("counts", "Actualtaxoncounts.");
  input.actualQualifiedTaxonCounts.forEach((v) =>
    bounded(v, "count", 1, 10000),
  );
  const N = sum(input.actualQualifiedTaxonCounts);
  bounded(N, "total", 1, 10000);
  bounded(input.actualWithoutReplacementRarefactionN, "n", 0, N);
  const n = input.actualWithoutReplacementRarefactionN;
  let s = 0;
  for (const c of input.actualQualifiedTaxonCounts) {
    let miss = 1;
    if (n > N - c) miss = 0;
    else for (let j = 0; j < n; j++) miss *= (N - c - j) / (N - j);
    s += 1 - miss;
  }
  return { expectedObservedTaxonRichness: s };
};
export const calculate = (
  input: Input,
  context?: ToolExecutionContext,
): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input, context) });
};
export const example = {
  input: {
    actualQualifiedTaxonCounts: [2, 2],
    actualWithoutReplacementRarefactionN: 2,
  },
  output: { result: { expectedObservedTaxonRichness: 1.6666666666666667 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "paleontology/rarefaction-standardized-n",
  title: "Rarefaction Species Count at Standardized N Calculator",
  description:
    "Exactfinitehypergeometricexpectedrarefaction\u03a3[1\u2212C(N\u2212ni,n)/C(N,n)],withoutreplacementactualcounts,not Chao1/extrapolation. Actual independently identified specimens,matched units/taxon/cohort/source/edition/calibration and model applicability external;not individual identity,causation,diagnosis,absolute age certainty or validated forecast.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified result",
      kind: "object",
    },
  ],
  calculate: (value, context) => calculate(value as unknown as Input, context),
});
export const run = tool.execute;
export default tool;
