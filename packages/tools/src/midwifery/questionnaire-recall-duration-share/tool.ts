import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly observedRecallDuration: number;
  readonly requestedRecallDuration: number;
};
export type Output = { readonly share: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    observedRecallDuration: { type: "number", minimum: 0 },
    requestedRecallDuration: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["observedRecallDuration", "requestedRecallDuration"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { share: { type: "number" } },
  required: ["share"],
} as const;
/** Calculate questionnaire recall duration share from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { observedRecallDuration, requestedRecallDuration } = request;
  const compute = (): Output => {
    H.domain(observedRecallDuration >= 0);
    H.positive(requestedRecallDuration);
    return { share: observedRecallDuration / requestedRecallDuration };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { observedRecallDuration: 15, requestedRecallDuration: 20 },
  output: { share: 0.75 },
} satisfies ToolExample<Input, Output>;
export const questionnaireRecallDurationShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "midwifery/questionnaire-recall-duration-share",
    title: "Questionnaire Recall Duration Share Tool",
    description:
      "Calculate questionnaire recall duration share from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        observedRecallDuration: { type: "number", minimum: 0 },
        requestedRecallDuration: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["observedRecallDuration", "requestedRecallDuration"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { share: { type: "number" } },
      required: ["share"],
    },
    ports: {
      inputs: [
        {
          id: "observedRecallDuration",
          label: "Observed Recall Duration",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "requestedRecallDuration",
          label: "Requested Recall Duration",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [{ id: "share", label: "Share", valueType: { type: "number" } }],
    },
  },
  calculate,
});
export const run = questionnaireRecallDurationShareTool.execute;
export default questionnaireRecallDurationShareTool;
