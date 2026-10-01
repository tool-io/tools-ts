import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly prefixLength: number;
  readonly tokenLength: number;
  readonly sourceLength: number;
};
export type Output = {
  readonly tokenStart: number;
  readonly tokenEnd: number;
  readonly fits: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    prefixLength: { type: "integer", minimum: 0 },
    tokenLength: { type: "integer", minimum: 0 },
    sourceLength: { type: "integer", minimum: 0 },
  },
  required: ["prefixLength", "tokenLength", "sourceLength"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    tokenStart: { type: "integer" },
    tokenEnd: { type: "integer" },
    fits: { type: "boolean" },
  },
  required: ["tokenStart", "tokenEnd", "fits"],
} as const;
/** Resolve one supplied length-prefix boundary in a single caller-defined indexing unit. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { prefixLength, tokenLength, sourceLength } = request;
  const compute = (): Output => {
    H.integer(prefixLength, 0);
    H.integer(tokenLength, 0);
    H.integer(sourceLength, 0);
    const end = BigInt(prefixLength) + BigInt(tokenLength);
    return {
      tokenStart: prefixLength,
      tokenEnd: Number(end),
      fits: end <= BigInt(sourceLength),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { prefixLength: 2, tokenLength: 5, sourceLength: 10 },
  output: { tokenStart: 2, tokenEnd: 7, fits: true },
} satisfies ToolExample<Input, Output>;
export const lengthPrefixedTokenBoundaryTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "parse/length-prefixed-token-boundary",
    title: "Length Prefixed Token Boundary Tool",
    description:
      "Resolve one supplied length-prefix boundary in a single caller-defined indexing unit.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        prefixLength: { type: "integer", minimum: 0 },
        tokenLength: { type: "integer", minimum: 0 },
        sourceLength: { type: "integer", minimum: 0 },
      },
      required: ["prefixLength", "tokenLength", "sourceLength"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        tokenStart: { type: "integer" },
        tokenEnd: { type: "integer" },
        fits: { type: "boolean" },
      },
      required: ["tokenStart", "tokenEnd", "fits"],
    },
    ports: {
      inputs: [
        {
          id: "prefixLength",
          label: "Prefix Length",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "tokenLength",
          label: "Token Length",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "sourceLength",
          label: "Source Length",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "tokenStart",
          label: "Token Start",
          valueType: { type: "integer" },
        },
        { id: "tokenEnd", label: "Token End", valueType: { type: "integer" } },
        { id: "fits", label: "Fits", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = lengthPrefixedTokenBoundaryTool.execute;
export default lengthPrefixedTokenBoundaryTool;
