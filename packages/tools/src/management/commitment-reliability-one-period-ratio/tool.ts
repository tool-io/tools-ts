import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly committed: number;
  readonly completedCommitted: number;
  readonly unplannedCompleted: number;
};
export type Output = {
  readonly reliability: number;
  readonly totalCompleted: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    committed: { type: "integer", minimum: 1 },
    completedCommitted: { type: "integer", minimum: 0 },
    unplannedCompleted: { type: "integer", minimum: 0 },
  },
  required: ["committed", "completedCommitted", "unplannedCompleted"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    reliability: { type: "number" },
    totalCompleted: { type: "integer" },
  },
  required: ["reliability", "totalCompleted"],
} as const;
/** Calculate commitment reliability one period ratio from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { committed, completedCommitted, unplannedCompleted } = request;
  const compute = (): Output => {
    H.integer(committed, 1);
    H.integer(completedCommitted, 0, committed);
    H.integer(unplannedCompleted, 0);
    return {
      reliability: completedCommitted / committed,
      totalCompleted: completedCommitted + unplannedCompleted,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { committed: 10, completedCommitted: 8, unplannedCompleted: 3 },
  output: { reliability: 0.8, totalCompleted: 11 },
} satisfies ToolExample<Input, Output>;
export const commitmentReliabilityOnePeriodRatioTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "management/commitment-reliability-one-period-ratio",
      title: "Commitment Reliability One Period Ratio Tool",
      description:
        "Calculate commitment reliability one period ratio from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          committed: { type: "integer", minimum: 1 },
          completedCommitted: { type: "integer", minimum: 0 },
          unplannedCompleted: { type: "integer", minimum: 0 },
        },
        required: ["committed", "completedCommitted", "unplannedCompleted"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          reliability: { type: "number" },
          totalCompleted: { type: "integer" },
        },
        required: ["reliability", "totalCompleted"],
      },
      ports: {
        inputs: [
          {
            id: "committed",
            label: "Committed",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "completedCommitted",
            label: "Completed Committed",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "unplannedCompleted",
            label: "Unplanned Completed",
            required: true,
            valueType: { type: "integer" },
          },
        ],
        outputs: [
          {
            id: "reliability",
            label: "Reliability",
            valueType: { type: "number" },
          },
          {
            id: "totalCompleted",
            label: "Total Completed",
            valueType: { type: "integer" },
          },
        ],
      },
    },
    calculate,
  });
export const run = commitmentReliabilityOnePeriodRatioTool.execute;
export default commitmentReliabilityOnePeriodRatioTool;
