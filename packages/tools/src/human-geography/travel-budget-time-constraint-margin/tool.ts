import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly availableMinutes: number;
  readonly outboundMinutes: number;
  readonly activityMinutes: number;
  readonly returnMinutes: number;
};
export type Output = {
  readonly timeMarginMinutes: number;
  readonly feasibleUnderInputs: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    availableMinutes: { type: "number", minimum: 0 },
    outboundMinutes: { type: "number", minimum: 0 },
    activityMinutes: { type: "number", minimum: 0 },
    returnMinutes: { type: "number", minimum: 0 },
  },
  required: [
    "availableMinutes",
    "outboundMinutes",
    "activityMinutes",
    "returnMinutes",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    timeMarginMinutes: { type: "number" },
    feasibleUnderInputs: { type: "boolean" },
  },
  required: ["timeMarginMinutes", "feasibleUnderInputs"],
} as const;
/** Compare explicit nonoverlapping travel and activity durations with a supplied time budget. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { availableMinutes, outboundMinutes, activityMinutes, returnMinutes } =
    request;
  const compute = (): Output => {
    H.domain(
      availableMinutes >= 0 &&
        outboundMinutes >= 0 &&
        activityMinutes >= 0 &&
        returnMinutes >= 0,
      "availableMinutes",
    );
    return (() => {
      const timeMarginMinutes =
        availableMinutes - outboundMinutes - activityMinutes - returnMinutes;
      return { timeMarginMinutes, feasibleUnderInputs: timeMarginMinutes >= 0 };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    availableMinutes: 120,
    outboundMinutes: 20,
    activityMinutes: 60,
    returnMinutes: 25,
  },
  output: { timeMarginMinutes: 15, feasibleUnderInputs: true },
} satisfies ToolExample<Input, Output>;
export const travelBudgetTimeConstraintMarginTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["human-geography", "human geography", "social sciences"],
      keywords: ["human geography", "social sciences"],
    },
    id: "human-geography/travel-budget-time-constraint-margin",
    title: "Travel Budget Time Constraint Margin",
    description:
      "Compare explicit nonoverlapping travel and activity durations with a supplied time budget.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        availableMinutes: { type: "number", minimum: 0 },
        outboundMinutes: { type: "number", minimum: 0 },
        activityMinutes: { type: "number", minimum: 0 },
        returnMinutes: { type: "number", minimum: 0 },
      },
      required: [
        "availableMinutes",
        "outboundMinutes",
        "activityMinutes",
        "returnMinutes",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        timeMarginMinutes: { type: "number" },
        feasibleUnderInputs: { type: "boolean" },
      },
      required: ["timeMarginMinutes", "feasibleUnderInputs"],
    },
    ports: {
      inputs: [
        {
          id: "availableMinutes",
          label: "Available Minutes",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "outboundMinutes",
          label: "Outbound Minutes",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "activityMinutes",
          label: "Activity Minutes",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "returnMinutes",
          label: "Return Minutes",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "timeMarginMinutes",
          label: "Time Margin Minutes",
          valueType: { type: "number" },
        },
        {
          id: "feasibleUnderInputs",
          label: "Feasible Under Inputs",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = travelBudgetTimeConstraintMarginTool.execute;
export default travelBudgetTimeConstraintMarginTool;
