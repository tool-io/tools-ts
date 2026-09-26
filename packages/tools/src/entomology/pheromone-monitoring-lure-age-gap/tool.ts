import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly inspectionDay: number;
  readonly deploymentDay: number;
  readonly replacementInterval: number;
};
export type Output = {
  readonly age: number;
  readonly remaining: number;
  readonly replacementDue: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    inspectionDay: { type: "number" },
    deploymentDay: { type: "number" },
    replacementInterval: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["inspectionDay", "deploymentDay", "replacementInterval"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    age: { type: "number" },
    remaining: { type: "number" },
    replacementDue: { type: "boolean" },
  },
  required: ["age", "remaining", "replacementDue"],
} as const;
/** Calculate pheromone monitoring lure age gap from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { inspectionDay, deploymentDay, replacementInterval } = request;
  const compute = (): Output => {
    H.domain(inspectionDay >= deploymentDay);
    H.positive(replacementInterval);
    return {
      age: inspectionDay - deploymentDay,
      remaining: replacementInterval - inspectionDay + deploymentDay,
      replacementDue: inspectionDay - deploymentDay >= replacementInterval,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { inspectionDay: 20, deploymentDay: 2, replacementInterval: 14 },
  output: { age: 18, remaining: -4, replacementDue: true },
} satisfies ToolExample<Input, Output>;
export const pheromoneMonitoringLureAgeGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "entomology/pheromone-monitoring-lure-age-gap",
    title: "Pheromone Monitoring Lure Age Gap Tool",
    description:
      "Calculate pheromone monitoring lure age gap from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        inspectionDay: { type: "number" },
        deploymentDay: { type: "number" },
        replacementInterval: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["inspectionDay", "deploymentDay", "replacementInterval"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        age: { type: "number" },
        remaining: { type: "number" },
        replacementDue: { type: "boolean" },
      },
      required: ["age", "remaining", "replacementDue"],
    },
    ports: {
      inputs: [
        {
          id: "inspectionDay",
          label: "Inspection Day",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "deploymentDay",
          label: "Deployment Day",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "replacementInterval",
          label: "Replacement Interval",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "age", label: "Age", valueType: { type: "number" } },
        { id: "remaining", label: "Remaining", valueType: { type: "number" } },
        {
          id: "replacementDue",
          label: "Replacement Due",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = pheromoneMonitoringLureAgeGapTool.execute;
export default pheromoneMonitoringLureAgeGapTool;
