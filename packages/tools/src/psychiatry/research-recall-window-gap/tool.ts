import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly eventAt: number;
  readonly interviewAt: number;
  readonly recalledDuration: number;
};
export type Output = {
  readonly actualRecallDuration: number;
  readonly recallGap: number;
  readonly eventPrecedesInterview: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    eventAt: { type: "number" },
    interviewAt: { type: "number" },
    recalledDuration: { type: "number", minimum: 0 },
  },
  required: ["eventAt", "interviewAt", "recalledDuration"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    actualRecallDuration: { type: "number" },
    recallGap: { type: "number" },
    eventPrecedesInterview: { type: "boolean" },
  },
  required: ["actualRecallDuration", "recallGap", "eventPrecedesInterview"],
} as const;
/** Compare explicitly supplied research recall timing, without clinical interpretation. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { eventAt, interviewAt, recalledDuration } = request;
  const compute = (): Output => {
    H.domain(recalledDuration >= 0);
    return {
      actualRecallDuration: interviewAt - eventAt,
      recallGap: recalledDuration - (interviewAt - eventAt),
      eventPrecedesInterview: eventAt <= interviewAt,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { eventAt: 10, interviewAt: 20, recalledDuration: 8 },
  output: {
    actualRecallDuration: 10,
    recallGap: -2,
    eventPrecedesInterview: true,
  },
} satisfies ToolExample<Input, Output>;
export const researchRecallWindowGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "psychiatry/research-recall-window-gap",
    title: "Research Recall Window Gap Tool",
    description:
      "Compare explicitly supplied research recall timing, without clinical interpretation.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        eventAt: { type: "number" },
        interviewAt: { type: "number" },
        recalledDuration: { type: "number", minimum: 0 },
      },
      required: ["eventAt", "interviewAt", "recalledDuration"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        actualRecallDuration: { type: "number" },
        recallGap: { type: "number" },
        eventPrecedesInterview: { type: "boolean" },
      },
      required: ["actualRecallDuration", "recallGap", "eventPrecedesInterview"],
    },
    ports: {
      inputs: [
        {
          id: "eventAt",
          label: "Event At",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "interviewAt",
          label: "Interview At",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "recalledDuration",
          label: "Recalled Duration",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "actualRecallDuration",
          label: "Actual Recall Duration",
          valueType: { type: "number" },
        },
        { id: "recallGap", label: "Recall Gap", valueType: { type: "number" } },
        {
          id: "eventPrecedesInterview",
          label: "Event Precedes Interview",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = researchRecallWindowGapTool.execute;
export default researchRecallWindowGapTool;
