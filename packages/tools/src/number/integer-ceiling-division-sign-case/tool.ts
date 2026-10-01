import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly numerator: string;
  readonly denominator: string;
};
export type Output = { readonly quotient: string; readonly remainder: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    numerator: { type: "string", maxLength: 8192 },
    denominator: { type: "string", maxLength: 8192 },
  },
  required: ["numerator", "denominator"],
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
/** Calculate integer ceiling division sign case from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { numerator, denominator } = request;
  const compute = (): Output => {
    const n = H.decimal(numerator),
      d = H.decimal(denominator);
    H.domain(d !== 0n);
    let q = n / d;
    if (n % d !== 0n && n < 0n === d < 0n) q++;
    return { quotient: String(q), remainder: String(n - q * d) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { numerator: "7", denominator: "3" },
  output: { quotient: "3", remainder: "-2" },
} satisfies ToolExample<Input, Output>;
export const integerCeilingDivisionSignCaseTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "number/integer-ceiling-division-sign-case",
    title: "Integer Ceiling Division Sign Case Tool",
    description:
      "Calculate integer ceiling division sign case from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        numerator: { type: "string", maxLength: 8192 },
        denominator: { type: "string", maxLength: 8192 },
      },
      required: ["numerator", "denominator"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        quotient: { type: "string", maxLength: 8192 },
        remainder: { type: "string", maxLength: 8192 },
      },
      required: ["quotient", "remainder"],
    },
    ports: {
      inputs: [
        {
          id: "numerator",
          label: "Numerator",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "denominator",
          label: "Denominator",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        { id: "quotient", label: "Quotient", valueType: { type: "string" } },
        { id: "remainder", label: "Remainder", valueType: { type: "string" } },
      ],
    },
  },
  calculate,
});
export const run = integerCeilingDivisionSignCaseTool.execute;
export default integerCeilingDivisionSignCaseTool;
