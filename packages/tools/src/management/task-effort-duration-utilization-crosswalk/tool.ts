import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly effortHours: number;
  readonly availableHoursPerDay: number;
  readonly utilizationFraction: number;
};
export type Output = { readonly durationDays: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    effortHours: { type: "number", minimum: 0 },
    availableHoursPerDay: { type: "number", exclusiveMinimum: 0 },
    utilizationFraction: { type: "number", exclusiveMinimum: 0, maximum: 1 },
  },
  required: ["effortHours", "availableHoursPerDay", "utilizationFraction"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { durationDays: { type: "number" } },
  required: ["durationDays"],
} as const;
/** Translate task effort into working-day duration under an explicit constant daily capacity and utilization. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { effortHours, availableHoursPerDay, utilizationFraction } = request;
  const compute = (): Output => {
    H.domain(effortHours >= 0, "effortHours");
    (H.domain(availableHoursPerDay > 0, "availableHoursPerDay"),
      availableHoursPerDay);
    H.domain(
      utilizationFraction > 0 && utilizationFraction <= 1,
      "utilizationFraction",
    );
    return {
      durationDays: effortHours / (availableHoursPerDay * utilizationFraction),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { effortHours: 12, availableHoursPerDay: 8, utilizationFraction: 0.5 },
  output: { durationDays: 3 },
} satisfies ToolExample<Input, Output>;
export const taskEffortDurationUtilizationCrosswalkTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "management/task-effort-duration-utilization-crosswalk",
      title: "Task Effort Duration Utilization Crosswalk Tool",
      description:
        "Translate task effort into working-day duration under an explicit constant daily capacity and utilization.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          effortHours: { type: "number", minimum: 0 },
          availableHoursPerDay: { type: "number", exclusiveMinimum: 0 },
          utilizationFraction: {
            type: "number",
            exclusiveMinimum: 0,
            maximum: 1,
          },
        },
        required: [
          "effortHours",
          "availableHoursPerDay",
          "utilizationFraction",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { durationDays: { type: "number" } },
        required: ["durationDays"],
      },
      ports: {
        inputs: [
          {
            id: "effortHours",
            label: "Effort Hours",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "availableHoursPerDay",
            label: "Available Hours Per Day",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "utilizationFraction",
            label: "Utilization Fraction",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "durationDays",
            label: "Duration Days",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = taskEffortDurationUtilizationCrosswalkTool.execute;
export default taskEffortDurationUtilizationCrosswalkTool;
