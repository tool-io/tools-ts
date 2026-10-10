import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly specimenLocated: boolean;
  readonly remainingMaterialRecorded: boolean;
  readonly releasePermissionRecorded: boolean;
};
export type Output = { readonly availableUnderFlags: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    specimenLocated: { type: "boolean" },
    remainingMaterialRecorded: { type: "boolean" },
    releasePermissionRecorded: { type: "boolean" },
  },
  required: [
    "specimenLocated",
    "remainingMaterialRecorded",
    "releasePermissionRecorded",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { availableUnderFlags: { type: "boolean" } },
  required: ["availableUnderFlags"],
} as const;
/** Combine explicit specimen availability and release flags without determining tissue adequacy or permission validity. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    specimenLocated,
    remainingMaterialRecorded,
    releasePermissionRecorded,
  } = request;
  const compute = (): Output => {
    return {
      availableUnderFlags:
        specimenLocated &&
        remainingMaterialRecorded &&
        releasePermissionRecorded,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    specimenLocated: true,
    remainingMaterialRecorded: true,
    releasePermissionRecorded: true,
  },
  output: { availableUnderFlags: true },
} satisfies ToolExample<Input, Output>;
export const biopsyTissueAvailabilityFlagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["oncology", "health and medicine"],
      keywords: ["oncology", "health and medicine"],
    },
    id: "oncology/biopsy-tissue-availability-flag",
    title: "Biopsy Tissue Availability Flag",
    description:
      "Combine explicit specimen availability and release flags without determining tissue adequacy or permission validity.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        specimenLocated: { type: "boolean" },
        remainingMaterialRecorded: { type: "boolean" },
        releasePermissionRecorded: { type: "boolean" },
      },
      required: [
        "specimenLocated",
        "remainingMaterialRecorded",
        "releasePermissionRecorded",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { availableUnderFlags: { type: "boolean" } },
      required: ["availableUnderFlags"],
    },
    ports: {
      inputs: [
        {
          id: "specimenLocated",
          label: "Specimen Located",
          required: true,
          valueType: { type: "boolean" },
        },
        {
          id: "remainingMaterialRecorded",
          label: "Remaining Material Recorded",
          required: true,
          valueType: { type: "boolean" },
        },
        {
          id: "releasePermissionRecorded",
          label: "Release Permission Recorded",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "availableUnderFlags",
          label: "Available Under Flags",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = biopsyTissueAvailabilityFlagTool.execute;
export default biopsyTissueAvailabilityFlagTool;
