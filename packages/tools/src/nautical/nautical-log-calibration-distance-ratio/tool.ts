import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly indicatedDistance: number;
  readonly suppliedReferenceDistance: number;
};
export type Output = { readonly referencePerIndicatedFactor: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    indicatedDistance: { type: "number", exclusiveMinimum: 0 },
    suppliedReferenceDistance: { type: "number", minimum: 0 },
  },
  required: ["indicatedDistance", "suppliedReferenceDistance"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { referencePerIndicatedFactor: { type: "number" } },
  required: ["referencePerIndicatedFactor"],
} as const;
/** Divide an explicit reference distance by indicated log distance without establishing operational calibration. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { indicatedDistance, suppliedReferenceDistance } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isFinite(indicatedDistance) && indicatedDistance > 0,
      "indicatedDistance",
    ),
      indicatedDistance);
    H.domain(suppliedReferenceDistance >= 0, "suppliedReferenceDistance");
    return {
      referencePerIndicatedFactor:
        suppliedReferenceDistance / indicatedDistance,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { indicatedDistance: 10, suppliedReferenceDistance: 12 },
  output: { referencePerIndicatedFactor: 1.2 },
} satisfies ToolExample<Input, Output>;
export const nauticalLogCalibrationDistanceRatioTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      discovery: {
        aliases: [],
        collections: ["data", "learn"],
        fields: ["nautical", "engineering"],
        keywords: ["nautical", "engineering"],
      },
      id: "nautical/nautical-log-calibration-distance-ratio",
      title: "Nautical Log Calibration Distance Ratio",
      description:
        "Divide an explicit reference distance by indicated log distance without establishing operational calibration.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          indicatedDistance: { type: "number", exclusiveMinimum: 0 },
          suppliedReferenceDistance: { type: "number", minimum: 0 },
        },
        required: ["indicatedDistance", "suppliedReferenceDistance"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { referencePerIndicatedFactor: { type: "number" } },
        required: ["referencePerIndicatedFactor"],
      },
      ports: {
        inputs: [
          {
            id: "indicatedDistance",
            label: "Indicated Distance",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "suppliedReferenceDistance",
            label: "Supplied Reference Distance",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "referencePerIndicatedFactor",
            label: "Reference Per Indicated Factor",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = nauticalLogCalibrationDistanceRatioTool.execute;
export default nauticalLogCalibrationDistanceRatioTool;
