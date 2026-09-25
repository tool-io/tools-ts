import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly observed: number;
  readonly reference: number;
  readonly observedCenter: number;
  readonly referenceCenter: number;
  readonly observedScale: number;
  readonly referenceScale: number;
};
export type Output = {
  readonly normalizedGap: number;
  readonly squaredGap: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    observed: { type: "number" },
    reference: { type: "number" },
    observedCenter: { type: "number" },
    referenceCenter: { type: "number" },
    observedScale: { type: "number", exclusiveMinimum: 0 },
    referenceScale: { type: "number", exclusiveMinimum: 0 },
  },
  required: [
    "observed",
    "reference",
    "observedCenter",
    "referenceCenter",
    "observedScale",
    "referenceScale",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    normalizedGap: { type: "number" },
    squaredGap: { type: "number" },
  },
  required: ["normalizedGap", "squaredGap"],
} as const;
/** One coordinate residual after supplied centering/scaling; rotations and full Procrustes fitting must already be established. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    observed,
    reference,
    observedCenter,
    referenceCenter,
    observedScale,
    referenceScale,
  } = request;
  const compute = (): Output => {
    H.positive(observedScale);
    H.positive(referenceScale);
    return {
      normalizedGap:
        (observed - observedCenter) / observedScale -
        (reference - referenceCenter) / referenceScale,
      squaredGap:
        ((observed - observedCenter) / observedScale -
          (reference - referenceCenter) / referenceScale) **
        2,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    observed: 5,
    reference: 3,
    observedCenter: 1,
    referenceCenter: 1,
    observedScale: 2,
    referenceScale: 2,
  },
  output: { normalizedGap: 1, squaredGap: 1 },
} satisfies ToolExample<Input, Output>;
export const embryoLandmarkProcrustesOneCoordinateGapTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "developmental-biology/embryo-landmark-procrustes-one-coordinate-gap",
      title: "Embryo Landmark Procrustes One Coordinate Gap Tool",
      description:
        "One coordinate residual after supplied centering/scaling; rotations and full Procrustes fitting must already be established.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          observed: { type: "number" },
          reference: { type: "number" },
          observedCenter: { type: "number" },
          referenceCenter: { type: "number" },
          observedScale: { type: "number", exclusiveMinimum: 0 },
          referenceScale: { type: "number", exclusiveMinimum: 0 },
        },
        required: [
          "observed",
          "reference",
          "observedCenter",
          "referenceCenter",
          "observedScale",
          "referenceScale",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          normalizedGap: { type: "number" },
          squaredGap: { type: "number" },
        },
        required: ["normalizedGap", "squaredGap"],
      },
      ports: {
        inputs: [
          {
            id: "observed",
            label: "Observed",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "reference",
            label: "Reference",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "observedCenter",
            label: "Observed Center",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "referenceCenter",
            label: "Reference Center",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "observedScale",
            label: "Observed Scale",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "referenceScale",
            label: "Reference Scale",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "normalizedGap",
            label: "Normalized Gap",
            valueType: { type: "number" },
          },
          {
            id: "squaredGap",
            label: "Squared Gap",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = embryoLandmarkProcrustesOneCoordinateGapTool.execute;
export default embryoLandmarkProcrustesOneCoordinateGapTool;
