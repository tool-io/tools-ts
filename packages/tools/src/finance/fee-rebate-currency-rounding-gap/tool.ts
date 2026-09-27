import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly feeMinor: number;
  readonly rebateMinor: number;
  readonly conversion: number;
  readonly roundedNetMinor: number;
};
export type Output = {
  readonly exactNetMinor: number;
  readonly gapMinor: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    feeMinor: { type: "integer" },
    rebateMinor: { type: "integer" },
    conversion: { type: "number", exclusiveMinimum: 0 },
    roundedNetMinor: { type: "integer" },
  },
  required: ["feeMinor", "rebateMinor", "conversion", "roundedNetMinor"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    exactNetMinor: { type: "number" },
    gapMinor: { type: "number" },
  },
  required: ["exactNetMinor", "gapMinor"],
} as const;
/** Measure a supplied currency-rounding result against exact converted net fees in minor units. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { feeMinor, rebateMinor, conversion, roundedNetMinor } = input;
  const compute = (): Output => {
    H.positive(conversion);
    const exactNetMinor = (feeMinor - rebateMinor) * conversion;
    return { exactNetMinor, gapMinor: roundedNetMinor - exactNetMinor };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: {
    feeMinor: 100,
    rebateMinor: 25,
    conversion: 1.5,
    roundedNetMinor: 113,
  },
  output: { exactNetMinor: 112.5, gapMinor: 0.5 },
} satisfies ToolExample<Input, Output>;
export const feeRebateCurrencyRoundingGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "finance/fee-rebate-currency-rounding-gap",
    title: "Fee Rebate Currency Rounding Gap Tool",
    description:
      "Measure a supplied currency-rounding result against exact converted net fees in minor units.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        feeMinor: { type: "integer" },
        rebateMinor: { type: "integer" },
        conversion: { type: "number", exclusiveMinimum: 0 },
        roundedNetMinor: { type: "integer" },
      },
      required: ["feeMinor", "rebateMinor", "conversion", "roundedNetMinor"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        exactNetMinor: { type: "number" },
        gapMinor: { type: "number" },
      },
      required: ["exactNetMinor", "gapMinor"],
    },
    ports: {
      inputs: [
        {
          id: "feeMinor",
          label: "Fee Minor",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "rebateMinor",
          label: "Rebate Minor",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "conversion",
          label: "Conversion",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "roundedNetMinor",
          label: "Rounded Net Minor",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "exactNetMinor",
          label: "Exact Net Minor",
          valueType: { type: "number" },
        },
        { id: "gapMinor", label: "Gap Minor", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = feeRebateCurrencyRoundingGapTool.execute;
export default feeRebateCurrencyRoundingGapTool;
