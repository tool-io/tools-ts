import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly previousStage: number;
  readonly currentStage: number;
  readonly elapsedHours: number;
  readonly tolerance: number;
};
export type Output = {
  readonly change: number;
  readonly ratePerHour: number;
  readonly trend: string;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    previousStage: { type: "number" },
    currentStage: { type: "number" },
    elapsedHours: { type: "number", exclusiveMinimum: 0 },
    tolerance: { type: "number", minimum: 0 },
  },
  required: ["previousStage", "currentStage", "elapsedHours", "tolerance"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    change: { type: "number" },
    ratePerHour: { type: "number" },
    trend: { type: "string", maxLength: 8192 },
  },
  required: ["change", "ratePerHour", "trend"],
} as const;
/** Calculate river stage rising falling flag from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { previousStage, currentStage, elapsedHours, tolerance } = request;
  const compute = (): Output => {
    H.positive(elapsedHours);
    H.domain(tolerance >= 0);
    return {
      change: currentStage - previousStage,
      ratePerHour: (currentStage - previousStage) / elapsedHours,
      trend:
        Math.abs(currentStage - previousStage) <= tolerance
          ? "steady"
          : currentStage > previousStage
            ? "rising"
            : "falling",
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    previousStage: 2,
    currentStage: 2.5,
    elapsedHours: 2,
    tolerance: 0.1,
  },
  output: { change: 0.5, ratePerHour: 0.25, trend: "rising" },
} satisfies ToolExample<Input, Output>;
export const riverStageRisingFallingFlagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "hydrology/river-stage-rising-falling-flag",
    title: "River Stage Rising Falling Flag Tool",
    description:
      "Calculate river stage rising falling flag from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        previousStage: { type: "number" },
        currentStage: { type: "number" },
        elapsedHours: { type: "number", exclusiveMinimum: 0 },
        tolerance: { type: "number", minimum: 0 },
      },
      required: ["previousStage", "currentStage", "elapsedHours", "tolerance"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        change: { type: "number" },
        ratePerHour: { type: "number" },
        trend: { type: "string", maxLength: 8192 },
      },
      required: ["change", "ratePerHour", "trend"],
    },
    ports: {
      inputs: [
        {
          id: "previousStage",
          label: "Previous Stage",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "currentStage",
          label: "Current Stage",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "elapsedHours",
          label: "Elapsed Hours",
          required: true,
          valueType: { type: "number", unit: "h" },
        },
        {
          id: "tolerance",
          label: "Tolerance",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "change", label: "Change", valueType: { type: "number" } },
        {
          id: "ratePerHour",
          label: "Rate Per Hour",
          valueType: { type: "number" },
        },
        { id: "trend", label: "Trend", valueType: { type: "string" } },
      ],
    },
  },
  calculate,
});
export const run = riverStageRisingFallingFlagTool.execute;
export default riverStageRisingFallingFlagTool;
