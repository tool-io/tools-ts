import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly referenceStationCoordinate: number;
  readonly recordedStationCoordinate: number;
};
export type Output = { readonly signedGap: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    referenceStationCoordinate: { type: "number" },
    recordedStationCoordinate: { type: "number" },
  },
  required: ["referenceStationCoordinate", "recordedStationCoordinate"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { signedGap: { type: "number" } },
  required: ["signedGap"],
} as const;
/** Subtract an explicit reference station coordinate from a recorded vessel station on the same longitudinal axis. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { referenceStationCoordinate, recordedStationCoordinate } = request;
  const compute = (): Output => {
    return {
      signedGap: recordedStationCoordinate - referenceStationCoordinate,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { referenceStationCoordinate: 12, recordedStationCoordinate: 17 },
  output: { signedGap: 5 },
} satisfies ToolExample<Input, Output>;
export const vesselTrimReferenceStationOffsetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["nautical", "engineering"],
      keywords: ["nautical", "engineering"],
    },
    id: "nautical/vessel-trim-reference-station-offset",
    title: "Vessel Trim Reference Station Offset",
    description:
      "Subtract an explicit reference station coordinate from a recorded vessel station on the same longitudinal axis.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        referenceStationCoordinate: { type: "number" },
        recordedStationCoordinate: { type: "number" },
      },
      required: ["referenceStationCoordinate", "recordedStationCoordinate"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { signedGap: { type: "number" } },
      required: ["signedGap"],
    },
    ports: {
      inputs: [
        {
          id: "referenceStationCoordinate",
          label: "Reference Station Coordinate",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "recordedStationCoordinate",
          label: "Recorded Station Coordinate",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "signedGap", label: "Signed Gap", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = vesselTrimReferenceStationOffsetTool.execute;
export default vesselTrimReferenceStationOffsetTool;
