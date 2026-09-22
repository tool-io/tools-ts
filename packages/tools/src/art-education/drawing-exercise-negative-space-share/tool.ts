import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly frameArea: number;
  readonly subjectArea: number;
  readonly excludedArea: number;
};
export type Output = {
  readonly availableArea: number;
  readonly negativeArea: number;
  readonly negativeShare: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    frameArea: { type: "number" },
    subjectArea: { type: "number", minimum: 0 },
    excludedArea: { type: "number", minimum: 0 },
  },
  required: ["frameArea", "subjectArea", "excludedArea"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    availableArea: { type: "number" },
    negativeArea: { type: "number" },
    negativeShare: { type: "number" },
  },
  required: ["availableArea", "negativeArea", "negativeShare"],
} as const;
/** Calculate drawing exercise negative space share from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { frameArea, subjectArea, excludedArea } = request;
  const compute = (): Output => {
    H.domain(
      excludedArea >= 0 &&
        frameArea > excludedArea &&
        subjectArea >= 0 &&
        subjectArea <= frameArea - excludedArea,
    );
    return {
      availableArea: frameArea - excludedArea,
      negativeArea: frameArea - excludedArea - subjectArea,
      negativeShare:
        (frameArea - excludedArea - subjectArea) / (frameArea - excludedArea),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { frameArea: 100, subjectArea: 30, excludedArea: 10 },
  output: {
    availableArea: 90,
    negativeArea: 60,
    negativeShare: 0.6666666666666666,
  },
} satisfies ToolExample<Input, Output>;
export const drawingExerciseNegativeSpaceShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "art-education/drawing-exercise-negative-space-share",
    title: "Drawing Exercise Negative Space Share Tool",
    description:
      "Calculate drawing exercise negative space share from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        frameArea: { type: "number" },
        subjectArea: { type: "number", minimum: 0 },
        excludedArea: { type: "number", minimum: 0 },
      },
      required: ["frameArea", "subjectArea", "excludedArea"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        availableArea: { type: "number" },
        negativeArea: { type: "number" },
        negativeShare: { type: "number" },
      },
      required: ["availableArea", "negativeArea", "negativeShare"],
    },
    ports: {
      inputs: [
        {
          id: "frameArea",
          label: "Frame Area",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "subjectArea",
          label: "Subject Area",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "excludedArea",
          label: "Excluded Area",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "availableArea",
          label: "Available Area",
          valueType: { type: "number" },
        },
        {
          id: "negativeArea",
          label: "Negative Area",
          valueType: { type: "number" },
        },
        {
          id: "negativeShare",
          label: "Negative Share",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = drawingExerciseNegativeSpaceShareTool.execute;
export default drawingExerciseNegativeSpaceShareTool;
