import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly token: string;
  readonly prefix: string;
  readonly delimiter: string;
};
export type Output = {
  readonly prefixMatches: boolean;
  readonly suffix: string;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    token: { type: "string", maxLength: 8192 },
    prefix: { type: "string", maxLength: 8192 },
    delimiter: { type: "string", maxLength: 8192 },
  },
  required: ["token", "prefix", "delimiter"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    prefixMatches: { type: "boolean" },
    suffix: { type: "string", maxLength: 8192 },
  },
  required: ["prefixMatches", "suffix"],
} as const;
/** Inspect a caller-defined public exhibit namespace without identity resolution or an invented checksum. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { token, prefix, delimiter } = request;
  const compute = (): Output => {
    H.domain(prefix.length > 0 && delimiter.length > 0);
    const boundary = prefix + delimiter;
    return {
      prefixMatches: token.startsWith(boundary),
      suffix: token.startsWith(boundary) ? token.slice(boundary.length) : "",
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { token: "EX-12", prefix: "EX", delimiter: "-" },
  output: { prefixMatches: true, suffix: "12" },
} satisfies ToolExample<Input, Output>;
export const exhibitIdCheckTokenTool = H.defineSchemaCalculation<Input, Output>(
  {
    ...{
      id: "forensic-science/exhibit-id-check-token",
      title: "Exhibit ID Check Token Tool",
      description:
        "Inspect a caller-defined public exhibit namespace without identity resolution or an invented checksum.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          token: { type: "string", maxLength: 8192 },
          prefix: { type: "string", maxLength: 8192 },
          delimiter: { type: "string", maxLength: 8192 },
        },
        required: ["token", "prefix", "delimiter"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          prefixMatches: { type: "boolean" },
          suffix: { type: "string", maxLength: 8192 },
        },
        required: ["prefixMatches", "suffix"],
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
            id: "delimiter",
            label: "Delimiter",
            required: true,
            valueType: { type: "string" },
          },
        ],
        outputs: [
          {
            id: "prefixMatches",
            label: "Prefix Matches",
            valueType: { type: "boolean" },
          },
          { id: "suffix", label: "Suffix", valueType: { type: "string" } },
        ],
      },
    },
    calculate,
  },
);
export const run = exhibitIdCheckTokenTool.execute;
export default exhibitIdCheckTokenTool;
