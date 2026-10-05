import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly integerDecimal: string };
export type Output = { readonly lastDigit: number; readonly parity: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    integerDecimal: {
      type: "string",
      maxLength: 8192,
      format: "integer-decimal",
    },
  },
  required: ["integerDecimal"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    lastDigit: { type: "integer" },
    parity: { type: "string", maxLength: 8192 },
  },
  required: ["lastDigit", "parity"],
} as const;
/** Use the final decimal magnitude digit as an exact parity witness for a bounded arbitrary-precision integer. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { integerDecimal } = request;
  const compute = (): Output => {
    const n = H.decimal(integerDecimal),
      a = n < 0n ? -n : n,
      lastDigit = Number(a % 10n);
    return { lastDigit, parity: lastDigit % 2 === 0 ? "even" : "odd" };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { integerDecimal: "-123456789123456789" },
  output: { lastDigit: 9, parity: "odd" },
} satisfies ToolExample<Input, Output>;
export const integerParityLastDigitWitnessTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "number/integer-parity-last-digit-witness",
    title: "Integer Parity Last Digit Witness Tool",
    description:
      "Use the final decimal magnitude digit as an exact parity witness for a bounded arbitrary-precision integer.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        integerDecimal: {
          type: "string",
          maxLength: 8192,
          format: "integer-decimal",
        },
      },
      required: ["integerDecimal"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        lastDigit: { type: "integer" },
        parity: { type: "string", maxLength: 8192 },
      },
      required: ["lastDigit", "parity"],
    },
    ports: {
      inputs: [
        {
          id: "integerDecimal",
          label: "Integer Decimal",
          required: true,
          valueType: { type: "string", format: "integer-decimal" },
        },
      ],
      outputs: [
        {
          id: "lastDigit",
          label: "Last Digit",
          valueType: { type: "integer" },
        },
        { id: "parity", label: "Parity", valueType: { type: "string" } },
      ],
    },
  },
  calculate,
});
export const run = integerParityLastDigitWitnessTool.execute;
export default integerParityLastDigitWitnessTool;
