import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly left: number;
  readonly right: number;
  readonly mask: number;
  readonly width: number;
};
export type Output = {
  readonly agreeingBits: number;
  readonly comparedBits: number;
  readonly allAgree: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    left: { type: "integer" },
    right: { type: "integer" },
    mask: { type: "integer" },
    width: { type: "integer", minimum: 1, maximum: 52 },
  },
  required: ["left", "right", "mask", "width"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    agreeingBits: { type: "integer" },
    comparedBits: { type: "integer" },
    allAgree: { type: "boolean" },
  },
  required: ["agreeingBits", "comparedBits", "allAgree"],
} as const;
/** Calculate masked bit agreement from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { left, right, mask, width } = request;
  const compute = (): Output => {
    H.integer(width, 1, 52);
    const limit = 2n ** BigInt(width);
    H.domain([left, right, mask].every((x) => x >= 0 && BigInt(x) < limit));
    const a = BigInt(left),
      b = BigInt(right),
      s = BigInt(mask);
    let comparedBits = 0,
      agreeingBits = 0;
    for (let i = 0n; i < BigInt(width); i++)
      if ((s >> i) & 1n) {
        comparedBits++;
        if (((a >> i) & 1n) === ((b >> i) & 1n)) agreeingBits++;
      }
    return {
      agreeingBits,
      comparedBits,
      allAgree: agreeingBits === comparedBits,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { left: 10, right: 14, mask: 15, width: 4 },
  output: { agreeingBits: 3, comparedBits: 4, allAgree: false },
} satisfies ToolExample<Input, Output>;
export const maskedBitAgreementTool = H.defineSchemaCalculation<Input, Output>({
  ...{
    id: "bitwise/masked-bit-agreement",
    title: "Masked Bit Agreement Tool",
    description:
      "Calculate masked bit agreement from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        left: { type: "integer" },
        right: { type: "integer" },
        mask: { type: "integer" },
        width: { type: "integer", minimum: 1, maximum: 52 },
      },
      required: ["left", "right", "mask", "width"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        agreeingBits: { type: "integer" },
        comparedBits: { type: "integer" },
        allAgree: { type: "boolean" },
      },
      required: ["agreeingBits", "comparedBits", "allAgree"],
    },
    ports: {
      inputs: [
        {
          id: "left",
          label: "Left",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "right",
          label: "Right",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "mask",
          label: "Mask",
          required: true,
          valueType: { type: "integer" },
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
          id: "agreeingBits",
          label: "Agreeing Bits",
          valueType: { type: "integer" },
        },
        {
          id: "comparedBits",
          label: "Compared Bits",
          valueType: { type: "integer" },
        },
        { id: "allAgree", label: "All Agree", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = maskedBitAgreementTool.execute;
export default maskedBitAgreementTool;
