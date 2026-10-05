import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly tokens: readonly string[];
  readonly index: number;
  readonly expectedToken: string;
  readonly replacementToken: string;
};
export type Output = {
  readonly tokens: readonly string[];
  readonly replaced: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    tokens: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    index: { type: "integer", minimum: 0 },
    expectedToken: { type: "string", maxLength: 8192 },
    replacementToken: { type: "string", maxLength: 8192 },
  },
  required: ["tokens", "index", "expectedToken", "replacementToken"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    tokens: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    replaced: { type: "boolean" },
  },
  required: ["tokens", "replaced"],
} as const;
/** Replace exactly one indexed literal token after checking its expected value. Logical substitutability and variable capture are not inferred. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { tokens, index, expectedToken, replacementToken } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isSafeInteger(index) && index >= 0 && index <= tokens.length - 1,
      "index",
    ),
      index);
    H.domain(tokens[index] === expectedToken, "expectedToken");
    return {
      tokens: tokens.map((v, i) => (i === index ? replacementToken : v)),
      replaced: expectedToken !== replacementToken,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    tokens: ["a", "=", "a"],
    index: 2,
    expectedToken: "a",
    replacementToken: "b",
  },
  output: { tokens: ["a", "=", "b"], replaced: true },
} satisfies ToolExample<Input, Output>;
export const identitySubstitutionPositionTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "philosophy/identity-substitution-position",
    title: "Identity Substitution Position Tool",
    description:
      "Replace exactly one indexed literal token after checking its expected value. Logical substitutability and variable capture are not inferred.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        tokens: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        index: { type: "integer", minimum: 0 },
        expectedToken: { type: "string", maxLength: 8192 },
        replacementToken: { type: "string", maxLength: 8192 },
      },
      required: ["tokens", "index", "expectedToken", "replacementToken"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        tokens: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        replaced: { type: "boolean" },
      },
      required: ["tokens", "replaced"],
    },
    ports: {
      inputs: [
        {
          id: "tokens",
          label: "Tokens",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "index",
          label: "Index",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "expectedToken",
          label: "Expected Token",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "replacementToken",
          label: "Replacement Token",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "tokens",
          label: "Tokens",
          valueType: { type: "list", items: { type: "string" } },
        },
        { id: "replaced", label: "Replaced", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = identitySubstitutionPositionTool.execute;
export default identitySubstitutionPositionTool;
