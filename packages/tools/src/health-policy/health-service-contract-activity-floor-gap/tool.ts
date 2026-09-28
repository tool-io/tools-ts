import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly activity: number;
  readonly floor: number;
  readonly ceiling: number;
  readonly unitPrice: number;
  readonly fixedPayment: number;
};
export type Output = {
  readonly belowFloor: number;
  readonly aboveCeiling: number;
  readonly payableActivity: number;
  readonly totalPayment: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    activity: { type: "number", minimum: 0 },
    floor: { type: "number", minimum: 0 },
    ceiling: { type: "number" },
    unitPrice: { type: "number", minimum: 0 },
    fixedPayment: { type: "number" },
  },
  required: ["activity", "floor", "ceiling", "unitPrice", "fixedPayment"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    belowFloor: { type: "number" },
    aboveCeiling: { type: "number" },
    payableActivity: { type: "number" },
    totalPayment: { type: "number" },
  },
  required: ["belowFloor", "aboveCeiling", "payableActivity", "totalPayment"],
} as const;
/** Apply supplied contract activity floor/ceiling arithmetic. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { activity, floor, ceiling, unitPrice, fixedPayment } = request;
  const compute = (): Output => {
    H.domain(activity >= 0 && floor >= 0 && ceiling >= floor && unitPrice >= 0);
    return {
      belowFloor: Math.max(0, floor - activity),
      aboveCeiling: Math.max(0, activity - ceiling),
      payableActivity: Math.max(floor, Math.min(ceiling, activity)),
      totalPayment:
        fixedPayment + Math.max(floor, Math.min(ceiling, activity)) * unitPrice,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    activity: 80,
    floor: 100,
    ceiling: 200,
    unitPrice: 5,
    fixedPayment: 20,
  },
  output: {
    belowFloor: 20,
    aboveCeiling: 0,
    payableActivity: 100,
    totalPayment: 520,
  },
} satisfies ToolExample<Input, Output>;
export const healthServiceContractActivityFloorGapTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "health-policy/health-service-contract-activity-floor-gap",
      title: "Health Service Contract Activity Floor Gap Tool",
      description: "Apply supplied contract activity floor/ceiling arithmetic.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          activity: { type: "number", minimum: 0 },
          floor: { type: "number", minimum: 0 },
          ceiling: { type: "number" },
          unitPrice: { type: "number", minimum: 0 },
          fixedPayment: { type: "number" },
        },
        required: ["activity", "floor", "ceiling", "unitPrice", "fixedPayment"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          belowFloor: { type: "number" },
          aboveCeiling: { type: "number" },
          payableActivity: { type: "number" },
          totalPayment: { type: "number" },
        },
        required: [
          "belowFloor",
          "aboveCeiling",
          "payableActivity",
          "totalPayment",
        ],
      },
      ports: {
        inputs: [
          {
            id: "activity",
            label: "Activity",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "floor",
            label: "Floor",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "ceiling",
            label: "Ceiling",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "unitPrice",
            label: "Unit Price",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "fixedPayment",
            label: "Fixed Payment",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "belowFloor",
            label: "Below Floor",
            valueType: { type: "number" },
          },
          {
            id: "aboveCeiling",
            label: "Above Ceiling",
            valueType: { type: "number" },
          },
          {
            id: "payableActivity",
            label: "Payable Activity",
            valueType: { type: "number" },
          },
          {
            id: "totalPayment",
            label: "Total Payment",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = healthServiceContractActivityFloorGapTool.execute;
export default healthServiceContractActivityFloorGapTool;
