import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstPage: number;
  readonly lastPage: number;
  readonly firstLine: number;
  readonly lastLine: number;
  readonly singlePage: boolean;
};
export type Output = {
  readonly pageCount: number;
  readonly samePageLineCount: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstPage: { type: "integer", minimum: 1 },
    lastPage: { type: "integer" },
    firstLine: { type: "integer", minimum: 1 },
    lastLine: { type: "integer", minimum: 1 },
    singlePage: { type: "boolean" },
  },
  required: ["firstPage", "lastPage", "firstLine", "lastLine", "singlePage"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    pageCount: { type: "integer" },
    samePageLineCount: { type: "integer" },
  },
  required: ["pageCount", "samePageLineCount"],
} as const;
/** Inclusive quotation page span and a line count only when explicitly on one page, without asserting cross-edition page equivalence. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstPage, lastPage, firstLine, lastLine, singlePage } = request;
  const compute = (): Output => {
    H.integer(firstPage, 1);
    H.integer(lastPage, firstPage);
    H.integer(firstLine, 1);
    H.integer(lastLine, 1);
    H.domain(!singlePage || (firstPage === lastPage && lastLine >= firstLine));
    return {
      pageCount: lastPage - firstPage + 1,
      samePageLineCount: singlePage ? lastLine - firstLine + 1 : 0,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    firstPage: 20,
    lastPage: 20,
    firstLine: 3,
    lastLine: 8,
    singlePage: true,
  },
  output: { pageCount: 1, samePageLineCount: 6 },
} satisfies ToolExample<Input, Output>;
export const tafsirQuotationEditionPageSpanTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "islamic-studies/tafsir-quotation-edition-page-span",
    title: "Tafsir Quotation Edition Page Span Tool",
    description:
      "Inclusive quotation page span and a line count only when explicitly on one page, without asserting cross-edition page equivalence.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstPage: { type: "integer", minimum: 1 },
        lastPage: { type: "integer" },
        firstLine: { type: "integer", minimum: 1 },
        lastLine: { type: "integer", minimum: 1 },
        singlePage: { type: "boolean" },
      },
      required: [
        "firstPage",
        "lastPage",
        "firstLine",
        "lastLine",
        "singlePage",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        pageCount: { type: "integer" },
        samePageLineCount: { type: "integer" },
      },
      required: ["pageCount", "samePageLineCount"],
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
          id: "firstLine",
          label: "First Line",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "lastLine",
          label: "Last Line",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "singlePage",
          label: "Single Page",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "pageCount",
          label: "Page Count",
          valueType: { type: "integer" },
        },
        {
          id: "samePageLineCount",
          label: "Same Page Line Count",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = tafsirQuotationEditionPageSpanTool.execute;
export default tafsirQuotationEditionPageSpanTool;
