import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly contractPricePerEnergy: number;
  readonly referencePricePerEnergy: number;
  readonly settledEnergy: number;
};
export type Output = {
  readonly priceDifference: number;
  readonly settlementAmount: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    contractPricePerEnergy: { type: "number" },
    referencePricePerEnergy: { type: "number" },
    settledEnergy: { type: "number", minimum: 0 },
  },
  required: [
    "contractPricePerEnergy",
    "referencePricePerEnergy",
    "settledEnergy",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    priceDifference: { type: "number" },
    settlementAmount: { type: "number" },
  },
  required: ["priceDifference", "settlementAmount"],
} as const;
/** Compute a signed contract-minus-reference PPA settlement leg for explicitly supplied energy, without selecting contract payment direction or other terms. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { contractPricePerEnergy, referencePricePerEnergy, settledEnergy } =
    request;
  const compute = (): Output => {
    H.domain(settledEnergy >= 0, "settledEnergy");
    return {
      priceDifference: contractPricePerEnergy - referencePricePerEnergy,
      settlementAmount:
        (contractPricePerEnergy - referencePricePerEnergy) * settledEnergy,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    contractPricePerEnergy: 60,
    referencePricePerEnergy: 50,
    settledEnergy: 100,
  },
  output: { priceDifference: 10, settlementAmount: 1000 },
} satisfies ToolExample<Input, Output>;
export const ppaSettlementPriceDifferenceTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["energy-economics", "energy economics", "economics"],
      keywords: ["energy economics", "economics"],
    },
    id: "energy-economics/ppa-settlement-price-difference",
    title: "PPA Settlement Price Difference",
    description:
      "Compute a signed contract-minus-reference PPA settlement leg for explicitly supplied energy, without selecting contract payment direction or other terms.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        contractPricePerEnergy: { type: "number" },
        referencePricePerEnergy: { type: "number" },
        settledEnergy: { type: "number", minimum: 0 },
      },
      required: [
        "contractPricePerEnergy",
        "referencePricePerEnergy",
        "settledEnergy",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        priceDifference: { type: "number" },
        settlementAmount: { type: "number" },
      },
      required: ["priceDifference", "settlementAmount"],
    },
    ports: {
      inputs: [
        {
          id: "contractPricePerEnergy",
          label: "Contract Price Per Energy",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "referencePricePerEnergy",
          label: "Reference Price Per Energy",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "settledEnergy",
          label: "Settled Energy",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "priceDifference",
          label: "Price Difference",
          valueType: { type: "number" },
        },
        {
          id: "settlementAmount",
          label: "Settlement Amount",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = ppaSettlementPriceDifferenceTool.execute;
export default ppaSettlementPriceDifferenceTool;
