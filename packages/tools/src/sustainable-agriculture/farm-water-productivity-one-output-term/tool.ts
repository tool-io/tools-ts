import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly edibleOutput: number;
  readonly withdrawnWater: number;
  readonly returnedWater: number;
};
export type Output = {
  readonly withdrawalProductivity: number;
  readonly consumptiveProductivity: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    edibleOutput: { type: "number", minimum: 0 },
    withdrawnWater: { type: "number" },
    returnedWater: { type: "number", minimum: 0 },
  },
  required: ["edibleOutput", "withdrawnWater", "returnedWater"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    withdrawalProductivity: { type: "number" },
    consumptiveProductivity: { type: "number" },
  },
  required: ["withdrawalProductivity", "consumptiveProductivity"],
} as const;
/** Calculate farm water productivity one output term from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { edibleOutput, withdrawnWater, returnedWater } = request;
  const compute = (): Output => {
    H.domain(
      edibleOutput >= 0 && withdrawnWater > returnedWater && returnedWater >= 0,
    );
    return {
      withdrawalProductivity: edibleOutput / withdrawnWater,
      consumptiveProductivity: edibleOutput / (withdrawnWater - returnedWater),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { edibleOutput: 200, withdrawnWater: 100, returnedWater: 20 },
  output: { withdrawalProductivity: 2, consumptiveProductivity: 2.5 },
} satisfies ToolExample<Input, Output>;
export const farmWaterProductivityOneOutputTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "sustainable-agriculture/farm-water-productivity-one-output-term",
    title: "Farm Water Productivity One Output Term Tool",
    description:
      "Calculate farm water productivity one output term from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        edibleOutput: { type: "number", minimum: 0 },
        withdrawnWater: { type: "number" },
        returnedWater: { type: "number", minimum: 0 },
      },
      required: ["edibleOutput", "withdrawnWater", "returnedWater"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        withdrawalProductivity: { type: "number" },
        consumptiveProductivity: { type: "number" },
      },
      required: ["withdrawalProductivity", "consumptiveProductivity"],
    },
    ports: {
      inputs: [
        {
          id: "edibleOutput",
          label: "Edible Output",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "withdrawnWater",
          label: "Withdrawn Water",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "returnedWater",
          label: "Returned Water",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "withdrawalProductivity",
          label: "Withdrawal Productivity",
          valueType: { type: "number" },
        },
        {
          id: "consumptiveProductivity",
          label: "Consumptive Productivity",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = farmWaterProductivityOneOutputTermTool.execute;
export default farmWaterProductivityOneOutputTermTool;
