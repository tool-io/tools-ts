import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly taskStartTime: number;
  readonly helpRequestTime: number;
};
export type Output = { readonly signedGap: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    taskStartTime: { type: "number" },
    helpRequestTime: { type: "number" },
  },
  required: ["taskStartTime", "helpRequestTime"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { signedGap: { type: "number" } },
  required: ["signedGap"],
} as const;
/** Calculate signed supplied help-request latency from task onset without interpreting motivation or difficulty. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { taskStartTime, helpRequestTime } = request;
  const compute = (): Output => {
    return { signedGap: helpRequestTime - taskStartTime };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { taskStartTime: 12, helpRequestTime: 17 },
  output: { signedGap: 5 },
} satisfies ToolExample<Input, Output>;
export const educationalTaskHelpRequestLatencyTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "educational-psychology/educational-task-help-request-latency",
    title: "Educational Task Help Request Latency Tool",
    description:
      "Calculate signed supplied help-request latency from task onset without interpreting motivation or difficulty.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        taskStartTime: { type: "number" },
        helpRequestTime: { type: "number" },
      },
      required: ["taskStartTime", "helpRequestTime"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { signedGap: { type: "number" } },
      required: ["signedGap"],
    },
    ports: {
      inputs: [
        {
          id: "taskStartTime",
          label: "Task Start Time",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "helpRequestTime",
          label: "Help Request Time",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "signedGap", label: "Signed Gap", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = educationalTaskHelpRequestLatencyTool.execute;
export default educationalTaskHelpRequestLatencyTool;
