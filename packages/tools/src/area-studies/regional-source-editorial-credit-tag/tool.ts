import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly sourceId: string;
  readonly editorName: string;
  readonly creditedRole: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sourceId: { type: "string", maxLength: 8192, minLength: 1 },
    editorName: { type: "string", maxLength: 8192, minLength: 1 },
    creditedRole: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["sourceId", "editorName", "creditedRole"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Record explicit regional-source editorial credit without assigning authorship. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { sourceId, editorName, creditedRole } = request;
  const compute = (): Output => {
    H.domain(sourceId.length > 0, "sourceId");
    H.domain(editorName.length > 0, "editorName");
    H.domain(creditedRole.length > 0, "creditedRole");
    return { token: JSON.stringify([sourceId, editorName, creditedRole]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    sourceId: "S17",
    editorName: "Editor A",
    creditedRole: "translator",
  },
  output: { token: '["S17","Editor A","translator"]' },
} satisfies ToolExample<Input, Output>;
export const regionalSourceEditorialCreditTagTool = H.defineSchemaCalculation<
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
    id: "area-studies/regional-source-editorial-credit-tag",
    title: "Regional Source Editorial Credit Tag",
    description:
      "Record explicit regional-source editorial credit without assigning authorship.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        sourceId: { type: "string", maxLength: 8192, minLength: 1 },
        editorName: { type: "string", maxLength: 8192, minLength: 1 },
        creditedRole: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["sourceId", "editorName", "creditedRole"],
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
          id: "editorName",
          label: "Editor Name",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "creditedRole",
          label: "Credited Role",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = regionalSourceEditorialCreditTagTool.execute;
export default regionalSourceEditorialCreditTagTool;
