import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstPage: number;
  readonly lastPage: number;
  readonly excludedPages: number;
};
export type Output = {
  readonly inclusiveSpan: number;
  readonly countedPages: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstPage: { type: "integer", minimum: 1 },
    lastPage: { type: "integer" },
    excludedPages: { type: "integer", minimum: 0 },
  },
  required: ["firstPage", "lastPage", "excludedPages"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    inclusiveSpan: { type: "integer" },
    countedPages: { type: "integer" },
  },
  required: ["inclusiveSpan", "countedPages"],
} as const;
/** Calculate serial pagination article span count from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstPage, lastPage, excludedPages } = request;
  const compute = (): Output => {
    H.integer(firstPage, 1);
    H.integer(lastPage, firstPage);
    H.integer(excludedPages, 0, lastPage - firstPage + 1);
    return {
      inclusiveSpan: lastPage - firstPage + 1,
      countedPages: lastPage - firstPage + 1 - excludedPages,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { firstPage: 101, lastPage: 110, excludedPages: 2 },
  output: { inclusiveSpan: 10, countedPages: 8 },
} satisfies ToolExample<Input, Output>;
export const serialPaginationArticleSpanCountTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "library-science/serial-pagination-article-span-count",
    title: "Serial Pagination Article Span Count Tool",
    description:
      "Calculate serial pagination article span count from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstPage: { type: "integer", minimum: 1 },
        lastPage: { type: "integer" },
        excludedPages: { type: "integer", minimum: 0 },
      },
      required: ["firstPage", "lastPage", "excludedPages"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        inclusiveSpan: { type: "integer" },
        countedPages: { type: "integer" },
      },
      required: ["inclusiveSpan", "countedPages"],
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
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "inclusiveSpan",
          label: "Inclusive Span",
          valueType: { type: "integer" },
        },
        {
          id: "countedPages",
          label: "Counted Pages",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = serialPaginationArticleSpanCountTool.execute;
export default serialPaginationArticleSpanCountTool;
