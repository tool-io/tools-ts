import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly prosthesisId: string;
  readonly materialWording: string;
  readonly lotId: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    prosthesisId: { type: "string", maxLength: 8192, minLength: 1 },
    materialWording: { type: "string", maxLength: 8192, minLength: 1 },
    lotId: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["prosthesisId", "materialWording", "lotId"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Record explicit prosthesis material wording and lot provenance without choosing or assessing a material. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { prosthesisId, materialWording, lotId } = request;
  const compute = (): Output => {
    H.domain(prosthesisId.length > 0, "prosthesisId");
    H.domain(materialWording.length > 0, "materialWording");
    H.domain(lotId.length > 0, "lotId");
    return { token: JSON.stringify([prosthesisId, materialWording, lotId]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { prosthesisId: "P17", materialWording: "Material A", lotId: "LOT3" },
  output: { token: '["P17","Material A","LOT3"]' },
} satisfies ToolExample<Input, Output>;
export const prosthesisMaterialLotLabelTool = H.defineSchemaCalculation<
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
    id: "prosthodontics/prosthesis-material-lot-label",
    title: "Prosthesis Material Lot Label",
    description:
      "Record explicit prosthesis material wording and lot provenance without choosing or assessing a material.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        prosthesisId: { type: "string", maxLength: 8192, minLength: 1 },
        materialWording: { type: "string", maxLength: 8192, minLength: 1 },
        lotId: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["prosthesisId", "materialWording", "lotId"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { token: { type: "string", maxLength: 8192 } },
      required: ["token"],
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
          id: "materialWording",
          label: "Material Wording",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "lotId",
          label: "Lot Id",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = prosthesisMaterialLotLabelTool.execute;
export default prosthesisMaterialLotLabelTool;
