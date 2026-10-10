import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly taskId: string;
  readonly verbalPrompts: number;
  readonly physicalPrompts: number;
};
export type Output = { readonly totalPrompts: number; readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    taskId: { type: "string", maxLength: 8192, minLength: 1 },
    verbalPrompts: { type: "integer", minimum: 0 },
    physicalPrompts: { type: "integer", minimum: 0 },
  },
  required: ["taskId", "verbalPrompts", "physicalPrompts"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    totalPrompts: { type: "integer" },
    label: { type: "string", maxLength: 8192 },
  },
  required: ["totalPrompts", "label"],
} as const;
/** Reconcile explicitly counted verbal and physical prompts without inferring independence or a functional score. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { taskId, verbalPrompts, physicalPrompts } = request;
  const compute = (): Output => {
    H.domain(taskId.length > 0, "taskId");
    (H.domain(
      Number.isSafeInteger(verbalPrompts) &&
        verbalPrompts >= 0 &&
        verbalPrompts <= Number.MAX_SAFE_INTEGER,
      "verbalPrompts",
    ),
      verbalPrompts);
    (H.domain(
      Number.isSafeInteger(physicalPrompts) &&
        physicalPrompts >= 0 &&
        physicalPrompts <= Number.MAX_SAFE_INTEGER,
      "physicalPrompts",
    ),
      physicalPrompts);
    return {
      totalPrompts: verbalPrompts + physicalPrompts,
      label:
        taskId + "; verbal=" + verbalPrompts + "; physical=" + physicalPrompts,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { taskId: "T17", verbalPrompts: 3, physicalPrompts: 1 },
  output: { totalPrompts: 4, label: "T17; verbal=3; physical=1" },
} satisfies ToolExample<Input, Output>;
export const taskStepPromptCountTool = H.defineSchemaCalculation<Input, Output>(
  {
    ...{
      discovery: {
        aliases: [],
        collections: ["data"],
        fields: [
          "occupational-therapy",
          "occupational therapy",
          "health and medicine",
        ],
        keywords: ["occupational therapy", "health and medicine"],
      },
      id: "occupational-therapy/task-step-prompt-count",
      title: "Task Step Prompt Count",
      description:
        "Reconcile explicitly counted verbal and physical prompts without inferring independence or a functional score.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          taskId: { type: "string", maxLength: 8192, minLength: 1 },
          verbalPrompts: { type: "integer", minimum: 0 },
          physicalPrompts: { type: "integer", minimum: 0 },
        },
        required: ["taskId", "verbalPrompts", "physicalPrompts"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          totalPrompts: { type: "integer" },
          label: { type: "string", maxLength: 8192 },
        },
        required: ["totalPrompts", "label"],
      },
      ports: {
        inputs: [
          {
            id: "taskId",
            label: "Task Id",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "verbalPrompts",
            label: "Verbal Prompts",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "physicalPrompts",
            label: "Physical Prompts",
            required: true,
            valueType: { type: "integer" },
          },
        ],
        outputs: [
          {
            id: "totalPrompts",
            label: "Total Prompts",
            valueType: { type: "integer" },
          },
          { id: "label", label: "Label", valueType: { type: "string" } },
        ],
      },
    },
    calculate,
  },
);
export const run = taskStepPromptCountTool.execute;
export default taskStepPromptCountTool;
