import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly recordedDistance: number;
  readonly referenceDistancePerRecordedUnit: number;
  readonly recordedFare: number;
};
export type Output = {
  readonly referenceDistance: number;
  readonly farePerReferenceDistance: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    recordedDistance: { type: "number", exclusiveMinimum: 0 },
    referenceDistancePerRecordedUnit: { type: "number", exclusiveMinimum: 0 },
    recordedFare: { type: "number", minimum: 0 },
  },
  required: [
    "recordedDistance",
    "referenceDistancePerRecordedUnit",
    "recordedFare",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    referenceDistance: { type: "number" },
    farePerReferenceDistance: { type: "number" },
  },
  required: ["referenceDistance", "farePerReferenceDistance"],
} as const;
/** Normalize an explicitly transcribed rail fare by distance converted with a caller-supplied historical unit factor. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { recordedDistance, referenceDistancePerRecordedUnit, recordedFare } =
    request;
  const compute = (): Output => {
    (H.domain(recordedDistance > 0, "recordedDistance"), recordedDistance);
    (H.domain(
      referenceDistancePerRecordedUnit > 0,
      "referenceDistancePerRecordedUnit",
    ),
      referenceDistancePerRecordedUnit);
    H.domain(recordedFare >= 0, "recordedFare");
    return {
      referenceDistance: recordedDistance * referenceDistancePerRecordedUnit,
      farePerReferenceDistance:
        recordedFare / (recordedDistance * referenceDistancePerRecordedUnit),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    recordedDistance: 20,
    referenceDistancePerRecordedUnit: 1.5,
    recordedFare: 6,
  },
  output: { referenceDistance: 30, farePerReferenceDistance: 0.2 },
} satisfies ToolExample<Input, Output>;
export const historicalRailFareDistanceUnitTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["economic-history", "economic history", "economics"],
      keywords: ["economic history", "economics"],
    },
    id: "economic-history/historical-rail-fare-distance-unit",
    title: "Historical Rail Fare Distance Unit",
    description:
      "Normalize an explicitly transcribed rail fare by distance converted with a caller-supplied historical unit factor.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        recordedDistance: { type: "number", exclusiveMinimum: 0 },
        referenceDistancePerRecordedUnit: {
          type: "number",
          exclusiveMinimum: 0,
        },
        recordedFare: { type: "number", minimum: 0 },
      },
      required: [
        "recordedDistance",
        "referenceDistancePerRecordedUnit",
        "recordedFare",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        referenceDistance: { type: "number" },
        farePerReferenceDistance: { type: "number" },
      },
      required: ["referenceDistance", "farePerReferenceDistance"],
    },
    ports: {
      inputs: [
        {
          id: "recordedDistance",
          label: "Recorded Distance",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "referenceDistancePerRecordedUnit",
          label: "Reference Distance Per Recorded Unit",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "recordedFare",
          label: "Recorded Fare",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "referenceDistance",
          label: "Reference Distance",
          valueType: { type: "number" },
        },
        {
          id: "farePerReferenceDistance",
          label: "Fare Per Reference Distance",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = historicalRailFareDistanceUnitTool.execute;
export default historicalRailFareDistanceUnitTool;
