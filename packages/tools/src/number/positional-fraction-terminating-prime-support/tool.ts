import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly denominator: number; readonly radix: number };
export type Output = {
  readonly terminating: boolean;
  readonly remainingDenominator: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    denominator: { type: "integer", minimum: 1 },
    radix: { type: "integer", minimum: 2, maximum: 36 },
  },
  required: ["denominator", "radix"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    terminating: { type: "boolean" },
    remainingDenominator: { type: "integer" },
  },
  required: ["terminating", "remainingDenominator"],
} as const;
/** Calculate positional fraction terminating prime support from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { denominator, radix } = input;
  const compute = (): Output => {
    H.integer(denominator, 1);
    H.integer(radix, 2, 36);
    let d = denominator;
    const gcd = (a: number, b: number): number => {
      while (b) {
        const t = a % b;
        a = b;
        b = t;
      }
      return a;
    };
    let g = gcd(d, radix);
    while (g > 1) {
      d /= g;
      g = gcd(d, radix);
    }
    return { terminating: d === 1, remainingDenominator: d };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { denominator: 40, radix: 10 },
  output: { terminating: true, remainingDenominator: 1 },
} satisfies ToolExample<Input, Output>;
export const positionalFractionTerminatingPrimeSupportTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "number/positional-fraction-terminating-prime-support",
      title: "Positional Fraction Terminating Prime Support Tool",
      description:
        "Calculate positional fraction terminating prime support from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          denominator: { type: "integer", minimum: 1 },
          radix: { type: "integer", minimum: 2, maximum: 36 },
        },
        required: ["denominator", "radix"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          terminating: { type: "boolean" },
          remainingDenominator: { type: "integer" },
        },
        required: ["terminating", "remainingDenominator"],
      },
      ports: {
        inputs: [
          {
            id: "denominator",
            label: "Denominator",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "radix",
            label: "Radix",
            required: true,
            valueType: { type: "integer" },
          },
        ],
        outputs: [
          {
            id: "terminating",
            label: "Terminating",
            valueType: { type: "boolean" },
          },
          {
            id: "remainingDenominator",
            label: "Remaining Denominator",
            valueType: { type: "integer" },
          },
        ],
      },
    },
    calculate,
  });
export const run = positionalFractionTerminatingPrimeSupportTool.execute;
export default positionalFractionTerminatingPrimeSupportTool;
