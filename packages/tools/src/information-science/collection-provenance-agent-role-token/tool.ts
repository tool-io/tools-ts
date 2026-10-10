import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly collectionId: string;
  readonly agentId: string;
  readonly suppliedRole: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    collectionId: { type: "string", maxLength: 8192, minLength: 1 },
    agentId: { type: "string", maxLength: 8192, minLength: 1 },
    suppliedRole: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["collectionId", "agentId", "suppliedRole"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Preserve an explicit collection provenance agent-role assertion without verifying ownership or chain of custody. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { collectionId, agentId, suppliedRole } = request;
  const compute = (): Output => {
    H.domain(collectionId.length > 0, "collectionId");
    H.domain(agentId.length > 0, "agentId");
    H.domain(suppliedRole.length > 0, "suppliedRole");
    return { token: JSON.stringify([collectionId, agentId, suppliedRole]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { collectionId: "C17", agentId: "A4", suppliedRole: "donor" },
  output: { token: '["C17","A4","donor"]' },
} satisfies ToolExample<Input, Output>;
export const collectionProvenanceAgentRoleTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "information-science/collection-provenance-agent-role-token",
    title: "Collection Provenance Agent Role Token Tool",
    description:
      "Preserve an explicit collection provenance agent-role assertion without verifying ownership or chain of custody.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        collectionId: { type: "string", maxLength: 8192, minLength: 1 },
        agentId: { type: "string", maxLength: 8192, minLength: 1 },
        suppliedRole: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["collectionId", "agentId", "suppliedRole"],
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
          id: "collectionId",
          label: "Collection Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "agentId",
          label: "Agent Id",
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
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = collectionProvenanceAgentRoleTokenTool.execute;
export default collectionProvenanceAgentRoleTokenTool;
