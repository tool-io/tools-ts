import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly homogeneousWeight: number;
  readonly tolerance: number;
};
export type Output = {
  readonly atHorizon: boolean;
  readonly distanceFromHorizon: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    homogeneousWeight: { type: "number" },
    tolerance: { type: "number", minimum: 0 },
  },
  required: ["homogeneousWeight", "tolerance"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    atHorizon: { type: "boolean" },
    distanceFromHorizon: { type: "number" },
  },
  required: ["atHorizon", "distanceFromHorizon"],
} as const;
/** Calculate vector projective point horizon denominator gap from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { homogeneousWeight, tolerance } = request;
  const compute = (): Output => {
    H.domain(tolerance >= 0);
    return {
      atHorizon: Math.abs(homogeneousWeight) <= tolerance,
      distanceFromHorizon: Math.abs(homogeneousWeight),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { homogeneousWeight: 0.001, tolerance: 0.01 },
  output: { atHorizon: true, distanceFromHorizon: 0.001 },
} satisfies ToolExample<Input, Output>;
export const vectorProjectivePointHorizonDenominatorGapTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "vector/vector-projective-point-horizon-denominator-gap",
      title: "Vector Projective Point Horizon Denominator Gap Tool",
      description:
        "Calculate vector projective point horizon denominator gap from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          homogeneousWeight: { type: "number" },
          tolerance: { type: "number", minimum: 0 },
        },
        required: ["homogeneousWeight", "tolerance"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          atHorizon: { type: "boolean" },
          distanceFromHorizon: { type: "number" },
        },
        required: ["atHorizon", "distanceFromHorizon"],
      },
      ports: {
        inputs: [
          {
            id: "homogeneousWeight",
            label: "Homogeneous Weight",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "tolerance",
            label: "Tolerance",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "atHorizon",
            label: "At Horizon",
            valueType: { type: "boolean" },
          },
          {
            id: "distanceFromHorizon",
            label: "Distance From Horizon",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = vectorProjectivePointHorizonDenominatorGapTool.execute;
export default vectorProjectivePointHorizonDenominatorGapTool;
