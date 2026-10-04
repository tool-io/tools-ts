import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly digits: string;
  readonly firstIndex: number;
  readonly secondIndex: number;
};
export type Output = {
  readonly swapped: string;
  readonly originalValid: boolean;
  readonly swappedValid: boolean;
  readonly undetected: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    digits: { type: "string", maxLength: 8192 },
    firstIndex: { type: "integer", minimum: 0, maximum: 12 },
    secondIndex: { type: "integer", minimum: 0, maximum: 12 },
  },
  required: ["digits", "firstIndex", "secondIndex"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    swapped: { type: "string", maxLength: 8192 },
    originalValid: { type: "boolean" },
    swappedValid: { type: "boolean" },
    undetected: { type: "boolean" },
  },
  required: ["swapped", "originalValid", "swappedValid", "undetected"],
} as const;
/** Witness checksum detection for an ISBN-13 digit transposition; registration and prefix allocation are not checked. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { digits, firstIndex, secondIndex } = request;
  const compute = (): Output => {
    H.domain(/^\d{13}(?![\s\S])/.test(digits));
    H.integer(firstIndex, 0, 12);
    H.integer(secondIndex, 0, 12);
    H.domain(firstIndex !== secondIndex);
    const a = digits.split("");
    [a[firstIndex], a[secondIndex]] = [a[secondIndex], a[firstIndex]];
    const swapped = a.join(""),
      valid = (s: string) =>
        [...s].reduce(
          (sum, c, i) => sum + Number(c) * (i % 2 === 0 ? 1 : 3),
          0,
        ) %
          10 ===
        0,
      originalValid = valid(digits),
      swappedValid = valid(swapped);
    return {
      swapped,
      originalValid,
      swappedValid,
      undetected: originalValid && swappedValid && swapped !== digits,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { digits: "9780306406157", firstIndex: 2, secondIndex: 3 },
  output: {
    swapped: "9708306406157",
    originalValid: true,
    swappedValid: false,
    undetected: false,
  },
} satisfies ToolExample<Input, Output>;
export const isbnCheckDigitTranspositionWitnessTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "validate/isbn-check-digit-transposition-witness",
    title: "ISBN Check Digit Transposition Witness Tool",
    description:
      "Witness checksum detection for an ISBN-13 digit transposition; registration and prefix allocation are not checked.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        digits: { type: "string", maxLength: 8192 },
        firstIndex: { type: "integer", minimum: 0, maximum: 12 },
        secondIndex: { type: "integer", minimum: 0, maximum: 12 },
      },
      required: ["digits", "firstIndex", "secondIndex"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        swapped: { type: "string", maxLength: 8192 },
        originalValid: { type: "boolean" },
        swappedValid: { type: "boolean" },
        undetected: { type: "boolean" },
      },
      required: ["swapped", "originalValid", "swappedValid", "undetected"],
    },
    ports: {
      inputs: [
        {
          id: "digits",
          label: "Digits",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "firstIndex",
          label: "First Index",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "secondIndex",
          label: "Second Index",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "swapped", label: "Swapped", valueType: { type: "string" } },
        {
          id: "originalValid",
          label: "Original Valid",
          valueType: { type: "boolean" },
        },
        {
          id: "swappedValid",
          label: "Swapped Valid",
          valueType: { type: "boolean" },
        },
        {
          id: "undetected",
          label: "Undetected",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = isbnCheckDigitTranspositionWitnessTool.execute;
export default isbnCheckDigitTranspositionWitnessTool;
