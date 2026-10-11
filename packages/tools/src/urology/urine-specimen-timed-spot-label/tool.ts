import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly specimenId: string;
  readonly collectionMode: string;
};
export type Output = { readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    specimenId: { type: "string", maxLength: 8192, minLength: 1 },
    collectionMode: {
      type: "string",
      maxLength: 8192,
      enum: ["timed", "spot", "other", "unspecified"],
    },
  },
  required: ["specimenId", "collectionMode"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { label: { type: "string", maxLength: 8192 } },
  required: ["label"],
} as const;
/** Label an explicitly recorded urine collection mode without treating spot and timed measurements as interchangeable. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { specimenId, collectionMode } = request;
  const compute = (): Output => {
    H.domain(specimenId.length > 0, "specimenId");
    H.domain(
      ["timed", "spot", "other", "unspecified"].includes(collectionMode),
      "collectionMode",
    );
    return { label: specimenId + " [" + collectionMode + "]" };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { specimenId: "S17", collectionMode: "timed" },
  output: { label: "S17 [timed]" },
} satisfies ToolExample<Input, Output>;
export const urineSpecimenTimedSpotLabelTool = H.defineSchemaCalculation<
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
    id: "urology/urine-specimen-timed-spot-label",
    title: "Urine Specimen Timed Spot Label",
    description:
      "Label an explicitly recorded urine collection mode without treating spot and timed measurements as interchangeable.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        specimenId: { type: "string", maxLength: 8192, minLength: 1 },
        collectionMode: {
          type: "string",
          maxLength: 8192,
          enum: ["timed", "spot", "other", "unspecified"],
        },
      },
      required: ["specimenId", "collectionMode"],
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
          id: "specimenId",
          label: "Specimen Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "collectionMode",
          label: "Collection Mode",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "label", label: "Label", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = urineSpecimenTimedSpotLabelTool.execute;
export default urineSpecimenTimedSpotLabelTool;
