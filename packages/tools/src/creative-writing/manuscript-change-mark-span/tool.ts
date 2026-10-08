import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly startOffset: number;
  readonly endOffset: number;
};
export type Output = { readonly spanLength: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    startOffset: { type: "integer", minimum: 0 },
    endOffset: { type: "integer" },
  },
  required: ["startOffset", "endOffset"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { spanLength: { type: "integer" } },
  required: ["spanLength"],
} as const;
/** Calculate the length of a supplied half-open manuscript change span in the caller-selected offset unit. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { startOffset, endOffset } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isSafeInteger(startOffset) &&
        startOffset >= 0 &&
        startOffset <= Number.MAX_SAFE_INTEGER,
      "startOffset",
    ),
      startOffset);
    (H.domain(
      Number.isSafeInteger(endOffset) &&
        endOffset >= startOffset &&
        endOffset <= Number.MAX_SAFE_INTEGER,
      "endOffset",
    ),
      endOffset);
    return { spanLength: endOffset - startOffset };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { startOffset: 12, endOffset: 19 },
  output: { spanLength: 7 },
} satisfies ToolExample<Input, Output>;
export const manuscriptChangeMarkSpanTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["creative-writing", "creative writing", "humanities"],
      keywords: ["creative writing", "humanities"],
    },
    id: "creative-writing/manuscript-change-mark-span",
    title: "Manuscript Change Mark Span",
    description:
      "Calculate the length of a supplied half-open manuscript change span in the caller-selected offset unit.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        startOffset: { type: "integer", minimum: 0 },
        endOffset: { type: "integer" },
      },
      required: ["startOffset", "endOffset"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { spanLength: { type: "integer" } },
      required: ["spanLength"],
    },
    ports: {
      inputs: [
        {
          id: "startOffset",
          label: "Start Offset",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "endOffset",
          label: "End Offset",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "spanLength",
          label: "Span Length",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = manuscriptChangeMarkSpanTool.execute;
export default manuscriptChangeMarkSpanTool;
