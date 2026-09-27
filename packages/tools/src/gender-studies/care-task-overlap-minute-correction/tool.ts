import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly taskMinutes: readonly number[];
  readonly doubleCountedMinutes: number;
};
export type Output = {
  readonly grossMinutes: number;
  readonly uniqueMinutes: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    taskMinutes: { type: "array", maxItems: 256, items: { type: "number" } },
    doubleCountedMinutes: { type: "number", minimum: 0 },
  },
  required: ["taskMinutes", "doubleCountedMinutes"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    grossMinutes: { type: "number" },
    uniqueMinutes: { type: "number" },
  },
  required: ["grossMinutes", "uniqueMinutes"],
} as const;
/** Subtract an explicitly supplied inclusion-exclusion duplicate-time total rather than infer task simultaneity. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { taskMinutes, doubleCountedMinutes } = request;
  const compute = (): Output => {
    H.domain(
      taskMinutes.every((x) => x >= 0) &&
        doubleCountedMinutes >= 0 &&
        doubleCountedMinutes <= taskMinutes.reduce((a, b) => a + b, 0),
    );
    return {
      grossMinutes: taskMinutes.reduce((a, b) => a + b, 0),
      uniqueMinutes:
        taskMinutes.reduce((a, b) => a + b, 0) - doubleCountedMinutes,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { taskMinutes: [30, 40], doubleCountedMinutes: 10 },
  output: { grossMinutes: 70, uniqueMinutes: 60 },
} satisfies ToolExample<Input, Output>;
export const careTaskOverlapMinuteCorrectionTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "gender-studies/care-task-overlap-minute-correction",
    title: "Care Task Overlap Minute Correction Tool",
    description:
      "Subtract an explicitly supplied inclusion-exclusion duplicate-time total rather than infer task simultaneity.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        taskMinutes: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
        doubleCountedMinutes: { type: "number", minimum: 0 },
      },
      required: ["taskMinutes", "doubleCountedMinutes"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        grossMinutes: { type: "number" },
        uniqueMinutes: { type: "number" },
      },
      required: ["grossMinutes", "uniqueMinutes"],
    },
    ports: {
      inputs: [
        {
          id: "taskMinutes",
          label: "Task Minutes",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "doubleCountedMinutes",
          label: "Double Counted Minutes",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "grossMinutes",
          label: "Gross Minutes",
          valueType: { type: "number" },
        },
        {
          id: "uniqueMinutes",
          label: "Unique Minutes",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = careTaskOverlapMinuteCorrectionTool.execute;
export default careTaskOverlapMinuteCorrectionTool;
