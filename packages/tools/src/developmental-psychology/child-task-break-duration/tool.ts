import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly breakStartSeconds: number;
  readonly breakEndSeconds: number;
  readonly plannedBreakSeconds: number;
};
export type Output = {
  readonly actualBreakSeconds: number;
  readonly differenceSeconds: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    breakStartSeconds: { type: "number" },
    breakEndSeconds: { type: "number" },
    plannedBreakSeconds: { type: "number", minimum: 0 },
  },
  required: ["breakStartSeconds", "breakEndSeconds", "plannedBreakSeconds"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    actualBreakSeconds: { type: "number" },
    differenceSeconds: { type: "number" },
  },
  required: ["actualBreakSeconds", "differenceSeconds"],
} as const;
/** Compare a recorded child-task break interval with an explicit plan without prescribing a break duration. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { breakStartSeconds, breakEndSeconds, plannedBreakSeconds } = request;
  const compute = (): Output => {
    H.domain(
      breakEndSeconds >= breakStartSeconds && plannedBreakSeconds >= 0,
      "breakEndSeconds",
    );
    return {
      actualBreakSeconds: breakEndSeconds - breakStartSeconds,
      differenceSeconds:
        breakEndSeconds - breakStartSeconds - plannedBreakSeconds,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    breakStartSeconds: 100,
    breakEndSeconds: 160,
    plannedBreakSeconds: 45,
  },
  output: { actualBreakSeconds: 60, differenceSeconds: 15 },
} satisfies ToolExample<Input, Output>;
export const childTaskBreakDurationTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: [
        "developmental-psychology",
        "developmental psychology",
        "psychology",
      ],
      keywords: ["developmental psychology", "psychology"],
    },
    id: "developmental-psychology/child-task-break-duration",
    title: "Child Task Break Duration",
    description:
      "Compare a recorded child-task break interval with an explicit plan without prescribing a break duration.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        breakStartSeconds: { type: "number" },
        breakEndSeconds: { type: "number" },
        plannedBreakSeconds: { type: "number", minimum: 0 },
      },
      required: ["breakStartSeconds", "breakEndSeconds", "plannedBreakSeconds"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        actualBreakSeconds: { type: "number" },
        differenceSeconds: { type: "number" },
      },
      required: ["actualBreakSeconds", "differenceSeconds"],
    },
    ports: {
      inputs: [
        {
          id: "breakStartSeconds",
          label: "Break Start Seconds",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "breakEndSeconds",
          label: "Break End Seconds",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "plannedBreakSeconds",
          label: "Planned Break Seconds",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "actualBreakSeconds",
          label: "Actual Break Seconds",
          valueType: { type: "number" },
        },
        {
          id: "differenceSeconds",
          label: "Difference Seconds",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = childTaskBreakDurationTool.execute;
export default childTaskBreakDurationTool;
