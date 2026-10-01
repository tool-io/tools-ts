import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly base: number;
  readonly numerator: number;
  readonly denominator: number;
};
export type Output = {
  readonly realDefined: boolean;
  readonly negativeResult: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    base: { type: "number" },
    numerator: { type: "integer" },
    denominator: { type: "integer", minimum: 1 },
  },
  required: ["base", "numerator", "denominator"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    realDefined: { type: "boolean" },
    negativeResult: { type: "boolean" },
  },
  required: ["realDefined", "negativeResult"],
} as const;
/** Calculate rational power sign domain flag from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { base, numerator, denominator } = input;
  const compute = (): Output => {
    H.integer(denominator, 1);
    let a = Math.abs(numerator),
      b = denominator;
    while (b) {
      const t = a % b;
      a = b;
      b = t;
    }
    const p = numerator / a,
      q = denominator / a;
    const realDefined =
      base > 0 || (base === 0 && numerator > 0) || (base < 0 && q % 2 === 1);
    return {
      realDefined,
      negativeResult: realDefined && base < 0 && p % 2 !== 0,
    };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { base: -8, numerator: 1, denominator: 3 },
  output: { realDefined: true, negativeResult: true },
} satisfies ToolExample<Input, Output>;
export const rationalPowerSignDomainFlagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "number/rational-power-sign-domain-flag",
    title: "Rational Power Sign Domain Flag Tool",
    description:
      "Calculate rational power sign domain flag from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        base: { type: "number" },
        numerator: { type: "integer" },
        denominator: { type: "integer", minimum: 1 },
      },
      required: ["base", "numerator", "denominator"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        realDefined: { type: "boolean" },
        negativeResult: { type: "boolean" },
      },
      required: ["realDefined", "negativeResult"],
    },
    ports: {
      inputs: [
        {
          id: "base",
          label: "Base",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "numerator",
          label: "Numerator",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "denominator",
          label: "Denominator",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "realDefined",
          label: "Real Defined",
          valueType: { type: "boolean" },
        },
        {
          id: "negativeResult",
          label: "Negative Result",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = rationalPowerSignDomainFlagTool.execute;
export default rationalPowerSignDomainFlagTool;
