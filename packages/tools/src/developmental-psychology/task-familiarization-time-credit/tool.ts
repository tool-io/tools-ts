import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly totalTime: number;
  readonly familiarization: number;
  readonly includeFamiliarization: boolean;
};
export type Output = {
  readonly scoredTime: number;
  readonly excludedTime: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    totalTime: { type: "number", minimum: 0 },
    familiarization: { type: "number", minimum: 0 },
    includeFamiliarization: { type: "boolean" },
  },
  required: ["totalTime", "familiarization", "includeFamiliarization"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    scoredTime: { type: "number" },
    excludedTime: { type: "number" },
  },
  required: ["scoredTime", "excludedTime"],
} as const;
/** Calculate task familiarization time credit from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { totalTime, familiarization, includeFamiliarization } = request;
  const compute = (): Output => {
    H.domain(
      totalTime >= 0 && familiarization >= 0 && familiarization <= totalTime,
    );
    return {
      scoredTime: totalTime - (includeFamiliarization ? 0 : familiarization),
      excludedTime: includeFamiliarization ? 0 : familiarization,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { totalTime: 20, familiarization: 5, includeFamiliarization: false },
  output: { scoredTime: 15, excludedTime: 5 },
} satisfies ToolExample<Input, Output>;
export const taskFamiliarizationTimeCreditTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "developmental-psychology/task-familiarization-time-credit",
    title: "Task Familiarization Time Credit Tool",
    description:
      "Calculate task familiarization time credit from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        totalTime: { type: "number", minimum: 0 },
        familiarization: { type: "number", minimum: 0 },
        includeFamiliarization: { type: "boolean" },
      },
      required: ["totalTime", "familiarization", "includeFamiliarization"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        scoredTime: { type: "number" },
        excludedTime: { type: "number" },
      },
      required: ["scoredTime", "excludedTime"],
    },
    ports: {
      inputs: [
        {
          id: "totalTime",
          label: "Total Time",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "familiarization",
          label: "Familiarization",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "includeFamiliarization",
          label: "Include Familiarization",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "scoredTime",
          label: "Scored Time",
          valueType: { type: "number" },
        },
        {
          id: "excludedTime",
          label: "Excluded Time",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = taskFamiliarizationTimeCreditTool.execute;
export default taskFamiliarizationTimeCreditTool;
