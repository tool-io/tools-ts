import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly totalMinutes: number;
  readonly restMinutes: number;
};
export type Output = {
  readonly activeMinutes: number;
  readonly restFraction: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    totalMinutes: { type: "number", exclusiveMinimum: 0 },
    restMinutes: { type: "number", minimum: 0 },
  },
  required: ["totalMinutes", "restMinutes"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    activeMinutes: { type: "number" },
    restFraction: { type: "number" },
  },
  required: ["activeMinutes", "restFraction"],
} as const;
/** Partition explicit activity-log duration into supplied rest and remaining active minutes without assessing fitness. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { totalMinutes, restMinutes } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isFinite(totalMinutes) && totalMinutes > 0,
      "totalMinutes",
    ),
      totalMinutes);
    H.domain(restMinutes >= 0 && restMinutes <= totalMinutes, "restMinutes");
    return {
      activeMinutes: totalMinutes - restMinutes,
      restFraction: restMinutes / totalMinutes,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { totalMinutes: 60, restMinutes: 15 },
  output: { activeMinutes: 45, restFraction: 0.25 },
} satisfies ToolExample<Input, Output>;
export const activityLogActiveRestMinuteSplitTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["health", "health and medicine"],
      keywords: ["health", "health and medicine"],
    },
    id: "health/activity-log-active-rest-minute-split",
    title: "Activity Log Active Rest Minute Split",
    description:
      "Partition explicit activity-log duration into supplied rest and remaining active minutes without assessing fitness.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        totalMinutes: { type: "number", exclusiveMinimum: 0 },
        restMinutes: { type: "number", minimum: 0 },
      },
      required: ["totalMinutes", "restMinutes"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        activeMinutes: { type: "number" },
        restFraction: { type: "number" },
      },
      required: ["activeMinutes", "restFraction"],
    },
    ports: {
      inputs: [
        {
          id: "totalMinutes",
          label: "Total Minutes",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "restMinutes",
          label: "Rest Minutes",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "activeMinutes",
          label: "Active Minutes",
          valueType: { type: "number" },
        },
        {
          id: "restFraction",
          label: "Rest Fraction",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = activityLogActiveRestMinuteSplitTool.execute;
export default activityLogActiveRestMinuteSplitTool;
