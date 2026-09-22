import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly duration: number;
  readonly participants: number;
};
export type Output = { readonly durationPerParticipant: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    duration: { type: "number", minimum: 0 },
    participants: { type: "integer", minimum: 1 },
  },
  required: ["duration", "participants"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { durationPerParticipant: { type: "number" } },
  required: ["durationPerParticipant"],
} as const;
/** Calculate critique duration per participant from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { duration, participants } = request;
  const compute = (): Output => {
    H.domain(duration >= 0);
    H.integer(participants, 1);
    return { durationPerParticipant: duration / participants };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { duration: 60, participants: 12 },
  output: { durationPerParticipant: 5 },
} satisfies ToolExample<Input, Output>;
export const critiqueDurationPerParticipantTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "art-education/critique-duration-per-participant",
    title: "Critique Duration Per Participant Tool",
    description:
      "Calculate critique duration per participant from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        duration: { type: "number", minimum: 0 },
        participants: { type: "integer", minimum: 1 },
      },
      required: ["duration", "participants"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { durationPerParticipant: { type: "number" } },
      required: ["durationPerParticipant"],
    },
    ports: {
      inputs: [
        {
          id: "duration",
          label: "Duration",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "participants",
          label: "Participants",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "durationPerParticipant",
          label: "Duration Per Participant",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = critiqueDurationPerParticipantTool.execute;
export default critiqueDurationPerParticipantTool;
