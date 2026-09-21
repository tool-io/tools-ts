import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly participantIds: readonly string[];
  readonly turnDurations: readonly number[];
  readonly selectedParticipant: string;
  readonly reservedDuration: number;
};
export type Output = {
  readonly allocatedDuration: number;
  readonly selectedDuration: number;
  readonly shareOfSession: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    participantIds: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    turnDurations: {
      type: "array",
      maxItems: 256,
      items: { type: "number", minimum: 0 },
    },
    selectedParticipant: { type: "string", maxLength: 8192 },
    reservedDuration: { type: "number", minimum: 0 },
  },
  required: [
    "participantIds",
    "turnDurations",
    "selectedParticipant",
    "reservedDuration",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    allocatedDuration: { type: "number" },
    selectedDuration: { type: "number" },
    shareOfSession: { type: "number" },
  },
  required: ["allocatedDuration", "selectedDuration", "shareOfSession"],
} as const;
/** Calculate peer circle turn allocation share from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    participantIds,
    turnDurations,
    selectedParticipant,
    reservedDuration,
  } = request;
  const compute = (): Output => {
    H.sameLength(participantIds, turnDurations);
    H.domain(turnDurations.every((x) => x >= 0) && reservedDuration >= 0);
    return (() => {
      const allocatedDuration = turnDurations.reduce((a, b) => a + b, 0),
        selectedDuration = turnDurations.reduce(
          (s, x, i) => s + (participantIds[i] === selectedParticipant ? x : 0),
          0,
        );
      H.positive(allocatedDuration + reservedDuration);
      return {
        allocatedDuration,
        selectedDuration,
        shareOfSession:
          selectedDuration / (allocatedDuration + reservedDuration),
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    participantIds: ["A", "B", "A"],
    turnDurations: [2, 3, 1],
    selectedParticipant: "A",
    reservedDuration: 4,
  },
  output: { allocatedDuration: 6, selectedDuration: 3, shareOfSession: 0.3 },
} satisfies ToolExample<Input, Output>;
export const peerCircleTurnAllocationShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "andragogy/peer-circle-turn-allocation-share",
    title: "Peer Circle Turn Allocation Share Tool",
    description:
      "Calculate peer circle turn allocation share from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        participantIds: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        turnDurations: {
          type: "array",
          maxItems: 256,
          items: { type: "number", minimum: 0 },
        },
        selectedParticipant: { type: "string", maxLength: 8192 },
        reservedDuration: { type: "number", minimum: 0 },
      },
      required: [
        "participantIds",
        "turnDurations",
        "selectedParticipant",
        "reservedDuration",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        allocatedDuration: { type: "number" },
        selectedDuration: { type: "number" },
        shareOfSession: { type: "number" },
      },
      required: ["allocatedDuration", "selectedDuration", "shareOfSession"],
    },
    ports: {
      inputs: [
        {
          id: "participantIds",
          label: "Participant Ids",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "turnDurations",
          label: "Turn Durations",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "selectedParticipant",
          label: "Selected Participant",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "reservedDuration",
          label: "Reserved Duration",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "allocatedDuration",
          label: "Allocated Duration",
          valueType: { type: "number" },
        },
        {
          id: "selectedDuration",
          label: "Selected Duration",
          valueType: { type: "number" },
        },
        {
          id: "shareOfSession",
          label: "Share Of Session",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = peerCircleTurnAllocationShareTool.execute;
export default peerCircleTurnAllocationShareTool;
