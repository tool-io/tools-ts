import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly identifier: string };
export type Output = {
  readonly normalized: string;
  readonly removedResolver: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { identifier: { type: "string", maxLength: 8192 } },
  required: ["identifier"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    normalized: { type: "string", maxLength: 8192 },
    removedResolver: { type: "boolean" },
  },
  required: ["normalized", "removedResolver"],
} as const;
/** Normalize an ASCII-whitespace-free DOI spelling and optional resolver prefix; no DOI existence or publisher authority is checked. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { identifier } = request;
  const compute = (): Output => {
    const stripped = identifier
      .replace(/^https?:\/\/(?:dx\.)?doi\.org\//i, "")
      .replace(/^doi:\s*/i, "");
    H.domain(/^10\.[0-9]{4,9}\/[^\s]+(?![\s\S])/.test(stripped));
    return {
      normalized: stripped.toLowerCase(),
      removedResolver: /^https?:\/\//i.test(identifier),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { identifier: "https://doi.org/10.1234/ABC" },
  output: { normalized: "10.1234/abc", removedResolver: true },
} satisfies ToolExample<Input, Output>;
export const referenceDoiPrefixCaseNormalizationTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "bibliometrics/reference-doi-prefix-case-normalization",
      title: "Reference DOI Prefix Case Normalization Tool",
      description:
        "Normalize an ASCII-whitespace-free DOI spelling and optional resolver prefix; no DOI existence or publisher authority is checked.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { identifier: { type: "string", maxLength: 8192 } },
        required: ["identifier"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          normalized: { type: "string", maxLength: 8192 },
          removedResolver: { type: "boolean" },
        },
        required: ["normalized", "removedResolver"],
      },
      ports: {
        inputs: [
          {
            id: "identifier",
            label: "Identifier",
            required: true,
            valueType: { type: "string" },
          },
        ],
        outputs: [
          {
            id: "normalized",
            label: "Normalized",
            valueType: { type: "string" },
          },
          {
            id: "removedResolver",
            label: "Removed Resolver",
            valueType: { type: "boolean" },
          },
        ],
      },
    },
    calculate,
  });
export const run = referenceDoiPrefixCaseNormalizationTool.execute;
export default referenceDoiPrefixCaseNormalizationTool;
