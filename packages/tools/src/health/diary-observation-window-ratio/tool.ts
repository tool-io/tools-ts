import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly observedDuration: number;
  readonly plannedDuration: number;
  readonly excludedPlannedDuration: number;
};
export type Output = {
  readonly eligibleDuration: number;
  readonly ratio: number;
  readonly defined: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    observedDuration: { type: "number", minimum: 0 },
    plannedDuration: { type: "number", minimum: 0 },
    excludedPlannedDuration: { type: "number", minimum: 0 },
  },
  required: ["observedDuration", "plannedDuration", "excludedPlannedDuration"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    eligibleDuration: { type: "number" },
    ratio: { type: "number" },
    defined: { type: "boolean" },
  },
  required: ["eligibleDuration", "ratio", "defined"],
} as const;
/** Compare supplied research diary exposure with an explicit eligible window; excess observation remains visible. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { observedDuration, plannedDuration, excludedPlannedDuration } =
    request;
  const compute = (): Output => {
    H.domain(
      plannedDuration >= 0 &&
        excludedPlannedDuration >= 0 &&
        excludedPlannedDuration <= plannedDuration &&
        observedDuration >= 0,
    );
    return {
      eligibleDuration: plannedDuration - excludedPlannedDuration,
      ratio:
        plannedDuration > excludedPlannedDuration
          ? observedDuration / (plannedDuration - excludedPlannedDuration)
          : 0,
      defined: plannedDuration > excludedPlannedDuration,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    observedDuration: 30,
    plannedDuration: 50,
    excludedPlannedDuration: 10,
  },
  output: { eligibleDuration: 40, ratio: 0.75, defined: true },
} satisfies ToolExample<Input, Output>;
export const diaryObservationWindowRatioTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "health/diary-observation-window-ratio",
    title: "Diary Observation Window Ratio Tool",
    description:
      "Compare supplied research diary exposure with an explicit eligible window; excess observation remains visible.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        observedDuration: { type: "number", minimum: 0 },
        plannedDuration: { type: "number", minimum: 0 },
        excludedPlannedDuration: { type: "number", minimum: 0 },
      },
      required: [
        "observedDuration",
        "plannedDuration",
        "excludedPlannedDuration",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        eligibleDuration: { type: "number" },
        ratio: { type: "number" },
        defined: { type: "boolean" },
      },
      required: ["eligibleDuration", "ratio", "defined"],
    },
    ports: {
      inputs: [
        {
          id: "observedDuration",
          label: "Observed Duration",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "plannedDuration",
          label: "Planned Duration",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "excludedPlannedDuration",
          label: "Excluded Planned Duration",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "eligibleDuration",
          label: "Eligible Duration",
          valueType: { type: "number" },
        },
        { id: "ratio", label: "Ratio", valueType: { type: "number" } },
        { id: "defined", label: "Defined", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = diaryObservationWindowRatioTool.execute;
export default diaryObservationWindowRatioTool;
