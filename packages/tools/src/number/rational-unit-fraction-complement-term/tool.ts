import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  domain,
  decimal,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = { readonly denominator: string };
export type Output = {
  readonly numerator: string;
  readonly denominator: string;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { denominator: { type: "string", maxLength: 8192 } },
  required: ["denominator"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    numerator: { type: "string", maxLength: 8192 },
    denominator: { type: "string", maxLength: 8192 },
  },
  required: ["numerator", "denominator"],
} as const;
/** Compute rational unit fraction complement term from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { denominator } = input;
  const compute = (): Output => {
    const n = decimal(denominator);
    domain(n > 0n);
    return { numerator: (n - 1n).toString(), denominator: n.toString() };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { denominator: "5" },
  output: { numerator: "4", denominator: "5" },
} satisfies ToolExample<Input, Output>;
export const rationalUnitFractionComplementTermTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "number/rational-unit-fraction-complement-term",
  title: "Rational Unit Fraction Complement Term Tool",
  description:
    "Compute rational unit fraction complement term from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "denominator",
        label: "Denominator",
        required: true,
        valueType: { type: "string" },
      },
    ],
    outputs: [
      { id: "numerator", label: "Numerator", valueType: { type: "string" } },
      {
        id: "denominator",
        label: "Denominator",
        valueType: { type: "string" },
      },
    ],
  },
});
export const run = rationalUnitFractionComplementTermTool.execute;
export default rationalUnitFractionComplementTermTool;
