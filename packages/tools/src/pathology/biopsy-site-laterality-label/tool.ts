import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly specimenId: string;
  readonly siteWording: string;
  readonly side: string;
};
export type Output = { readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    specimenId: { type: "string", maxLength: 8192, minLength: 1 },
    siteWording: { type: "string", maxLength: 8192, minLength: 1 },
    side: {
      type: "string",
      maxLength: 8192,
      enum: ["left", "right", "bilateral", "midline", "unspecified"],
    },
  },
  required: ["specimenId", "siteWording", "side"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { label: { type: "string", maxLength: 8192 } },
  required: ["label"],
} as const;
/** Combine explicitly recorded biopsy site wording and laterality without identifying tissue or validating provenance. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { specimenId, siteWording, side } = request;
  const compute = (): Output => {
    H.domain(specimenId.length > 0 && siteWording.length > 0, "specimenId");
    H.domain(
      ["left", "right", "bilateral", "midline", "unspecified"].includes(side),
      "side",
    );
    return { label: specimenId + "; " + siteWording + " [" + side + "]" };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { specimenId: "S17", siteWording: "site A", side: "left" },
  output: { label: "S17; site A [left]" },
} satisfies ToolExample<Input, Output>;
export const biopsySiteLateralityLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["pathology", "health and medicine"],
      keywords: ["pathology", "health and medicine"],
    },
    id: "pathology/biopsy-site-laterality-label",
    title: "Biopsy Site Laterality Label",
    description:
      "Combine explicitly recorded biopsy site wording and laterality without identifying tissue or validating provenance.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        specimenId: { type: "string", maxLength: 8192, minLength: 1 },
        siteWording: { type: "string", maxLength: 8192, minLength: 1 },
        side: {
          type: "string",
          maxLength: 8192,
          enum: ["left", "right", "bilateral", "midline", "unspecified"],
        },
      },
      required: ["specimenId", "siteWording", "side"],
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
          id: "siteWording",
          label: "Site Wording",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "side",
          label: "Side",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "label", label: "Label", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = biopsySiteLateralityLabelTool.execute;
export default biopsySiteLateralityLabelTool;
