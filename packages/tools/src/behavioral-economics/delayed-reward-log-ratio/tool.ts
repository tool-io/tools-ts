import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly immediateReward: number;
  readonly delayedReward: number;
  readonly delay: number;
};
export type Output = {
  readonly logRatio: number;
  readonly perTimeLogRatio: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    immediateReward: { type: "number", exclusiveMinimum: 0 },
    delayedReward: { type: "number", exclusiveMinimum: 0 },
    delay: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["immediateReward", "delayedReward", "delay"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    logRatio: { type: "number" },
    perTimeLogRatio: { type: "number" },
  },
  required: ["logRatio", "perTimeLogRatio"],
} as const;
/** Calculate delayed reward log ratio from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { immediateReward, delayedReward, delay } = request;
  const compute = (): Output => {
    H.positive(immediateReward);
    H.positive(delayedReward);
    H.positive(delay);
    return {
      logRatio: Math.log(delayedReward) - Math.log(immediateReward),
      perTimeLogRatio:
        (Math.log(delayedReward) - Math.log(immediateReward)) / delay,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { immediateReward: 1, delayedReward: 2, delay: 2 },
  output: {
    logRatio: 0.6931471805599453,
    perTimeLogRatio: 0.34657359027997264,
  },
} satisfies ToolExample<Input, Output>;
export const delayedRewardLogRatioTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "behavioral-economics/delayed-reward-log-ratio",
    title: "Delayed Reward Log Ratio Tool",
    description:
      "Calculate delayed reward log ratio from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        immediateReward: { type: "number", exclusiveMinimum: 0 },
        delayedReward: { type: "number", exclusiveMinimum: 0 },
        delay: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["immediateReward", "delayedReward", "delay"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        logRatio: { type: "number" },
        perTimeLogRatio: { type: "number" },
      },
      required: ["logRatio", "perTimeLogRatio"],
    },
    ports: {
      inputs: [
        {
          id: "immediateReward",
          label: "Immediate Reward",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "delayedReward",
          label: "Delayed Reward",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "delay",
          label: "Delay",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "logRatio", label: "Log Ratio", valueType: { type: "number" } },
        {
          id: "perTimeLogRatio",
          label: "Per Time Log Ratio",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = delayedRewardLogRatioTool.execute;
export default delayedRewardLogRatioTool;
