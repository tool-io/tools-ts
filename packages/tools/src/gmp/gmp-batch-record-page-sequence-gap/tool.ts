import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly pages: readonly number[];
  readonly first: number;
  readonly last: number;
};
export type Output = {
  readonly missing: readonly number[];
  readonly duplicates: readonly number[];
  readonly outside: readonly number[];
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    pages: { type: "array", maxItems: 256, items: { type: "integer" } },
    first: { type: "integer", minimum: 1 },
    last: { type: "integer" },
  },
  required: ["pages", "first", "last"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    missing: { type: "array", maxItems: 256, items: { type: "integer" } },
    duplicates: { type: "array", maxItems: 256, items: { type: "integer" } },
    outside: { type: "array", maxItems: 256, items: { type: "integer" } },
  },
  required: ["missing", "duplicates", "outside"],
} as const;
/** Audit an explicitly bounded batch-record page sequence. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { pages, first, last } = request;
  const compute = (): Output => {
    H.integer(first, 1);
    H.integer(last, first, first + 255);
    const seen = new Set<number>(),
      duplicates: number[] = [];
    for (const p of pages) {
      if (seen.has(p) && !duplicates.includes(p)) duplicates.push(p);
      seen.add(p);
    }
    return {
      missing: Array.from(
        { length: last - first + 1 },
        (_, i) => first + i,
      ).filter((x) => !seen.has(x)),
      duplicates,
      outside: pages.filter((x) => x < first || x > last),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { pages: [1, 2, 2, 4, 7], first: 1, last: 4 },
  output: { missing: [3], duplicates: [2], outside: [7] },
} satisfies ToolExample<Input, Output>;
export const gmpBatchRecordPageSequenceGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "gmp/gmp-batch-record-page-sequence-gap",
    title: "GMP Batch Record Page Sequence Gap Tool",
    description: "Audit an explicitly bounded batch-record page sequence.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        pages: { type: "array", maxItems: 256, items: { type: "integer" } },
        first: { type: "integer", minimum: 1 },
        last: { type: "integer" },
      },
      required: ["pages", "first", "last"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        missing: { type: "array", maxItems: 256, items: { type: "integer" } },
        duplicates: {
          type: "array",
          maxItems: 256,
          items: { type: "integer" },
        },
        outside: { type: "array", maxItems: 256, items: { type: "integer" } },
      },
      required: ["missing", "duplicates", "outside"],
    },
    ports: {
      inputs: [
        {
          id: "pages",
          label: "Pages",
          required: true,
          valueType: { type: "list", items: { type: "integer" } },
        },
        {
          id: "first",
          label: "First",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "last",
          label: "Last",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "missing",
          label: "Missing",
          valueType: { type: "list", items: { type: "integer" } },
        },
        {
          id: "duplicates",
          label: "Duplicates",
          valueType: { type: "list", items: { type: "integer" } },
        },
        {
          id: "outside",
          label: "Outside",
          valueType: { type: "list", items: { type: "integer" } },
        },
      ],
    },
  },
  calculate,
});
export const run = gmpBatchRecordPageSequenceGapTool.execute;
export default gmpBatchRecordPageSequenceGapTool;
