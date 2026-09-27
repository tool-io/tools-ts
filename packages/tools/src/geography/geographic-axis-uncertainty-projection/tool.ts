import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly eastSigma: number;
  readonly northSigma: number;
  readonly correlation: number;
  readonly angleRadians: number;
};
export type Output = { readonly projectedVariance: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    eastSigma: { type: "number", minimum: 0 },
    northSigma: { type: "number", minimum: 0 },
    correlation: { type: "number", minimum: -1, maximum: 1 },
    angleRadians: { type: "number" },
  },
  required: ["eastSigma", "northSigma", "correlation", "angleRadians"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { projectedVariance: { type: "number" } },
  required: ["projectedVariance"],
} as const;
/** Local Cartesian variance projected onto an axis measured counterclockwise from east. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { eastSigma, northSigma, correlation, angleRadians } = request;
  const compute = (): Output => {
    H.domain(
      eastSigma >= 0 &&
        northSigma >= 0 &&
        correlation >= -1 &&
        correlation <= 1,
    );
    return {
      projectedVariance:
        (eastSigma * Math.cos(angleRadians)) ** 2 +
        (northSigma * Math.sin(angleRadians)) ** 2 +
        2 *
          correlation *
          eastSigma *
          northSigma *
          Math.cos(angleRadians) *
          Math.sin(angleRadians),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { eastSigma: 2, northSigma: 3, correlation: 0, angleRadians: 0 },
  output: { projectedVariance: 4 },
} satisfies ToolExample<Input, Output>;
export const geographicAxisUncertaintyProjectionTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "geography/geographic-axis-uncertainty-projection",
      title: "Geographic Axis Uncertainty Projection Tool",
      description:
        "Local Cartesian variance projected onto an axis measured counterclockwise from east.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          eastSigma: { type: "number", minimum: 0 },
          northSigma: { type: "number", minimum: 0 },
          correlation: { type: "number", minimum: -1, maximum: 1 },
          angleRadians: { type: "number" },
        },
        required: ["eastSigma", "northSigma", "correlation", "angleRadians"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { projectedVariance: { type: "number" } },
        required: ["projectedVariance"],
      },
      ports: {
        inputs: [
          {
            id: "eastSigma",
            label: "East Sigma",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "northSigma",
            label: "North Sigma",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "correlation",
            label: "Correlation",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "angleRadians",
            label: "Angle Radians",
            required: true,
            valueType: { type: "number", unit: "rad" },
          },
        ],
        outputs: [
          {
            id: "projectedVariance",
            label: "Projected Variance",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = geographicAxisUncertaintyProjectionTool.execute;
export default geographicAxisUncertaintyProjectionTool;
