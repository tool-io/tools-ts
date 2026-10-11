import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly taskCode: string;
  readonly assistanceWording: string;
  readonly respondent: string;
};
export type Output = { readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    taskCode: { type: "string", maxLength: 8192, minLength: 1 },
    assistanceWording: { type: "string", maxLength: 8192, minLength: 1 },
    respondent: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["taskCode", "assistanceWording", "respondent"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { label: { type: "string", maxLength: 8192 } },
  required: ["label"],
} as const;
/** Label explicit task-assistance wording and respondent source without scoring functional limitation. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { taskCode, assistanceWording, respondent } = request;
  const compute = (): Output => {
    H.domain(
      taskCode.length > 0 &&
        assistanceWording.length > 0 &&
        respondent.length > 0,
      "taskCode",
    );
    return {
      label:
        taskCode +
        "; assistance=" +
        JSON.stringify(assistanceWording) +
        " [" +
        respondent +
        "]",
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    taskCode: "T17",
    assistanceWording: "help opening container",
    respondent: "self report",
  },
  output: { label: 'T17; assistance="help opening container" [self report]' },
} satisfies ToolExample<Input, Output>;
export const functionalTaskAssistanceLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["rheumatology", "health and medicine"],
      keywords: ["rheumatology", "health and medicine"],
    },
    id: "rheumatology/functional-task-assistance-label",
    title: "Functional Task Assistance Label",
    description:
      "Label explicit task-assistance wording and respondent source without scoring functional limitation.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        taskCode: { type: "string", maxLength: 8192, minLength: 1 },
        assistanceWording: { type: "string", maxLength: 8192, minLength: 1 },
        respondent: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["taskCode", "assistanceWording", "respondent"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { label: { type: "string", maxLength: 8192 } },
      required: ["label"],
    },
    ports: {
      inputs: [
        {
          id: "taskCode",
          label: "Task Code",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "assistanceWording",
          label: "Assistance Wording",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "respondent",
          label: "Respondent",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "label", label: "Label", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = functionalTaskAssistanceLabelTool.execute;
export default functionalTaskAssistanceLabelTool;
