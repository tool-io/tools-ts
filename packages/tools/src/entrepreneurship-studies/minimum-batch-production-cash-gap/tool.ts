import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly cashAvailable: number;
  readonly minimumBatchUnits: number;
  readonly variableCostPerUnit: number;
  readonly setupCashCost: number;
};
export type Output = {
  readonly requiredCash: number;
  readonly cashGap: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    cashAvailable: { type: "number", minimum: 0 },
    minimumBatchUnits: { type: "integer", minimum: 0 },
    variableCostPerUnit: { type: "number", minimum: 0 },
    setupCashCost: { type: "number", minimum: 0 },
  },
  required: [
    "cashAvailable",
    "minimumBatchUnits",
    "variableCostPerUnit",
    "setupCashCost",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { requiredCash: { type: "number" }, cashGap: { type: "number" } },
  required: ["requiredCash", "cashGap"],
} as const;
/** Reconcile explicit minimum-batch variable and setup cash requirements against available cash without a production feasibility forecast. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    cashAvailable,
    minimumBatchUnits,
    variableCostPerUnit,
    setupCashCost,
  } = request;
  const compute = (): Output => {
    H.domain(cashAvailable >= 0, "cashAvailable");
    (H.domain(
      Number.isSafeInteger(minimumBatchUnits) &&
        minimumBatchUnits >= 0 &&
        minimumBatchUnits <= Number.MAX_SAFE_INTEGER,
      "minimumBatchUnits",
    ),
      minimumBatchUnits);
    H.domain(variableCostPerUnit >= 0, "variableCostPerUnit");
    H.domain(setupCashCost >= 0, "setupCashCost");
    return {
      requiredCash: minimumBatchUnits * variableCostPerUnit + setupCashCost,
      cashGap:
        cashAvailable - minimumBatchUnits * variableCostPerUnit - setupCashCost,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    cashAvailable: 1000,
    minimumBatchUnits: 100,
    variableCostPerUnit: 8,
    setupCashCost: 300,
  },
  output: { requiredCash: 1100, cashGap: -100 },
} satisfies ToolExample<Input, Output>;
export const minimumBatchProductionCashGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "entrepreneurship-studies/minimum-batch-production-cash-gap",
    title: "Minimum Batch Production Cash Gap Tool",
    description:
      "Reconcile explicit minimum-batch variable and setup cash requirements against available cash without a production feasibility forecast.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        cashAvailable: { type: "number", minimum: 0 },
        minimumBatchUnits: { type: "integer", minimum: 0 },
        variableCostPerUnit: { type: "number", minimum: 0 },
        setupCashCost: { type: "number", minimum: 0 },
      },
      required: [
        "cashAvailable",
        "minimumBatchUnits",
        "variableCostPerUnit",
        "setupCashCost",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        requiredCash: { type: "number" },
        cashGap: { type: "number" },
      },
      required: ["requiredCash", "cashGap"],
    },
    ports: {
      inputs: [
        {
          id: "cashAvailable",
          label: "Cash Available",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "minimumBatchUnits",
          label: "Minimum Batch Units",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "variableCostPerUnit",
          label: "Variable Cost Per Unit",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "setupCashCost",
          label: "Setup Cash Cost",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "requiredCash",
          label: "Required Cash",
          valueType: { type: "number" },
        },
        { id: "cashGap", label: "Cash Gap", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = minimumBatchProductionCashGapTool.execute;
export default minimumBatchProductionCashGapTool;
