import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  domain,
  decimal,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = { readonly dividend: string; readonly divisor: string };
export type Output = {
  readonly remainder: string;
  readonly quotientTerm: string;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    dividend: { type: "string", maxLength: 8192 },
    divisor: { type: "string", maxLength: 8192 },
  },
  required: ["dividend", "divisor"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    remainder: { type: "string", maxLength: 8192 },
    quotientTerm: { type: "string", maxLength: 8192 },
  },
  required: ["remainder", "quotientTerm"],
} as const;
/** Compute carryless division leading cancellation step from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { dividend, divisor } = input;
  const compute = (): Output => {
    const a = decimal(dividend),
      b = decimal(divisor);
    domain(a >= 0n && b > 0n && a < 1n << 128n && b < 1n << 128n);
    const shift = a === 0n ? -1 : a.toString(2).length - b.toString(2).length;
    return {
      remainder: (shift < 0 ? a : a ^ (b << BigInt(shift))).toString(),
      quotientTerm: (shift < 0 ? 0n : 1n << BigInt(shift)).toString(),
    };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { dividend: "13", divisor: "3" },
  output: { remainder: "1", quotientTerm: "4" },
} satisfies ToolExample<Input, Output>;
export const carrylessDivisionLeadingCancellationStepTool =
  defineSchemaCalculation<Input, Output>({
    id: "bitwise/carryless-division-leading-cancellation-step",
    title: "Carryless Division Leading Cancellation Step Tool",
    description:
      "Compute carryless division leading cancellation step from explicit bounded inputs.",
    calculate,
    inputSchema,
    outputSchema,
    ports: {
      inputs: [
        {
          id: "dividend",
          label: "Dividend",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "divisor",
          label: "Divisor",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        { id: "remainder", label: "Remainder", valueType: { type: "string" } },
        {
          id: "quotientTerm",
          label: "Quotient Term",
          valueType: { type: "string" },
        },
      ],
    },
  });
export const run = carrylessDivisionLeadingCancellationStepTool.execute;
export default carrylessDivisionLeadingCancellationStepTool;
