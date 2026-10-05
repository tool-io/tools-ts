import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly inBedMinutes: number;
  readonly asleepMinutes: number;
};
export type Output = {
  readonly awakeInBedMinutes: number;
  readonly sleepEfficiencyPercent: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    inBedMinutes: { type: "number", exclusiveMinimum: 0 },
    asleepMinutes: { type: "number", minimum: 0 },
  },
  required: ["inBedMinutes", "asleepMinutes"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    awakeInBedMinutes: { type: "number" },
    sleepEfficiencyPercent: { type: "number" },
  },
  required: ["awakeInBedMinutes", "sleepEfficiencyPercent"],
} as const;
/** Describe the logged awake-in-bed interval and the ratio of asleep to in-bed duration without interpreting sleep health. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { inBedMinutes, asleepMinutes } = request;
  const compute = (): Output => {
    (H.domain(inBedMinutes > 0, "inBedMinutes"), inBedMinutes);
    H.domain(
      asleepMinutes >= 0 && asleepMinutes <= inBedMinutes,
      "asleepMinutes",
    );
    return {
      awakeInBedMinutes: inBedMinutes - asleepMinutes,
      sleepEfficiencyPercent: (100 * asleepMinutes) / inBedMinutes,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { inBedMinutes: 480, asleepMinutes: 420 },
  output: { awakeInBedMinutes: 60, sleepEfficiencyPercent: 87.5 },
} satisfies ToolExample<Input, Output>;
export const sleepLogInbedVsAsleepGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "health/sleep-log-inbed-vs-asleep-gap",
    title: "Sleep Log Inbed Vs Asleep Gap Tool",
    description:
      "Describe the logged awake-in-bed interval and the ratio of asleep to in-bed duration without interpreting sleep health.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        inBedMinutes: { type: "number", exclusiveMinimum: 0 },
        asleepMinutes: { type: "number", minimum: 0 },
      },
      required: ["inBedMinutes", "asleepMinutes"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        awakeInBedMinutes: { type: "number" },
        sleepEfficiencyPercent: { type: "number" },
      },
      required: ["awakeInBedMinutes", "sleepEfficiencyPercent"],
    },
    ports: {
      inputs: [
        {
          id: "inBedMinutes",
          label: "In Bed Minutes",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "asleepMinutes",
          label: "Asleep Minutes",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "awakeInBedMinutes",
          label: "Awake In Bed Minutes",
          valueType: { type: "number" },
        },
        {
          id: "sleepEfficiencyPercent",
          label: "Sleep Efficiency Percent",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = sleepLogInbedVsAsleepGapTool.execute;
export default sleepLogInbedVsAsleepGapTool;
