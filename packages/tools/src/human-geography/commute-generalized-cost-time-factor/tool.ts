import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly fare: number;
  readonly travelMinutes: number;
  readonly waitMinutes: number;
  readonly wagePerHour: number;
  readonly waitWeight: number;
};
export type Output = {
  readonly valuedMinutes: number;
  readonly timeCost: number;
  readonly generalizedCost: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    fare: { type: "number", minimum: 0 },
    travelMinutes: { type: "number", minimum: 0 },
    waitMinutes: { type: "number", minimum: 0 },
    wagePerHour: { type: "number", minimum: 0 },
    waitWeight: { type: "number", minimum: 0 },
  },
  required: [
    "fare",
    "travelMinutes",
    "waitMinutes",
    "wagePerHour",
    "waitWeight",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    valuedMinutes: { type: "number" },
    timeCost: { type: "number" },
    generalizedCost: { type: "number" },
  },
  required: ["valuedMinutes", "timeCost", "generalizedCost"],
} as const;
/** Caller-weighted generalized commute cost; wage and waiting-time weights are explicit valuation assumptions. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { fare, travelMinutes, waitMinutes, wagePerHour, waitWeight } = request;
  const compute = (): Output => {
    H.domain(
      fare >= 0 &&
        travelMinutes >= 0 &&
        waitMinutes >= 0 &&
        wagePerHour >= 0 &&
        waitWeight >= 0,
    );
    return {
      valuedMinutes: travelMinutes + waitMinutes * waitWeight,
      timeCost: ((travelMinutes + waitMinutes * waitWeight) * wagePerHour) / 60,
      generalizedCost:
        fare + ((travelMinutes + waitMinutes * waitWeight) * wagePerHour) / 60,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    fare: 5,
    travelMinutes: 30,
    waitMinutes: 10,
    wagePerHour: 20,
    waitWeight: 2,
  },
  output: {
    valuedMinutes: 50,
    timeCost: 16.666666666666668,
    generalizedCost: 21.666666666666668,
  },
} satisfies ToolExample<Input, Output>;
export const commuteGeneralizedCostTimeFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "human-geography/commute-generalized-cost-time-factor",
    title: "Commute Generalized Cost Time Factor Tool",
    description:
      "Caller-weighted generalized commute cost; wage and waiting-time weights are explicit valuation assumptions.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        fare: { type: "number", minimum: 0 },
        travelMinutes: { type: "number", minimum: 0 },
        waitMinutes: { type: "number", minimum: 0 },
        wagePerHour: { type: "number", minimum: 0 },
        waitWeight: { type: "number", minimum: 0 },
      },
      required: [
        "fare",
        "travelMinutes",
        "waitMinutes",
        "wagePerHour",
        "waitWeight",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        valuedMinutes: { type: "number" },
        timeCost: { type: "number" },
        generalizedCost: { type: "number" },
      },
      required: ["valuedMinutes", "timeCost", "generalizedCost"],
    },
    ports: {
      inputs: [
        {
          id: "fare",
          label: "Fare",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "travelMinutes",
          label: "Travel Minutes",
          required: true,
          valueType: { type: "number", unit: "min" },
        },
        {
          id: "waitMinutes",
          label: "Wait Minutes",
          required: true,
          valueType: { type: "number", unit: "min" },
        },
        {
          id: "wagePerHour",
          label: "Wage Per Hour",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "waitWeight",
          label: "Wait Weight",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "valuedMinutes",
          label: "Valued Minutes",
          valueType: { type: "number", unit: "min" },
        },
        { id: "timeCost", label: "Time Cost", valueType: { type: "number" } },
        {
          id: "generalizedCost",
          label: "Generalized Cost",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = commuteGeneralizedCostTimeFactorTool.execute;
export default commuteGeneralizedCostTimeFactorTool;
