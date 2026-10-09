import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly queueMinutes: number;
  readonly suppliedValuePerHour: number;
};
export type Output = { readonly valuedQueueCost: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    queueMinutes: { type: "number", minimum: 0 },
    suppliedValuePerHour: { type: "number", minimum: 0 },
  },
  required: ["queueMinutes", "suppliedValuePerHour"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { valuedQueueCost: { type: "number" } },
  required: ["valuedQueueCost"],
} as const;
/** Value an explicit queue duration at a supplied hourly rate without choosing a social valuation. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { queueMinutes, suppliedValuePerHour } = request;
  const compute = (): Output => {
    H.domain(queueMinutes >= 0 && suppliedValuePerHour >= 0, "queueMinutes");
    return { valuedQueueCost: (queueMinutes / 60) * suppliedValuePerHour };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { queueMinutes: 45, suppliedValuePerHour: 12 },
  output: { valuedQueueCost: 9 },
} satisfies ToolExample<Input, Output>;
export const foodAccessQueueTimeCostTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["cost", "learn"],
      fields: ["food-security", "food security", "agriculture"],
      keywords: ["food security", "agriculture"],
    },
    id: "food-security/food-access-queue-time-cost",
    title: "Food Access Queue Time Cost",
    description:
      "Value an explicit queue duration at a supplied hourly rate without choosing a social valuation.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        queueMinutes: { type: "number", minimum: 0 },
        suppliedValuePerHour: { type: "number", minimum: 0 },
      },
      required: ["queueMinutes", "suppliedValuePerHour"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { valuedQueueCost: { type: "number" } },
      required: ["valuedQueueCost"],
    },
    ports: {
      inputs: [
        {
          id: "queueMinutes",
          label: "Queue Minutes",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedValuePerHour",
          label: "Supplied Value Per Hour",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "valuedQueueCost",
          label: "Valued Queue Cost",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = foodAccessQueueTimeCostTool.execute;
export default foodAccessQueueTimeCostTool;
