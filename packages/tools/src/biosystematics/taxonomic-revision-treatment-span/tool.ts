import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstPage: number;
  readonly lastPage: number;
  readonly excludedPages: readonly number[];
};
export type Output = {
  readonly inclusiveSpan: number;
  readonly includedPages: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstPage: { type: "integer", minimum: 1 },
    lastPage: { type: "integer" },
    excludedPages: { type: "array", maxItems: 256, items: { type: "integer" } },
  },
  required: ["firstPage", "lastPage", "excludedPages"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    inclusiveSpan: { type: "integer" },
    includedPages: { type: "integer" },
  },
  required: ["inclusiveSpan", "includedPages"],
} as const;
/** Calculate taxonomic revision treatment span from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstPage, lastPage, excludedPages } = request;
  const compute = (): Output => {
    H.integer(firstPage, 1);
    H.integer(lastPage, firstPage);
    H.domain(excludedPages.every((x) => x >= firstPage && x <= lastPage));
    return {
      inclusiveSpan: lastPage - firstPage + 1,
      includedPages: lastPage - firstPage + 1 - new Set(excludedPages).size,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { firstPage: 10, lastPage: 20, excludedPages: [12, 15, 15] },
  output: { inclusiveSpan: 11, includedPages: 9 },
} satisfies ToolExample<Input, Output>;
export const taxonomicRevisionTreatmentSpanTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "biosystematics/taxonomic-revision-treatment-span",
    title: "Taxonomic Revision Treatment Span Tool",
    description:
      "Calculate taxonomic revision treatment span from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstPage: { type: "integer", minimum: 1 },
        lastPage: { type: "integer" },
        excludedPages: {
          type: "array",
          maxItems: 256,
          items: { type: "integer" },
        },
      },
      required: ["firstPage", "lastPage", "excludedPages"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        inclusiveSpan: { type: "integer" },
        includedPages: { type: "integer" },
      },
      required: ["inclusiveSpan", "includedPages"],
    },
    ports: {
      inputs: [
        {
          id: "firstPage",
          label: "First Page",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "lastPage",
          label: "Last Page",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "excludedPages",
          label: "Excluded Pages",
          required: true,
          valueType: { type: "list", items: { type: "integer" } },
        },
      ],
      outputs: [
        {
          id: "inclusiveSpan",
          label: "Inclusive Span",
          valueType: { type: "integer" },
        },
        {
          id: "includedPages",
          label: "Included Pages",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = taxonomicRevisionTreatmentSpanTool.execute;
export default taxonomicRevisionTreatmentSpanTool;
