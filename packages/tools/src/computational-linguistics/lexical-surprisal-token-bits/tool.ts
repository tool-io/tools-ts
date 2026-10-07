import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly tokenProbability: number };
export type Output = { readonly surprisalBits: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    tokenProbability: { type: "number", exclusiveMinimum: 0, maximum: 1 },
  },
  required: ["tokenProbability"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { surprisalBits: { type: "number" } },
  required: ["surprisalBits"],
} as const;
/** Calculate one supplied positive token probability surprisal in bits without estimating a language model probability. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { tokenProbability } = request;
  const compute = (): Output => {
    H.domain(tokenProbability > 0 && tokenProbability <= 1, "tokenProbability");
    return { surprisalBits: -Math.log2(tokenProbability) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { tokenProbability: 0.25 },
  output: { surprisalBits: 2 },
} satisfies ToolExample<Input, Output>;
export const lexicalSurprisalTokenBitsTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: [
        "computational-linguistics",
        "computational linguistics",
        "information and language sciences",
      ],
      keywords: [
        "computational linguistics",
        "information and language sciences",
      ],
    },
    id: "computational-linguistics/lexical-surprisal-token-bits",
    title: "Lexical Surprisal Token Bits",
    description:
      "Calculate one supplied positive token probability surprisal in bits without estimating a language model probability.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        tokenProbability: { type: "number", exclusiveMinimum: 0, maximum: 1 },
      },
      required: ["tokenProbability"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { surprisalBits: { type: "number" } },
      required: ["surprisalBits"],
    },
    ports: {
      inputs: [
        {
          id: "tokenProbability",
          label: "Token Probability",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "surprisalBits",
          label: "Surprisal Bits",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = lexicalSurprisalTokenBitsTool.execute;
export default lexicalSurprisalTokenBitsTool;
