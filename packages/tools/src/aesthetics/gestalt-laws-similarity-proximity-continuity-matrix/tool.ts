import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  bounded,
  shape,
  simpleError,
} from "../batch44-shared.js";

export type Input = Readonly<{
  readonly independentlyAnnotatedSimilarityLinks: readonly (readonly number[])[];
  readonly independentlyAnnotatedProximityLinks: readonly (readonly number[])[];
  readonly independentlyAnnotatedContinuityLinks: readonly (readonly number[])[];
  readonly observedElementCount: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "independentlyAnnotatedSimilarityLinks",
    label: "Independently annotated similarity links",
    kind: "matrix",
  },
  {
    id: "independentlyAnnotatedProximityLinks",
    label: "Independently annotated proximity links",
    kind: "matrix",
  },
  {
    id: "independentlyAnnotatedContinuityLinks",
    label: "Independently annotated continuity links",
    kind: "matrix",
  },
  {
    id: "observedElementCount",
    label: "Observed element count",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  bounded(input.observedElementCount, "elements", 1, 64);
  const m = Array.from(
    { length: input.observedElementCount },
    () => Array(input.observedElementCount).fill(0) as number[],
  );
  for (const [links, mask] of [
    [input.independentlyAnnotatedSimilarityLinks, 1],
    [input.independentlyAnnotatedProximityLinks, 2],
    [input.independentlyAnnotatedContinuityLinks, 4],
  ] as const) {
    if (links.length && shape(links, "links") !== 2)
      simpleError("links", "Explicit element index pairs.");
    const seen = new Set<string>();
    for (const [a, b] of links) {
      bounded(a, "index", 0, input.observedElementCount - 1);
      bounded(b, "index", 0, input.observedElementCount - 1);
      if (a === b) simpleError("links", "Distinct element indices.");
      const key = [Math.min(a, b), Math.max(a, b)].join(":");
      if (seen.has(key))
        simpleError(
          "links",
          "No duplicated undirected pair within one principle.",
        );
      seen.add(key);
      m[a][b] |= mask;
      m[b][a] |= mask;
    }
  }
  return { pairPrincipleMaskMatrix: m };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    independentlyAnnotatedSimilarityLinks: [[0, 1]],
    independentlyAnnotatedProximityLinks: [[1, 2]],
    independentlyAnnotatedContinuityLinks: [[0, 2]],
    observedElementCount: 3,
  },
  output: {
    result: {
      pairPrincipleMaskMatrix: [
        [0, 1, 4],
        [1, 0, 2],
        [4, 2, 0],
      ],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "aesthetics/gestalt-laws-similarity-proximity-continuity-matrix",
  title: "Gestalt Laws Similarity Proximity Continuity Matrix",
  description:
    "Encode independently witnessed Gestalt pair relations as symmetric bitmask matrix:1similarity,2proximity,4continuity. Multiple principles coexist; no automatic grouping or perception prediction.",
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
