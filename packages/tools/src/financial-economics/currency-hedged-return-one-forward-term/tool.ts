import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly foreignAssetReturn: number;
  readonly spotStart: number;
  readonly spotEnd: number;
  readonly forwardRate: number;
  readonly hedgeFraction: number;
};
export type Output = {
  readonly unhedgedDomesticReturn: number;
  readonly hedgeContribution: number;
  readonly hedgedReturn: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    foreignAssetReturn: { type: "number", minimum: -1 },
    spotStart: { type: "number", exclusiveMinimum: 0 },
    spotEnd: { type: "number", exclusiveMinimum: 0 },
    forwardRate: { type: "number", exclusiveMinimum: 0 },
    hedgeFraction: { type: "number", minimum: 0 },
  },
  required: [
    "foreignAssetReturn",
    "spotStart",
    "spotEnd",
    "forwardRate",
    "hedgeFraction",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    unhedgedDomesticReturn: { type: "number" },
    hedgeContribution: { type: "number" },
    hedgedReturn: { type: "number" },
  },
  required: ["unhedgedDomesticReturn", "hedgeContribution", "hedgedReturn"],
} as const;
/** Sell a fraction of initial foreign principal forward, domestic-per-foreign quotes; asset gains are not automatically rehedged. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { foreignAssetReturn, spotStart, spotEnd, forwardRate, hedgeFraction } =
    request;
  const compute = (): Output => {
    H.domain(foreignAssetReturn >= -1 && hedgeFraction >= 0);
    H.positive(spotStart);
    H.positive(spotEnd);
    H.positive(forwardRate);
    return {
      unhedgedDomesticReturn:
        ((1 + foreignAssetReturn) * spotEnd) / spotStart - 1,
      hedgeContribution: (hedgeFraction * (forwardRate - spotEnd)) / spotStart,
      hedgedReturn:
        ((1 + foreignAssetReturn) * spotEnd) / spotStart -
        1 +
        (hedgeFraction * (forwardRate - spotEnd)) / spotStart,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    foreignAssetReturn: 0.1,
    spotStart: 2,
    spotEnd: 1.8,
    forwardRate: 2,
    hedgeFraction: 1,
  },
  output: {
    unhedgedDomesticReturn: -0.009999999999999898,
    hedgeContribution: 0.09999999999999998,
    hedgedReturn: 0.09000000000000008,
  },
} satisfies ToolExample<Input, Output>;
export const currencyHedgedReturnOneForwardTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "financial-economics/currency-hedged-return-one-forward-term",
    title: "Currency Hedged Return One Forward Term Tool",
    description:
      "Sell a fraction of initial foreign principal forward, domestic-per-foreign quotes; asset gains are not automatically rehedged.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        foreignAssetReturn: { type: "number", minimum: -1 },
        spotStart: { type: "number", exclusiveMinimum: 0 },
        spotEnd: { type: "number", exclusiveMinimum: 0 },
        forwardRate: { type: "number", exclusiveMinimum: 0 },
        hedgeFraction: { type: "number", minimum: 0 },
      },
      required: [
        "foreignAssetReturn",
        "spotStart",
        "spotEnd",
        "forwardRate",
        "hedgeFraction",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        unhedgedDomesticReturn: { type: "number" },
        hedgeContribution: { type: "number" },
        hedgedReturn: { type: "number" },
      },
      required: ["unhedgedDomesticReturn", "hedgeContribution", "hedgedReturn"],
    },
    ports: {
      inputs: [
        {
          id: "foreignAssetReturn",
          label: "Foreign Asset Return",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "spotStart",
          label: "Spot Start",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "spotEnd",
          label: "Spot End",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "forwardRate",
          label: "Forward Rate",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "hedgeFraction",
          label: "Hedge Fraction",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "unhedgedDomesticReturn",
          label: "Unhedged Domestic Return",
          valueType: { type: "number" },
        },
        {
          id: "hedgeContribution",
          label: "Hedge Contribution",
          valueType: { type: "number" },
        },
        {
          id: "hedgedReturn",
          label: "Hedged Return",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = currencyHedgedReturnOneForwardTermTool.execute;
export default currencyHedgedReturnOneForwardTermTool;
