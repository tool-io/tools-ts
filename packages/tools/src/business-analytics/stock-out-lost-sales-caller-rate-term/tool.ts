import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly stockoutHours: number;
  readonly expectedUnitsPerHour: number;
  readonly substitutionFraction: number;
  readonly unitContribution: number;
};
export type Output = {
  readonly grossLostUnits: number;
  readonly netLostUnits: number;
  readonly lostContribution: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    stockoutHours: { type: "number", minimum: 0 },
    expectedUnitsPerHour: { type: "number", minimum: 0 },
    substitutionFraction: { type: "number", minimum: 0, maximum: 1 },
    unitContribution: { type: "number" },
  },
  required: [
    "stockoutHours",
    "expectedUnitsPerHour",
    "substitutionFraction",
    "unitContribution",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    grossLostUnits: { type: "number" },
    netLostUnits: { type: "number" },
    lostContribution: { type: "number" },
  },
  required: ["grossLostUnits", "netLostUnits", "lostContribution"],
} as const;
/** Caller-supplied counterfactual demand and substitution assumptions; no causal lost-sales estimate is learned from observations. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    stockoutHours,
    expectedUnitsPerHour,
    substitutionFraction,
    unitContribution,
  } = request;
  const compute = (): Output => {
    H.domain(stockoutHours >= 0 && expectedUnitsPerHour >= 0);
    H.probability(substitutionFraction);
    return {
      grossLostUnits: stockoutHours * expectedUnitsPerHour,
      netLostUnits:
        stockoutHours * expectedUnitsPerHour * (1 - substitutionFraction),
      lostContribution:
        stockoutHours *
        expectedUnitsPerHour *
        (1 - substitutionFraction) *
        unitContribution,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    stockoutHours: 5,
    expectedUnitsPerHour: 10,
    substitutionFraction: 0.2,
    unitContribution: 3,
  },
  output: { grossLostUnits: 50, netLostUnits: 40, lostContribution: 120 },
} satisfies ToolExample<Input, Output>;
export const stockOutLostSalesCallerRateTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "business-analytics/stock-out-lost-sales-caller-rate-term",
    title: "Stock Out Lost Sales Caller Rate Term Tool",
    description:
      "Caller-supplied counterfactual demand and substitution assumptions; no causal lost-sales estimate is learned from observations.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        stockoutHours: { type: "number", minimum: 0 },
        expectedUnitsPerHour: { type: "number", minimum: 0 },
        substitutionFraction: { type: "number", minimum: 0, maximum: 1 },
        unitContribution: { type: "number" },
      },
      required: [
        "stockoutHours",
        "expectedUnitsPerHour",
        "substitutionFraction",
        "unitContribution",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        grossLostUnits: { type: "number" },
        netLostUnits: { type: "number" },
        lostContribution: { type: "number" },
      },
      required: ["grossLostUnits", "netLostUnits", "lostContribution"],
    },
    ports: {
      inputs: [
        {
          id: "stockoutHours",
          label: "Stockout Hours",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "expectedUnitsPerHour",
          label: "Expected Units Per Hour",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "substitutionFraction",
          label: "Substitution Fraction",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "unitContribution",
          label: "Unit Contribution",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "grossLostUnits",
          label: "Gross Lost Units",
          valueType: { type: "number" },
        },
        {
          id: "netLostUnits",
          label: "Net Lost Units",
          valueType: { type: "number" },
        },
        {
          id: "lostContribution",
          label: "Lost Contribution",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = stockOutLostSalesCallerRateTermTool.execute;
export default stockOutLostSalesCallerRateTermTool;
