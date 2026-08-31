import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  instants,
  unique,
  bounded,
  aligned,
} from "../batch-shared.js";
export type Input = Readonly<{
  readonly sectionIds: readonly string[];
  readonly sectionDeadlineUtc: readonly string[];
  readonly sectionFirstFolio: readonly number[];
  readonly sectionPageCounts: readonly number[];
}>;
export type Output = Readonly<{
  readonly deadlineOrderedSectionIds: readonly string[];
  readonly deadlineOrderedFirstFolios: readonly number[];
  readonly overlappingFolioSectionIndexPairs: readonly (readonly number[])[];
}>;
const inputFields = [
  { id: "sectionIds", label: "Section ids", kind: "stringList" },
  {
    id: "sectionDeadlineUtc",
    label: "Section deadline utc",
    kind: "stringList",
  },
  { id: "sectionFirstFolio", label: "Section first folio", kind: "numberList" },
  { id: "sectionPageCounts", label: "Section page counts", kind: "numberList" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  aligned(input.sectionIds, input.sectionDeadlineUtc, "sectionIds");
  aligned(input.sectionIds, input.sectionFirstFolio, "sectionIds");
  aligned(input.sectionIds, input.sectionPageCounts, "sectionIds");
  unique(input.sectionIds, "sections");
  const times = instants(input.sectionDeadlineUtc);
  input.sectionFirstFolio.forEach((v) => bounded(v, "folio", 1, 1000000));
  input.sectionPageCounts.forEach((v) => bounded(v, "pages", 1, 100000));
  const order = input.sectionIds
      .map((_, i) => i)
      .sort((a, b) => times[a] - times[b] || a - b),
    pairs: number[][] = [];
  for (let i = 0; i < order.length; i++)
    for (let j = i + 1; j < order.length; j++)
      if (
        input.sectionFirstFolio[i] <
          input.sectionFirstFolio[j] + input.sectionPageCounts[j] &&
        input.sectionFirstFolio[j] <
          input.sectionFirstFolio[i] + input.sectionPageCounts[i]
      ) {
        if (pairs.length >= 128)
          simpleError(
            "folios",
            "Overlap witnesses exceed 128 rows; narrow scope.",
          );
        pairs.push([i, j]);
      }
  return {
    deadlineOrderedSectionIds: order.map((i) => input.sectionIds[i]),
    deadlineOrderedFirstFolios: order.map((i) => input.sectionFirstFolio[i]),
    overlappingFolioSectionIndexPairs: pairs,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  sectionIds: ["A", "B"],
  sectionDeadlineUtc: ["2025-01-01T12:00:00Z", "2025-01-01T10:00:00Z"],
  sectionFirstFolio: [1, 5],
  sectionPageCounts: [4, 2],
} satisfies Input;
export const exampleOutput = {
  deadlineOrderedSectionIds: ["B", "A"],
  deadlineOrderedFirstFolios: [5, 1],
  overlappingFolioSectionIndexPairs: [],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "journalism/folio-deadline-section-pagination-order-lookup",
  title: "Folio Deadline Section Pagination Order Lookup",
  description:
    "Order observed section production deadlines while auditing actual folio interval collisions, preserving stable deadline ties; not automatic newspaper pagination or a universal section order.",
  inputs: inputFields,
  outputs: [
    {
      id: "deadlineOrderedSectionIds",
      label: "Deadline ordered section ids",
      kind: "stringList",
    },
    {
      id: "deadlineOrderedFirstFolios",
      label: "Deadline ordered first folios",
      kind: "numberList",
    },
    {
      id: "overlappingFolioSectionIndexPairs",
      label: "Overlapping folio section index pairs",
      kind: "matrix",
    },
  ],
  calculate: (value) =>
    calculate({
      sectionIds: value.sectionIds as readonly string[],
      sectionDeadlineUtc: value.sectionDeadlineUtc as readonly string[],
      sectionFirstFolio: value.sectionFirstFolio as readonly number[],
      sectionPageCounts: value.sectionPageCounts as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
