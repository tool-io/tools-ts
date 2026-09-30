import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly length: number;
  readonly endMargin: number;
  readonly spacing: number;
};
export type Output = { readonly plants: number; readonly usedSpan: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    length: { type: "number" },
    endMargin: { type: "number", minimum: 0 },
    spacing: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["length", "endMargin", "spacing"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { plants: { type: "integer" }, usedSpan: { type: "number" } },
  required: ["plants", "usedSpan"],
} as const;
/** Place the first vine at the left margin, then use fixed spacing without breaching the right margin. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { length, endMargin, spacing } = request;
  const compute = (): Output => {
    H.domain(endMargin >= 0 && length >= 2 * endMargin);
    H.positive(spacing);
    return {
      plants: Math.floor((length - 2 * endMargin) / spacing) + 1,
      usedSpan: Math.floor((length - 2 * endMargin) / spacing) * spacing,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { length: 10, endMargin: 1, spacing: 2 },
  output: { plants: 5, usedSpan: 8 },
} satisfies ToolExample<Input, Output>;
export const trellisVineSpacingEndMarginTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "landscape-architecture/trellis-vine-spacing-end-margin",
    title: "Trellis Vine Spacing End Margin Tool",
    description:
      "Place the first vine at the left margin, then use fixed spacing without breaching the right margin.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        length: { type: "number" },
        endMargin: { type: "number", minimum: 0 },
        spacing: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["length", "endMargin", "spacing"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { plants: { type: "integer" }, usedSpan: { type: "number" } },
      required: ["plants", "usedSpan"],
    },
    ports: {
      inputs: [
        {
          id: "length",
          label: "Length",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "endMargin",
          label: "End Margin",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "spacing",
          label: "Spacing",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "plants", label: "Plants", valueType: { type: "integer" } },
        { id: "usedSpan", label: "Used Span", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = trellisVineSpacingEndMarginTool.execute;
export default trellisVineSpacingEndMarginTool;
