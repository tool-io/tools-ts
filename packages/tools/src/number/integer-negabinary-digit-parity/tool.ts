import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly integer: string };
export type Output = {
  readonly digitCount: number;
  readonly ones: number;
  readonly parity: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    integer: { type: "string", maxLength: 8192, format: "integer-decimal" },
  },
  required: ["integer"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    digitCount: { type: "integer" },
    ones: { type: "integer" },
    parity: { type: "integer" },
  },
  required: ["digitCount", "ones", "parity"],
} as const;
/** Count the ones and digit length in the canonical base −2 expansion, including one zero digit for zero. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { integer } = request;
  const compute = (): Output => {
    let n = H.decimal(integer),
      ones = 0,
      digitCount = 0;
    do {
      let r = n % -2n;
      n /= -2n;
      if (r < 0n) {
        r += 2n;
        n++;
      }
      ones += Number(r);
      digitCount++;
    } while (n !== 0n);
    return { digitCount, ones, parity: ones % 2 };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { integer: "-3" },
  output: { digitCount: 4, ones: 3, parity: 1 },
} satisfies ToolExample<Input, Output>;
export const integerNegabinaryDigitParityTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "number/integer-negabinary-digit-parity",
    title: "Integer Negabinary Digit Parity Tool",
    description:
      "Count the ones and digit length in the canonical base −2 expansion, including one zero digit for zero.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        integer: { type: "string", maxLength: 8192, format: "integer-decimal" },
      },
      required: ["integer"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        digitCount: { type: "integer" },
        ones: { type: "integer" },
        parity: { type: "integer" },
      },
      required: ["digitCount", "ones", "parity"],
    },
    ports: {
      inputs: [
        {
          id: "integer",
          label: "Integer",
          required: true,
          valueType: { type: "string", format: "integer-decimal" },
        },
      ],
      outputs: [
        {
          id: "digitCount",
          label: "Digit Count",
          valueType: { type: "integer" },
        },
        { id: "ones", label: "Ones", valueType: { type: "integer" } },
        { id: "parity", label: "Parity", valueType: { type: "integer" } },
      ],
    },
  },
  calculate,
});
export const run = integerNegabinaryDigitParityTool.execute;
export default integerNegabinaryDigitParityTool;
