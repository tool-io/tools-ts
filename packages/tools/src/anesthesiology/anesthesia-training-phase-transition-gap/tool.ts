import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly previousEnd: number;
  readonly nextStart: number;
  readonly expectedHandoff: number;
  readonly overlapAllowed: boolean;
};
export type Output = {
  readonly signedGap: number;
  readonly deviation: number;
  readonly overlap: boolean;
  readonly acceptable: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    previousEnd: { type: "number" },
    nextStart: { type: "number" },
    expectedHandoff: { type: "number" },
    overlapAllowed: { type: "boolean" },
  },
  required: ["previousEnd", "nextStart", "expectedHandoff", "overlapAllowed"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    signedGap: { type: "number" },
    deviation: { type: "number" },
    overlap: { type: "boolean" },
    acceptable: { type: "boolean" },
  },
  required: ["signedGap", "deviation", "overlap", "acceptable"],
} as const;
/** Audit training phase timestamps under an explicit overlap policy. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { previousEnd, nextStart, expectedHandoff, overlapAllowed } = request;
  const compute = (): Output => {
    H.domain(expectedHandoff >= 0, "expectedHandoff");
    return {
      signedGap: nextStart - previousEnd,
      deviation: nextStart - previousEnd - expectedHandoff,
      overlap: nextStart < previousEnd,
      acceptable: overlapAllowed || nextStart >= previousEnd,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    previousEnd: 100,
    nextStart: 108,
    expectedHandoff: 5,
    overlapAllowed: false,
  },
  output: { signedGap: 8, deviation: 3, overlap: false, acceptable: true },
} satisfies ToolExample<Input, Output>;
export const anesthesiaTrainingPhaseTransitionGapTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "anesthesiology/anesthesia-training-phase-transition-gap",
      title: "Anesthesia Training Phase Transition Gap Tool",
      description:
        "Audit training phase timestamps under an explicit overlap policy.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          previousEnd: { type: "number" },
          nextStart: { type: "number" },
          expectedHandoff: { type: "number" },
          overlapAllowed: { type: "boolean" },
        },
        required: [
          "previousEnd",
          "nextStart",
          "expectedHandoff",
          "overlapAllowed",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          signedGap: { type: "number" },
          deviation: { type: "number" },
          overlap: { type: "boolean" },
          acceptable: { type: "boolean" },
        },
        required: ["signedGap", "deviation", "overlap", "acceptable"],
      },
      ports: {
        inputs: [
          {
            id: "previousEnd",
            label: "Previous End",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "nextStart",
            label: "Next Start",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "expectedHandoff",
            label: "Expected Handoff",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "overlapAllowed",
            label: "Overlap Allowed",
            required: true,
            valueType: { type: "boolean" },
          },
        ],
        outputs: [
          {
            id: "signedGap",
            label: "Signed Gap",
            valueType: { type: "number" },
          },
          {
            id: "deviation",
            label: "Deviation",
            valueType: { type: "number" },
          },
          { id: "overlap", label: "Overlap", valueType: { type: "boolean" } },
          {
            id: "acceptable",
            label: "Acceptable",
            valueType: { type: "boolean" },
          },
        ],
      },
    },
    calculate,
  });
export const run = anesthesiaTrainingPhaseTransitionGapTool.execute;
export default anesthesiaTrainingPhaseTransitionGapTool;
