import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly stationId: string;
  readonly pressureType: string;
  readonly referenceElevationMeters: number;
};
export type Output = { readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    stationId: { type: "string", maxLength: 8192 },
    pressureType: {
      type: "string",
      maxLength: 8192,
      enum: ["station", "sea-level", "altimeter"],
    },
    referenceElevationMeters: { type: "number" },
  },
  required: ["stationId", "pressureType", "referenceElevationMeters"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { label: { type: "string", maxLength: 8192 } },
  required: ["label"],
} as const;
/** Label the explicitly declared pressure product and reference elevation; no atmospheric pressure reduction is performed. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { stationId, pressureType, referenceElevationMeters } = request;
  const compute = (): Output => {
    H.domain(stationId.length > 0, "stationId");
    H.domain(
      ["station", "sea-level", "altimeter"].includes(pressureType),
      "pressureType",
    );
    return {
      label:
        stationId +
        "; pressure=" +
        pressureType +
        "; reference=" +
        referenceElevationMeters +
        " m",
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    stationId: "STN1",
    pressureType: "station",
    referenceElevationMeters: 250,
  },
  output: { label: "STN1; pressure=station; reference=250 m" },
} satisfies ToolExample<Input, Output>;
export const stationPressureReductionMetadataLabelTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "atmospheric-science/station-pressure-reduction-metadata-label",
      title: "Station Pressure Reduction Metadata Label Tool",
      description:
        "Label the explicitly declared pressure product and reference elevation; no atmospheric pressure reduction is performed.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          stationId: { type: "string", maxLength: 8192 },
          pressureType: {
            type: "string",
            maxLength: 8192,
            enum: ["station", "sea-level", "altimeter"],
          },
          referenceElevationMeters: { type: "number" },
        },
        required: ["stationId", "pressureType", "referenceElevationMeters"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { label: { type: "string", maxLength: 8192 } },
        required: ["label"],
      },
      ports: {
        inputs: [
          {
            id: "stationId",
            label: "Station Id",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "pressureType",
            label: "Pressure Type",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "referenceElevationMeters",
            label: "Reference Elevation Meters",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          { id: "label", label: "Label", valueType: { type: "string" } },
        ],
      },
    },
    calculate,
  });
export const run = stationPressureReductionMetadataLabelTool.execute;
export default stationPressureReductionMetadataLabelTool;
