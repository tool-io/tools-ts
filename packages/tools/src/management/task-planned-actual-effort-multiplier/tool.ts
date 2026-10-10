import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly plannedHours: number;
  readonly actualHours: number;
};
export type Output = {
  readonly actualToPlanned: number;
  readonly signedHourDifference: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    plannedHours: { type: "number", exclusiveMinimum: 0 },
    actualHours: { type: "number", minimum: 0 },
  },
  required: ["plannedHours", "actualHours"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    actualToPlanned: { type: "number" },
    signedHourDifference: { type: "number" },
  },
  required: ["actualToPlanned", "signedHourDifference"],
} as const;
/** Compare explicit actual task effort to positive planned effort without forecasting completion. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { plannedHours, actualHours } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isFinite(plannedHours) && plannedHours > 0,
      "plannedHours",
    ),
      plannedHours);
    H.domain(actualHours >= 0, "actualHours");
    return {
      actualToPlanned: actualHours / plannedHours,
      signedHourDifference: actualHours - plannedHours,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { plannedHours: 20, actualHours: 25 },
  output: { actualToPlanned: 1.25, signedHourDifference: 5 },
} satisfies ToolExample<Input, Output>;
export const taskPlannedActualEffortMultiplierTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["management", "business and finance"],
      keywords: ["management", "business and finance"],
    },
    id: "management/task-planned-actual-effort-multiplier",
    title: "Task Planned Actual Effort Multiplier",
    description:
      "Compare explicit actual task effort to positive planned effort without forecasting completion.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        plannedHours: { type: "number", exclusiveMinimum: 0 },
        actualHours: { type: "number", minimum: 0 },
      },
      required: ["plannedHours", "actualHours"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        actualToPlanned: { type: "number" },
        signedHourDifference: { type: "number" },
      },
      required: ["actualToPlanned", "signedHourDifference"],
    },
    ports: {
      inputs: [
        {
          id: "plannedHours",
          label: "Planned Hours",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "actualHours",
          label: "Actual Hours",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "actualToPlanned",
          label: "Actual To Planned",
          valueType: { type: "number" },
        },
        {
          id: "signedHourDifference",
          label: "Signed Hour Difference",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = taskPlannedActualEffortMultiplierTool.execute;
export default taskPlannedActualEffortMultiplierTool;
