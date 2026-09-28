import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly spacingEm: number;
  readonly fontPixels: number;
  readonly characterCount: number;
  readonly includeTrailing: boolean;
};
export type Output = {
  readonly spacingPixels: number;
  readonly gaps: number;
  readonly addedWidthPixels: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    spacingEm: { type: "number" },
    fontPixels: { type: "number", minimum: 0 },
    characterCount: { type: "integer", minimum: 0 },
    includeTrailing: { type: "boolean" },
  },
  required: ["spacingEm", "fontPixels", "characterCount", "includeTrailing"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    spacingPixels: { type: "number" },
    gaps: { type: "integer" },
    addedWidthPixels: { type: "number" },
  },
  required: ["spacingPixels", "gaps", "addedWidthPixels"],
} as const;
/** Caller-selected inter-character versus trailing-spacing convention; this does not model font shaping or kerning. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { spacingEm, fontPixels, characterCount, includeTrailing } = request;
  const compute = (): Output => {
    H.domain(fontPixels >= 0);
    H.integer(characterCount, 0);
    return {
      spacingPixels: spacingEm * fontPixels,
      gaps: Math.max(0, characterCount - (includeTrailing ? 0 : 1)),
      addedWidthPixels:
        spacingEm *
        fontPixels *
        Math.max(0, characterCount - (includeTrailing ? 0 : 1)),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    spacingEm: 0.05,
    fontPixels: 20,
    characterCount: 10,
    includeTrailing: false,
  },
  output: { spacingPixels: 1, gaps: 9, addedWidthPixels: 9 },
} satisfies ToolExample<Input, Output>;
export const letterSpacingEmPixelCrosswalkTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "graphic-design/letter-spacing-em-pixel-crosswalk",
    title: "Letter Spacing Em Pixel Crosswalk Tool",
    description:
      "Caller-selected inter-character versus trailing-spacing convention; this does not model font shaping or kerning.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        spacingEm: { type: "number" },
        fontPixels: { type: "number", minimum: 0 },
        characterCount: { type: "integer", minimum: 0 },
        includeTrailing: { type: "boolean" },
      },
      required: [
        "spacingEm",
        "fontPixels",
        "characterCount",
        "includeTrailing",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        spacingPixels: { type: "number" },
        gaps: { type: "integer" },
        addedWidthPixels: { type: "number" },
      },
      required: ["spacingPixels", "gaps", "addedWidthPixels"],
    },
    ports: {
      inputs: [
        {
          id: "spacingEm",
          label: "Spacing Em",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "fontPixels",
          label: "Font Pixels",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "characterCount",
          label: "Character Count",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "includeTrailing",
          label: "Include Trailing",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "spacingPixels",
          label: "Spacing Pixels",
          valueType: { type: "number" },
        },
        { id: "gaps", label: "Gaps", valueType: { type: "integer" } },
        {
          id: "addedWidthPixels",
          label: "Added Width Pixels",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = letterSpacingEmPixelCrosswalkTool.execute;
export default letterSpacingEmPixelCrosswalkTool;
