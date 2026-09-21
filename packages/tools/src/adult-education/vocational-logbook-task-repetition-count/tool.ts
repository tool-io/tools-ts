import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly tasks: readonly string[];
  readonly supervised: readonly boolean[];
  readonly targetTask: string;
  readonly includeSupervised: boolean;
  readonly required: number;
};
export type Output = { readonly count: number; readonly remaining: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    tasks: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    supervised: { type: "array", maxItems: 256, items: { type: "boolean" } },
    targetTask: { type: "string", maxLength: 8192 },
    includeSupervised: { type: "boolean" },
    required: { type: "integer", minimum: 0 },
  },
  required: [
    "tasks",
    "supervised",
    "targetTask",
    "includeSupervised",
    "required",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { count: { type: "integer" }, remaining: { type: "integer" } },
  required: ["count", "remaining"],
} as const;
/** Calculate vocational logbook task repetition count from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { tasks, supervised, targetTask, includeSupervised, required } =
    request;
  const compute = (): Output => {
    H.sameLength(tasks, supervised);
    H.integer(required, 0);
    const count = tasks.filter(
      (x, i) => x === targetTask && (includeSupervised || !supervised[i]),
    ).length;
    return { count, remaining: Math.max(0, required - count) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    tasks: ["A", "A", "B", "A"],
    supervised: [false, true, false, false],
    targetTask: "A",
    includeSupervised: false,
    required: 3,
  },
  output: { count: 2, remaining: 1 },
} satisfies ToolExample<Input, Output>;
export const vocationalLogbookTaskRepetitionCountTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "adult-education/vocational-logbook-task-repetition-count",
      title: "Vocational Logbook Task Repetition Count Tool",
      description:
        "Calculate vocational logbook task repetition count from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          tasks: {
            type: "array",
            maxItems: 256,
            items: { type: "string", maxLength: 8192 },
          },
          supervised: {
            type: "array",
            maxItems: 256,
            items: { type: "boolean" },
          },
          targetTask: { type: "string", maxLength: 8192 },
          includeSupervised: { type: "boolean" },
          required: { type: "integer", minimum: 0 },
        },
        required: [
          "tasks",
          "supervised",
          "targetTask",
          "includeSupervised",
          "required",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          count: { type: "integer" },
          remaining: { type: "integer" },
        },
        required: ["count", "remaining"],
      },
      ports: {
        inputs: [
          {
            id: "tasks",
            label: "Tasks",
            required: true,
            valueType: { type: "list", items: { type: "string" } },
          },
          {
            id: "supervised",
            label: "Supervised",
            required: true,
            valueType: { type: "list", items: { type: "boolean" } },
          },
          {
            id: "targetTask",
            label: "Target Task",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "includeSupervised",
            label: "Include Supervised",
            required: true,
            valueType: { type: "boolean" },
          },
          {
            id: "required",
            label: "Required",
            required: true,
            valueType: { type: "integer" },
          },
        ],
        outputs: [
          { id: "count", label: "Count", valueType: { type: "integer" } },
          {
            id: "remaining",
            label: "Remaining",
            valueType: { type: "integer" },
          },
        ],
      },
    },
    calculate,
  });
export const run = vocationalLogbookTaskRepetitionCountTool.execute;
export default vocationalLogbookTaskRepetitionCountTool;
