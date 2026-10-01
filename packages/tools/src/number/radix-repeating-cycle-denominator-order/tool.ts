import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly denominator: number; readonly radix: number };
export type Output = { readonly period: number; readonly terminating: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    denominator: { type: "integer", minimum: 1, maximum: 10000 },
    radix: { type: "integer", minimum: 2, maximum: 36 },
  },
  required: ["denominator", "radix"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { period: { type: "integer" }, terminating: { type: "boolean" } },
  required: ["period", "terminating"],
} as const;
/** Find the repeating period of 1/denominator after removing factors shared with the radix. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { denominator, radix } = request;
  const compute = (): Output => {
    H.integer(denominator, 1, 10000);
    H.integer(radix, 2, 36);
    let d = denominator;
    const gcd = (a: number, b: number): number => {
      while (b) {
        const r = a % b;
        a = b;
        b = r;
      }
      return a;
    };
    let g = gcd(d, radix);
    while (g > 1) {
      d /= g;
      g = gcd(d, radix);
    }
    if (d === 1) return { period: 0, terminating: true };
    let r = radix % d,
      period = 1;
    while (r !== 1) {
      r = (r * radix) % d;
      period++;
    }
    return { period, terminating: false };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { denominator: 7, radix: 10 },
  output: { period: 6, terminating: false },
} satisfies ToolExample<Input, Output>;
export const radixRepeatingCycleDenominatorOrderTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "number/radix-repeating-cycle-denominator-order",
      title: "Radix Repeating Cycle Denominator Order Tool",
      description:
        "Find the repeating period of 1/denominator after removing factors shared with the radix.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          denominator: { type: "integer", minimum: 1, maximum: 10000 },
          radix: { type: "integer", minimum: 2, maximum: 36 },
        },
        required: ["denominator", "radix"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          period: { type: "integer" },
          terminating: { type: "boolean" },
        },
        required: ["period", "terminating"],
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
          { id: "period", label: "Period", valueType: { type: "integer" } },
          {
            id: "terminating",
            label: "Terminating",
            valueType: { type: "boolean" },
          },
        ],
      },
    },
    calculate,
  });
export const run = radixRepeatingCycleDenominatorOrderTool.execute;
export default radixRepeatingCycleDenominatorOrderTool;
