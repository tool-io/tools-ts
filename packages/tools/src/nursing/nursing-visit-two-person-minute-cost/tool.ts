import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstMinutes: number;
  readonly secondMinutes: number;
  readonly firstHourlyCost: number;
  readonly secondHourlyCost: number;
  readonly sharedFixedCost: number;
};
export type Output = {
  readonly personMinutes: number;
  readonly laborCost: number;
  readonly totalCost: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstMinutes: { type: "number", minimum: 0 },
    secondMinutes: { type: "number", minimum: 0 },
    firstHourlyCost: { type: "number", minimum: 0 },
    secondHourlyCost: { type: "number", minimum: 0 },
    sharedFixedCost: { type: "number", minimum: 0 },
  },
  required: [
    "firstMinutes",
    "secondMinutes",
    "firstHourlyCost",
    "secondHourlyCost",
    "sharedFixedCost",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    personMinutes: { type: "number" },
    laborCost: { type: "number" },
    totalCost: { type: "number" },
  },
  required: ["personMinutes", "laborCost", "totalCost"],
} as const;
/** Total supplied person-minute labor and shared fixed cost for one visit. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    firstMinutes,
    secondMinutes,
    firstHourlyCost,
    secondHourlyCost,
    sharedFixedCost,
  } = request;
  const compute = (): Output => {
    H.domain(
      firstMinutes >= 0 &&
        secondMinutes >= 0 &&
        firstHourlyCost >= 0 &&
        secondHourlyCost >= 0 &&
        sharedFixedCost >= 0,
    );
    return {
      personMinutes: firstMinutes + secondMinutes,
      laborCost:
        (firstMinutes * firstHourlyCost + secondMinutes * secondHourlyCost) /
        60,
      totalCost:
        (firstMinutes * firstHourlyCost + secondMinutes * secondHourlyCost) /
          60 +
        sharedFixedCost,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    firstMinutes: 30,
    secondMinutes: 20,
    firstHourlyCost: 60,
    secondHourlyCost: 90,
    sharedFixedCost: 10,
  },
  output: { personMinutes: 50, laborCost: 60, totalCost: 70 },
} satisfies ToolExample<Input, Output>;
export const nursingVisitTwoPersonMinuteCostTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "nursing/nursing-visit-two-person-minute-cost",
    title: "Nursing Visit Two Person Minute Cost Tool",
    description:
      "Total supplied person-minute labor and shared fixed cost for one visit.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstMinutes: { type: "number", minimum: 0 },
        secondMinutes: { type: "number", minimum: 0 },
        firstHourlyCost: { type: "number", minimum: 0 },
        secondHourlyCost: { type: "number", minimum: 0 },
        sharedFixedCost: { type: "number", minimum: 0 },
      },
      required: [
        "firstMinutes",
        "secondMinutes",
        "firstHourlyCost",
        "secondHourlyCost",
        "sharedFixedCost",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        personMinutes: { type: "number" },
        laborCost: { type: "number" },
        totalCost: { type: "number" },
      },
      required: ["personMinutes", "laborCost", "totalCost"],
    },
    ports: {
      inputs: [
        {
          id: "firstMinutes",
          label: "First Minutes",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "secondMinutes",
          label: "Second Minutes",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "firstHourlyCost",
          label: "First Hourly Cost",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "secondHourlyCost",
          label: "Second Hourly Cost",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "sharedFixedCost",
          label: "Shared Fixed Cost",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "personMinutes",
          label: "Person Minutes",
          valueType: { type: "number" },
        },
        { id: "laborCost", label: "Labor Cost", valueType: { type: "number" } },
        { id: "totalCost", label: "Total Cost", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = nursingVisitTwoPersonMinuteCostTool.execute;
export default nursingVisitTwoPersonMinuteCostTool;
