import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  domain,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = {
  readonly left: string;
  readonly right: string;
  readonly ignoreAsciiCase: boolean;
};
export type Output = { readonly match: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    left: { type: "string", maxLength: 8192 },
    right: { type: "string", maxLength: 8192 },
    ignoreAsciiCase: { type: "boolean" },
  },
  required: ["left", "right", "ignoreAsciiCase"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { match: { type: "boolean" } },
  required: ["match"],
} as const;
/** Compare two tokens with an explicit ASCII-only case-folding policy. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { left, right, ignoreAsciiCase } = input;
  const compute = (): Output => {
    domain(/^[\x00-\x7f]*(?![\s\S])/.test(left + right));
    return {
      match: ignoreAsciiCase
        ? left.toLowerCase() === right.toLowerCase()
        : left === right,
    };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { left: "Alpha", right: "alpha", ignoreAsciiCase: true },
  output: { match: true },
} satisfies ToolExample<Input, Output>;
export const tokenMatchCaseFoldPolicyPairTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "similarity/token-match-case-fold-policy-pair",
  title: "Token Match Case Fold Policy Pair Tool",
  description:
    "Compare two tokens with an explicit ASCII-only case-folding policy.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "left",
        label: "Left",
        required: true,
        valueType: { type: "string" },
      },
      {
        id: "right",
        label: "Right",
        required: true,
        valueType: { type: "string" },
      },
      {
        id: "ignoreAsciiCase",
        label: "Ignore Ascii Case",
        required: true,
        valueType: { type: "boolean" },
      },
    ],
    outputs: [{ id: "match", label: "Match", valueType: { type: "boolean" } }],
  },
});
export const run = tokenMatchCaseFoldPolicyPairTool.execute;
export default tokenMatchCaseFoldPolicyPairTool;
