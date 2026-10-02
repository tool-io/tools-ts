import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly participatingMinutes: number;
  readonly availableMinutes: number;
  readonly excludedMinutes: number;
};
export type Output = {
  readonly eligibleMinutes: number;
  readonly share: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    participatingMinutes: { type: "number", minimum: 0 },
    availableMinutes: { type: "number" },
    excludedMinutes: { type: "number", minimum: 0 },
  },
  required: ["participatingMinutes", "availableMinutes", "excludedMinutes"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    eligibleMinutes: { type: "number" },
    share: { type: "number" },
  },
  required: ["eligibleMinutes", "share"],
} as const;
/** Participation-time bookkeeping without inferring agreement, influence or mediation effectiveness. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { participatingMinutes, availableMinutes, excludedMinutes } = request;
  const compute = (): Output => {
    H.domain(
      availableMinutes > excludedMinutes &&
        excludedMinutes >= 0 &&
        participatingMinutes >= 0 &&
        participatingMinutes <= availableMinutes - excludedMinutes,
    );
    return {
      eligibleMinutes: availableMinutes - excludedMinutes,
      share: participatingMinutes / (availableMinutes - excludedMinutes),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    participatingMinutes: 45,
    availableMinutes: 90,
    excludedMinutes: 30,
  },
  output: { eligibleMinutes: 60, share: 0.75 },
} satisfies ToolExample<Input, Output>;
export const mediationSessionParticipationShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "peace-studies/mediation-session-participation-share",
    title: "Mediation Session Participation Share Tool",
    description:
      "Participation-time bookkeeping without inferring agreement, influence or mediation effectiveness.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        participatingMinutes: { type: "number", minimum: 0 },
        availableMinutes: { type: "number" },
        excludedMinutes: { type: "number", minimum: 0 },
      },
      required: ["participatingMinutes", "availableMinutes", "excludedMinutes"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        eligibleMinutes: { type: "number" },
        share: { type: "number" },
      },
      required: ["eligibleMinutes", "share"],
    },
    ports: {
      inputs: [
        {
          id: "participatingMinutes",
          label: "Participating Minutes",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "availableMinutes",
          label: "Available Minutes",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "excludedMinutes",
          label: "Excluded Minutes",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "eligibleMinutes",
          label: "Eligible Minutes",
          valueType: { type: "number" },
        },
        { id: "share", label: "Share", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = mediationSessionParticipationShareTool.execute;
export default mediationSessionParticipationShareTool;
