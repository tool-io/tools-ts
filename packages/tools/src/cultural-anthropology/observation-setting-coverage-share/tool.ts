import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly observedTime: number;
  readonly possibleTime: number;
  readonly excludedTime: number;
};
export type Output = { readonly eligibleTime: number; readonly share: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    observedTime: { type: "number", minimum: 0 },
    possibleTime: { type: "number" },
    excludedTime: { type: "number", minimum: 0 },
  },
  required: ["observedTime", "possibleTime", "excludedTime"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { eligibleTime: { type: "number" }, share: { type: "number" } },
  required: ["eligibleTime", "share"],
} as const;
/** Audit supplied observation-setting time coverage without inferring cultural prevalence. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { observedTime, possibleTime, excludedTime } = request;
  const compute = (): Output => {
    H.domain(
      possibleTime > excludedTime &&
        excludedTime >= 0 &&
        observedTime >= 0 &&
        observedTime <= possibleTime - excludedTime,
    );
    return {
      eligibleTime: possibleTime - excludedTime,
      share: observedTime / (possibleTime - excludedTime),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { observedTime: 60, possibleTime: 100, excludedTime: 20 },
  output: { eligibleTime: 80, share: 0.75 },
} satisfies ToolExample<Input, Output>;
export const observationSettingCoverageShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "cultural-anthropology/observation-setting-coverage-share",
    title: "Observation Setting Coverage Share Tool",
    description:
      "Audit supplied observation-setting time coverage without inferring cultural prevalence.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        observedTime: { type: "number", minimum: 0 },
        possibleTime: { type: "number" },
        excludedTime: { type: "number", minimum: 0 },
      },
      required: ["observedTime", "possibleTime", "excludedTime"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        eligibleTime: { type: "number" },
        share: { type: "number" },
      },
      required: ["eligibleTime", "share"],
    },
    ports: {
      inputs: [
        {
          id: "observedTime",
          label: "Observed Time",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "possibleTime",
          label: "Possible Time",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "excludedTime",
          label: "Excluded Time",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "eligibleTime",
          label: "Eligible Time",
          valueType: { type: "number" },
        },
        { id: "share", label: "Share", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = observationSettingCoverageShareTool.execute;
export default observationSettingCoverageShareTool;
