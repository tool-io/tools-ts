import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly reactionTime: number;
  readonly cutoff: number;
  readonly inclusiveReject: boolean;
};
export type Output = { readonly margin: number; readonly anticipated: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    reactionTime: { type: "number", minimum: 0 },
    cutoff: { type: "number", minimum: 0 },
    inclusiveReject: { type: "boolean" },
  },
  required: ["reactionTime", "cutoff", "inclusiveReject"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { margin: { type: "number" }, anticipated: { type: "boolean" } },
  required: ["margin", "anticipated"],
} as const;
/** Caller-defined research exclusion rule; no universal anticipation latency threshold is assumed. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { reactionTime, cutoff, inclusiveReject } = request;
  const compute = (): Output => {
    H.domain(reactionTime >= 0 && cutoff >= 0);
    return {
      margin: reactionTime - cutoff,
      anticipated: inclusiveReject
        ? reactionTime <= cutoff
        : reactionTime < cutoff,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { reactionTime: 120, cutoff: 150, inclusiveReject: false },
  output: { margin: -30, anticipated: true },
} satisfies ToolExample<Input, Output>;
export const reactionTimeAnticipationCallerCutoffGapTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "experimental-psychology/reaction-time-anticipation-caller-cutoff-gap",
      title: "Reaction Time Anticipation Caller Cutoff Gap Tool",
      description:
        "Caller-defined research exclusion rule; no universal anticipation latency threshold is assumed.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          reactionTime: { type: "number", minimum: 0 },
          cutoff: { type: "number", minimum: 0 },
          inclusiveReject: { type: "boolean" },
        },
        required: ["reactionTime", "cutoff", "inclusiveReject"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          margin: { type: "number" },
          anticipated: { type: "boolean" },
        },
        required: ["margin", "anticipated"],
      },
      ports: {
        inputs: [
          {
            id: "reactionTime",
            label: "Reaction Time",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "cutoff",
            label: "Cutoff",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "inclusiveReject",
            label: "Inclusive Reject",
            required: true,
            valueType: { type: "boolean" },
          },
        ],
        outputs: [
          { id: "margin", label: "Margin", valueType: { type: "number" } },
          {
            id: "anticipated",
            label: "Anticipated",
            valueType: { type: "boolean" },
          },
        ],
      },
    },
    calculate,
  });
export const run = reactionTimeAnticipationCallerCutoffGapTool.execute;
export default reactionTimeAnticipationCallerCutoffGapTool;
