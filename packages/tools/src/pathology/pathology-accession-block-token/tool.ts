import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly accessionId: string;
  readonly blockId: string;
  readonly laboratoryNamespace: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    accessionId: { type: "string", maxLength: 8192, minLength: 1 },
    blockId: { type: "string", maxLength: 8192, minLength: 1 },
    laboratoryNamespace: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["accessionId", "blockId", "laboratoryNamespace"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Qualify an explicit pathology accession/block pair by its laboratory namespace. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { accessionId, blockId, laboratoryNamespace } = request;
  const compute = (): Output => {
    H.domain(accessionId.length > 0, "accessionId");
    H.domain(blockId.length > 0, "blockId");
    H.domain(laboratoryNamespace.length > 0, "laboratoryNamespace");
    return {
      token: JSON.stringify([accessionId, blockId, laboratoryNamespace]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { accessionId: "ACC17", blockId: "B3", laboratoryNamespace: "LAB-A" },
  output: { token: '["ACC17","B3","LAB-A"]' },
} satisfies ToolExample<Input, Output>;
export const pathologyAccessionBlockTokenTool = H.defineSchemaCalculation<
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
    id: "pathology/pathology-accession-block-token",
    title: "Pathology Accession Block Token",
    description:
      "Qualify an explicit pathology accession/block pair by its laboratory namespace.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        accessionId: { type: "string", maxLength: 8192, minLength: 1 },
        blockId: { type: "string", maxLength: 8192, minLength: 1 },
        laboratoryNamespace: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["accessionId", "blockId", "laboratoryNamespace"],
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
          id: "accessionId",
          label: "Accession Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "blockId",
          label: "Block Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "laboratoryNamespace",
          label: "Laboratory Namespace",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = pathologyAccessionBlockTokenTool.execute;
export default pathologyAccessionBlockTokenTool;
