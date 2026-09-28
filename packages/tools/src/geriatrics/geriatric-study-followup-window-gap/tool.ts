import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly observedDay: number;
  readonly targetDay: number;
  readonly earlyAllowance: number;
  readonly lateAllowance: number;
};
export type Output = {
  readonly offsetDays: number;
  readonly earlyGap: number;
  readonly lateGap: number;
  readonly inside: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    observedDay: { type: "integer" },
    targetDay: { type: "integer" },
    earlyAllowance: { type: "integer", minimum: 0 },
    lateAllowance: { type: "integer", minimum: 0 },
  },
  required: ["observedDay", "targetDay", "earlyAllowance", "lateAllowance"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    offsetDays: { type: "integer" },
    earlyGap: { type: "integer" },
    lateGap: { type: "integer" },
    inside: { type: "boolean" },
  },
  required: ["offsetDays", "earlyGap", "lateGap", "inside"],
} as const;
/** Caller-defined inclusive research visit window, independent of treatment or appointment urgency. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { observedDay, targetDay, earlyAllowance, lateAllowance } = request;
  const compute = (): Output => {
    H.integer(earlyAllowance, 0);
    H.integer(lateAllowance, 0);
    return {
      offsetDays: observedDay - targetDay,
      earlyGap: Math.max(0, targetDay - earlyAllowance - observedDay),
      lateGap: Math.max(0, observedDay - targetDay - lateAllowance),
      inside:
        observedDay >= targetDay - earlyAllowance &&
        observedDay <= targetDay + lateAllowance,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    observedDay: 110,
    targetDay: 100,
    earlyAllowance: 5,
    lateAllowance: 7,
  },
  output: { offsetDays: 10, earlyGap: 0, lateGap: 3, inside: false },
} satisfies ToolExample<Input, Output>;
export const geriatricStudyFollowupWindowGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "geriatrics/geriatric-study-followup-window-gap",
    title: "Geriatric Study Followup Window Gap Tool",
    description:
      "Caller-defined inclusive research visit window, independent of treatment or appointment urgency.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        observedDay: { type: "integer" },
        targetDay: { type: "integer" },
        earlyAllowance: { type: "integer", minimum: 0 },
        lateAllowance: { type: "integer", minimum: 0 },
      },
      required: ["observedDay", "targetDay", "earlyAllowance", "lateAllowance"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        offsetDays: { type: "integer" },
        earlyGap: { type: "integer" },
        lateGap: { type: "integer" },
        inside: { type: "boolean" },
      },
      required: ["offsetDays", "earlyGap", "lateGap", "inside"],
    },
    ports: {
      inputs: [
        {
          id: "observedDay",
          label: "Observed Day",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "targetDay",
          label: "Target Day",
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
          id: "offsetDays",
          label: "Offset Days",
          valueType: { type: "integer" },
        },
        { id: "earlyGap", label: "Early Gap", valueType: { type: "integer" } },
        { id: "lateGap", label: "Late Gap", valueType: { type: "integer" } },
        { id: "inside", label: "Inside", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = geriatricStudyFollowupWindowGapTool.execute;
export default geriatricStudyFollowupWindowGapTool;
