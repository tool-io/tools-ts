import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly trialCode: string;
  readonly presented: boolean;
  readonly responseRecorded: boolean;
};
export type Output = { readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    trialCode: { type: "string", maxLength: 8192, minLength: 1 },
    presented: { type: "boolean" },
    responseRecorded: { type: "boolean" },
  },
  required: ["trialCode", "presented", "responseRecorded"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { label: { type: "string", maxLength: 8192 } },
  required: ["label"],
} as const;
/** Distinguish an unpresented trial from a presented trial with no recorded response. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { trialCode, presented, responseRecorded } = request;
  const compute = (): Output => {
    H.domain(trialCode.length > 0, "trialCode");
    H.domain(!responseRecorded || presented, "responseRecorded");
    return {
      label:
        trialCode +
        " [" +
        (!presented
          ? "not-presented"
          : responseRecorded
            ? "response-recorded"
            : "missed-response") +
        "]",
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { trialCode: "T17", presented: true, responseRecorded: false },
  output: { label: "T17 [missed-response]" },
} satisfies ToolExample<Input, Output>;
export const taskMissedResponseLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["behavioral-science", "behavioral science", "psychology"],
      keywords: ["behavioral science", "psychology"],
    },
    id: "behavioral-science/task-missed-response-label",
    title: "Task Missed Response Label",
    description:
      "Distinguish an unpresented trial from a presented trial with no recorded response.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        trialCode: { type: "string", maxLength: 8192, minLength: 1 },
        presented: { type: "boolean" },
        responseRecorded: { type: "boolean" },
      },
      required: ["trialCode", "presented", "responseRecorded"],
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
          id: "trialCode",
          label: "Trial Code",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "presented",
          label: "Presented",
          required: true,
          valueType: { type: "boolean" },
        },
        {
          id: "responseRecorded",
          label: "Response Recorded",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [{ id: "label", label: "Label", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = taskMissedResponseLabelTool.execute;
export default taskMissedResponseLabelTool;
