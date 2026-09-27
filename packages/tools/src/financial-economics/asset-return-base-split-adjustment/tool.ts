import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly oldPrice: number;
  readonly newPrice: number;
  readonly newSharesPerOld: number;
  readonly dividendPerOld: number;
};
export type Output = {
  readonly adjustedReturn: number;
  readonly unadjustedReturn: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    oldPrice: { type: "number", exclusiveMinimum: 0 },
    newPrice: { type: "number", minimum: 0 },
    newSharesPerOld: { type: "number", exclusiveMinimum: 0 },
    dividendPerOld: { type: "number", minimum: 0 },
  },
  required: ["oldPrice", "newPrice", "newSharesPerOld", "dividendPerOld"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    adjustedReturn: { type: "number" },
    unadjustedReturn: { type: "number" },
  },
  required: ["adjustedReturn", "unadjustedReturn"],
} as const;
/** One-period supplied split/dividend return arithmetic without fetching prices or corporate actions. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { oldPrice, newPrice, newSharesPerOld, dividendPerOld } = request;
  const compute = (): Output => {
    H.positive(oldPrice);
    H.domain(newPrice >= 0 && dividendPerOld >= 0);
    H.positive(newSharesPerOld);
    return {
      adjustedReturn:
        (newPrice * newSharesPerOld + dividendPerOld) / oldPrice - 1,
      unadjustedReturn: newPrice / oldPrice - 1,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { oldPrice: 100, newPrice: 55, newSharesPerOld: 2, dividendPerOld: 0 },
  output: {
    adjustedReturn: 0.10000000000000009,
    unadjustedReturn: -0.44999999999999996,
  },
} satisfies ToolExample<Input, Output>;
export const assetReturnBaseSplitAdjustmentTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "financial-economics/asset-return-base-split-adjustment",
    title: "Asset Return Base Split Adjustment Tool",
    description:
      "One-period supplied split/dividend return arithmetic without fetching prices or corporate actions.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        oldPrice: { type: "number", exclusiveMinimum: 0 },
        newPrice: { type: "number", minimum: 0 },
        newSharesPerOld: { type: "number", exclusiveMinimum: 0 },
        dividendPerOld: { type: "number", minimum: 0 },
      },
      required: ["oldPrice", "newPrice", "newSharesPerOld", "dividendPerOld"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        adjustedReturn: { type: "number" },
        unadjustedReturn: { type: "number" },
      },
      required: ["adjustedReturn", "unadjustedReturn"],
    },
    ports: {
      inputs: [
        {
          id: "oldPrice",
          label: "Old Price",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "newPrice",
          label: "New Price",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "newSharesPerOld",
          label: "New Shares Per Old",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "dividendPerOld",
          label: "Dividend Per Old",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "adjustedReturn",
          label: "Adjusted Return",
          valueType: { type: "number" },
        },
        {
          id: "unadjustedReturn",
          label: "Unadjusted Return",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = assetReturnBaseSplitAdjustmentTool.execute;
export default assetReturnBaseSplitAdjustmentTool;
