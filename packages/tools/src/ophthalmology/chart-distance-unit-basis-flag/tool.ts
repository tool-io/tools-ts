import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly distance: number;
  readonly suppliedMetersPerUnit: number;
  readonly referenceMeters: number;
};
export type Output = {
  readonly distanceMeters: number;
  readonly referenceRatio: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    distance: { type: "number", minimum: 0 },
    suppliedMetersPerUnit: { type: "number", exclusiveMinimum: 0 },
    referenceMeters: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["distance", "suppliedMetersPerUnit", "referenceMeters"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    distanceMeters: { type: "number" },
    referenceRatio: { type: "number" },
  },
  required: ["distanceMeters", "referenceRatio"],
} as const;
/** Compare a supplied chart distance to an explicit reference after unit conversion; no acuity score is inferred. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { distance, suppliedMetersPerUnit, referenceMeters } = request;
  const compute = (): Output => {
    H.domain(distance >= 0);
    H.positive(suppliedMetersPerUnit);
    H.positive(referenceMeters);
    return {
      distanceMeters: distance * suppliedMetersPerUnit,
      referenceRatio: (distance * suppliedMetersPerUnit) / referenceMeters,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { distance: 20, suppliedMetersPerUnit: 0.3, referenceMeters: 6 },
  output: { distanceMeters: 6, referenceRatio: 1 },
} satisfies ToolExample<Input, Output>;
export const chartDistanceUnitBasisFlagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "ophthalmology/chart-distance-unit-basis-flag",
    title: "Chart Distance Unit Basis Flag Tool",
    description:
      "Compare a supplied chart distance to an explicit reference after unit conversion; no acuity score is inferred.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        distance: { type: "number", minimum: 0 },
        suppliedMetersPerUnit: { type: "number", exclusiveMinimum: 0 },
        referenceMeters: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["distance", "suppliedMetersPerUnit", "referenceMeters"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        distanceMeters: { type: "number" },
        referenceRatio: { type: "number" },
      },
      required: ["distanceMeters", "referenceRatio"],
    },
    ports: {
      inputs: [
        {
          id: "distance",
          label: "Distance",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedMetersPerUnit",
          label: "Supplied Meters Per Unit",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "referenceMeters",
          label: "Reference Meters",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "distanceMeters",
          label: "Distance Meters",
          valueType: { type: "number" },
        },
        {
          id: "referenceRatio",
          label: "Reference Ratio",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = chartDistanceUnitBasisFlagTool.execute;
export default chartDistanceUnitBasisFlagTool;
