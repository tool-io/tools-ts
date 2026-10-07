import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly signedInt32: number;
  readonly shiftCount: number;
};
export type Output = {
  readonly shiftedValue: number;
  readonly discardedOneBits: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    signedInt32: { type: "integer", minimum: -2147483648, maximum: 2147483647 },
    shiftCount: { type: "integer", minimum: 0, maximum: 31 },
  },
  required: ["signedInt32", "shiftCount"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    shiftedValue: { type: "integer" },
    discardedOneBits: { type: "integer" },
  },
  required: ["shiftedValue", "discardedOneBits"],
} as const;
/** Apply an explicit 32-bit arithmetic right shift and count one bits removed from the low positions. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { signedInt32, shiftCount } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isSafeInteger(signedInt32) &&
        signedInt32 >= -2147483648 &&
        signedInt32 <= 2147483647,
      "signedInt32",
    ),
      signedInt32);
    (H.domain(
      Number.isSafeInteger(shiftCount) && shiftCount >= 0 && shiftCount <= 31,
      "shiftCount",
    ),
      shiftCount);
    return (() => {
      const mask = shiftCount === 0 ? 0 : 0xffffffff >>> (32 - shiftCount);
      let discarded = (signedInt32 >>> 0) & mask;
      let count = 0;
      while (discarded !== 0) {
        discarded &= discarded - 1;
        count++;
      }
      return {
        shiftedValue: signedInt32 >> shiftCount,
        discardedOneBits: count,
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { signedInt32: 13, shiftCount: 2 },
  output: { shiftedValue: 3, discardedOneBits: 1 },
} satisfies ToolExample<Input, Output>;
export const signedRightShiftDiscardedBitCountTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["bitwise", "bitwise operations", "computer science"],
      keywords: ["bitwise operations", "computer science"],
    },
    id: "bitwise/signed-right-shift-discarded-bit-count",
    title: "Signed Right Shift Discarded Bit Count",
    description:
      "Apply an explicit 32-bit arithmetic right shift and count one bits removed from the low positions.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        signedInt32: {
          type: "integer",
          minimum: -2147483648,
          maximum: 2147483647,
        },
        shiftCount: { type: "integer", minimum: 0, maximum: 31 },
      },
      required: ["signedInt32", "shiftCount"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        shiftedValue: { type: "integer" },
        discardedOneBits: { type: "integer" },
      },
      required: ["shiftedValue", "discardedOneBits"],
    },
    ports: {
      inputs: [
        {
          id: "signedInt32",
          label: "Signed Int32",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "shiftCount",
          label: "Shift Count",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "shiftedValue",
          label: "Shifted Value",
          valueType: { type: "integer" },
        },
        {
          id: "discardedOneBits",
          label: "Discarded One Bits",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = signedRightShiftDiscardedBitCountTool.execute;
export default signedRightShiftDiscardedBitCountTool;
