import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly bedLength: number;
  readonly spacing: number;
  readonly plants: number;
  readonly endMargin: number;
};
export type Output = { readonly usedLength: number; readonly residual: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    bedLength: { type: "number", minimum: 0 },
    spacing: { type: "number", minimum: 0 },
    plants: { type: "integer", minimum: 1 },
    endMargin: { type: "number", minimum: 0 },
  },
  required: ["bedLength", "spacing", "plants", "endMargin"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { usedLength: { type: "number" }, residual: { type: "number" } },
  required: ["usedLength", "residual"],
} as const;
/** Calculate city garden plant spacing edge gap from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { bedLength, spacing, plants, endMargin } = request;
  const compute = (): Output => {
    H.integer(plants, 1);
    H.domain(bedLength >= 0 && spacing >= 0 && endMargin >= 0);
    return {
      usedLength: Math.max(0, plants - 1) * spacing + 2 * endMargin,
      residual: bedLength - Math.max(0, plants - 1) * spacing - 2 * endMargin,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { bedLength: 5, spacing: 0.5, plants: 8, endMargin: 0.2 },
  output: { usedLength: 3.9, residual: 1.1 },
} satisfies ToolExample<Input, Output>;
export const cityGardenPlantSpacingEdgeGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "urban-agriculture/city-garden-plant-spacing-edge-gap",
    title: "City Garden Plant Spacing Edge Gap Tool",
    description:
      "Calculate city garden plant spacing edge gap from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        bedLength: { type: "number", minimum: 0 },
        spacing: { type: "number", minimum: 0 },
        plants: { type: "integer", minimum: 1 },
        endMargin: { type: "number", minimum: 0 },
      },
      required: ["bedLength", "spacing", "plants", "endMargin"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        usedLength: { type: "number" },
        residual: { type: "number" },
      },
      required: ["usedLength", "residual"],
    },
    ports: {
      inputs: [
        {
          id: "bedLength",
          label: "Bed Length",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "spacing",
          label: "Spacing",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "plants",
          label: "Plants",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "endMargin",
          label: "End Margin",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "usedLength",
          label: "Used Length",
          valueType: { type: "number" },
        },
        { id: "residual", label: "Residual", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = cityGardenPlantSpacingEdgeGapTool.execute;
export default cityGardenPlantSpacingEdgeGapTool;
