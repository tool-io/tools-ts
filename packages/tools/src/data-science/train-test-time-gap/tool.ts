import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly latestTrainingTime: number;
  readonly earliestTestTime: number;
  readonly embargoDuration: number;
};
export type Output = {
  readonly gap: number;
  readonly beyondEmbargo: number;
  readonly embargoSatisfied: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    latestTrainingTime: { type: "number" },
    earliestTestTime: { type: "number" },
    embargoDuration: { type: "number", minimum: 0 },
  },
  required: ["latestTrainingTime", "earliestTestTime", "embargoDuration"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    gap: { type: "number" },
    beyondEmbargo: { type: "number" },
    embargoSatisfied: { type: "boolean" },
  },
  required: ["gap", "beyondEmbargo", "embargoSatisfied"],
} as const;
/** Compare supplied time-split bounds and an explicit embargo without certifying absence of data leakage. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { latestTrainingTime, earliestTestTime, embargoDuration } = request;
  const compute = (): Output => {
    H.domain(embargoDuration >= 0);
    return {
      gap: earliestTestTime - latestTrainingTime,
      beyondEmbargo: earliestTestTime - latestTrainingTime - embargoDuration,
      embargoSatisfied:
        earliestTestTime - latestTrainingTime >= embargoDuration,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    latestTrainingTime: 100,
    earliestTestTime: 120,
    embargoDuration: 10,
  },
  output: { gap: 20, beyondEmbargo: 10, embargoSatisfied: true },
} satisfies ToolExample<Input, Output>;
export const trainTestTimeGapTool = H.defineSchemaCalculation<Input, Output>({
  ...{
    id: "data-science/train-test-time-gap",
    title: "Train Test Time Gap Tool",
    description:
      "Compare supplied time-split bounds and an explicit embargo without certifying absence of data leakage.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        latestTrainingTime: { type: "number" },
        earliestTestTime: { type: "number" },
        embargoDuration: { type: "number", minimum: 0 },
      },
      required: ["latestTrainingTime", "earliestTestTime", "embargoDuration"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        gap: { type: "number" },
        beyondEmbargo: { type: "number" },
        embargoSatisfied: { type: "boolean" },
      },
      required: ["gap", "beyondEmbargo", "embargoSatisfied"],
    },
    ports: {
      inputs: [
        {
          id: "latestTrainingTime",
          label: "Latest Training Time",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "earliestTestTime",
          label: "Earliest Test Time",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "embargoDuration",
          label: "Embargo Duration",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "gap", label: "Gap", valueType: { type: "number" } },
        {
          id: "beyondEmbargo",
          label: "Beyond Embargo",
          valueType: { type: "number" },
        },
        {
          id: "embargoSatisfied",
          label: "Embargo Satisfied",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = trainTestTimeGapTool.execute;
export default trainTestTimeGapTool;
