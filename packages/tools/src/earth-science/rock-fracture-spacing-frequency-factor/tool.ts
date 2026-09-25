import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly intersections: number;
  readonly scanLength: number;
  readonly angleFromNormal: number;
};
export type Output = {
  readonly apparentFrequency: number;
  readonly normalFrequency: number;
  readonly normalSpacing: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    intersections: { type: "integer", minimum: 1 },
    scanLength: { type: "number", exclusiveMinimum: 0 },
    angleFromNormal: { type: "number" },
  },
  required: ["intersections", "scanLength", "angleFromNormal"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    apparentFrequency: { type: "number" },
    normalFrequency: { type: "number" },
    normalSpacing: { type: "number" },
  },
  required: ["apparentFrequency", "normalFrequency", "normalSpacing"],
} as const;
/** Planar parallel-fracture scanline correction with angle between scanline and fracture normal, not a fractured-network orientation estimate. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { intersections, scanLength, angleFromNormal } = request;
  const compute = (): Output => {
    H.integer(intersections, 1);
    H.positive(scanLength);
    H.domain(angleFromNormal > -Math.PI / 2 && angleFromNormal < Math.PI / 2);
    return {
      apparentFrequency: intersections / scanLength,
      normalFrequency:
        intersections / (scanLength * Math.abs(Math.cos(angleFromNormal))),
      normalSpacing:
        (scanLength * Math.abs(Math.cos(angleFromNormal))) / intersections,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { intersections: 10, scanLength: 20, angleFromNormal: 0 },
  output: { apparentFrequency: 0.5, normalFrequency: 0.5, normalSpacing: 2 },
} satisfies ToolExample<Input, Output>;
export const rockFractureSpacingFrequencyFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "earth-science/rock-fracture-spacing-frequency-factor",
    title: "Rock Fracture Spacing Frequency Factor Tool",
    description:
      "Planar parallel-fracture scanline correction with angle between scanline and fracture normal, not a fractured-network orientation estimate.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        intersections: { type: "integer", minimum: 1 },
        scanLength: { type: "number", exclusiveMinimum: 0 },
        angleFromNormal: { type: "number" },
      },
      required: ["intersections", "scanLength", "angleFromNormal"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        apparentFrequency: { type: "number" },
        normalFrequency: { type: "number" },
        normalSpacing: { type: "number" },
      },
      required: ["apparentFrequency", "normalFrequency", "normalSpacing"],
    },
    ports: {
      inputs: [
        {
          id: "intersections",
          label: "Intersections",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "scanLength",
          label: "Scan Length",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "angleFromNormal",
          label: "Angle From Normal",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "apparentFrequency",
          label: "Apparent Frequency",
          valueType: { type: "number" },
        },
        {
          id: "normalFrequency",
          label: "Normal Frequency",
          valueType: { type: "number" },
        },
        {
          id: "normalSpacing",
          label: "Normal Spacing",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = rockFractureSpacingFrequencyFactorTool.execute;
export default rockFractureSpacingFrequencyFactorTool;
