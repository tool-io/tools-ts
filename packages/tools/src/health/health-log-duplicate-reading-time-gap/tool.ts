import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstEpochSeconds: number;
  readonly secondEpochSeconds: number;
  readonly toleranceSeconds: number;
};
export type Output = {
  readonly gapSeconds: number;
  readonly possibleDuplicate: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstEpochSeconds: { type: "integer" },
    secondEpochSeconds: { type: "integer" },
    toleranceSeconds: { type: "number", minimum: 0 },
  },
  required: ["firstEpochSeconds", "secondEpochSeconds", "toleranceSeconds"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    gapSeconds: { type: "number" },
    possibleDuplicate: { type: "boolean" },
  },
  required: ["gapSeconds", "possibleDuplicate"],
} as const;
/** Calculate health log duplicate reading time gap from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstEpochSeconds, secondEpochSeconds, toleranceSeconds } = request;
  const compute = (): Output => {
    H.domain(toleranceSeconds >= 0);
    const gapSeconds = Math.abs(firstEpochSeconds - secondEpochSeconds);
    return { gapSeconds, possibleDuplicate: gapSeconds <= toleranceSeconds };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    firstEpochSeconds: 1000,
    secondEpochSeconds: 1005,
    toleranceSeconds: 10,
  },
  output: { gapSeconds: 5, possibleDuplicate: true },
} satisfies ToolExample<Input, Output>;
export const healthLogDuplicateReadingTimeGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "health/health-log-duplicate-reading-time-gap",
    title: "Health Log Duplicate Reading Time Gap Tool",
    description:
      "Calculate health log duplicate reading time gap from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstEpochSeconds: { type: "integer" },
        secondEpochSeconds: { type: "integer" },
        toleranceSeconds: { type: "number", minimum: 0 },
      },
      required: ["firstEpochSeconds", "secondEpochSeconds", "toleranceSeconds"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        gapSeconds: { type: "number" },
        possibleDuplicate: { type: "boolean" },
      },
      required: ["gapSeconds", "possibleDuplicate"],
    },
    ports: {
      inputs: [
        {
          id: "firstEpochSeconds",
          label: "First Epoch Seconds",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "secondEpochSeconds",
          label: "Second Epoch Seconds",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "toleranceSeconds",
          label: "Tolerance Seconds",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "gapSeconds",
          label: "Gap Seconds",
          valueType: { type: "number" },
        },
        {
          id: "possibleDuplicate",
          label: "Possible Duplicate",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = healthLogDuplicateReadingTimeGapTool.execute;
export default healthLogDuplicateReadingTimeGapTool;
