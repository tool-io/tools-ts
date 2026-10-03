import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly baseRent: number;
  readonly stepAmount: number;
  readonly completedSteps: number;
};
export type Output = {
  readonly newRent: number;
  readonly totalIncrease: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    baseRent: { type: "number", minimum: 0 },
    stepAmount: { type: "number", minimum: 0 },
    completedSteps: { type: "integer", minimum: 0 },
  },
  required: ["baseRent", "stepAmount", "completedSteps"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    newRent: { type: "number" },
    totalIncrease: { type: "number" },
  },
  required: ["newRent", "totalIncrease"],
} as const;
/** Calculate ground lease rent step delta from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { baseRent, stepAmount, completedSteps } = request;
  const compute = (): Output => {
    H.domain(baseRent >= 0 && stepAmount >= 0);
    H.integer(completedSteps, 0);
    return {
      newRent: baseRent + stepAmount * completedSteps,
      totalIncrease: stepAmount * completedSteps,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { baseRent: 1000, stepAmount: 100, completedSteps: 3 },
  output: { newRent: 1300, totalIncrease: 300 },
} satisfies ToolExample<Input, Output>;
export const groundLeaseRentStepDeltaTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "real-estate/ground-lease-rent-step-delta",
    title: "Ground Lease Rent Step Delta Tool",
    description:
      "Calculate ground lease rent step delta from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        baseRent: { type: "number", minimum: 0 },
        stepAmount: { type: "number", minimum: 0 },
        completedSteps: { type: "integer", minimum: 0 },
      },
      required: ["baseRent", "stepAmount", "completedSteps"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        newRent: { type: "number" },
        totalIncrease: { type: "number" },
      },
      required: ["newRent", "totalIncrease"],
    },
    ports: {
      inputs: [
        {
          id: "baseRent",
          label: "Base Rent",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "stepAmount",
          label: "Step Amount",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "completedSteps",
          label: "Completed Steps",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "newRent", label: "New Rent", valueType: { type: "number" } },
        {
          id: "totalIncrease",
          label: "Total Increase",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = groundLeaseRentStepDeltaTool.execute;
export default groundLeaseRentStepDeltaTool;
