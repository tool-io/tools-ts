import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly stage: number;
  readonly referenceStage: number;
  readonly positiveUp: boolean;
  readonly equalityCountsAbove: boolean;
};
export type Output = {
  readonly signedGap: number;
  readonly aboveUnderRule: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    stage: { type: "number" },
    referenceStage: { type: "number" },
    positiveUp: { type: "boolean" },
    equalityCountsAbove: { type: "boolean" },
  },
  required: ["stage", "referenceStage", "positiveUp", "equalityCountsAbove"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    signedGap: { type: "number" },
    aboveUnderRule: { type: "boolean" },
  },
  required: ["signedGap", "aboveUnderRule"],
} as const;
/** Classify stage against a supplied datum and equality convention without a flood threshold. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { stage, referenceStage, positiveUp, equalityCountsAbove } = request;
  const compute = (): Output => {
    return (() => {
      const signedGap = (stage - referenceStage) * (positiveUp ? 1 : -1);
      return {
        signedGap,
        aboveUnderRule: equalityCountsAbove ? signedGap >= 0 : signedGap > 0,
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    stage: 5,
    referenceStage: 3,
    positiveUp: true,
    equalityCountsAbove: false,
  },
  output: { signedGap: 2, aboveUnderRule: true },
} satisfies ToolExample<Input, Output>;
export const streamStageReferenceSignTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "hydrology/stream-stage-reference-sign",
    title: "Stream Stage Reference Sign Tool",
    description:
      "Classify stage against a supplied datum and equality convention without a flood threshold.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        stage: { type: "number" },
        referenceStage: { type: "number" },
        positiveUp: { type: "boolean" },
        equalityCountsAbove: { type: "boolean" },
      },
      required: [
        "stage",
        "referenceStage",
        "positiveUp",
        "equalityCountsAbove",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        signedGap: { type: "number" },
        aboveUnderRule: { type: "boolean" },
      },
      required: ["signedGap", "aboveUnderRule"],
    },
    ports: {
      inputs: [
        {
          id: "stage",
          label: "Stage",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "referenceStage",
          label: "Reference Stage",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "positiveUp",
          label: "Positive Up",
          required: true,
          valueType: { type: "boolean" },
        },
        {
          id: "equalityCountsAbove",
          label: "Equality Counts Above",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        { id: "signedGap", label: "Signed Gap", valueType: { type: "number" } },
        {
          id: "aboveUnderRule",
          label: "Above Under Rule",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = streamStageReferenceSignTool.execute;
export default streamStageReferenceSignTool;
