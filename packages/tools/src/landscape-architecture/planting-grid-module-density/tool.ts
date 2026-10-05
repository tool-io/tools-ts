import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly rowSpacingMeters: number;
  readonly columnSpacingMeters: number;
};
export type Output = { readonly plantsPerSquareMeter: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    rowSpacingMeters: { type: "number", exclusiveMinimum: 0 },
    columnSpacingMeters: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["rowSpacingMeters", "columnSpacingMeters"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { plantsPerSquareMeter: { type: "number" } },
  required: ["plantsPerSquareMeter"],
} as const;
/** Compute ideal interior plant density for a rectangular planting grid; boundary losses are not included. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { rowSpacingMeters, columnSpacingMeters } = request;
  const compute = (): Output => {
    (H.domain(rowSpacingMeters > 0, "rowSpacingMeters"), rowSpacingMeters);
    (H.domain(columnSpacingMeters > 0, "columnSpacingMeters"),
      columnSpacingMeters);
    return {
      plantsPerSquareMeter: 1 / (rowSpacingMeters * columnSpacingMeters),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { rowSpacingMeters: 0.5, columnSpacingMeters: 0.4 },
  output: { plantsPerSquareMeter: 5 },
} satisfies ToolExample<Input, Output>;
export const plantingGridModuleDensityTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "landscape-architecture/planting-grid-module-density",
    title: "Planting Grid Module Density Tool",
    description:
      "Compute ideal interior plant density for a rectangular planting grid; boundary losses are not included.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        rowSpacingMeters: { type: "number", exclusiveMinimum: 0 },
        columnSpacingMeters: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["rowSpacingMeters", "columnSpacingMeters"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { plantsPerSquareMeter: { type: "number" } },
      required: ["plantsPerSquareMeter"],
    },
    ports: {
      inputs: [
        {
          id: "rowSpacingMeters",
          label: "Row Spacing Meters",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "columnSpacingMeters",
          label: "Column Spacing Meters",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "plantsPerSquareMeter",
          label: "Plants Per Square Meter",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = plantingGridModuleDensityTool.execute;
export default plantingGridModuleDensityTool;
