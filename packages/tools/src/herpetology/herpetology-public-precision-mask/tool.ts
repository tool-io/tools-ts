import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly recordId: string;
  readonly locationText: string;
  readonly publishExactLocation: boolean;
  readonly replacement: string;
};
export type Output = { readonly displayLocation: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    recordId: { type: "string", maxLength: 8192, minLength: 1 },
    locationText: { type: "string", maxLength: 8192 },
    publishExactLocation: { type: "boolean" },
    replacement: { type: "string", maxLength: 8192 },
  },
  required: ["recordId", "locationText", "publishExactLocation", "replacement"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { displayLocation: { type: "string", maxLength: 8192 } },
  required: ["displayLocation"],
} as const;
/** Apply an explicit whole-location masking flag without deciding species-sensitivity or release policy. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { recordId, locationText, publishExactLocation, replacement } = request;
  const compute = (): Output => {
    H.domain(recordId.length > 0, "recordId");
    H.domain(
      publishExactLocation || replacement.length > 0,
      "publishExactLocation",
    );
    return {
      displayLocation: publishExactLocation ? locationText : replacement,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    recordId: "R17",
    locationText: "Location A",
    publishExactLocation: false,
    replacement: "[withheld]",
  },
  output: { displayLocation: "[withheld]" },
} satisfies ToolExample<Input, Output>;
export const herpetologyPublicPrecisionMaskTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["herpetology", "biology"],
      keywords: ["herpetology", "biology"],
    },
    id: "herpetology/herpetology-public-precision-mask",
    title: "Herpetology Public Precision Mask",
    description:
      "Apply an explicit whole-location masking flag without deciding species-sensitivity or release policy.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        recordId: { type: "string", maxLength: 8192, minLength: 1 },
        locationText: { type: "string", maxLength: 8192 },
        publishExactLocation: { type: "boolean" },
        replacement: { type: "string", maxLength: 8192 },
      },
      required: [
        "recordId",
        "locationText",
        "publishExactLocation",
        "replacement",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { displayLocation: { type: "string", maxLength: 8192 } },
      required: ["displayLocation"],
    },
    ports: {
      inputs: [
        {
          id: "recordId",
          label: "Record Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "locationText",
          label: "Location Text",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "publishExactLocation",
          label: "Publish Exact Location",
          required: true,
          valueType: { type: "boolean" },
        },
        {
          id: "replacement",
          label: "Replacement",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "displayLocation",
          label: "Display Location",
          valueType: { type: "string" },
        },
      ],
    },
  },
  calculate,
});
export const run = herpetologyPublicPrecisionMaskTool.execute;
export default herpetologyPublicPrecisionMaskTool;
