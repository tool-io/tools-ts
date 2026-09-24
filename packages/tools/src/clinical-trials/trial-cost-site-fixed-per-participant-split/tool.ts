import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly siteFixed: number;
  readonly participantVariable: number;
  readonly participants: number;
  readonly sharedCentral: number;
  readonly siteShare: number;
};
export type Output = {
  readonly fixedAllocated: number;
  readonly variableTotal: number;
  readonly total: number;
  readonly perParticipant: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    siteFixed: { type: "number", minimum: 0 },
    participantVariable: { type: "number", minimum: 0 },
    participants: { type: "integer", minimum: 1 },
    sharedCentral: { type: "number", minimum: 0 },
    siteShare: { type: "number", minimum: 0, maximum: 1 },
  },
  required: [
    "siteFixed",
    "participantVariable",
    "participants",
    "sharedCentral",
    "siteShare",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    fixedAllocated: { type: "number" },
    variableTotal: { type: "number" },
    total: { type: "number" },
    perParticipant: { type: "number" },
  },
  required: ["fixedAllocated", "variableTotal", "total", "perParticipant"],
} as const;
/** Calculate trial cost site fixed per participant split from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    siteFixed,
    participantVariable,
    participants,
    sharedCentral,
    siteShare,
  } = request;
  const compute = (): Output => {
    H.integer(participants, 1);
    H.domain(siteFixed >= 0 && participantVariable >= 0 && sharedCentral >= 0);
    H.probability(siteShare);
    return {
      fixedAllocated: siteFixed + sharedCentral * siteShare,
      variableTotal: participants * participantVariable,
      total:
        siteFixed +
        sharedCentral * siteShare +
        participants * participantVariable,
      perParticipant:
        (siteFixed + sharedCentral * siteShare) / participants +
        participantVariable,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    siteFixed: 1000,
    participantVariable: 50,
    participants: 20,
    sharedCentral: 500,
    siteShare: 0.2,
  },
  output: {
    fixedAllocated: 1100,
    variableTotal: 1000,
    total: 2100,
    perParticipant: 105,
  },
} satisfies ToolExample<Input, Output>;
export const trialCostSiteFixedPerParticipantSplitTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "clinical-trials/trial-cost-site-fixed-per-participant-split",
      title: "Trial Cost Site Fixed Per Participant Split Tool",
      description:
        "Calculate trial cost site fixed per participant split from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          siteFixed: { type: "number", minimum: 0 },
          participantVariable: { type: "number", minimum: 0 },
          participants: { type: "integer", minimum: 1 },
          sharedCentral: { type: "number", minimum: 0 },
          siteShare: { type: "number", minimum: 0, maximum: 1 },
        },
        required: [
          "siteFixed",
          "participantVariable",
          "participants",
          "sharedCentral",
          "siteShare",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          fixedAllocated: { type: "number" },
          variableTotal: { type: "number" },
          total: { type: "number" },
          perParticipant: { type: "number" },
        },
        required: [
          "fixedAllocated",
          "variableTotal",
          "total",
          "perParticipant",
        ],
      },
      ports: {
        inputs: [
          {
            id: "siteFixed",
            label: "Site Fixed",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "participantVariable",
            label: "Participant Variable",
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
            id: "sharedCentral",
            label: "Shared Central",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "siteShare",
            label: "Site Share",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "fixedAllocated",
            label: "Fixed Allocated",
            valueType: { type: "number" },
          },
          {
            id: "variableTotal",
            label: "Variable Total",
            valueType: { type: "number" },
          },
          { id: "total", label: "Total", valueType: { type: "number" } },
          {
            id: "perParticipant",
            label: "Per Participant",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = trialCostSiteFixedPerParticipantSplitTool.execute;
export default trialCostSiteFixedPerParticipantSplitTool;
