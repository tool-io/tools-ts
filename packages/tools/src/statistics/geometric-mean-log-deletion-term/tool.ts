import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly logSum: number;
  readonly count: number;
  readonly removedValue: number;
};
export type Output = {
  readonly remainingGeometricMean: number;
  readonly logMean: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    logSum: { type: "number" },
    count: { type: "integer", minimum: 2 },
    removedValue: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["logSum", "count", "removedValue"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    remainingGeometricMean: { type: "number" },
    logMean: { type: "number" },
  },
  required: ["remainingGeometricMean", "logMean"],
} as const;
/** Calculate geometric mean log deletion term from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { logSum, count, removedValue } = request;
  const compute = (): Output => {
    H.integer(count, 2);
    H.positive(removedValue);
    const logMean = (logSum - Math.log(removedValue)) / (count - 1);
    return { remainingGeometricMean: Math.exp(logMean), logMean };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { logSum: 4.1588830833596715, count: 3, removedValue: 2 },
  output: {
    remainingGeometricMean: 5.656854249492379,
    logMean: 1.732867951399863,
  },
} satisfies ToolExample<Input, Output>;
export const geometricMeanLogDeletionTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "statistics/geometric-mean-log-deletion-term",
    title: "Geometric Mean Log Deletion Term Tool",
    description:
      "Calculate geometric mean log deletion term from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        logSum: { type: "number" },
        count: { type: "integer", minimum: 2 },
        removedValue: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["logSum", "count", "removedValue"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        remainingGeometricMean: { type: "number" },
        logMean: { type: "number" },
      },
      required: ["remainingGeometricMean", "logMean"],
    },
    ports: {
      inputs: [
        {
          id: "logSum",
          label: "Log Sum",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "count",
          label: "Count",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "removedValue",
          label: "Removed Value",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "remainingGeometricMean",
          label: "Remaining Geometric Mean",
          valueType: { type: "number" },
        },
        { id: "logMean", label: "Log Mean", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = geometricMeanLogDeletionTermTool.execute;
export default geometricMeanLogDeletionTermTool;
