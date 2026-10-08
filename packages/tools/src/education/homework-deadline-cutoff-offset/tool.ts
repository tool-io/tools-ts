import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly suppliedDeadlineSeconds: number;
  readonly submissionSeconds: number;
};
export type Output = { readonly signedGap: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    suppliedDeadlineSeconds: { type: "number" },
    submissionSeconds: { type: "number" },
  },
  required: ["suppliedDeadlineSeconds", "submissionSeconds"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { signedGap: { type: "number" } },
  required: ["signedGap"],
} as const;
/** Subtract an explicit homework deadline from a submission marker on one shared timeline, retaining early submissions as negative offsets. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { suppliedDeadlineSeconds, submissionSeconds } = request;
  const compute = (): Output => {
    return { signedGap: submissionSeconds - suppliedDeadlineSeconds };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { suppliedDeadlineSeconds: 12, submissionSeconds: 17 },
  output: { signedGap: 5 },
} satisfies ToolExample<Input, Output>;
export const homeworkDeadlineCutoffOffsetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["education"],
      keywords: ["education"],
    },
    id: "education/homework-deadline-cutoff-offset",
    title: "Homework Deadline Cutoff Offset",
    description:
      "Subtract an explicit homework deadline from a submission marker on one shared timeline, retaining early submissions as negative offsets.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        suppliedDeadlineSeconds: { type: "number" },
        submissionSeconds: { type: "number" },
      },
      required: ["suppliedDeadlineSeconds", "submissionSeconds"],
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
          id: "suppliedDeadlineSeconds",
          label: "Supplied Deadline Seconds",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "submissionSeconds",
          label: "Submission Seconds",
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
export const run = homeworkDeadlineCutoffOffsetTool.execute;
export default homeworkDeadlineCutoffOffsetTool;
