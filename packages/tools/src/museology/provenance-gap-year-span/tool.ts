import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  sum,
  intervalUnion,
  span,
} from "../shared.js";
export type Input = Readonly<{
  readonly documentedOwnershipYearIntervals: readonly (readonly number[])[];
  readonly reviewYearBounds: readonly number[];
}>;
export type Output = Readonly<{
  readonly undocumentedYearIntervals: readonly (readonly number[])[];
  readonly totalUndocumentedYears: number;
  readonly documentedUnionYears: number;
}>;
const inputFields = [
  {
    id: "documentedOwnershipYearIntervals",
    label: "Documented ownership year intervals",
    kind: "matrix",
  },
  { id: "reviewYearBounds", label: "Review year bounds", kind: "numberList" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  if (input.reviewYearBounds.length !== 2)
    simpleError("bounds", "Two review endpoints required.");
  const [a, b] = input.reviewYearBounds;
  positive(span(a, b, "review"), "review");
  const union = intervalUnion(input.documentedOwnershipYearIntervals),
    gaps: number[][] = [];
  let cursor = a;
  for (const [lo, hi] of union) {
    const l = Math.max(a, lo),
      h = Math.min(b, hi);
    if (h <= l) continue;
    if (l > cursor) gaps.push([cursor, l]);
    cursor = Math.max(cursor, h);
  }
  if (cursor < b) gaps.push([cursor, b]);
  const total = sum(gaps.map((r) => r[1] - r[0]));
  return {
    undocumentedYearIntervals: gaps,
    totalUndocumentedYears: total,
    documentedUnionYears: b - a - total,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  documentedOwnershipYearIntervals: [
    [1900, 1920],
    [1910, 1930],
    [1940, 1950],
  ],
  reviewYearBounds: [1900, 1950],
} satisfies Input;
export const exampleOutput = {
  undocumentedYearIntervals: [[1930, 1940]],
  totalUndocumentedYears: 10,
  documentedUnionYears: 40,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "museology/provenance-gap-year-span",
  title: "Provenance Gap Year Span Calculator",
  description:
    "Union overlapping documented ownership intervals and retain all gaps inside caller half-open review years; unlike event-date spacing, overlapping documentation is not double-counted and gaps are not proof of unlawful ownership.",
  inputs: inputFields,
  outputs: [
    {
      id: "undocumentedYearIntervals",
      label: "Undocumented year intervals",
      kind: "matrix",
    },
    {
      id: "totalUndocumentedYears",
      label: "Total undocumented years",
      kind: "number",
    },
    {
      id: "documentedUnionYears",
      label: "Documented union years",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      documentedOwnershipYearIntervals:
        value.documentedOwnershipYearIntervals as readonly (readonly number[])[],
      reviewYearBounds: value.reviewYearBounds as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
