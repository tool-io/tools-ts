import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly prosthesisId: string;
  readonly thicknessMillimeters: number;
  readonly measurementSite: string;
};
export type Output = { readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    prosthesisId: { type: "string", maxLength: 8192, minLength: 1 },
    thicknessMillimeters: { type: "number", minimum: 0 },
    measurementSite: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["prosthesisId", "thicknessMillimeters", "measurementSite"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { label: { type: "string", maxLength: 8192 } },
  required: ["label"],
} as const;
/** Label an explicit denture-base thickness and site without recommending a material thickness. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { prosthesisId, thicknessMillimeters, measurementSite } = request;
  const compute = (): Output => {
    H.domain(
      prosthesisId.length > 0 && measurementSite.length > 0,
      "prosthesisId",
    );
    H.domain(thicknessMillimeters >= 0, "thicknessMillimeters");
    return {
      label:
        prosthesisId +
        "; thickness=" +
        thicknessMillimeters +
        " mm [" +
        measurementSite +
        "]",
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    prosthesisId: "P17",
    thicknessMillimeters: 2.5,
    measurementSite: "site A",
  },
  output: { label: "P17; thickness=2.5 mm [site A]" },
} satisfies ToolExample<Input, Output>;
export const dentureBaseThicknessInputTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["prosthodontics", "health and medicine"],
      keywords: ["prosthodontics", "health and medicine"],
    },
    id: "prosthodontics/denture-base-thickness-input",
    title: "Denture Base Thickness Input",
    description:
      "Label an explicit denture-base thickness and site without recommending a material thickness.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        prosthesisId: { type: "string", maxLength: 8192, minLength: 1 },
        thicknessMillimeters: { type: "number", minimum: 0 },
        measurementSite: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["prosthesisId", "thicknessMillimeters", "measurementSite"],
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
          id: "prosthesisId",
          label: "Prosthesis Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "thicknessMillimeters",
          label: "Thickness Millimeters",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "measurementSite",
          label: "Measurement Site",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "label", label: "Label", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = dentureBaseThicknessInputTool.execute;
export default dentureBaseThicknessInputTool;
