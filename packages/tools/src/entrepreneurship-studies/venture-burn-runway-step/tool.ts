import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly openingCash: number;
  readonly cashReceipts: number;
  readonly cashPayments: number;
  readonly expectedMonthlyBurn: number;
};
export type Output = {
  readonly closingCash: number;
  readonly runwayMonths: number;
  readonly runwayDefined: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    openingCash: { type: "number", minimum: 0 },
    cashReceipts: { type: "number", minimum: 0 },
    cashPayments: { type: "number", minimum: 0 },
    expectedMonthlyBurn: { type: "number", minimum: 0 },
  },
  required: [
    "openingCash",
    "cashReceipts",
    "cashPayments",
    "expectedMonthlyBurn",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    closingCash: { type: "number" },
    runwayMonths: { type: "number" },
    runwayDefined: { type: "boolean" },
  },
  required: ["closingCash", "runwayMonths", "runwayDefined"],
} as const;
/** Update an explicit cash balance and constant-burn runway, reporting undefined runway separately when supplied burn is zero. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { openingCash, cashReceipts, cashPayments, expectedMonthlyBurn } =
    request;
  const compute = (): Output => {
    H.domain(
      openingCash >= 0 &&
        cashReceipts >= 0 &&
        cashPayments >= 0 &&
        expectedMonthlyBurn >= 0,
      "openingCash",
    );
    return (() => {
      const closingCash = openingCash + cashReceipts - cashPayments;
      return {
        closingCash,
        runwayMonths:
          expectedMonthlyBurn > 0
            ? Math.max(0, closingCash) / expectedMonthlyBurn
            : 0,
        runwayDefined: expectedMonthlyBurn > 0,
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    openingCash: 100000,
    cashReceipts: 20000,
    cashPayments: 30000,
    expectedMonthlyBurn: 15000,
  },
  output: { closingCash: 90000, runwayMonths: 6, runwayDefined: true },
} satisfies ToolExample<Input, Output>;
export const ventureBurnRunwayStepTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: [
        "entrepreneurship-studies",
        "entrepreneurship studies",
        "business and finance",
      ],
      keywords: ["entrepreneurship studies", "business and finance"],
    },
    id: "entrepreneurship-studies/venture-burn-runway-step",
    title: "Venture Burn Runway Step",
    description:
      "Update an explicit cash balance and constant-burn runway, reporting undefined runway separately when supplied burn is zero.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        openingCash: { type: "number", minimum: 0 },
        cashReceipts: { type: "number", minimum: 0 },
        cashPayments: { type: "number", minimum: 0 },
        expectedMonthlyBurn: { type: "number", minimum: 0 },
      },
      required: [
        "openingCash",
        "cashReceipts",
        "cashPayments",
        "expectedMonthlyBurn",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        closingCash: { type: "number" },
        runwayMonths: { type: "number" },
        runwayDefined: { type: "boolean" },
      },
      required: ["closingCash", "runwayMonths", "runwayDefined"],
    },
    ports: {
      inputs: [
        {
          id: "openingCash",
          label: "Opening Cash",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "cashReceipts",
          label: "Cash Receipts",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "cashPayments",
          label: "Cash Payments",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "expectedMonthlyBurn",
          label: "Expected Monthly Burn",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "closingCash",
          label: "Closing Cash",
          valueType: { type: "number" },
        },
        {
          id: "runwayMonths",
          label: "Runway Months",
          valueType: { type: "number" },
        },
        {
          id: "runwayDefined",
          label: "Runway Defined",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = ventureBurnRunwayStepTool.execute;
export default ventureBurnRunwayStepTool;
