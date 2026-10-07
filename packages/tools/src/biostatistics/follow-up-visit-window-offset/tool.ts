import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly actualDay: number;
  readonly targetDay: number;
  readonly earlyAllowanceDays: number;
  readonly lateAllowanceDays: number;
};
export type Output = {
  readonly offsetDays: number;
  readonly withinWindow: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    actualDay: { type: "number" },
    targetDay: { type: "number" },
    earlyAllowanceDays: { type: "number", minimum: 0 },
    lateAllowanceDays: { type: "number", minimum: 0 },
  },
  required: [
    "actualDay",
    "targetDay",
    "earlyAllowanceDays",
    "lateAllowanceDays",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    offsetDays: { type: "number" },
    withinWindow: { type: "boolean" },
  },
  required: ["offsetDays", "withinWindow"],
} as const;
/** Compare an observed follow-up day with an explicitly supplied asymmetric inclusive visit window. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { actualDay, targetDay, earlyAllowanceDays, lateAllowanceDays } =
    request;
  const compute = (): Output => {
    H.domain(
      earlyAllowanceDays >= 0 && lateAllowanceDays >= 0,
      "earlyAllowanceDays",
    );
    return {
      offsetDays: actualDay - targetDay,
      withinWindow:
        actualDay >= targetDay - earlyAllowanceDays &&
        actualDay <= targetDay + lateAllowanceDays,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    actualDay: 32,
    targetDay: 30,
    earlyAllowanceDays: 2,
    lateAllowanceDays: 5,
  },
  output: { offsetDays: 2, withinWindow: true },
} satisfies ToolExample<Input, Output>;
export const followupVisitWindowOffsetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["biostatistics", "research and quality management"],
      keywords: ["biostatistics", "research and quality management"],
    },
    id: "biostatistics/follow-up-visit-window-offset",
    title: "Follow Up Visit Window Offset",
    description:
      "Compare an observed follow-up day with an explicitly supplied asymmetric inclusive visit window.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        actualDay: { type: "number" },
        targetDay: { type: "number" },
        earlyAllowanceDays: { type: "number", minimum: 0 },
        lateAllowanceDays: { type: "number", minimum: 0 },
      },
      required: [
        "actualDay",
        "targetDay",
        "earlyAllowanceDays",
        "lateAllowanceDays",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        offsetDays: { type: "number" },
        withinWindow: { type: "boolean" },
      },
      required: ["offsetDays", "withinWindow"],
    },
    ports: {
      inputs: [
        {
          id: "actualDay",
          label: "Actual Day",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "targetDay",
          label: "Target Day",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "earlyAllowanceDays",
          label: "Early Allowance Days",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "lateAllowanceDays",
          label: "Late Allowance Days",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "offsetDays",
          label: "Offset Days",
          valueType: { type: "number" },
        },
        {
          id: "withinWindow",
          label: "Within Window",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = followupVisitWindowOffsetTool.execute;
export default followupVisitWindowOffsetTool;
