import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly apexElevation: number;
  readonly toeElevation: number;
  readonly radialDistance: number;
};
export type Output = {
  readonly gradient: number;
  readonly angleRadians: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    apexElevation: { type: "number" },
    toeElevation: { type: "number" },
    radialDistance: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["apexElevation", "toeElevation", "radialDistance"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    gradient: { type: "number" },
    angleRadians: { type: "number" },
  },
  required: ["gradient", "angleRadians"],
} as const;
/** Calculate alluvial fan radial slope term from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { apexElevation, toeElevation, radialDistance } = request;
  const compute = (): Output => {
    H.positive(radialDistance);
    return {
      gradient: (apexElevation - toeElevation) / radialDistance,
      angleRadians: Math.atan((apexElevation - toeElevation) / radialDistance),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { apexElevation: 100, toeElevation: 90, radialDistance: 100 },
  output: { gradient: 0.1, angleRadians: 0.09966865249116204 },
} satisfies ToolExample<Input, Output>;
export const alluvialFanRadialSlopeTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "geomorphology/alluvial-fan-radial-slope-term",
    title: "Alluvial Fan Radial Slope Term Tool",
    description:
      "Calculate alluvial fan radial slope term from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        apexElevation: { type: "number" },
        toeElevation: { type: "number" },
        radialDistance: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["apexElevation", "toeElevation", "radialDistance"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        gradient: { type: "number" },
        angleRadians: { type: "number" },
      },
      required: ["gradient", "angleRadians"],
    },
    ports: {
      inputs: [
        {
          id: "apexElevation",
          label: "Apex Elevation",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "toeElevation",
          label: "Toe Elevation",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "radialDistance",
          label: "Radial Distance",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "gradient", label: "Gradient", valueType: { type: "number" } },
        {
          id: "angleRadians",
          label: "Angle Radians",
          valueType: { type: "number", unit: "rad" },
        },
      ],
    },
  },
  calculate,
});
export const run = alluvialFanRadialSlopeTermTool.execute;
export default alluvialFanRadialSlopeTermTool;
