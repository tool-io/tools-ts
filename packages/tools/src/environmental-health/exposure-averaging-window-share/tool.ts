import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly observedWindowDuration: number;
  readonly fullWindowDuration: number;
  readonly excludedDuration: number;
};
export type Output = {
  readonly eligibleDuration: number;
  readonly coverage: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    observedWindowDuration: { type: "number", minimum: 0 },
    fullWindowDuration: { type: "number" },
    excludedDuration: { type: "number", minimum: 0 },
  },
  required: [
    "observedWindowDuration",
    "fullWindowDuration",
    "excludedDuration",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    eligibleDuration: { type: "number" },
    coverage: { type: "number" },
  },
  required: ["eligibleDuration", "coverage"],
} as const;
/** Audit supplied exposure observation coverage without filling missing measurements or calculating health risk. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { observedWindowDuration, fullWindowDuration, excludedDuration } =
    request;
  const compute = (): Output => {
    H.domain(
      fullWindowDuration > excludedDuration &&
        excludedDuration >= 0 &&
        observedWindowDuration >= 0 &&
        observedWindowDuration <= fullWindowDuration - excludedDuration,
    );
    return {
      eligibleDuration: fullWindowDuration - excludedDuration,
      coverage:
        observedWindowDuration / (fullWindowDuration - excludedDuration),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    observedWindowDuration: 60,
    fullWindowDuration: 100,
    excludedDuration: 20,
  },
  output: { eligibleDuration: 80, coverage: 0.75 },
} satisfies ToolExample<Input, Output>;
export const exposureAveragingWindowShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "environmental-health/exposure-averaging-window-share",
    title: "Exposure Averaging Window Share Tool",
    description:
      "Audit supplied exposure observation coverage without filling missing measurements or calculating health risk.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        observedWindowDuration: { type: "number", minimum: 0 },
        fullWindowDuration: { type: "number" },
        excludedDuration: { type: "number", minimum: 0 },
      },
      required: [
        "observedWindowDuration",
        "fullWindowDuration",
        "excludedDuration",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        eligibleDuration: { type: "number" },
        coverage: { type: "number" },
      },
      required: ["eligibleDuration", "coverage"],
    },
    ports: {
      inputs: [
        {
          id: "observedWindowDuration",
          label: "Observed Window Duration",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "fullWindowDuration",
          label: "Full Window Duration",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "excludedDuration",
          label: "Excluded Duration",
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
        { id: "coverage", label: "Coverage", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = exposureAveragingWindowShareTool.execute;
export default exposureAveragingWindowShareTool;
