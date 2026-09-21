import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly eligible: number;
  readonly participants: number;
  readonly pending: number;
};
export type Output = {
  readonly takeup: number;
  readonly possibleTakeup: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    eligible: { type: "integer", minimum: 1 },
    participants: { type: "integer", minimum: 0 },
    pending: { type: "integer", minimum: 0 },
  },
  required: ["eligible", "participants", "pending"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    takeup: { type: "number" },
    possibleTakeup: { type: "number" },
  },
  required: ["takeup", "possibleTakeup"],
} as const;
/** Calculate agricultural program takeup one group from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { eligible, participants, pending } = request;
  const compute = (): Output => {
    H.integer(eligible, 1);
    H.integer(participants, 0, eligible);
    H.integer(pending, 0, eligible - participants);
    return {
      takeup: participants / eligible,
      possibleTakeup: (participants + pending) / eligible,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { eligible: 100, participants: 60, pending: 20 },
  output: { takeup: 0.6, possibleTakeup: 0.8 },
} satisfies ToolExample<Input, Output>;
export const agriculturalProgramTakeupOneGroupTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "agricultural-policy/agricultural-program-takeup-one-group",
    title: "Agricultural Program Takeup One Group Tool",
    description:
      "Calculate agricultural program takeup one group from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        eligible: { type: "integer", minimum: 1 },
        participants: { type: "integer", minimum: 0 },
        pending: { type: "integer", minimum: 0 },
      },
      required: ["eligible", "participants", "pending"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        takeup: { type: "number" },
        possibleTakeup: { type: "number" },
      },
      required: ["takeup", "possibleTakeup"],
    },
    ports: {
      inputs: [
        {
          id: "eligible",
          label: "Eligible",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "participants",
          label: "Participants",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "pending",
          label: "Pending",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "takeup", label: "Takeup", valueType: { type: "number" } },
        {
          id: "possibleTakeup",
          label: "Possible Takeup",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = agriculturalProgramTakeupOneGroupTool.execute;
export default agriculturalProgramTakeupOneGroupTool;
