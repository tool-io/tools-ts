import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly multiplicity: number; readonly divisor: number };
export type Output = { readonly quotient: number; readonly remainder: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    multiplicity: { type: "integer", minimum: 0 },
    divisor: { type: "integer", minimum: 1 },
  },
  required: ["multiplicity", "divisor"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { quotient: { type: "integer" }, remainder: { type: "integer" } },
  required: ["quotient", "remainder"],
} as const;
/** Calculate multiset quotient remainder one key from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { multiplicity, divisor } = request;
  const compute = (): Output => {
    H.integer(multiplicity, 0);
    H.integer(divisor, 1);
    return {
      quotient: Number(BigInt(multiplicity) / BigInt(divisor)),
      remainder: Number(BigInt(multiplicity) % BigInt(divisor)),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { multiplicity: 17, divisor: 5 },
  output: { quotient: 3, remainder: 2 },
} satisfies ToolExample<Input, Output>;
export const multisetQuotientRemainderOneKeyTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "set/multiset-quotient-remainder-one-key",
    title: "Multiset Quotient Remainder One Key Tool",
    description:
      "Calculate multiset quotient remainder one key from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        multiplicity: { type: "integer", minimum: 0 },
        divisor: { type: "integer", minimum: 1 },
      },
      required: ["multiplicity", "divisor"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        quotient: { type: "integer" },
        remainder: { type: "integer" },
      },
      required: ["quotient", "remainder"],
    },
    ports: {
      inputs: [
        {
          id: "multiplicity",
          label: "Multiplicity",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "divisor",
          label: "Divisor",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "quotient", label: "Quotient", valueType: { type: "integer" } },
        { id: "remainder", label: "Remainder", valueType: { type: "integer" } },
      ],
    },
  },
  calculate,
});
export const run = multisetQuotientRemainderOneKeyTool.execute;
export default multisetQuotientRemainderOneKeyTool;
