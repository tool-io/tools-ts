import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly photoId: string;
  readonly siteWording: string;
  readonly viewWording: string;
};
export type Output = { readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    photoId: { type: "string", maxLength: 8192, minLength: 1 },
    siteWording: { type: "string", maxLength: 8192, minLength: 1 },
    viewWording: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["photoId", "siteWording", "viewWording"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { label: { type: "string", maxLength: 8192 } },
  required: ["label"],
} as const;
/** Format supplied gastrointestinal photo site and view wording without assessing image findings. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { photoId, siteWording, viewWording } = request;
  const compute = (): Output => {
    H.domain(
      photoId.length > 0 && siteWording.length > 0 && viewWording.length > 0,
      "photoId",
    );
    return { label: photoId + " [" + siteWording + "; " + viewWording + "]" };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    photoId: "IMG17",
    siteWording: "site A",
    viewWording: "retroflexed",
  },
  output: { label: "IMG17 [site A; retroflexed]" },
} satisfies ToolExample<Input, Output>;
export const endoscopyPhotoViewLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["gastroenterology", "health and medicine"],
      keywords: ["gastroenterology", "health and medicine"],
    },
    id: "gastroenterology/endoscopy-photo-view-label",
    title: "Endoscopy Photo View Label",
    description:
      "Format supplied gastrointestinal photo site and view wording without assessing image findings.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        photoId: { type: "string", maxLength: 8192, minLength: 1 },
        siteWording: { type: "string", maxLength: 8192, minLength: 1 },
        viewWording: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["photoId", "siteWording", "viewWording"],
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
          id: "photoId",
          label: "Photo Id",
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
          id: "viewWording",
          label: "View Wording",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "label", label: "Label", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = endoscopyPhotoViewLabelTool.execute;
export default endoscopyPhotoViewLabelTool;
