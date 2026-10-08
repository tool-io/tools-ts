import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly priorCompletedVisits: number;
  readonly priorPracticeSessions: number;
};
export type Output = {
  readonly totalPriorExposures: number;
  readonly currentVisitOrdinal: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    priorCompletedVisits: { type: "integer", minimum: 0 },
    priorPracticeSessions: { type: "integer", minimum: 0 },
  },
  required: ["priorCompletedVisits", "priorPracticeSessions"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    totalPriorExposures: { type: "integer" },
    currentVisitOrdinal: { type: "integer" },
  },
  required: ["totalPriorExposures", "currentVisitOrdinal"],
} as const;
/** Count explicitly recorded prior testing and practice exposures while keeping visit ordinal distinct from practice exposure. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { priorCompletedVisits, priorPracticeSessions } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isSafeInteger(priorCompletedVisits) &&
        priorCompletedVisits >= 0 &&
        priorCompletedVisits <= Number.MAX_SAFE_INTEGER - 1,
      "priorCompletedVisits",
    ),
      priorCompletedVisits);
    (H.domain(
      Number.isSafeInteger(priorPracticeSessions) &&
        priorPracticeSessions >= 0 &&
        priorPracticeSessions <= Number.MAX_SAFE_INTEGER,
      "priorPracticeSessions",
    ),
      priorPracticeSessions);
    return {
      totalPriorExposures: priorCompletedVisits + priorPracticeSessions,
      currentVisitOrdinal: priorCompletedVisits + 1,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { priorCompletedVisits: 3, priorPracticeSessions: 2 },
  output: { totalPriorExposures: 5, currentVisitOrdinal: 4 },
} satisfies ToolExample<Input, Output>;
export const longitudinalVisitPracticeCountTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: [
        "developmental-psychology",
        "developmental psychology",
        "psychology",
      ],
      keywords: ["developmental psychology", "psychology"],
    },
    id: "developmental-psychology/longitudinal-visit-practice-count",
    title: "Longitudinal Visit Practice Count",
    description:
      "Count explicitly recorded prior testing and practice exposures while keeping visit ordinal distinct from practice exposure.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        priorCompletedVisits: { type: "integer", minimum: 0 },
        priorPracticeSessions: { type: "integer", minimum: 0 },
      },
      required: ["priorCompletedVisits", "priorPracticeSessions"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        totalPriorExposures: { type: "integer" },
        currentVisitOrdinal: { type: "integer" },
      },
      required: ["totalPriorExposures", "currentVisitOrdinal"],
    },
    ports: {
      inputs: [
        {
          id: "priorCompletedVisits",
          label: "Prior Completed Visits",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "priorPracticeSessions",
          label: "Prior Practice Sessions",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "totalPriorExposures",
          label: "Total Prior Exposures",
          valueType: { type: "integer" },
        },
        {
          id: "currentVisitOrdinal",
          label: "Current Visit Ordinal",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = longitudinalVisitPracticeCountTool.execute;
export default longitudinalVisitPracticeCountTool;
