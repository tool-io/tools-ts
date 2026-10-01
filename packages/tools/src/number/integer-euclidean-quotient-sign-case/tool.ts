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
export type Output = { readonly quotient: string; readonly remainder: string };
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
    quotient: { type: "string", maxLength: 8192 },
    remainder: { type: "string", maxLength: 8192 },
  },
  required: ["quotient", "remainder"],
} as const;
/** Compute integer euclidean quotient sign case from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { dividend, divisor } = input;
  const compute = (): Output => {
    const a = decimal(dividend),
      b = decimal(divisor);
    domain(b !== 0n);
    const r = ((a % b) + (b < 0n ? -b : b)) % (b < 0n ? -b : b);
    return { quotient: ((a - r) / b).toString(), remainder: r.toString() };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { dividend: "-7", divisor: "3" },
  output: { quotient: "-3", remainder: "2" },
} satisfies ToolExample<Input, Output>;
export const integerEuclideanQuotientSignCaseTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "number/integer-euclidean-quotient-sign-case",
  title: "Integer Euclidean Quotient Sign Case Tool",
  description:
    "Compute integer euclidean quotient sign case from explicit bounded inputs.",
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
      { id: "quotient", label: "Quotient", valueType: { type: "string" } },
      { id: "remainder", label: "Remainder", valueType: { type: "string" } },
    ],
  },
});
export const run = integerEuclideanQuotientSignCaseTool.execute;
export default integerEuclideanQuotientSignCaseTool;
