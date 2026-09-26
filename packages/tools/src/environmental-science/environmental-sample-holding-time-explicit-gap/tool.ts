import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly elapsedHours: number;
  readonly callerLimitHours: number;
};
export type Output = {
  readonly remainingHours: number;
  readonly exceeded: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    elapsedHours: { type: "number", minimum: 0 },
    callerLimitHours: { type: "number", minimum: 0 },
  },
  required: ["elapsedHours", "callerLimitHours"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    remainingHours: { type: "number" },
    exceeded: { type: "boolean" },
  },
  required: ["remainingHours", "exceeded"],
} as const;
/** Calculate environmental sample holding time explicit gap from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { elapsedHours, callerLimitHours } = request;
  const compute = (): Output => {
    H.domain(elapsedHours >= 0 && callerLimitHours >= 0);
    return {
      remainingHours: callerLimitHours - elapsedHours,
      exceeded: elapsedHours > callerLimitHours,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { elapsedHours: 20, callerLimitHours: 24 },
  output: { remainingHours: 4, exceeded: false },
} satisfies ToolExample<Input, Output>;
export const environmentalSampleHoldingTimeExplicitGapTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "environmental-science/environmental-sample-holding-time-explicit-gap",
      title: "Environmental Sample Holding Time Explicit Gap Tool",
      description:
        "Calculate environmental sample holding time explicit gap from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          elapsedHours: { type: "number", minimum: 0 },
          callerLimitHours: { type: "number", minimum: 0 },
        },
        required: ["elapsedHours", "callerLimitHours"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          remainingHours: { type: "number" },
          exceeded: { type: "boolean" },
        },
        required: ["remainingHours", "exceeded"],
      },
      ports: {
        inputs: [
          {
            id: "elapsedHours",
            label: "Elapsed Hours",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "callerLimitHours",
            label: "Caller Limit Hours",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "remainingHours",
            label: "Remaining Hours",
            valueType: { type: "number" },
          },
          { id: "exceeded", label: "Exceeded", valueType: { type: "boolean" } },
        ],
      },
    },
    calculate,
  });
export const run = environmentalSampleHoldingTimeExplicitGapTool.execute;
export default environmentalSampleHoldingTimeExplicitGapTool;
