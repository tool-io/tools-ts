import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly suppliedForwardDividend: number;
  readonly spotPrice: number;
};
export type Output = { readonly forwardDividendYieldFraction: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    suppliedForwardDividend: { type: "number", minimum: 0 },
    spotPrice: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["suppliedForwardDividend", "spotPrice"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { forwardDividendYieldFraction: { type: "number" } },
  required: ["forwardDividendYieldFraction"],
} as const;
/** Divide an explicitly supplied forward dividend amount by positive spot price on the same share and currency basis without forecasting dividends. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { suppliedForwardDividend, spotPrice } = request;
  const compute = (): Output => {
    H.domain(suppliedForwardDividend >= 0, "suppliedForwardDividend");
    (H.domain(Number.isFinite(spotPrice) && spotPrice > 0, "spotPrice"),
      spotPrice);
    return {
      forwardDividendYieldFraction: suppliedForwardDividend / spotPrice,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { suppliedForwardDividend: 4, spotPrice: 100 },
  output: { forwardDividendYieldFraction: 0.04 },
} satisfies ToolExample<Input, Output>;
export const dividendYieldForwardSpotUnitTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "financial-economics/dividend-yield-forward-spot-unit",
    title: "Dividend Yield Forward Spot Unit Tool",
    description:
      "Divide an explicitly supplied forward dividend amount by positive spot price on the same share and currency basis without forecasting dividends.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        suppliedForwardDividend: { type: "number", minimum: 0 },
        spotPrice: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["suppliedForwardDividend", "spotPrice"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { forwardDividendYieldFraction: { type: "number" } },
      required: ["forwardDividendYieldFraction"],
    },
    ports: {
      inputs: [
        {
          id: "suppliedForwardDividend",
          label: "Supplied Forward Dividend",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "spotPrice",
          label: "Spot Price",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "forwardDividendYieldFraction",
          label: "Forward Dividend Yield Fraction",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = dividendYieldForwardSpotUnitTool.execute;
export default dividendYieldForwardSpotUnitTool;
