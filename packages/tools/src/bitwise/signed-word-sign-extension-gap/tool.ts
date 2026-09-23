import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly wordDecimal: string;
  readonly sourceWidth: number;
  readonly targetWidth: number;
};
export type Output = {
  readonly extendedDecimal: string;
  readonly addedBitValueDecimal: string;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    wordDecimal: { type: "string", maxLength: 8192 },
    sourceWidth: { type: "integer", minimum: 1, maximum: 256 },
    targetWidth: { type: "integer", maximum: 256 },
  },
  required: ["wordDecimal", "sourceWidth", "targetWidth"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    extendedDecimal: { type: "string", maxLength: 8192 },
    addedBitValueDecimal: { type: "string", maxLength: 8192 },
  },
  required: ["extendedDecimal", "addedBitValueDecimal"],
} as const;
/** Compare unsigned source/target bit-pattern values during exact signed-word sign extension. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { wordDecimal, sourceWidth, targetWidth } = request;
  const compute = (): Output => {
    H.integer(sourceWidth, 1, 256);
    H.integer(targetWidth, sourceWidth, 256);
    const n = H.decimal(wordDecimal),
      sourceLimit = 1n << BigInt(sourceWidth);
    H.domain(n >= 0n && n < sourceLimit);
    const negative = (n & (sourceLimit >> 1n)) !== 0n,
      extended = negative ? n + (1n << BigInt(targetWidth)) - sourceLimit : n;
    return {
      extendedDecimal: extended.toString(),
      addedBitValueDecimal: (extended - n).toString(),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { wordDecimal: "255", sourceWidth: 8, targetWidth: 16 },
  output: { extendedDecimal: "65535", addedBitValueDecimal: "65280" },
} satisfies ToolExample<Input, Output>;
export const signedWordSignExtensionGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "bitwise/signed-word-sign-extension-gap",
    title: "Signed Word Sign Extension Gap Tool",
    description:
      "Compare unsigned source/target bit-pattern values during exact signed-word sign extension.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        wordDecimal: { type: "string", maxLength: 8192 },
        sourceWidth: { type: "integer", minimum: 1, maximum: 256 },
        targetWidth: { type: "integer", maximum: 256 },
      },
      required: ["wordDecimal", "sourceWidth", "targetWidth"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        extendedDecimal: { type: "string", maxLength: 8192 },
        addedBitValueDecimal: { type: "string", maxLength: 8192 },
      },
      required: ["extendedDecimal", "addedBitValueDecimal"],
    },
    ports: {
      inputs: [
        {
          id: "wordDecimal",
          label: "Word Decimal",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "sourceWidth",
          label: "Source Width",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "targetWidth",
          label: "Target Width",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "extendedDecimal",
          label: "Extended Decimal",
          valueType: { type: "string" },
        },
        {
          id: "addedBitValueDecimal",
          label: "Added Bit Value Decimal",
          valueType: { type: "string" },
        },
      ],
    },
  },
  calculate,
});
export const run = signedWordSignExtensionGapTool.execute;
export default signedWordSignExtensionGapTool;
