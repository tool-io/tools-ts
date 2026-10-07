import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly responseSeconds: number;
  readonly suppliedDeadlineSeconds: number;
  readonly includeDeadline: boolean;
};
export type Output = {
  readonly withinSuppliedDeadline: boolean;
  readonly latenessSeconds: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    responseSeconds: { type: "number" },
    suppliedDeadlineSeconds: { type: "number" },
    includeDeadline: { type: "boolean" },
  },
  required: ["responseSeconds", "suppliedDeadlineSeconds", "includeDeadline"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    withinSuppliedDeadline: { type: "boolean" },
    latenessSeconds: { type: "number" },
  },
  required: ["withinSuppliedDeadline", "latenessSeconds"],
} as const;
/** Compare explicit response and deadline timestamps with a caller-selected equality policy. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { responseSeconds, suppliedDeadlineSeconds, includeDeadline } = request;
  const compute = (): Output => {
    return {
      withinSuppliedDeadline: includeDeadline
        ? responseSeconds <= suppliedDeadlineSeconds
        : responseSeconds < suppliedDeadlineSeconds,
      latenessSeconds: responseSeconds - suppliedDeadlineSeconds,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    responseSeconds: 90,
    suppliedDeadlineSeconds: 100,
    includeDeadline: true,
  },
  output: { withinSuppliedDeadline: true, latenessSeconds: -10 },
} satisfies ToolExample<Input, Output>;
export const messageResponseBeforeAfterDeadlineTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["communication", "social sciences"],
      keywords: ["communication", "social sciences"],
    },
    id: "communication/message-response-before-after-deadline",
    title: "Message Response Before After Deadline",
    description:
      "Compare explicit response and deadline timestamps with a caller-selected equality policy.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        responseSeconds: { type: "number" },
        suppliedDeadlineSeconds: { type: "number" },
        includeDeadline: { type: "boolean" },
      },
      required: [
        "responseSeconds",
        "suppliedDeadlineSeconds",
        "includeDeadline",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        withinSuppliedDeadline: { type: "boolean" },
        latenessSeconds: { type: "number" },
      },
      required: ["withinSuppliedDeadline", "latenessSeconds"],
    },
    ports: {
      inputs: [
        {
          id: "responseSeconds",
          label: "Response Seconds",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedDeadlineSeconds",
          label: "Supplied Deadline Seconds",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "includeDeadline",
          label: "Include Deadline",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "withinSuppliedDeadline",
          label: "Within Supplied Deadline",
          valueType: { type: "boolean" },
        },
        {
          id: "latenessSeconds",
          label: "Lateness Seconds",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = messageResponseBeforeAfterDeadlineTool.execute;
export default messageResponseBeforeAfterDeadlineTool;
