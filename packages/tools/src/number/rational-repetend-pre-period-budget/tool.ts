import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly denominator: number; readonly radix: number };
export type Output = {
  readonly prePeriod: number;
  readonly remainingDenominator: number;
  readonly terminates: boolean;
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
    prePeriod: { type: "integer" },
    remainingDenominator: { type: "integer" },
    terminates: { type: "boolean" },
  },
  required: ["prePeriod", "remainingDenominator", "terminates"],
} as const;
/** Nonrepeating prefix length for a reduced rational denominator in the supplied radix; numerator must already be coprime. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { denominator, radix } = request;
  const compute = (): Output => {
    H.integer(denominator, 1);
    H.integer(radix, 2, 36);
    let d = BigInt(denominator),
      prePeriod = 0;
    const b = BigInt(radix),
      gcd = (x: bigint, y: bigint): bigint => {
        while (y !== 0n) {
          const r = x % y;
          x = y;
          y = r;
        }
        return x;
      };
    while (true) {
      const g = gcd(d, b);
      if (g === 1n) break;
      d /= g;
      prePeriod++;
    }
    return { prePeriod, remainingDenominator: Number(d), terminates: d === 1n };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { denominator: 12, radix: 10 },
  output: { prePeriod: 2, remainingDenominator: 3, terminates: false },
} satisfies ToolExample<Input, Output>;
export const rationalRepetendPrePeriodBudgetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "number/rational-repetend-pre-period-budget",
    title: "Rational Repetend Pre Period Budget Tool",
    description:
      "Nonrepeating prefix length for a reduced rational denominator in the supplied radix; numerator must already be coprime.",
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
        prePeriod: { type: "integer" },
        remainingDenominator: { type: "integer" },
        terminates: { type: "boolean" },
      },
      required: ["prePeriod", "remainingDenominator", "terminates"],
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
          id: "prePeriod",
          label: "Pre Period",
          valueType: { type: "integer" },
        },
        {
          id: "remainingDenominator",
          label: "Remaining Denominator",
          valueType: { type: "integer" },
        },
        {
          id: "terminates",
          label: "Terminates",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = rationalRepetendPrePeriodBudgetTool.execute;
export default rationalRepetendPrePeriodBudgetTool;
