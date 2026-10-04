import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly activity: number;
  readonly suppliedFactor: number;
  readonly allocationShare: number;
};
export type Output = {
  readonly grossInventory: number;
  readonly allocatedInventory: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    activity: { type: "number", minimum: 0 },
    suppliedFactor: { type: "number" },
    allocationShare: { type: "number", minimum: 0, maximum: 1 },
  },
  required: ["activity", "suppliedFactor", "allocationShare"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    grossInventory: { type: "number" },
    allocatedInventory: { type: "number" },
  },
  required: ["grossInventory", "allocatedInventory"],
} as const;
/** One explicitly supplied inventory factor, without choosing an emissions methodology. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { activity, suppliedFactor, allocationShare } = request;
  const compute = (): Output => {
    H.domain(activity >= 0);
    H.probability(allocationShare);
    return {
      grossInventory: activity * suppliedFactor,
      allocatedInventory: activity * suppliedFactor * allocationShare,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { activity: 100, suppliedFactor: 2.5, allocationShare: 0.4 },
  output: { grossInventory: 250, allocatedInventory: 100 },
} satisfies ToolExample<Input, Output>;
export const farmEmissionFactorOneActivityTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "sustainable-agriculture/farm-emission-factor-one-activity-term",
    title: "Farm Emission Factor One Activity Term Tool",
    description:
      "One explicitly supplied inventory factor, without choosing an emissions methodology.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        activity: { type: "number", minimum: 0 },
        suppliedFactor: { type: "number" },
        allocationShare: { type: "number", minimum: 0, maximum: 1 },
      },
      required: ["activity", "suppliedFactor", "allocationShare"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        grossInventory: { type: "number" },
        allocatedInventory: { type: "number" },
      },
      required: ["grossInventory", "allocatedInventory"],
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
          id: "suppliedFactor",
          label: "Supplied Factor",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "allocationShare",
          label: "Allocation Share",
          required: true,
          valueType: { type: "number", unit: "1" },
        },
      ],
      outputs: [
        {
          id: "grossInventory",
          label: "Gross Inventory",
          valueType: { type: "number" },
        },
        {
          id: "allocatedInventory",
          label: "Allocated Inventory",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = farmEmissionFactorOneActivityTermTool.execute;
export default farmEmissionFactorOneActivityTermTool;
