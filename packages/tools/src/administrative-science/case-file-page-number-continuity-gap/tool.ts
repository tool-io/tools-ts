import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly pages: readonly number[] };
export type Output = {
  readonly missing: readonly number[];
  readonly duplicatePages: readonly number[];
  readonly ordered: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    pages: { type: "array", maxItems: 256, items: { type: "integer" } },
  },
  required: ["pages"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    missing: { type: "array", maxItems: 256, items: { type: "integer" } },
    duplicatePages: {
      type: "array",
      maxItems: 256,
      items: { type: "integer" },
    },
    ordered: { type: "boolean" },
  },
  required: ["missing", "duplicatePages", "ordered"],
} as const;
/** Audit a supplied page-label span of at most 256 pages, retaining duplicates and order information. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { pages } = request;
  const compute = (): Output => {
    H.domain(pages.length > 0 && pages.every((x) => x >= 1));
    const unique = new Set(pages),
      minimum = Math.min(...pages),
      maximum = Math.max(...pages);
    H.domain(maximum - minimum <= 255);
    return {
      missing: Array.from(
        { length: maximum - minimum + 1 },
        (_, i) => minimum + i,
      ).filter((x) => !unique.has(x)),
      duplicatePages: [...unique].filter(
        (x) => pages.filter((p) => p === x).length > 1,
      ),
      ordered: pages.every((x, i) => i === 0 || x > pages[i - 1]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { pages: [1, 2, 4, 4] },
  output: { missing: [3], duplicatePages: [4], ordered: false },
} satisfies ToolExample<Input, Output>;
export const caseFilePageNumberContinuityGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "administrative-science/case-file-page-number-continuity-gap",
    title: "Case File Page Number Continuity Gap Tool",
    description:
      "Audit a supplied page-label span of at most 256 pages, retaining duplicates and order information.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        pages: { type: "array", maxItems: 256, items: { type: "integer" } },
      },
      required: ["pages"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        missing: { type: "array", maxItems: 256, items: { type: "integer" } },
        duplicatePages: {
          type: "array",
          maxItems: 256,
          items: { type: "integer" },
        },
        ordered: { type: "boolean" },
      },
      required: ["missing", "duplicatePages", "ordered"],
    },
    ports: {
      inputs: [
        {
          id: "pages",
          label: "Pages",
          required: true,
          valueType: { type: "list", items: { type: "integer" } },
        },
      ],
      outputs: [
        {
          id: "missing",
          label: "Missing",
          valueType: { type: "list", items: { type: "integer" } },
        },
        {
          id: "duplicatePages",
          label: "Duplicate Pages",
          valueType: { type: "list", items: { type: "integer" } },
        },
        { id: "ordered", label: "Ordered", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = caseFilePageNumberContinuityGapTool.execute;
export default caseFilePageNumberContinuityGapTool;
