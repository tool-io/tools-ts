import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly sessionMinutes: number;
  readonly participants: number;
  readonly observerMinutes: number;
  readonly pausedMinutes: number;
};
export type Output = {
  readonly grossPersonMinutes: number;
  readonly netParticipantMinutes: number;
  readonly totalContactMinutes: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sessionMinutes: { type: "number", minimum: 0 },
    participants: { type: "integer", minimum: 0 },
    observerMinutes: { type: "number", minimum: 0 },
    pausedMinutes: { type: "number", minimum: 0 },
  },
  required: [
    "sessionMinutes",
    "participants",
    "observerMinutes",
    "pausedMinutes",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    grossPersonMinutes: { type: "number" },
    netParticipantMinutes: { type: "number" },
    totalContactMinutes: { type: "number" },
  },
  required: [
    "grossPersonMinutes",
    "netParticipantMinutes",
    "totalContactMinutes",
  ],
} as const;
/** Calculate biosecurity drill participant minute budget from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { sessionMinutes, participants, observerMinutes, pausedMinutes } =
    request;
  const compute = (): Output => {
    H.integer(participants, 0);
    H.domain(
      sessionMinutes >= 0 &&
        observerMinutes >= 0 &&
        pausedMinutes >= 0 &&
        pausedMinutes <= sessionMinutes,
    );
    return {
      grossPersonMinutes: sessionMinutes * participants,
      netParticipantMinutes: (sessionMinutes - pausedMinutes) * participants,
      totalContactMinutes:
        (sessionMinutes - pausedMinutes) * participants + observerMinutes,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    sessionMinutes: 60,
    participants: 10,
    observerMinutes: 30,
    pausedMinutes: 5,
  },
  output: {
    grossPersonMinutes: 600,
    netParticipantMinutes: 550,
    totalContactMinutes: 580,
  },
} satisfies ToolExample<Input, Output>;
export const biosecurityDrillParticipantMinuteBudgetTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "biosecurity/biosecurity-drill-participant-minute-budget",
      title: "Biosecurity Drill Participant Minute Budget Tool",
      description:
        "Calculate biosecurity drill participant minute budget from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          sessionMinutes: { type: "number", minimum: 0 },
          participants: { type: "integer", minimum: 0 },
          observerMinutes: { type: "number", minimum: 0 },
          pausedMinutes: { type: "number", minimum: 0 },
        },
        required: [
          "sessionMinutes",
          "participants",
          "observerMinutes",
          "pausedMinutes",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          grossPersonMinutes: { type: "number" },
          netParticipantMinutes: { type: "number" },
          totalContactMinutes: { type: "number" },
        },
        required: [
          "grossPersonMinutes",
          "netParticipantMinutes",
          "totalContactMinutes",
        ],
      },
      ports: {
        inputs: [
          {
            id: "sessionMinutes",
            label: "Session Minutes",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "participants",
            label: "Participants",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "observerMinutes",
            label: "Observer Minutes",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "pausedMinutes",
            label: "Paused Minutes",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "grossPersonMinutes",
            label: "Gross Person Minutes",
            valueType: { type: "number" },
          },
          {
            id: "netParticipantMinutes",
            label: "Net Participant Minutes",
            valueType: { type: "number" },
          },
          {
            id: "totalContactMinutes",
            label: "Total Contact Minutes",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = biosecurityDrillParticipantMinuteBudgetTool.execute;
export default biosecurityDrillParticipantMinuteBudgetTool;
