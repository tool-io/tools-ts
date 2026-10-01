import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly value: number;
  readonly radix: number;
  readonly preserveNegativeZero: boolean;
};
export type Output = {
  readonly formatted: string;
  readonly negativeZero: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    value: { type: "number" },
    radix: { type: "integer", minimum: 2, maximum: 36 },
    preserveNegativeZero: { type: "boolean" },
  },
  required: ["value", "radix", "preserveNegativeZero"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    formatted: { type: "string", maxLength: 8192 },
    negativeZero: { type: "boolean" },
  },
  required: ["formatted", "negativeZero"],
} as const;
/** Format a safe integer in radix 2–36 with an explicit direct-call negative-zero policy. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { value, radix, preserveNegativeZero } = request;
  const compute = (): Output => {
    H.domain(Number.isSafeInteger(value));
    H.integer(radix, 2, 36);
    const negativeZero = Object.is(value, -0);
    return {
      formatted:
        negativeZero && preserveNegativeZero ? "-0" : value.toString(radix),
      negativeZero,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { value: 0, radix: 10, preserveNegativeZero: false },
  output: { formatted: "0", negativeZero: false },
} satisfies ToolExample<Input, Output>;
export const integerRadixNegativeZeroPolicyTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "number/integer-radix-negative-zero-policy",
    title: "Integer Radix Negative Zero Policy Tool",
    description:
      "Format a safe integer in radix 2–36 with an explicit direct-call negative-zero policy.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        value: { type: "number" },
        radix: { type: "integer", minimum: 2, maximum: 36 },
        preserveNegativeZero: { type: "boolean" },
      },
      required: ["value", "radix", "preserveNegativeZero"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        formatted: { type: "string", maxLength: 8192 },
        negativeZero: { type: "boolean" },
      },
      required: ["formatted", "negativeZero"],
    },
    ports: {
      inputs: [
        {
          id: "value",
          label: "Value",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "radix",
          label: "Radix",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "preserveNegativeZero",
          label: "Preserve Negative Zero",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        { id: "formatted", label: "Formatted", valueType: { type: "string" } },
        {
          id: "negativeZero",
          label: "Negative Zero",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = integerRadixNegativeZeroPolicyTool.execute;
export default integerRadixNegativeZeroPolicyTool;
