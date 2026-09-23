import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly word: string; readonly width: number };
export type Output = {
  readonly fixedPoint: boolean;
  readonly signedDecimal: string;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    word: { type: "string", maxLength: 8192 },
    width: { type: "integer", minimum: 1, maximum: 256 },
  },
  required: ["word", "width"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    fixedPoint: { type: "boolean" },
    signedDecimal: { type: "string", maxLength: 8192 },
  },
  required: ["fixedPoint", "signedDecimal"],
} as const;
/** Inspect exact modular two’s-complement negation fixed points, including zero and the most negative signed word. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { word, width } = request;
  const compute = (): Output => {
    H.integer(width, 1, 256);
    const n = H.decimal(word),
      modulus = 1n << BigInt(width);
    H.domain(n >= 0n && n < modulus);
    return {
      fixedPoint: (modulus - n) % modulus === n,
      signedDecimal: (n >= modulus / 2n ? n - modulus : n).toString(),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { word: "128", width: 8 },
  output: { fixedPoint: true, signedDecimal: "-128" },
} satisfies ToolExample<Input, Output>;
export const signedWordNegationFixedPointTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "bitwise/signed-word-negation-fixed-point",
    title: "Signed Word Negation Fixed Point Tool",
    description:
      "Inspect exact modular two’s-complement negation fixed points, including zero and the most negative signed word.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        word: { type: "string", maxLength: 8192 },
        width: { type: "integer", minimum: 1, maximum: 256 },
      },
      required: ["word", "width"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        fixedPoint: { type: "boolean" },
        signedDecimal: { type: "string", maxLength: 8192 },
      },
      required: ["fixedPoint", "signedDecimal"],
    },
    ports: {
      inputs: [
        {
          id: "word",
          label: "Word",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "width",
          label: "Width",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "fixedPoint",
          label: "Fixed Point",
          valueType: { type: "boolean" },
        },
        {
          id: "signedDecimal",
          label: "Signed Decimal",
          valueType: { type: "string" },
        },
      ],
    },
  },
  calculate,
});
export const run = signedWordNegationFixedPointTool.execute;
export default signedWordNegationFixedPointTool;
