import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly lineCharacters: readonly number[];
  readonly averageGlyphWidth: number;
  readonly fontSize: number;
  readonly labelWidth: number;
  readonly horizontalMargin: number;
};
export type Output = {
  readonly requiredWidth: number;
  readonly availableWidth: number;
  readonly fits: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    lineCharacters: {
      type: "array",
      maxItems: 256,
      items: { type: "integer" },
    },
    averageGlyphWidth: { type: "number", minimum: 0 },
    fontSize: { type: "number", minimum: 0 },
    labelWidth: { type: "number" },
    horizontalMargin: { type: "number", minimum: 0 },
  },
  required: [
    "lineCharacters",
    "averageGlyphWidth",
    "fontSize",
    "labelWidth",
    "horizontalMargin",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    requiredWidth: { type: "number" },
    availableWidth: { type: "number" },
    fits: { type: "boolean" },
  },
  required: ["requiredWidth", "availableWidth", "fits"],
} as const;
/** Explicit mean-glyph-width estimate, not font shaping or exact typography measurement. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    lineCharacters,
    averageGlyphWidth,
    fontSize,
    labelWidth,
    horizontalMargin,
  } = request;
  const compute = (): Output => {
    H.domain(
      lineCharacters.every((x) => x >= 0) &&
        averageGlyphWidth >= 0 &&
        fontSize >= 0 &&
        horizontalMargin >= 0 &&
        labelWidth >= 2 * horizontalMargin,
    );
    return {
      requiredWidth:
        Math.max(0, ...lineCharacters) * averageGlyphWidth * fontSize,
      availableWidth: labelWidth - 2 * horizontalMargin,
      fits:
        Math.max(0, ...lineCharacters) * averageGlyphWidth * fontSize <=
        labelWidth - 2 * horizontalMargin,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    lineCharacters: [10, 20],
    averageGlyphWidth: 0.5,
    fontSize: 12,
    labelWidth: 150,
    horizontalMargin: 10,
  },
  output: { requiredWidth: 120, availableWidth: 130, fits: true },
} satisfies ToolExample<Input, Output>;
export const classroomExhibitionLabelFontFitTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "art-education/classroom-exhibition-label-font-fit",
    title: "Classroom Exhibition Label Font Fit Tool",
    description:
      "Explicit mean-glyph-width estimate, not font shaping or exact typography measurement.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        lineCharacters: {
          type: "array",
          maxItems: 256,
          items: { type: "integer" },
        },
        averageGlyphWidth: { type: "number", minimum: 0 },
        fontSize: { type: "number", minimum: 0 },
        labelWidth: { type: "number" },
        horizontalMargin: { type: "number", minimum: 0 },
      },
      required: [
        "lineCharacters",
        "averageGlyphWidth",
        "fontSize",
        "labelWidth",
        "horizontalMargin",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        requiredWidth: { type: "number" },
        availableWidth: { type: "number" },
        fits: { type: "boolean" },
      },
      required: ["requiredWidth", "availableWidth", "fits"],
    },
    ports: {
      inputs: [
        {
          id: "lineCharacters",
          label: "Line Characters",
          required: true,
          valueType: { type: "list", items: { type: "integer" } },
        },
        {
          id: "averageGlyphWidth",
          label: "Average Glyph Width",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "fontSize",
          label: "Font Size",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "labelWidth",
          label: "Label Width",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "horizontalMargin",
          label: "Horizontal Margin",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "requiredWidth",
          label: "Required Width",
          valueType: { type: "number" },
        },
        {
          id: "availableWidth",
          label: "Available Width",
          valueType: { type: "number" },
        },
        { id: "fits", label: "Fits", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = classroomExhibitionLabelFontFitTool.execute;
export default classroomExhibitionLabelFontFitTool;
