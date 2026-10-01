import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly requiredSteps: readonly number[];
  readonly recordedSteps: readonly number[];
  readonly firstExpected: number;
};
export type Output = {
  readonly missingSteps: readonly number[];
  readonly outOfOrderCount: number;
  readonly firstGap: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    requiredSteps: { type: "array", maxItems: 256, items: { type: "integer" } },
    recordedSteps: { type: "array", maxItems: 256, items: { type: "integer" } },
    firstExpected: { type: "integer" },
  },
  required: ["requiredSteps", "recordedSteps", "firstExpected"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    missingSteps: { type: "array", maxItems: 256, items: { type: "integer" } },
    outOfOrderCount: { type: "integer" },
    firstGap: { type: "integer" },
  },
  required: ["missingSteps", "outOfOrderCount", "firstGap"],
} as const;
/** Audit explicit step identifiers without inferring task performance. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { requiredSteps, recordedSteps, firstExpected } = request;
  const compute = (): Output => {
    H.domain(
      new Set(requiredSteps).size === requiredSteps.length &&
        new Set(recordedSteps).size === recordedSteps.length,
    );
    return {
      missingSteps: requiredSteps.filter((x) => !recordedSteps.includes(x)),
      outOfOrderCount: recordedSteps.filter(
        (x, i) => i > 0 && x < recordedSteps[i - 1],
      ).length,
      firstGap: recordedSteps.length ? recordedSteps[0] - firstExpected : 0,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    requiredSteps: [1, 2, 3, 4],
    recordedSteps: [1, 3, 2],
    firstExpected: 1,
  },
  output: { missingSteps: [4], outOfOrderCount: 1, firstGap: 0 },
} satisfies ToolExample<Input, Output>;
export const workTaskOneHandedSequenceStepgapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "occupational-therapy/work-task-one-handed-sequence-stepgap",
    title: "Work Task One Handed Sequence Stepgap Tool",
    description:
      "Audit explicit step identifiers without inferring task performance.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        requiredSteps: {
          type: "array",
          maxItems: 256,
          items: { type: "integer" },
        },
        recordedSteps: {
          type: "array",
          maxItems: 256,
          items: { type: "integer" },
        },
        firstExpected: { type: "integer" },
      },
      required: ["requiredSteps", "recordedSteps", "firstExpected"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        missingSteps: {
          type: "array",
          maxItems: 256,
          items: { type: "integer" },
        },
        outOfOrderCount: { type: "integer" },
        firstGap: { type: "integer" },
      },
      required: ["missingSteps", "outOfOrderCount", "firstGap"],
    },
    ports: {
      inputs: [
        {
          id: "requiredSteps",
          label: "Required Steps",
          required: true,
          valueType: { type: "list", items: { type: "integer" } },
        },
        {
          id: "recordedSteps",
          label: "Recorded Steps",
          required: true,
          valueType: { type: "list", items: { type: "integer" } },
        },
        {
          id: "firstExpected",
          label: "First Expected",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "missingSteps",
          label: "Missing Steps",
          valueType: { type: "list", items: { type: "integer" } },
        },
        {
          id: "outOfOrderCount",
          label: "Out Of Order Count",
          valueType: { type: "integer" },
        },
        { id: "firstGap", label: "First Gap", valueType: { type: "integer" } },
      ],
    },
  },
  calculate,
});
export const run = workTaskOneHandedSequenceStepgapTool.execute;
export default workTaskOneHandedSequenceStepgapTool;
