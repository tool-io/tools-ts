import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly token: string;
  readonly prefix: string;
  readonly expectedLength: number;
};
export type Output = {
  readonly prefixMatches: boolean;
  readonly lengthMatches: boolean;
  readonly preserved: string;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    token: { type: "string", maxLength: 8192 },
    prefix: { type: "string", maxLength: 8192 },
    expectedLength: { type: "integer", minimum: 0 },
  },
  required: ["token", "prefix", "expectedLength"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    prefixMatches: { type: "boolean" },
    lengthMatches: { type: "boolean" },
    preserved: { type: "string", maxLength: 8192 },
  },
  required: ["prefixMatches", "lengthMatches", "preserved"],
} as const;
/** Inspect exact supplied field-ID prefix/UTF-16 length conventions without numeric coercion or checksum claims. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { token, prefix, expectedLength } = request;
  const compute = (): Output => {
    H.integer(expectedLength, 0);
    return {
      prefixMatches: token.startsWith(prefix),
      lengthMatches: token.length === expectedLength,
      preserved: token,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { token: "F-001", prefix: "F-", expectedLength: 5 },
  output: { prefixMatches: true, lengthMatches: true, preserved: "F-001" },
} satisfies ToolExample<Input, Output>;
export const fieldIdCheckTokenTool = H.defineSchemaCalculation<Input, Output>({
  ...{
    id: "agroinformatics/field-id-check-token",
    title: "Field ID Check Token Tool",
    description:
      "Inspect exact supplied field-ID prefix/UTF-16 length conventions without numeric coercion or checksum claims.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        token: { type: "string", maxLength: 8192 },
        prefix: { type: "string", maxLength: 8192 },
        expectedLength: { type: "integer", minimum: 0 },
      },
      required: ["token", "prefix", "expectedLength"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        prefixMatches: { type: "boolean" },
        lengthMatches: { type: "boolean" },
        preserved: { type: "string", maxLength: 8192 },
      },
      required: ["prefixMatches", "lengthMatches", "preserved"],
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
          id: "prefix",
          label: "Prefix",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "expectedLength",
          label: "Expected Length",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "prefixMatches",
          label: "Prefix Matches",
          valueType: { type: "boolean" },
        },
        {
          id: "lengthMatches",
          label: "Length Matches",
          valueType: { type: "boolean" },
        },
        { id: "preserved", label: "Preserved", valueType: { type: "string" } },
      ],
    },
  },
  calculate,
});
export const run = fieldIdCheckTokenTool.execute;
export default fieldIdCheckTokenTool;
