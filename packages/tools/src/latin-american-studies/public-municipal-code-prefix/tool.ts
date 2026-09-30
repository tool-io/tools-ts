import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly code: string;
  readonly suppliedPrefix: string;
  readonly requireSeparator: boolean;
  readonly separator: string;
};
export type Output = {
  readonly prefixMatches: boolean;
  readonly suffix: string;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    code: { type: "string", maxLength: 8192 },
    suppliedPrefix: { type: "string", maxLength: 8192 },
    requireSeparator: { type: "boolean" },
    separator: { type: "string", maxLength: 8192 },
  },
  required: ["code", "suppliedPrefix", "requireSeparator", "separator"],
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
/** Inspect a public code against an explicit prefix and separator policy, without a municipality lookup. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { code, suppliedPrefix, requireSeparator, separator } = request;
  const compute = (): Output => {
    return (() => {
      H.domain(
        suppliedPrefix.length > 0 &&
          (!requireSeparator || separator.length > 0),
      );
      const prefix = suppliedPrefix + (requireSeparator ? separator : ""),
        prefixMatches = code.startsWith(prefix);
      return {
        prefixMatches,
        suffix: prefixMatches ? code.slice(prefix.length) : "",
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    code: "AB-123",
    suppliedPrefix: "AB",
    requireSeparator: true,
    separator: "-",
  },
  output: { prefixMatches: true, suffix: "123" },
} satisfies ToolExample<Input, Output>;
export const publicMunicipalCodePrefixTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "latin-american-studies/public-municipal-code-prefix",
    title: "Public Municipal Code Prefix Tool",
    description:
      "Inspect a public code against an explicit prefix and separator policy, without a municipality lookup.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        code: { type: "string", maxLength: 8192 },
        suppliedPrefix: { type: "string", maxLength: 8192 },
        requireSeparator: { type: "boolean" },
        separator: { type: "string", maxLength: 8192 },
      },
      required: ["code", "suppliedPrefix", "requireSeparator", "separator"],
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
          id: "code",
          label: "Code",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "suppliedPrefix",
          label: "Supplied Prefix",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "requireSeparator",
          label: "Require Separator",
          required: true,
          valueType: { type: "boolean" },
        },
        {
          id: "separator",
          label: "Separator",
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
export const run = publicMunicipalCodePrefixTool.execute;
export default publicMunicipalCodePrefixTool;
