import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly firstPage: number; readonly lastPage: number };
export type Output = { readonly inclusivePageCount: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstPage: { type: "integer", minimum: 1 },
    lastPage: { type: "integer" },
  },
  required: ["firstPage", "lastPage"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { inclusivePageCount: { type: "integer" } },
  required: ["inclusivePageCount"],
} as const;
/** Count an explicitly contiguous inclusive Arabic-numbered reference page span. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstPage, lastPage } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isSafeInteger(firstPage) &&
        firstPage >= 1 &&
        firstPage <= Number.MAX_SAFE_INTEGER,
      "firstPage",
    ),
      firstPage);
    (H.domain(
      Number.isSafeInteger(lastPage) &&
        lastPage >= firstPage &&
        lastPage <= Number.MAX_SAFE_INTEGER,
      "lastPage",
    ),
      lastPage);
    return { inclusivePageCount: lastPage - firstPage + 1 };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { firstPage: 17, lastPage: 24 },
  output: { inclusivePageCount: 8 },
} satisfies ToolExample<Input, Output>;
export const referencePageSpanLengthTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["bibliometrics", "research and quality management"],
      keywords: ["bibliometrics", "research and quality management"],
    },
    id: "bibliometrics/reference-page-span-length",
    title: "Reference Page Span Length",
    description:
      "Count an explicitly contiguous inclusive Arabic-numbered reference page span.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstPage: { type: "integer", minimum: 1 },
        lastPage: { type: "integer" },
      },
      required: ["firstPage", "lastPage"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { inclusivePageCount: { type: "integer" } },
      required: ["inclusivePageCount"],
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
      ],
      outputs: [
        {
          id: "inclusivePageCount",
          label: "Inclusive Page Count",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = referencePageSpanLengthTool.execute;
export default referencePageSpanLengthTool;
