import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly token: string; readonly suppliedPrefix: string };
export type Output = {
  readonly prefixMatches: boolean;
  readonly suffix: string;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    token: { type: "string", maxLength: 8192 },
    suppliedPrefix: { type: "string", maxLength: 8192 },
  },
  required: ["token", "suppliedPrefix"],
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
/** Inspect a caller-defined public notation prefix without interpreting potency as biological activity. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { token, suppliedPrefix } = request;
  const compute = (): Output => {
    H.domain(suppliedPrefix.length > 0);
    return {
      prefixMatches: token.startsWith(suppliedPrefix),
      suffix: token.startsWith(suppliedPrefix)
        ? token.slice(suppliedPrefix.length)
        : "",
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { token: "src:12C", suppliedPrefix: "src:" },
  output: { prefixMatches: true, suffix: "12C" },
} satisfies ToolExample<Input, Output>;
export const publicPotencyLabelPrefixTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "homeopathy/public-potency-label-prefix-token",
    title: "Public Potency Label Prefix Token Tool",
    description:
      "Inspect a caller-defined public notation prefix without interpreting potency as biological activity.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        token: { type: "string", maxLength: 8192 },
        suppliedPrefix: { type: "string", maxLength: 8192 },
      },
      required: ["token", "suppliedPrefix"],
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
          id: "suppliedPrefix",
          label: "Supplied Prefix",
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
});
export const run = publicPotencyLabelPrefixTokenTool.execute;
export default publicPotencyLabelPrefixTokenTool;
