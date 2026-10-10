import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly locationRecordId: string;
  readonly referencePeriod: string;
};
export type Output = { readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    locationRecordId: { type: "string", maxLength: 8192, minLength: 1 },
    referencePeriod: {
      type: "string",
      maxLength: 8192,
      enum: ["night", "day", "mixed", "unknown"],
    },
  },
  required: ["locationRecordId", "referencePeriod"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { label: { type: "string", maxLength: 8192 } },
  required: ["label"],
} as const;
/** Label an explicitly supplied residential-location day/night reference period without inferring home or work locations. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { locationRecordId, referencePeriod } = request;
  const compute = (): Output => {
    H.domain(locationRecordId.length > 0, "locationRecordId");
    H.domain(
      ["night", "day", "mixed", "unknown"].includes(referencePeriod),
      "referencePeriod",
    );
    return { label: locationRecordId + " [" + referencePeriod + "]" };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { locationRecordId: "L17", referencePeriod: "night" },
  output: { label: "L17 [night]" },
} satisfies ToolExample<Input, Output>;
export const residentialLocationNightdayLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "human-geography/residential-location-nightday-label",
    title: "Residential Location Nightday Label Tool",
    description:
      "Label an explicitly supplied residential-location day/night reference period without inferring home or work locations.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        locationRecordId: { type: "string", maxLength: 8192, minLength: 1 },
        referencePeriod: {
          type: "string",
          maxLength: 8192,
          enum: ["night", "day", "mixed", "unknown"],
        },
      },
      required: ["locationRecordId", "referencePeriod"],
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
          id: "locationRecordId",
          label: "Location Record Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "referencePeriod",
          label: "Reference Period",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "label", label: "Label", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = residentialLocationNightdayLabelTool.execute;
export default residentialLocationNightdayLabelTool;
