import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly priceBefore: number;
  readonly priceAfter: number;
  readonly cashDividend: number;
  readonly includedFraction: number;
};
export type Output = {
  readonly priceReturn: number;
  readonly includedDividendReturn: number;
  readonly totalReturn: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    priceBefore: { type: "number", exclusiveMinimum: 0 },
    priceAfter: { type: "number", minimum: 0 },
    cashDividend: { type: "number", minimum: 0 },
    includedFraction: { type: "number", minimum: 0, maximum: 1 },
  },
  required: ["priceBefore", "priceAfter", "cashDividend", "includedFraction"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    priceReturn: { type: "number" },
    includedDividendReturn: { type: "number" },
    totalReturn: { type: "number" },
  },
  required: ["priceReturn", "includedDividendReturn", "totalReturn"],
} as const;
/** Calculate exdividend return window share from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { priceBefore, priceAfter, cashDividend, includedFraction } = request;
  const compute = (): Output => {
    H.positive(priceBefore);
    H.domain(priceAfter >= 0 && cashDividend >= 0);
    H.probability(includedFraction);
    return {
      priceReturn: (priceAfter - priceBefore) / priceBefore,
      includedDividendReturn: (cashDividend / priceBefore) * includedFraction,
      totalReturn:
        (priceAfter - priceBefore) / priceBefore +
        (cashDividend / priceBefore) * includedFraction,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    priceBefore: 100,
    priceAfter: 98,
    cashDividend: 3,
    includedFraction: 1,
  },
  output: {
    priceReturn: -0.02,
    includedDividendReturn: 0.03,
    totalReturn: 0.009999999999999998,
  },
} satisfies ToolExample<Input, Output>;
export const exdividendReturnWindowShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "financial-economics/exdividend-return-window-share",
    title: "Exdividend Return Window Share Tool",
    description:
      "Calculate exdividend return window share from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        priceBefore: { type: "number", exclusiveMinimum: 0 },
        priceAfter: { type: "number", minimum: 0 },
        cashDividend: { type: "number", minimum: 0 },
        includedFraction: { type: "number", minimum: 0, maximum: 1 },
      },
      required: [
        "priceBefore",
        "priceAfter",
        "cashDividend",
        "includedFraction",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        priceReturn: { type: "number" },
        includedDividendReturn: { type: "number" },
        totalReturn: { type: "number" },
      },
      required: ["priceReturn", "includedDividendReturn", "totalReturn"],
    },
    ports: {
      inputs: [
        {
          id: "priceBefore",
          label: "Price Before",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "priceAfter",
          label: "Price After",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "cashDividend",
          label: "Cash Dividend",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "includedFraction",
          label: "Included Fraction",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "priceReturn",
          label: "Price Return",
          valueType: { type: "number" },
        },
        {
          id: "includedDividendReturn",
          label: "Included Dividend Return",
          valueType: { type: "number" },
        },
        {
          id: "totalReturn",
          label: "Total Return",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = exdividendReturnWindowShareTool.execute;
export default exdividendReturnWindowShareTool;
