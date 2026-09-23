import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly token: string;
  readonly sourceTokens: readonly string[];
  readonly normalizedTokens: readonly string[];
  readonly code: string;
  readonly edition: string;
};
export type Output = { readonly status: string; readonly sourceKey: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    token: { type: "string", maxLength: 8192 },
    sourceTokens: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    normalizedTokens: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    code: { type: "string", maxLength: 8192 },
    edition: { type: "string", maxLength: 8192 },
  },
  required: ["token", "sourceTokens", "normalizedTokens", "code", "edition"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    status: { type: "string", maxLength: 8192 },
    sourceKey: { type: "string", maxLength: 8192 },
  },
  required: ["status", "sourceKey"],
} as const;
/** Resolve a reviewed caller-supplied type-status vocabulary with explicit code and edition. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { token, sourceTokens, normalizedTokens, code, edition } = request;
  const compute = (): Output => {
    H.sameLength(sourceTokens, normalizedTokens);
    H.domain(
      new Set(sourceTokens).size === sourceTokens.length &&
        code.length > 0 &&
        edition.length > 0,
    );
    const index = sourceTokens.indexOf(token);
    H.domain(index >= 0, "token");
    return {
      status: normalizedTokens[index],
      sourceKey: JSON.stringify([code, edition, token]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    token: "HT",
    sourceTokens: ["HT", "PT"],
    normalizedTokens: ["holotype", "paratype"],
    code: "ICZN",
    edition: "study-edition",
  },
  output: { status: "holotype", sourceKey: '["ICZN","study-edition","HT"]' },
} satisfies ToolExample<Input, Output>;
export const nomenclaturalTypeStatusSourceTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "biosystematics/nomenclatural-type-status-source-token",
    title: "Nomenclatural Type Status Source Token Tool",
    description:
      "Resolve a reviewed caller-supplied type-status vocabulary with explicit code and edition.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        token: { type: "string", maxLength: 8192 },
        sourceTokens: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        normalizedTokens: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        code: { type: "string", maxLength: 8192 },
        edition: { type: "string", maxLength: 8192 },
      },
      required: [
        "token",
        "sourceTokens",
        "normalizedTokens",
        "code",
        "edition",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        status: { type: "string", maxLength: 8192 },
        sourceKey: { type: "string", maxLength: 8192 },
      },
      required: ["status", "sourceKey"],
    },
    ports: {
      inputs: [
        {
          id: "token",
          label: "Token",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "sourceTokens",
          label: "Source Tokens",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "normalizedTokens",
          label: "Normalized Tokens",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "code",
          label: "Code",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "edition",
          label: "Edition",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        { id: "status", label: "Status", valueType: { type: "string" } },
        { id: "sourceKey", label: "Source Key", valueType: { type: "string" } },
      ],
    },
  },
  calculate,
});
export const run = nomenclaturalTypeStatusSourceTokenTool.execute;
export default nomenclaturalTypeStatusSourceTokenTool;
