import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly taskHours: number;
  readonly suppliedWeight: number;
};
export type Output = { readonly weightedHours: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    taskHours: { type: "number", minimum: 0 },
    suppliedWeight: { type: "number", minimum: 0 },
  },
  required: ["taskHours", "suppliedWeight"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { weightedHours: { type: "number" } },
  required: ["weightedHours"],
} as const;
/** Calculate volunteer task time weight from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { taskHours, suppliedWeight } = request;
  const compute = (): Output => {
    H.domain(taskHours >= 0 && suppliedWeight >= 0);
    return { weightedHours: taskHours * suppliedWeight };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { taskHours: 3, suppliedWeight: 0.5 },
  output: { weightedHours: 1.5 },
} satisfies ToolExample<Input, Output>;
export const volunteerTaskTimeWeightTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "urban-agriculture/volunteer-task-time-weight",
    title: "Volunteer Task Time Weight Tool",
    description:
      "Calculate volunteer task time weight from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        taskHours: { type: "number", minimum: 0 },
        suppliedWeight: { type: "number", minimum: 0 },
      },
      required: ["taskHours", "suppliedWeight"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { weightedHours: { type: "number" } },
      required: ["weightedHours"],
    },
    ports: {
      inputs: [
        {
          id: "taskHours",
          label: "Task Hours",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedWeight",
          label: "Supplied Weight",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "weightedHours",
          label: "Weighted Hours",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = volunteerTaskTimeWeightTool.execute;
export default volunteerTaskTimeWeightTool;
