import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly monograms: readonly string[];
  readonly mints: readonly string[];
  readonly queryMonogram: string;
  readonly references: readonly string[];
}>;
export type Output = Readonly<{
  readonly matchedMint: string;
  readonly matchedReference: string;
  readonly queryMonogram: string;
}>;

export const calculate = (input: Input): Output => {
  if (
    input.monograms.length === 0 ||
    input.monograms.length !== input.mints.length ||
    input.monograms.length !== input.references.length
  )
    simpleError(
      "monograms",
      "Monogram, mint, and reference lists must be nonempty and equal in length.",
      "record_length_mismatch",
    );
  const normalized = input.queryMonogram.trim().toUpperCase();
  if (normalized.length === 0)
    simpleError(
      "queryMonogram",
      "Query monogram must not be empty.",
      "empty_query",
    );
  const index = input.monograms.findIndex(
    (mark) => mark.trim().toUpperCase() === normalized,
  );
  if (index < 0)
    simpleError(
      "queryMonogram",
      "Monogram is absent from the caller-supplied records.",
      "monogram_not_found",
    );
  const matchedMint = input.mints[index];
  const matchedReference = input.references[index];
  if (matchedMint === undefined || matchedReference === undefined)
    simpleError(
      "monograms",
      "Matching record is incomplete.",
      "record_incomplete",
    );
  return { matchedMint, matchedReference, queryMonogram: input.queryMonogram };
};

export const example = {
  input: {
    monograms: ["M1", "M2"],
    mints: ["Amphipolis", "Miletos"],
    queryMonogram: "M2",
    references: ["Caller catalogue 1", "Caller catalogue 2"],
  },
  output: {
    matchedMint: "Miletos",
    matchedReference: "Caller catalogue 2",
    queryMonogram: "M2",
  },
} satisfies ToolExample<Input, Output>;
export const edgeCase = {
  input: {
    monograms: ["A"],
    mints: ["Caller mint"],
    queryMonogram: "a",
    references: ["Caller ref"],
  },
  output: {
    matchedMint: "Caller mint",
    matchedReference: "Caller ref",
    queryMonogram: "a",
  },
} satisfies { readonly input: Input; readonly output: Output };

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      monograms: input.monograms as string[],
      mints: input.mints as string[],
      queryMonogram: input.queryMonogram as string,
      references: input.references as string[],
    }),
  description:
    "Look up a monogram only within a caller-supplied, parallel mint-and-reference dataset; the mark alone is not treated as a universal mint attribution.",
  id: "numismatics/alexander-drachm-monogram-record-lookup",
  inputs: [
    { id: "monograms", kind: "stringList", label: "Monogram keys" },
    { id: "mints", kind: "stringList", label: "Mint attributions" },
    { id: "queryMonogram", kind: "string", label: "Query monogram" },
    { id: "references", kind: "stringList", label: "Catalogue references" },
  ],
  outputs: [
    {
      id: "matchedMint",
      kind: "string",
      label: "Matched caller-supplied mint",
    },
    {
      id: "matchedReference",
      kind: "string",
      label: "Matched catalogue reference",
    },
    { id: "queryMonogram", kind: "string", label: "Query monogram" },
  ],
  title: "Alexander Drachm Monogram Record Lookup",
});

export const run = tool.execute;
export default tool;
