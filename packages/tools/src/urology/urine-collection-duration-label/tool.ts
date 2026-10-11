import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly collectionId: string;
  readonly durationHours: number;
};
export type Output = {
  readonly label: string;
  readonly durationMinutes: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    collectionId: { type: "string", maxLength: 8192, minLength: 1 },
    durationHours: { type: "number", minimum: 0 },
  },
  required: ["collectionId", "durationHours"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    label: { type: "string", maxLength: 8192 },
    durationMinutes: { type: "number" },
  },
  required: ["label", "durationMinutes"],
} as const;
/** Label an explicit urine collection duration and crosswalk it to minutes without assessing collection completeness. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { collectionId, durationHours } = request;
  const compute = (): Output => {
    H.domain(collectionId.length > 0, "collectionId");
    H.domain(durationHours >= 0, "durationHours");
    return {
      label: collectionId + "; duration=" + durationHours + " h",
      durationMinutes: durationHours * 60,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { collectionId: "C17", durationHours: 24 },
  output: { label: "C17; duration=24 h", durationMinutes: 1440 },
} satisfies ToolExample<Input, Output>;
export const urineCollectionDurationLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["urology", "health and medicine"],
      keywords: ["urology", "health and medicine"],
    },
    id: "urology/urine-collection-duration-label",
    title: "Urine Collection Duration Label",
    description:
      "Label an explicit urine collection duration and crosswalk it to minutes without assessing collection completeness.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        collectionId: { type: "string", maxLength: 8192, minLength: 1 },
        durationHours: { type: "number", minimum: 0 },
      },
      required: ["collectionId", "durationHours"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        label: { type: "string", maxLength: 8192 },
        durationMinutes: { type: "number" },
      },
      required: ["label", "durationMinutes"],
    },
    ports: {
      inputs: [
        {
          id: "collectionId",
          label: "Collection Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "durationHours",
          label: "Duration Hours",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "label", label: "Label", valueType: { type: "string" } },
        {
          id: "durationMinutes",
          label: "Duration Minutes",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = urineCollectionDurationLabelTool.execute;
export default urineCollectionDurationLabelTool;
