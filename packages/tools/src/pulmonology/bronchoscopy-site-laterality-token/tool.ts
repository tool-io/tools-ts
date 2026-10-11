import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly procedureId: string;
  readonly siteWording: string;
  readonly laterality: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    procedureId: { type: "string", maxLength: 8192, minLength: 1 },
    siteWording: { type: "string", maxLength: 8192, minLength: 1 },
    laterality: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["procedureId", "siteWording", "laterality"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Record explicit bronchoscopy site and laterality wording without anatomical interpretation. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { procedureId, siteWording, laterality } = request;
  const compute = (): Output => {
    H.domain(
      procedureId.length > 0 && siteWording.length > 0 && laterality.length > 0,
      "procedureId",
    );
    return { token: JSON.stringify([procedureId, siteWording, laterality]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { procedureId: "BR17", siteWording: "site A", laterality: "left" },
  output: { token: '["BR17","site A","left"]' },
} satisfies ToolExample<Input, Output>;
export const bronchoscopySiteLateralityTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["pulmonology", "health and medicine"],
      keywords: ["pulmonology", "health and medicine"],
    },
    id: "pulmonology/bronchoscopy-site-laterality-token",
    title: "Bronchoscopy Site Laterality Token",
    description:
      "Record explicit bronchoscopy site and laterality wording without anatomical interpretation.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        procedureId: { type: "string", maxLength: 8192, minLength: 1 },
        siteWording: { type: "string", maxLength: 8192, minLength: 1 },
        laterality: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["procedureId", "siteWording", "laterality"],
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
          id: "procedureId",
          label: "Procedure Id",
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
          id: "laterality",
          label: "Laterality",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = bronchoscopySiteLateralityTokenTool.execute;
export default bronchoscopySiteLateralityTokenTool;
