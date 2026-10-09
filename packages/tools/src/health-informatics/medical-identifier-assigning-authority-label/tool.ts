import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly identifier: string;
  readonly authority: string;
  readonly identifierType: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    identifier: { type: "string", maxLength: 8192, minLength: 1 },
    authority: { type: "string", maxLength: 8192, minLength: 1 },
    identifierType: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["identifier", "authority", "identifierType"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Qualify a literal medical identifier by its supplied assigning authority and type without resolving a person or record. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { identifier, authority, identifierType } = request;
  const compute = (): Output => {
    H.domain(identifier.length > 0, "identifier");
    H.domain(authority.length > 0, "authority");
    H.domain(identifierType.length > 0, "identifierType");
    return { token: JSON.stringify([identifier, authority, identifierType]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    identifier: "P17",
    authority: "Hospital A",
    identifierType: "local patient ID",
  },
  output: { token: '["P17","Hospital A","local patient ID"]' },
} satisfies ToolExample<Input, Output>;
export const medicalIdentifierAssigningAuthorityLabelTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      discovery: {
        aliases: [],
        collections: ["data"],
        fields: [
          "health-informatics",
          "health informatics",
          "research and quality management",
        ],
        keywords: ["health informatics", "research and quality management"],
      },
      id: "health-informatics/medical-identifier-assigning-authority-label",
      title: "Medical Identifier Assigning Authority Label",
      description:
        "Qualify a literal medical identifier by its supplied assigning authority and type without resolving a person or record.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          identifier: { type: "string", maxLength: 8192, minLength: 1 },
          authority: { type: "string", maxLength: 8192, minLength: 1 },
          identifierType: { type: "string", maxLength: 8192, minLength: 1 },
        },
        required: ["identifier", "authority", "identifierType"],
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
            id: "identifier",
            label: "Identifier",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "authority",
            label: "Authority",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "identifierType",
            label: "Identifier Type",
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
export const run = medicalIdentifierAssigningAuthorityLabelTool.execute;
export default medicalIdentifierAssigningAuthorityLabelTool;
