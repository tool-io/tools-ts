import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly entryId: string;
  readonly locationWording: string;
  readonly precisionTag: string;
};
export type Output = { readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    entryId: { type: "string", maxLength: 8192, minLength: 1 },
    locationWording: { type: "string", maxLength: 8192, minLength: 1 },
    precisionTag: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["entryId", "locationWording", "precisionTag"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { label: { type: "string", maxLength: 8192 } },
  required: ["label"],
} as const;
/** Attach explicit spatial-precision wording to an activity diary entry without geocoding or inferring a location. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { entryId, locationWording, precisionTag } = request;
  const compute = (): Output => {
    H.domain(
      entryId.length > 0 &&
        locationWording.length > 0 &&
        precisionTag.length > 0,
      "entryId",
    );
    return {
      label:
        entryId +
        "; location=" +
        JSON.stringify(locationWording) +
        " [" +
        precisionTag +
        "]",
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    entryId: "D17",
    locationWording: "District A",
    precisionTag: "district",
  },
  output: { label: 'D17; location="District A" [district]' },
} satisfies ToolExample<Input, Output>;
export const activityDiaryLocationPrecisionTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["human-geography", "human geography", "social sciences"],
      keywords: ["human geography", "social sciences"],
    },
    id: "human-geography/activity-diary-location-precision",
    title: "Activity Diary Location Precision",
    description:
      "Attach explicit spatial-precision wording to an activity diary entry without geocoding or inferring a location.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        entryId: { type: "string", maxLength: 8192, minLength: 1 },
        locationWording: { type: "string", maxLength: 8192, minLength: 1 },
        precisionTag: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["entryId", "locationWording", "precisionTag"],
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
          id: "entryId",
          label: "Entry Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "locationWording",
          label: "Location Wording",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "precisionTag",
          label: "Precision Tag",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "label", label: "Label", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = activityDiaryLocationPrecisionTool.execute;
export default activityDiaryLocationPrecisionTool;
