import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly baselineDay: number;
  readonly targetOffset: number;
  readonly actualDay: number;
  readonly earlyAllowance: number;
  readonly lateAllowance: number;
};
export type Output = {
  readonly nominalDay: number;
  readonly deviation: number;
  readonly earlyMargin: number;
  readonly lateMargin: number;
  readonly inside: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    baselineDay: { type: "integer" },
    targetOffset: { type: "integer" },
    actualDay: { type: "integer" },
    earlyAllowance: { type: "integer", minimum: 0 },
    lateAllowance: { type: "integer", minimum: 0 },
  },
  required: [
    "baselineDay",
    "targetOffset",
    "actualDay",
    "earlyAllowance",
    "lateAllowance",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    nominalDay: { type: "integer" },
    deviation: { type: "integer" },
    earlyMargin: { type: "integer" },
    lateMargin: { type: "integer" },
    inside: { type: "boolean" },
  },
  required: ["nominalDay", "deviation", "earlyMargin", "lateMargin", "inside"],
} as const;
/** Audit research assessment deviation from supplied nominal timing. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    baselineDay,
    targetOffset,
    actualDay,
    earlyAllowance,
    lateAllowance,
  } = request;
  const compute = (): Output => {
    H.integer(earlyAllowance, 0);
    H.integer(lateAllowance, 0);
    return {
      nominalDay: baselineDay + targetOffset,
      deviation: actualDay - baselineDay - targetOffset,
      earlyMargin: actualDay - baselineDay - targetOffset + earlyAllowance,
      lateMargin: baselineDay + targetOffset + lateAllowance - actualDay,
      inside:
        actualDay >= baselineDay + targetOffset - earlyAllowance &&
        actualDay <= baselineDay + targetOffset + lateAllowance,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    baselineDay: 100,
    targetOffset: 30,
    actualDay: 132,
    earlyAllowance: 3,
    lateAllowance: 5,
  },
  output: {
    nominalDay: 130,
    deviation: 2,
    earlyMargin: 5,
    lateMargin: 3,
    inside: true,
  },
} satisfies ToolExample<Input, Output>;
export const rheumatologyVisitScheduleOffsetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "rheumatology/rheumatology-visit-schedule-offset",
    title: "Rheumatology Visit Schedule Offset Tool",
    description:
      "Audit research assessment deviation from supplied nominal timing.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        baselineDay: { type: "integer" },
        targetOffset: { type: "integer" },
        actualDay: { type: "integer" },
        earlyAllowance: { type: "integer", minimum: 0 },
        lateAllowance: { type: "integer", minimum: 0 },
      },
      required: [
        "baselineDay",
        "targetOffset",
        "actualDay",
        "earlyAllowance",
        "lateAllowance",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        nominalDay: { type: "integer" },
        deviation: { type: "integer" },
        earlyMargin: { type: "integer" },
        lateMargin: { type: "integer" },
        inside: { type: "boolean" },
      },
      required: [
        "nominalDay",
        "deviation",
        "earlyMargin",
        "lateMargin",
        "inside",
      ],
    },
    ports: {
      inputs: [
        {
          id: "baselineDay",
          label: "Baseline Day",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "targetOffset",
          label: "Target Offset",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "actualDay",
          label: "Actual Day",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "earlyAllowance",
          label: "Early Allowance",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "lateAllowance",
          label: "Late Allowance",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "nominalDay",
          label: "Nominal Day",
          valueType: { type: "integer" },
        },
        { id: "deviation", label: "Deviation", valueType: { type: "integer" } },
        {
          id: "earlyMargin",
          label: "Early Margin",
          valueType: { type: "integer" },
        },
        {
          id: "lateMargin",
          label: "Late Margin",
          valueType: { type: "integer" },
        },
        { id: "inside", label: "Inside", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = rheumatologyVisitScheduleOffsetTool.execute;
export default rheumatologyVisitScheduleOffsetTool;
