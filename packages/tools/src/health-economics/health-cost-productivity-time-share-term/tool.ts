import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly lostHours: number;
  readonly workFraction: number;
  readonly wagePerHour: number;
  readonly replacementFraction: number;
};
export type Output = {
  readonly paidWorkHours: number;
  readonly grossProductivityCost: number;
  readonly unreplacedCost: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    lostHours: { type: "number", minimum: 0 },
    workFraction: { type: "number", minimum: 0, maximum: 1 },
    wagePerHour: { type: "number", minimum: 0 },
    replacementFraction: { type: "number", minimum: 0, maximum: 1 },
  },
  required: ["lostHours", "workFraction", "wagePerHour", "replacementFraction"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    paidWorkHours: { type: "number" },
    grossProductivityCost: { type: "number" },
    unreplacedCost: { type: "number" },
  },
  required: ["paidWorkHours", "grossProductivityCost", "unreplacedCost"],
} as const;
/** Caller-defined productivity valuation with an explicit replacement adjustment, without a complete friction-cost model. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { lostHours, workFraction, wagePerHour, replacementFraction } = request;
  const compute = (): Output => {
    H.domain(lostHours >= 0 && wagePerHour >= 0);
    H.probability(workFraction);
    H.probability(replacementFraction);
    return {
      paidWorkHours: lostHours * workFraction,
      grossProductivityCost: lostHours * workFraction * wagePerHour,
      unreplacedCost:
        lostHours * workFraction * wagePerHour * (1 - replacementFraction),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    lostHours: 40,
    workFraction: 0.75,
    wagePerHour: 20,
    replacementFraction: 0.5,
  },
  output: {
    paidWorkHours: 30,
    grossProductivityCost: 600,
    unreplacedCost: 300,
  },
} satisfies ToolExample<Input, Output>;
export const healthCostProductivityTimeShareTermTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "health-economics/health-cost-productivity-time-share-term",
      title: "Health Cost Productivity Time Share Term Tool",
      description:
        "Caller-defined productivity valuation with an explicit replacement adjustment, without a complete friction-cost model.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          lostHours: { type: "number", minimum: 0 },
          workFraction: { type: "number", minimum: 0, maximum: 1 },
          wagePerHour: { type: "number", minimum: 0 },
          replacementFraction: { type: "number", minimum: 0, maximum: 1 },
        },
        required: [
          "lostHours",
          "workFraction",
          "wagePerHour",
          "replacementFraction",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          paidWorkHours: { type: "number" },
          grossProductivityCost: { type: "number" },
          unreplacedCost: { type: "number" },
        },
        required: ["paidWorkHours", "grossProductivityCost", "unreplacedCost"],
      },
      ports: {
        inputs: [
          {
            id: "lostHours",
            label: "Lost Hours",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "workFraction",
            label: "Work Fraction",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "wagePerHour",
            label: "Wage Per Hour",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "replacementFraction",
            label: "Replacement Fraction",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "paidWorkHours",
            label: "Paid Work Hours",
            valueType: { type: "number" },
          },
          {
            id: "grossProductivityCost",
            label: "Gross Productivity Cost",
            valueType: { type: "number" },
          },
          {
            id: "unreplacedCost",
            label: "Unreplaced Cost",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = healthCostProductivityTimeShareTermTool.execute;
export default healthCostProductivityTimeShareTermTool;
