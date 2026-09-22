import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly startPage: number;
  readonly endPage: number;
  readonly inclusive: boolean;
  readonly excludedPages: number;
};
export type Output = {
  readonly rawSpanDecimal: string;
  readonly eligiblePagesDecimal: string;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    startPage: { type: "integer", minimum: 0 },
    endPage: { type: "integer" },
    inclusive: { type: "boolean" },
    excludedPages: { type: "integer", minimum: 0 },
  },
  required: ["startPage", "endPage", "inclusive", "excludedPages"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    rawSpanDecimal: {
      type: "string",
      maxLength: 8192,
      format: "integer-decimal",
    },
    eligiblePagesDecimal: {
      type: "string",
      maxLength: 8192,
      format: "integer-decimal",
    },
  },
  required: ["rawSpanDecimal", "eligiblePagesDecimal"],
} as const;
/** Calculate citation source page span from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { startPage, endPage, inclusive, excludedPages } = request;
  const compute = (): Output => {
    H.integer(startPage, 0);
    H.integer(endPage, startPage);
    H.integer(excludedPages, 0);
    return (() => {
      const raw = BigInt(endPage) - BigInt(startPage) + (inclusive ? 1n : 0n);
      H.domain(BigInt(excludedPages) <= raw);
      return {
        rawSpanDecimal: raw.toString(),
        eligiblePagesDecimal: (raw - BigInt(excludedPages)).toString(),
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { startPage: 10, endPage: 15, inclusive: true, excludedPages: 1 },
  output: { rawSpanDecimal: "6", eligiblePagesDecimal: "5" },
} satisfies ToolExample<Input, Output>;
export const citationSourcePageSpanTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "bibliometrics/citation-source-page-span",
    title: "Citation Source Page Span Tool",
    description:
      "Calculate citation source page span from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        startPage: { type: "integer", minimum: 0 },
        endPage: { type: "integer" },
        inclusive: { type: "boolean" },
        excludedPages: { type: "integer", minimum: 0 },
      },
      required: ["startPage", "endPage", "inclusive", "excludedPages"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        rawSpanDecimal: {
          type: "string",
          maxLength: 8192,
          format: "integer-decimal",
        },
        eligiblePagesDecimal: {
          type: "string",
          maxLength: 8192,
          format: "integer-decimal",
        },
      },
      required: ["rawSpanDecimal", "eligiblePagesDecimal"],
    },
    ports: {
      inputs: [
        {
          id: "startPage",
          label: "Start Page",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "endPage",
          label: "End Page",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "inclusive",
          label: "Inclusive",
          required: true,
          valueType: { type: "boolean" },
        },
        {
          id: "excludedPages",
          label: "Excluded Pages",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "rawSpanDecimal",
          label: "Raw Span Decimal",
          valueType: { type: "string", format: "integer-decimal" },
        },
        {
          id: "eligiblePagesDecimal",
          label: "Eligible Pages Decimal",
          valueType: { type: "string", format: "integer-decimal" },
        },
      ],
    },
  },
  calculate,
});
export const run = citationSourcePageSpanTool.execute;
export default citationSourcePageSpanTool;
