import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly circumference: number;
  readonly cells: number;
  readonly driveRatio: number;
  readonly slip: number;
};
export type Output = { readonly spacing: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    circumference: { type: "number", exclusiveMinimum: 0 },
    cells: { type: "integer", minimum: 1 },
    driveRatio: { type: "number", exclusiveMinimum: 0 },
    slip: { type: "number", minimum: 0, exclusiveMaximum: 1 },
  },
  required: ["circumference", "cells", "driveRatio", "slip"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { spacing: { type: "number" } },
  required: ["spacing"],
} as const;
/** Mechanical bench spacing with an explicitly supplied drive ratio and distance-loss convention. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { circumference, cells, driveRatio, slip } = request;
  const compute = (): Output => {
    H.positive(circumference);
    H.integer(cells, 1);
    H.positive(driveRatio);
    H.domain(slip >= 0 && slip < 1);
    return { spacing: (circumference * (1 - slip)) / (cells * driveRatio) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { circumference: 2, cells: 20, driveRatio: 1, slip: 0.1 },
  output: { spacing: 0.09 },
} satisfies ToolExample<Input, Output>;
export const seederDriveWheelCellSpacingTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "agrotechnology/seeder-drive-wheel-cell-spacing",
    title: "Seeder Drive Wheel Cell Spacing Tool",
    description:
      "Mechanical bench spacing with an explicitly supplied drive ratio and distance-loss convention.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        circumference: { type: "number", exclusiveMinimum: 0 },
        cells: { type: "integer", minimum: 1 },
        driveRatio: { type: "number", exclusiveMinimum: 0 },
        slip: { type: "number", minimum: 0, exclusiveMaximum: 1 },
      },
      required: ["circumference", "cells", "driveRatio", "slip"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { spacing: { type: "number" } },
      required: ["spacing"],
    },
    ports: {
      inputs: [
        {
          id: "circumference",
          label: "Circumference",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "cells",
          label: "Cells",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "driveRatio",
          label: "Drive Ratio",
          required: true,
          valueType: { type: "number", unit: "1" },
        },
        {
          id: "slip",
          label: "Slip",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "spacing", label: "Spacing", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = seederDriveWheelCellSpacingTool.execute;
export default seederDriveWheelCellSpacingTool;
