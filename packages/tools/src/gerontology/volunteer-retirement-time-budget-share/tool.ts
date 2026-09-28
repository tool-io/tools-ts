import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly volunteerHours: number;
  readonly paidHours: number;
  readonly careHours: number;
  readonly discretionaryBudget: number;
  readonly concurrentHours: number;
};
export type Output = {
  readonly grossHours: number;
  readonly uniqueHours: number;
  readonly volunteerShareOfBudget: number;
  readonly remainingBudget: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    volunteerHours: { type: "number", minimum: 0 },
    paidHours: { type: "number", minimum: 0 },
    careHours: { type: "number", minimum: 0 },
    discretionaryBudget: { type: "number", exclusiveMinimum: 0 },
    concurrentHours: { type: "number", minimum: 0 },
  },
  required: [
    "volunteerHours",
    "paidHours",
    "careHours",
    "discretionaryBudget",
    "concurrentHours",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    grossHours: { type: "number" },
    uniqueHours: { type: "number" },
    volunteerShareOfBudget: { type: "number" },
    remainingBudget: { type: "number" },
  },
  required: [
    "grossHours",
    "uniqueHours",
    "volunteerShareOfBudget",
    "remainingBudget",
  ],
} as const;
/** Time budget with a supplied total overlap correction, not an inference from potentially intersecting activities. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    volunteerHours,
    paidHours,
    careHours,
    discretionaryBudget,
    concurrentHours,
  } = request;
  const compute = (): Output => {
    H.domain(
      volunteerHours >= 0 &&
        paidHours >= 0 &&
        careHours >= 0 &&
        concurrentHours >= 0 &&
        concurrentHours <= volunteerHours + paidHours + careHours,
    );
    H.positive(discretionaryBudget);
    return {
      grossHours: volunteerHours + paidHours + careHours,
      uniqueHours: volunteerHours + paidHours + careHours - concurrentHours,
      volunteerShareOfBudget: volunteerHours / discretionaryBudget,
      remainingBudget:
        discretionaryBudget -
        volunteerHours -
        paidHours -
        careHours +
        concurrentHours,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    volunteerHours: 10,
    paidHours: 5,
    careHours: 15,
    discretionaryBudget: 40,
    concurrentHours: 5,
  },
  output: {
    grossHours: 30,
    uniqueHours: 25,
    volunteerShareOfBudget: 0.25,
    remainingBudget: 15,
  },
} satisfies ToolExample<Input, Output>;
export const volunteerRetirementTimeBudgetShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "gerontology/volunteer-retirement-time-budget-share",
    title: "Volunteer Retirement Time Budget Share Tool",
    description:
      "Time budget with a supplied total overlap correction, not an inference from potentially intersecting activities.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        volunteerHours: { type: "number", minimum: 0 },
        paidHours: { type: "number", minimum: 0 },
        careHours: { type: "number", minimum: 0 },
        discretionaryBudget: { type: "number", exclusiveMinimum: 0 },
        concurrentHours: { type: "number", minimum: 0 },
      },
      required: [
        "volunteerHours",
        "paidHours",
        "careHours",
        "discretionaryBudget",
        "concurrentHours",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        grossHours: { type: "number" },
        uniqueHours: { type: "number" },
        volunteerShareOfBudget: { type: "number" },
        remainingBudget: { type: "number" },
      },
      required: [
        "grossHours",
        "uniqueHours",
        "volunteerShareOfBudget",
        "remainingBudget",
      ],
    },
    ports: {
      inputs: [
        {
          id: "volunteerHours",
          label: "Volunteer Hours",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "paidHours",
          label: "Paid Hours",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "careHours",
          label: "Care Hours",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "discretionaryBudget",
          label: "Discretionary Budget",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "concurrentHours",
          label: "Concurrent Hours",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "grossHours",
          label: "Gross Hours",
          valueType: { type: "number" },
        },
        {
          id: "uniqueHours",
          label: "Unique Hours",
          valueType: { type: "number" },
        },
        {
          id: "volunteerShareOfBudget",
          label: "Volunteer Share Of Budget",
          valueType: { type: "number" },
        },
        {
          id: "remainingBudget",
          label: "Remaining Budget",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = volunteerRetirementTimeBudgetShareTool.execute;
export default volunteerRetirementTimeBudgetShareTool;
