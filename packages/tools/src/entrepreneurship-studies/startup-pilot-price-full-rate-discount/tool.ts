import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly fullUnitPrice: number;
  readonly pilotUnits: number;
  readonly pilotFee: number;
  readonly setupFee: number;
};
export type Output = {
  readonly fullEquivalent: number;
  readonly discountFraction: number;
  readonly realizedUnitPrice: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    fullUnitPrice: { type: "number", exclusiveMinimum: 0 },
    pilotUnits: { type: "number", exclusiveMinimum: 0 },
    pilotFee: { type: "number" },
    setupFee: { type: "number", minimum: 0 },
  },
  required: ["fullUnitPrice", "pilotUnits", "pilotFee", "setupFee"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    fullEquivalent: { type: "number" },
    discountFraction: { type: "number" },
    realizedUnitPrice: { type: "number" },
  },
  required: ["fullEquivalent", "discountFraction", "realizedUnitPrice"],
} as const;
/** Calculate startup pilot price full rate discount from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { fullUnitPrice, pilotUnits, pilotFee, setupFee } = request;
  const compute = (): Output => {
    H.positive(fullUnitPrice);
    H.positive(pilotUnits);
    H.domain(pilotFee >= setupFee && setupFee >= 0);
    return {
      fullEquivalent: fullUnitPrice * pilotUnits,
      discountFraction:
        1 - (pilotFee - setupFee) / (fullUnitPrice * pilotUnits),
      realizedUnitPrice: (pilotFee - setupFee) / pilotUnits,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { fullUnitPrice: 100, pilotUnits: 20, pilotFee: 1500, setupFee: 100 },
  output: {
    fullEquivalent: 2000,
    discountFraction: 0.30000000000000004,
    realizedUnitPrice: 70,
  },
} satisfies ToolExample<Input, Output>;
export const startupPilotPriceFullRateDiscountTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "entrepreneurship-studies/startup-pilot-price-full-rate-discount",
    title: "Startup Pilot Price Full Rate Discount Tool",
    description:
      "Calculate startup pilot price full rate discount from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        fullUnitPrice: { type: "number", exclusiveMinimum: 0 },
        pilotUnits: { type: "number", exclusiveMinimum: 0 },
        pilotFee: { type: "number" },
        setupFee: { type: "number", minimum: 0 },
      },
      required: ["fullUnitPrice", "pilotUnits", "pilotFee", "setupFee"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        fullEquivalent: { type: "number" },
        discountFraction: { type: "number" },
        realizedUnitPrice: { type: "number" },
      },
      required: ["fullEquivalent", "discountFraction", "realizedUnitPrice"],
    },
    ports: {
      inputs: [
        {
          id: "fullUnitPrice",
          label: "Full Unit Price",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "pilotUnits",
          label: "Pilot Units",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "pilotFee",
          label: "Pilot Fee",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "setupFee",
          label: "Setup Fee",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "fullEquivalent",
          label: "Full Equivalent",
          valueType: { type: "number" },
        },
        {
          id: "discountFraction",
          label: "Discount Fraction",
          valueType: { type: "number" },
        },
        {
          id: "realizedUnitPrice",
          label: "Realized Unit Price",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = startupPilotPriceFullRateDiscountTool.execute;
export default startupPilotPriceFullRateDiscountTool;
