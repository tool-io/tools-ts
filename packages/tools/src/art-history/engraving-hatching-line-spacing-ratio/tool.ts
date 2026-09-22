import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstSpacing: number;
  readonly secondSpacing: number;
};
export type Output = {
  readonly spacingRatio: number;
  readonly densityRatio: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstSpacing: { type: "number", exclusiveMinimum: 0 },
    secondSpacing: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["firstSpacing", "secondSpacing"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    spacingRatio: { type: "number" },
    densityRatio: { type: "number" },
  },
  required: ["spacingRatio", "densityRatio"],
} as const;
/** Calculate engraving hatching line spacing ratio from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstSpacing, secondSpacing } = request;
  const compute = (): Output => {
    H.positive(firstSpacing);
    H.positive(secondSpacing);
    return {
      spacingRatio: firstSpacing / secondSpacing,
      densityRatio: secondSpacing / firstSpacing,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { firstSpacing: 0.5, secondSpacing: 1 },
  output: { spacingRatio: 0.5, densityRatio: 2 },
} satisfies ToolExample<Input, Output>;
export const engravingHatchingLineSpacingRatioTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "art-history/engraving-hatching-line-spacing-ratio",
    title: "Engraving Hatching Line Spacing Ratio Tool",
    description:
      "Calculate engraving hatching line spacing ratio from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstSpacing: { type: "number", exclusiveMinimum: 0 },
        secondSpacing: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["firstSpacing", "secondSpacing"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        spacingRatio: { type: "number" },
        densityRatio: { type: "number" },
      },
      required: ["spacingRatio", "densityRatio"],
    },
    ports: {
      inputs: [
        {
          id: "firstSpacing",
          label: "First Spacing",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "secondSpacing",
          label: "Second Spacing",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "spacingRatio",
          label: "Spacing Ratio",
          valueType: { type: "number" },
        },
        {
          id: "densityRatio",
          label: "Density Ratio",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = engravingHatchingLineSpacingRatioTool.execute;
export default engravingHatchingLineSpacingRatioTool;
