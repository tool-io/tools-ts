import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly latitudeDegrees: number;
  readonly longitudeDegrees: number;
  readonly suppliedQuantumDegrees: number;
};
export type Output = {
  readonly roundedLatitudeDegrees: number;
  readonly roundedLongitudeDegrees: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    latitudeDegrees: { type: "number", minimum: -90, maximum: 90 },
    longitudeDegrees: { type: "number", minimum: -180, maximum: 180 },
    suppliedQuantumDegrees: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["latitudeDegrees", "longitudeDegrees", "suppliedQuantumDegrees"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    roundedLatitudeDegrees: { type: "number", minimum: -90, maximum: 90 },
    roundedLongitudeDegrees: { type: "number", minimum: -180, maximum: 180 },
  },
  required: ["roundedLatitudeDegrees", "roundedLongitudeDegrees"],
} as const;
/** Round explicit geographic coordinates to a supplied degree quantum with half ties toward positive infinity; rounding alone does not guarantee location privacy. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { latitudeDegrees, longitudeDegrees, suppliedQuantumDegrees } = request;
  const compute = (): Output => {
    H.domain(
      latitudeDegrees >= -90 && latitudeDegrees <= 90,
      "latitudeDegrees",
    );
    H.domain(
      longitudeDegrees >= -180 && longitudeDegrees <= 180,
      "longitudeDegrees",
    );
    (H.domain(
      Number.isFinite(suppliedQuantumDegrees) && suppliedQuantumDegrees > 0,
      "suppliedQuantumDegrees",
    ),
      suppliedQuantumDegrees);
    return {
      roundedLatitudeDegrees:
        Math.round(latitudeDegrees / suppliedQuantumDegrees) *
        suppliedQuantumDegrees,
      roundedLongitudeDegrees:
        Math.round(longitudeDegrees / suppliedQuantumDegrees) *
        suppliedQuantumDegrees,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    latitudeDegrees: 12.34,
    longitudeDegrees: 45.67,
    suppliedQuantumDegrees: 0.1,
  },
  output: { roundedLatitudeDegrees: 12.3, roundedLongitudeDegrees: 45.7 },
} satisfies ToolExample<Input, Output>;
export const ethnographicLocationPublicPrecisionRoundingTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      discovery: {
        aliases: [],
        collections: ["learn"],
        fields: ["anthropology", "social sciences"],
        keywords: ["anthropology", "social sciences"],
      },
      id: "anthropology/ethnographic-location-public-precision-rounding",
      title: "Ethnographic Location Public Precision Rounding",
      description:
        "Round explicit geographic coordinates to a supplied degree quantum with half ties toward positive infinity; rounding alone does not guarantee location privacy.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          latitudeDegrees: { type: "number", minimum: -90, maximum: 90 },
          longitudeDegrees: { type: "number", minimum: -180, maximum: 180 },
          suppliedQuantumDegrees: { type: "number", exclusiveMinimum: 0 },
        },
        required: [
          "latitudeDegrees",
          "longitudeDegrees",
          "suppliedQuantumDegrees",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          roundedLatitudeDegrees: { type: "number", minimum: -90, maximum: 90 },
          roundedLongitudeDegrees: {
            type: "number",
            minimum: -180,
            maximum: 180,
          },
        },
        required: ["roundedLatitudeDegrees", "roundedLongitudeDegrees"],
      },
      ports: {
        inputs: [
          {
            id: "latitudeDegrees",
            label: "Latitude Degrees",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "longitudeDegrees",
            label: "Longitude Degrees",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "suppliedQuantumDegrees",
            label: "Supplied Quantum Degrees",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "roundedLatitudeDegrees",
            label: "Rounded Latitude Degrees",
            valueType: { type: "number" },
          },
          {
            id: "roundedLongitudeDegrees",
            label: "Rounded Longitude Degrees",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = ethnographicLocationPublicPrecisionRoundingTool.execute;
export default ethnographicLocationPublicPrecisionRoundingTool;
