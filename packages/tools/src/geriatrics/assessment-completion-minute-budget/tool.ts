import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly allocatedMinutes: number;
  readonly elapsedMinutes: number;
  readonly reservedBreakMinutes: number;
};
export type Output = {
  readonly remainingWorkMinutes: number;
  readonly overrun: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    allocatedMinutes: { type: "number", minimum: 0 },
    elapsedMinutes: { type: "number", minimum: 0 },
    reservedBreakMinutes: { type: "number", minimum: 0 },
  },
  required: ["allocatedMinutes", "elapsedMinutes", "reservedBreakMinutes"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    remainingWorkMinutes: { type: "number" },
    overrun: { type: "boolean" },
  },
  required: ["remainingWorkMinutes", "overrun"],
} as const;
/** Subtract supplied elapsed time and nonoverlapping reserved breaks from an assessment time budget. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { allocatedMinutes, elapsedMinutes, reservedBreakMinutes } = request;
  const compute = (): Output => {
    H.domain(
      allocatedMinutes >= 0 && elapsedMinutes >= 0 && reservedBreakMinutes >= 0,
      "allocatedMinutes",
    );
    return {
      remainingWorkMinutes:
        allocatedMinutes - elapsedMinutes - reservedBreakMinutes,
      overrun: elapsedMinutes + reservedBreakMinutes > allocatedMinutes,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { allocatedMinutes: 60, elapsedMinutes: 35, reservedBreakMinutes: 10 },
  output: { remainingWorkMinutes: 15, overrun: false },
} satisfies ToolExample<Input, Output>;
export const assessmentCompletionMinuteBudgetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["geriatrics", "health and medicine"],
      keywords: ["geriatrics", "health and medicine"],
    },
    id: "geriatrics/assessment-completion-minute-budget",
    title: "Assessment Completion Minute Budget",
    description:
      "Subtract supplied elapsed time and nonoverlapping reserved breaks from an assessment time budget.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        allocatedMinutes: { type: "number", minimum: 0 },
        elapsedMinutes: { type: "number", minimum: 0 },
        reservedBreakMinutes: { type: "number", minimum: 0 },
      },
      required: ["allocatedMinutes", "elapsedMinutes", "reservedBreakMinutes"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        remainingWorkMinutes: { type: "number" },
        overrun: { type: "boolean" },
      },
      required: ["remainingWorkMinutes", "overrun"],
    },
    ports: {
      inputs: [
        {
          id: "allocatedMinutes",
          label: "Allocated Minutes",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "elapsedMinutes",
          label: "Elapsed Minutes",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "reservedBreakMinutes",
          label: "Reserved Break Minutes",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "remainingWorkMinutes",
          label: "Remaining Work Minutes",
          valueType: { type: "number" },
        },
        { id: "overrun", label: "Overrun", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = assessmentCompletionMinuteBudgetTool.execute;
export default assessmentCompletionMinuteBudgetTool;
