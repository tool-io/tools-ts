import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly fractionDigits: string;
  readonly zeroDigit: string;
};
export type Output = {
  readonly leadingZeroDigits: number;
  readonly remainingDigits: string;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    fractionDigits: { type: "string", maxLength: 8192 },
    zeroDigit: { type: "string", maxLength: 8192 },
  },
  required: ["fractionDigits", "zeroDigit"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    leadingZeroDigits: { type: "integer" },
    remainingDigits: { type: "string", maxLength: 8192 },
  },
  required: ["leadingZeroDigits", "remainingDigits"],
} as const;
/** Count an explicit fractional digit string leading run of a supplied zero symbol without interpreting its radix. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { fractionDigits, zeroDigit } = request;
  const compute = (): Output => {
    return (() => {
      H.domain(Array.from(zeroDigit).length === 1, "zeroDigit");
      const digits = Array.from(fractionDigits);
      let leadingZeroDigits = 0;
      while (
        leadingZeroDigits < digits.length &&
        digits[leadingZeroDigits] === zeroDigit
      )
        leadingZeroDigits++;
      return {
        leadingZeroDigits,
        remainingDigits: digits.slice(leadingZeroDigits).join(""),
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { fractionDigits: "000AB", zeroDigit: "0" },
  output: { leadingZeroDigits: 3, remainingDigits: "AB" },
} satisfies ToolExample<Input, Output>;
export const radixFractionLeadingZeroBudgetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["number", "mathematics"],
      keywords: ["number", "mathematics"],
    },
    id: "number/radix-fraction-leading-zero-budget",
    title: "Radix Fraction Leading Zero Budget",
    description:
      "Count an explicit fractional digit string leading run of a supplied zero symbol without interpreting its radix.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        fractionDigits: { type: "string", maxLength: 8192 },
        zeroDigit: { type: "string", maxLength: 8192 },
      },
      required: ["fractionDigits", "zeroDigit"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        leadingZeroDigits: { type: "integer" },
        remainingDigits: { type: "string", maxLength: 8192 },
      },
      required: ["leadingZeroDigits", "remainingDigits"],
    },
    ports: {
      inputs: [
        {
          id: "fractionDigits",
          label: "Fraction Digits",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "zeroDigit",
          label: "Zero Digit",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "leadingZeroDigits",
          label: "Leading Zero Digits",
          valueType: { type: "integer" },
        },
        {
          id: "remainingDigits",
          label: "Remaining Digits",
          valueType: { type: "string" },
        },
      ],
    },
  },
  calculate,
});
export const run = radixFractionLeadingZeroBudgetTool.execute;
export default radixFractionLeadingZeroBudgetTool;
