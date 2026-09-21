import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly sourceAlias: string;
  readonly targetAlias: string;
  readonly directed: boolean;
};
export type Output = { readonly key: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sourceAlias: { type: "string", maxLength: 8192 },
    targetAlias: { type: "string", maxLength: 8192 },
    directed: { type: "boolean" },
  },
  required: ["sourceAlias", "targetAlias", "directed"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { key: { type: "string", maxLength: 8192 } },
  required: ["key"],
} as const;
/** Build an edge key from caller-provided aliases; no identities or cultural relationship types are inferred. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { sourceAlias, targetAlias, directed } = request;
  const compute = (): Output => {
    const pair =
      directed || sourceAlias <= targetAlias
        ? [sourceAlias, targetAlias]
        : [targetAlias, sourceAlias];
    return { key: JSON.stringify(pair) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { sourceAlias: "B", targetAlias: "A", directed: false },
  output: { key: '["A","B"]' },
} satisfies ToolExample<Input, Output>;
export const authorizedGenealogyAnonymizedEdgeKeyTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "anthropology/authorized-genealogy-anonymized-edge-key",
      title: "Authorized Genealogy Anonymized Edge Key Tool",
      description:
        "Build an edge key from caller-provided aliases; no identities or cultural relationship types are inferred.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          sourceAlias: { type: "string", maxLength: 8192 },
          targetAlias: { type: "string", maxLength: 8192 },
          directed: { type: "boolean" },
        },
        required: ["sourceAlias", "targetAlias", "directed"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { key: { type: "string", maxLength: 8192 } },
        required: ["key"],
      },
      ports: {
        inputs: [
          {
            id: "sourceAlias",
            label: "Source Alias",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "targetAlias",
            label: "Target Alias",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "directed",
            label: "Directed",
            required: true,
            valueType: { type: "boolean" },
          },
        ],
        outputs: [{ id: "key", label: "Key", valueType: { type: "string" } }],
      },
    },
    calculate,
  });
export const run = authorizedGenealogyAnonymizedEdgeKeyTool.execute;
export default authorizedGenealogyAnonymizedEdgeKeyTool;
