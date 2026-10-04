import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly token: string };
export type Output = {
  readonly prefixValid: boolean;
  readonly suffixPresent: boolean;
  readonly suffix: string;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    prefixValid: { type: "boolean" },
    suffixPresent: { type: "boolean" },
    suffix: { type: "string", maxLength: 8192 },
  },
  required: ["prefixValid", "suffixPresent", "suffix"],
} as const;
/** Calculate doi suffix nonempty boundary check from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { token } = request;
  const compute = (): Output => {
    const i = token.indexOf("/"),
      prefix = i < 0 ? token : token.slice(0, i),
      suffix = i < 0 ? "" : token.slice(i + 1);
    return {
      prefixValid: /^10\.\d{4,9}(?![\s\S])/.test(prefix),
      suffixPresent: suffix.length > 0,
      suffix,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { token: "10.1000/xyz" },
  output: { prefixValid: true, suffixPresent: true, suffix: "xyz" },
} satisfies ToolExample<Input, Output>;
export const doiSuffixNonemptyBoundaryCheckTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "validate/doi-suffix-nonempty-boundary-check",
    title: "DOI Suffix Nonempty Boundary Check Tool",
    description:
      "Calculate doi suffix nonempty boundary check from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { token: { type: "string", maxLength: 8192 } },
      required: ["token"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        prefixValid: { type: "boolean" },
        suffixPresent: { type: "boolean" },
        suffix: { type: "string", maxLength: 8192 },
      },
      required: ["prefixValid", "suffixPresent", "suffix"],
    },
    ports: {
      inputs: [
        {
          id: "token",
          label: "Token",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "prefixValid",
          label: "Prefix Valid",
          valueType: { type: "boolean" },
        },
        {
          id: "suffixPresent",
          label: "Suffix Present",
          valueType: { type: "boolean" },
        },
        { id: "suffix", label: "Suffix", valueType: { type: "string" } },
      ],
    },
  },
  calculate,
});
export const run = doiSuffixNonemptyBoundaryCheckTool.execute;
export default doiSuffixNonemptyBoundaryCheckTool;
