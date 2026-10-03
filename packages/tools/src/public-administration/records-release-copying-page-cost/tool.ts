import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly pages: number;
  readonly freePages: number;
  readonly perPage: number;
  readonly fixedFee: number;
};
export type Output = {
  readonly billablePages: number;
  readonly copyingCost: number;
  readonly total: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    pages: { type: "integer", minimum: 0 },
    freePages: { type: "integer", minimum: 0 },
    perPage: { type: "number", minimum: 0 },
    fixedFee: { type: "number", minimum: 0 },
  },
  required: ["pages", "freePages", "perPage", "fixedFee"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    billablePages: { type: "integer" },
    copyingCost: { type: "number" },
    total: { type: "number" },
  },
  required: ["billablePages", "copyingCost", "total"],
} as const;
/** Calculate records release copying page cost from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { pages, freePages, perPage, fixedFee } = request;
  const compute = (): Output => {
    H.integer(pages, 0);
    H.integer(freePages, 0);
    H.domain(perPage >= 0 && fixedFee >= 0);
    return {
      billablePages: Math.max(0, pages - freePages),
      copyingCost: Math.max(0, pages - freePages) * perPage,
      total: Math.max(0, pages - freePages) * perPage + fixedFee,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { pages: 100, freePages: 20, perPage: 0.1, fixedFee: 5 },
  output: { billablePages: 80, copyingCost: 8, total: 13 },
} satisfies ToolExample<Input, Output>;
export const recordsReleaseCopyingPageCostTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "public-administration/records-release-copying-page-cost",
    title: "Records Release Copying Page Cost Tool",
    description:
      "Calculate records release copying page cost from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        pages: { type: "integer", minimum: 0 },
        freePages: { type: "integer", minimum: 0 },
        perPage: { type: "number", minimum: 0 },
        fixedFee: { type: "number", minimum: 0 },
      },
      required: ["pages", "freePages", "perPage", "fixedFee"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        billablePages: { type: "integer" },
        copyingCost: { type: "number" },
        total: { type: "number" },
      },
      required: ["billablePages", "copyingCost", "total"],
    },
    ports: {
      inputs: [
        {
          id: "pages",
          label: "Pages",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "freePages",
          label: "Free Pages",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "perPage",
          label: "Per Page",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "fixedFee",
          label: "Fixed Fee",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "billablePages",
          label: "Billable Pages",
          valueType: { type: "integer" },
        },
        {
          id: "copyingCost",
          label: "Copying Cost",
          valueType: { type: "number" },
        },
        { id: "total", label: "Total", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = recordsReleaseCopyingPageCostTool.execute;
export default recordsReleaseCopyingPageCostTool;
