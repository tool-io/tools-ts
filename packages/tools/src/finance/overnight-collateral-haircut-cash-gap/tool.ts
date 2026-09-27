import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly marketValue: number;
  readonly haircut: number;
  readonly cashRequired: number;
};
export type Output = {
  readonly eligibleValue: number;
  readonly shortfall: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    marketValue: { type: "number", minimum: 0 },
    haircut: { type: "number", minimum: 0, maximum: 1 },
    cashRequired: { type: "number", minimum: 0 },
  },
  required: ["marketValue", "haircut", "cashRequired"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    eligibleValue: { type: "number" },
    shortfall: { type: "number" },
  },
  required: ["eligibleValue", "shortfall"],
} as const;
/** Calculate overnight collateral haircut cash gap from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { marketValue, haircut, cashRequired } = request;
  const compute = (): Output => {
    H.domain(marketValue >= 0 && cashRequired >= 0);
    H.probability(haircut);
    const eligibleValue = marketValue * (1 - haircut);
    return {
      eligibleValue,
      shortfall: Math.max(0, cashRequired - eligibleValue),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { marketValue: 1000, haircut: 0.1, cashRequired: 950 },
  output: { eligibleValue: 900, shortfall: 50 },
} satisfies ToolExample<Input, Output>;
export const overnightCollateralHaircutCashGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "finance/overnight-collateral-haircut-cash-gap",
    title: "Overnight Collateral Haircut Cash Gap Tool",
    description:
      "Calculate overnight collateral haircut cash gap from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        marketValue: { type: "number", minimum: 0 },
        haircut: { type: "number", minimum: 0, maximum: 1 },
        cashRequired: { type: "number", minimum: 0 },
      },
      required: ["marketValue", "haircut", "cashRequired"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        eligibleValue: { type: "number" },
        shortfall: { type: "number" },
      },
      required: ["eligibleValue", "shortfall"],
    },
    ports: {
      inputs: [
        {
          id: "marketValue",
          label: "Market Value",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "haircut",
          label: "Haircut",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "cashRequired",
          label: "Cash Required",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "eligibleValue",
          label: "Eligible Value",
          valueType: { type: "number" },
        },
        { id: "shortfall", label: "Shortfall", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = overnightCollateralHaircutCashGapTool.execute;
export default overnightCollateralHaircutCashGapTool;
