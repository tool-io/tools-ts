import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly observationId: string;
  readonly colorWording: string;
  readonly referenceStandard: string;
};
export type Output = { readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    observationId: { type: "string", maxLength: 8192, minLength: 1 },
    colorWording: { type: "string", maxLength: 8192, minLength: 1 },
    referenceStandard: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["observationId", "colorWording", "referenceStandard"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { label: { type: "string", maxLength: 8192 } },
  required: ["label"],
} as const;
/** Label an explicitly recorded skin-color observation with its reference source without inferring diagnosis or ethnicity. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { observationId, colorWording, referenceStandard } = request;
  const compute = (): Output => {
    H.domain(
      observationId.length > 0 &&
        colorWording.length > 0 &&
        referenceStandard.length > 0,
      "observationId",
    );
    return {
      label:
        observationId +
        "; color=" +
        JSON.stringify(colorWording) +
        " [" +
        referenceStandard +
        "]",
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    observationId: "O17",
    colorWording: "recorded red",
    referenceStandard: "chart A",
  },
  output: { label: 'O17; color="recorded red" [chart A]' },
} satisfies ToolExample<Input, Output>;
export const skinObservationColorReferenceLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["dermatology", "health and medicine"],
      keywords: ["dermatology", "health and medicine"],
    },
    id: "dermatology/skin-observation-color-reference-label",
    title: "Skin Observation Color Reference Label",
    description:
      "Label an explicitly recorded skin-color observation with its reference source without inferring diagnosis or ethnicity.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        observationId: { type: "string", maxLength: 8192, minLength: 1 },
        colorWording: { type: "string", maxLength: 8192, minLength: 1 },
        referenceStandard: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["observationId", "colorWording", "referenceStandard"],
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
          id: "observationId",
          label: "Observation Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "colorWording",
          label: "Color Wording",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "referenceStandard",
          label: "Reference Standard",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "label", label: "Label", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = skinObservationColorReferenceLabelTool.execute;
export default skinObservationColorReferenceLabelTool;
