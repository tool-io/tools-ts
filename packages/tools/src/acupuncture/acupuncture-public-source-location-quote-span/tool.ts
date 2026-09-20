import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly text: string;
  readonly start: number;
  readonly end: number;
  readonly sourceId: string;
};
export type Output = {
  readonly excerpt: string;
  readonly codeUnitLength: number;
  readonly locator: string;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    text: { type: "string", maxLength: 8192 },
    start: { type: "integer", minimum: 0 },
    end: { type: "integer" },
    sourceId: { type: "string", maxLength: 8192 },
  },
  required: ["text", "start", "end", "sourceId"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    excerpt: { type: "string", maxLength: 8192 },
    codeUnitLength: { type: "integer" },
    locator: { type: "string", maxLength: 8192 },
  },
  required: ["excerpt", "codeUnitLength", "locator"],
} as const;
/** Extract a caller-supplied UTF-16 source span without verifying its claim. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { text, start, end, sourceId } = request;
  const compute = (): Output => {
    H.integer(start, 0, text.length);
    H.integer(end, start, text.length);
    H.domain(sourceId.length > 0);
    return {
      excerpt: text.slice(start, end),
      codeUnitLength: end - start,
      locator: JSON.stringify([sourceId, start, end]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { text: "abcdef", start: 1, end: 4, sourceId: "doc-A" },
  output: { excerpt: "bcd", codeUnitLength: 3, locator: '["doc-A",1,4]' },
} satisfies ToolExample<Input, Output>;
export const acupuncturePublicSourceLocationQuoteSpanTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "acupuncture/acupuncture-public-source-location-quote-span",
      title: "Acupuncture Public Source Location Quote Span Tool",
      description:
        "Extract a caller-supplied UTF-16 source span without verifying its claim.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          text: { type: "string", maxLength: 8192 },
          start: { type: "integer", minimum: 0 },
          end: { type: "integer" },
          sourceId: { type: "string", maxLength: 8192 },
        },
        required: ["text", "start", "end", "sourceId"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          excerpt: { type: "string", maxLength: 8192 },
          codeUnitLength: { type: "integer" },
          locator: { type: "string", maxLength: 8192 },
        },
        required: ["excerpt", "codeUnitLength", "locator"],
      },
      ports: {
        inputs: [
          {
            id: "text",
            label: "Text",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "start",
            label: "Start",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "end",
            label: "End",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "sourceId",
            label: "Source Id",
            required: true,
            valueType: { type: "string" },
          },
        ],
        outputs: [
          { id: "excerpt", label: "Excerpt", valueType: { type: "string" } },
          {
            id: "codeUnitLength",
            label: "Code Unit Length",
            valueType: { type: "integer" },
          },
          { id: "locator", label: "Locator", valueType: { type: "string" } },
        ],
      },
    },
    calculate,
  });
export const run = acupuncturePublicSourceLocationQuoteSpanTool.execute;
export default acupuncturePublicSourceLocationQuoteSpanTool;
