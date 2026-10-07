import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly queueJoinSeconds: number;
  readonly turnStartSeconds: number;
};
export type Output = { readonly signedGap: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    queueJoinSeconds: { type: "number" },
    turnStartSeconds: { type: "number" },
  },
  required: ["queueJoinSeconds", "turnStartSeconds"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { signedGap: { type: "number" } },
  required: ["signedGap"],
} as const;
/** Subtract explicit meeting queue-join from turn-start timestamps without evaluating participation fairness. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { queueJoinSeconds, turnStartSeconds } = request;
  const compute = (): Output => {
    return { signedGap: turnStartSeconds - queueJoinSeconds };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { queueJoinSeconds: 12, turnStartSeconds: 17 },
  output: { signedGap: 5 },
} satisfies ToolExample<Input, Output>;
export const meetingTurnQueueWaitDurationTool = H.defineSchemaCalculation<
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
    id: "communication/meeting-turn-queue-wait-duration",
    title: "Meeting Turn Queue Wait Duration",
    description:
      "Subtract explicit meeting queue-join from turn-start timestamps without evaluating participation fairness.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        queueJoinSeconds: { type: "number" },
        turnStartSeconds: { type: "number" },
      },
      required: ["queueJoinSeconds", "turnStartSeconds"],
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
          id: "queueJoinSeconds",
          label: "Queue Join Seconds",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "turnStartSeconds",
          label: "Turn Start Seconds",
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
export const run = meetingTurnQueueWaitDurationTool.execute;
export default meetingTurnQueueWaitDurationTool;
