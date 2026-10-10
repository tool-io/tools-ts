import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly publicationId: string;
  readonly suppliedTipografiaText: string;
  readonly suppliedRole: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    publicationId: { type: "string", maxLength: 8192, minLength: 1 },
    suppliedTipografiaText: { type: "string", maxLength: 8192, minLength: 1 },
    suppliedRole: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["publicationId", "suppliedTipografiaText", "suppliedRole"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Preserve an explicit Brazilian imprint typography-house role transcription without translating or verifying publishing history. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { publicationId, suppliedTipografiaText, suppliedRole } = request;
  const compute = (): Output => {
    H.domain(publicationId.length > 0, "publicationId");
    H.domain(suppliedTipografiaText.length > 0, "suppliedTipografiaText");
    H.domain(suppliedRole.length > 0, "suppliedRole");
    return {
      token: JSON.stringify([
        publicationId,
        suppliedTipografiaText,
        suppliedRole,
      ]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    publicationId: "PUB17",
    suppliedTipografiaText: "Typographia A",
    suppliedRole: "printer",
  },
  output: { token: '["PUB17","Typographia A","printer"]' },
} satisfies ToolExample<Input, Output>;
export const brazilianImprintTipografiaRoleLabelTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      discovery: {
        aliases: [],
        collections: ["learn"],
        fields: [
          "latin-american-studies",
          "latin american studies",
          "humanities",
        ],
        keywords: ["latin american studies", "humanities"],
      },
      id: "latin-american-studies/brazilian-imprint-tipografia-role-label",
      title: "Brazilian Imprint Tipografia Role Label",
      description:
        "Preserve an explicit Brazilian imprint typography-house role transcription without translating or verifying publishing history.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          publicationId: { type: "string", maxLength: 8192, minLength: 1 },
          suppliedTipografiaText: {
            type: "string",
            maxLength: 8192,
            minLength: 1,
          },
          suppliedRole: { type: "string", maxLength: 8192, minLength: 1 },
        },
        required: ["publicationId", "suppliedTipografiaText", "suppliedRole"],
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
            id: "publicationId",
            label: "Publication Id",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "suppliedTipografiaText",
            label: "Supplied Tipografia Text",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "suppliedRole",
            label: "Supplied Role",
            required: true,
            valueType: { type: "string" },
          },
        ],
        outputs: [
          { id: "token", label: "Token", valueType: { type: "string" } },
        ],
      },
    },
    calculate,
  });
export const run = brazilianImprintTipografiaRoleLabelTool.execute;
export default brazilianImprintTipografiaRoleLabelTool;
