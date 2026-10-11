import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly findingId: string;
  readonly ownerCode: string;
  readonly ownerNamespace: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    findingId: { type: "string", maxLength: 8192, minLength: 1 },
    ownerCode: { type: "string", maxLength: 8192, minLength: 1 },
    ownerNamespace: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["findingId", "ownerCode", "ownerNamespace"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Qualify a supplied audit-finding owner code by namespace without assigning accountability. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { findingId, ownerCode, ownerNamespace } = request;
  const compute = (): Output => {
    H.domain(findingId.length > 0, "findingId");
    H.domain(ownerCode.length > 0, "ownerCode");
    H.domain(ownerNamespace.length > 0, "ownerNamespace");
    return { token: JSON.stringify([findingId, ownerCode, ownerNamespace]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    findingId: "F17",
    ownerCode: "TEAM2",
    ownerNamespace: "Directory A",
  },
  output: { token: '["F17","TEAM2","Directory A"]' },
} satisfies ToolExample<Input, Output>;
export const auditFindingOwnerCodeTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: [
        "quality-assurance",
        "quality assurance",
        "research and quality management",
      ],
      keywords: ["quality assurance", "research and quality management"],
    },
    id: "quality-assurance/audit-finding-owner-code",
    title: "Audit Finding Owner Code",
    description:
      "Qualify a supplied audit-finding owner code by namespace without assigning accountability.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        findingId: { type: "string", maxLength: 8192, minLength: 1 },
        ownerCode: { type: "string", maxLength: 8192, minLength: 1 },
        ownerNamespace: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["findingId", "ownerCode", "ownerNamespace"],
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
          id: "findingId",
          label: "Finding Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "ownerCode",
          label: "Owner Code",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "ownerNamespace",
          label: "Owner Namespace",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = auditFindingOwnerCodeTool.execute;
export default auditFindingOwnerCodeTool;
