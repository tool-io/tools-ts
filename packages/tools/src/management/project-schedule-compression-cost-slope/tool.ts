import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly normalDays: number;
  readonly crashDays: number;
  readonly normalCost: number;
  readonly crashCost: number;
};
export type Output = { readonly daysSaved: number; readonly costSlope: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    normalDays: { type: "number" },
    crashDays: { type: "number", minimum: 0 },
    normalCost: { type: "number", minimum: 0 },
    crashCost: { type: "number" },
  },
  required: ["normalDays", "crashDays", "normalCost", "crashCost"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { daysSaved: { type: "number" }, costSlope: { type: "number" } },
  required: ["daysSaved", "costSlope"],
} as const;
/** Calculate project schedule compression cost slope from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { normalDays, crashDays, normalCost, crashCost } = request;
  const compute = (): Output => {
    H.domain(
      crashDays >= 0 &&
        normalDays > crashDays &&
        normalCost >= 0 &&
        crashCost >= normalCost,
    );
    return {
      daysSaved: normalDays - crashDays,
      costSlope: (crashCost - normalCost) / (normalDays - crashDays),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { normalDays: 10, crashDays: 6, normalCost: 1000, crashCost: 1600 },
  output: { daysSaved: 4, costSlope: 150 },
} satisfies ToolExample<Input, Output>;
export const projectScheduleCompressionCostSlopeTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "management/project-schedule-compression-cost-slope",
      title: "Project Schedule Compression Cost Slope Tool",
      description:
        "Calculate project schedule compression cost slope from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          normalDays: { type: "number" },
          crashDays: { type: "number", minimum: 0 },
          normalCost: { type: "number", minimum: 0 },
          crashCost: { type: "number" },
        },
        required: ["normalDays", "crashDays", "normalCost", "crashCost"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          daysSaved: { type: "number" },
          costSlope: { type: "number" },
        },
        required: ["daysSaved", "costSlope"],
      },
      ports: {
        inputs: [
          {
            id: "normalDays",
            label: "Normal Days",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "crashDays",
            label: "Crash Days",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "normalCost",
            label: "Normal Cost",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "crashCost",
            label: "Crash Cost",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "daysSaved",
            label: "Days Saved",
            valueType: { type: "number" },
          },
          {
            id: "costSlope",
            label: "Cost Slope",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = projectScheduleCompressionCostSlopeTool.execute;
export default projectScheduleCompressionCostSlopeTool;
