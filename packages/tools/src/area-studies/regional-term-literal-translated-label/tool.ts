import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly sourceId: string;
  readonly literalTerm: string;
  readonly suppliedTranslation: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sourceId: { type: "string", maxLength: 8192, minLength: 1 },
    literalTerm: { type: "string", maxLength: 8192, minLength: 1 },
    suppliedTranslation: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["sourceId", "literalTerm", "suppliedTranslation"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Preserve an explicit source term and supplied translation without asserting semantic equivalence. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { sourceId, literalTerm, suppliedTranslation } = request;
  const compute = (): Output => {
    H.domain(sourceId.length > 0, "sourceId");
    H.domain(literalTerm.length > 0, "literalTerm");
    H.domain(suppliedTranslation.length > 0, "suppliedTranslation");
    return {
      token: JSON.stringify([sourceId, literalTerm, suppliedTranslation]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { sourceId: "S17", literalTerm: "río", suppliedTranslation: "river" },
  output: { token: '["S17","río","river"]' },
} satisfies ToolExample<Input, Output>;
export const regionalTermLiteralTranslatedLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["area-studies", "area studies", "humanities"],
      keywords: ["area studies", "humanities"],
    },
    id: "area-studies/regional-term-literal-translated-label",
    title: "Regional Term Literal Translated Label",
    description:
      "Preserve an explicit source term and supplied translation without asserting semantic equivalence.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        sourceId: { type: "string", maxLength: 8192, minLength: 1 },
        literalTerm: { type: "string", maxLength: 8192, minLength: 1 },
        suppliedTranslation: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["sourceId", "literalTerm", "suppliedTranslation"],
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
          id: "sourceId",
          label: "Source Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "literalTerm",
          label: "Literal Term",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "suppliedTranslation",
          label: "Supplied Translation",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = regionalTermLiteralTranslatedLabelTool.execute;
export default regionalTermLiteralTranslatedLabelTool;
