import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly suppliedDigraph: string;
  readonly suppliedCollationLabel: string;
  readonly sourceVersion: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    suppliedDigraph: { type: "string", maxLength: 8192, minLength: 1 },
    suppliedCollationLabel: { type: "string", maxLength: 8192, minLength: 1 },
    sourceVersion: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["suppliedDigraph", "suppliedCollationLabel", "sourceVersion"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Qualify an explicit digraph collation label by source version without inventing a language-specific ordering. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { suppliedDigraph, suppliedCollationLabel, sourceVersion } = request;
  const compute = (): Output => {
    H.domain(suppliedDigraph.length > 0, "suppliedDigraph");
    H.domain(suppliedCollationLabel.length > 0, "suppliedCollationLabel");
    H.domain(sourceVersion.length > 0, "sourceVersion");
    return {
      token: JSON.stringify([
        suppliedDigraph,
        suppliedCollationLabel,
        sourceVersion,
      ]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    suppliedDigraph: "ch",
    suppliedCollationLabel: "Position A",
    sourceVersion: "Source v2",
  },
  output: { token: '["ch","Position A","Source v2"]' },
} satisfies ToolExample<Input, Output>;
export const africanLanguageDigraphCollationTokenTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      discovery: {
        aliases: [],
        collections: ["learn"],
        fields: ["african-studies", "african studies", "humanities"],
        keywords: ["african studies", "humanities"],
      },
      id: "african-studies/african-language-digraph-collation-token",
      title: "African Language Digraph Collation Token",
      description:
        "Qualify an explicit digraph collation label by source version without inventing a language-specific ordering.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          suppliedDigraph: { type: "string", maxLength: 8192, minLength: 1 },
          suppliedCollationLabel: {
            type: "string",
            maxLength: 8192,
            minLength: 1,
          },
          sourceVersion: { type: "string", maxLength: 8192, minLength: 1 },
        },
        required: [
          "suppliedDigraph",
          "suppliedCollationLabel",
          "sourceVersion",
        ],
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
            id: "suppliedDigraph",
            label: "Supplied Digraph",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "suppliedCollationLabel",
            label: "Supplied Collation Label",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "sourceVersion",
            label: "Source Version",
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
export const run = africanLanguageDigraphCollationTokenTool.execute;
export default africanLanguageDigraphCollationTokenTool;
