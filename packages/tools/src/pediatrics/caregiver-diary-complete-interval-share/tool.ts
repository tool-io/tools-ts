import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly completeMinutes: number;
  readonly incompleteMinutes: number;
  readonly unobservedMinutes: number;
};
export type Output = {
  readonly recordedMinutes: number;
  readonly completeOfRecorded: number;
  readonly completeOfPlanned: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    completeMinutes: { type: "number", minimum: 0 },
    incompleteMinutes: { type: "number", minimum: 0 },
    unobservedMinutes: { type: "number", minimum: 0 },
  },
  required: ["completeMinutes", "incompleteMinutes", "unobservedMinutes"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    recordedMinutes: { type: "number" },
    completeOfRecorded: { type: "number" },
    completeOfPlanned: { type: "number" },
  },
  required: ["recordedMinutes", "completeOfRecorded", "completeOfPlanned"],
} as const;
/** Calculate caregiver diary complete interval share from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { completeMinutes, incompleteMinutes, unobservedMinutes } = request;
  const compute = (): Output => {
    H.domain(
      completeMinutes >= 0 &&
        incompleteMinutes >= 0 &&
        unobservedMinutes >= 0 &&
        completeMinutes + incompleteMinutes > 0,
    );
    return {
      recordedMinutes: completeMinutes + incompleteMinutes,
      completeOfRecorded:
        completeMinutes / (completeMinutes + incompleteMinutes),
      completeOfPlanned:
        completeMinutes /
        (completeMinutes + incompleteMinutes + unobservedMinutes),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { completeMinutes: 60, incompleteMinutes: 20, unobservedMinutes: 20 },
  output: {
    recordedMinutes: 80,
    completeOfRecorded: 0.75,
    completeOfPlanned: 0.6,
  },
} satisfies ToolExample<Input, Output>;
export const caregiverDiaryCompleteIntervalShareTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "pediatrics/caregiver-diary-complete-interval-share",
      title: "Caregiver Diary Complete Interval Share Tool",
      description:
        "Calculate caregiver diary complete interval share from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          completeMinutes: { type: "number", minimum: 0 },
          incompleteMinutes: { type: "number", minimum: 0 },
          unobservedMinutes: { type: "number", minimum: 0 },
        },
        required: ["completeMinutes", "incompleteMinutes", "unobservedMinutes"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          recordedMinutes: { type: "number" },
          completeOfRecorded: { type: "number" },
          completeOfPlanned: { type: "number" },
        },
        required: [
          "recordedMinutes",
          "completeOfRecorded",
          "completeOfPlanned",
        ],
      },
      ports: {
        inputs: [
          {
            id: "completeMinutes",
            label: "Complete Minutes",
            required: true,
            valueType: { type: "number", unit: "min" },
          },
          {
            id: "incompleteMinutes",
            label: "Incomplete Minutes",
            required: true,
            valueType: { type: "number", unit: "min" },
          },
          {
            id: "unobservedMinutes",
            label: "Unobserved Minutes",
            required: true,
            valueType: { type: "number", unit: "min" },
          },
        ],
        outputs: [
          {
            id: "recordedMinutes",
            label: "Recorded Minutes",
            valueType: { type: "number", unit: "min" },
          },
          {
            id: "completeOfRecorded",
            label: "Complete Of Recorded",
            valueType: { type: "number" },
          },
          {
            id: "completeOfPlanned",
            label: "Complete Of Planned",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = caregiverDiaryCompleteIntervalShareTool.execute;
export default caregiverDiaryCompleteIntervalShareTool;
