import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly classMinutes: number;
  readonly travelMinutes: number;
  readonly studyMinutes: number;
};
export type Output = {
  readonly totalMinutes: number;
  readonly travelShare: number;
  readonly learningMinutes: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    classMinutes: { type: "number", minimum: 0 },
    travelMinutes: { type: "number", minimum: 0 },
    studyMinutes: { type: "number", minimum: 0 },
  },
  required: ["classMinutes", "travelMinutes", "studyMinutes"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    totalMinutes: { type: "number" },
    travelShare: { type: "number" },
    learningMinutes: { type: "number" },
  },
  required: ["totalMinutes", "travelShare", "learningMinutes"],
} as const;
/** Calculate evening class travel study time share from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { classMinutes, travelMinutes, studyMinutes } = request;
  const compute = (): Output => {
    H.domain(
      classMinutes >= 0 &&
        travelMinutes >= 0 &&
        studyMinutes >= 0 &&
        classMinutes + travelMinutes + studyMinutes > 0,
    );
    return {
      totalMinutes: classMinutes + travelMinutes + studyMinutes,
      travelShare:
        travelMinutes / (classMinutes + travelMinutes + studyMinutes),
      learningMinutes: classMinutes + studyMinutes,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { classMinutes: 120, travelMinutes: 60, studyMinutes: 60 },
  output: { totalMinutes: 240, travelShare: 0.25, learningMinutes: 180 },
} satisfies ToolExample<Input, Output>;
export const eveningClassTravelStudyTimeShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "adult-education/evening-class-travel-study-time-share",
    title: "Evening Class Travel Study Time Share Tool",
    description:
      "Calculate evening class travel study time share from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        classMinutes: { type: "number", minimum: 0 },
        travelMinutes: { type: "number", minimum: 0 },
        studyMinutes: { type: "number", minimum: 0 },
      },
      required: ["classMinutes", "travelMinutes", "studyMinutes"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        totalMinutes: { type: "number" },
        travelShare: { type: "number" },
        learningMinutes: { type: "number" },
      },
      required: ["totalMinutes", "travelShare", "learningMinutes"],
    },
    ports: {
      inputs: [
        {
          id: "classMinutes",
          label: "Class Minutes",
          required: true,
          valueType: { type: "number", unit: "min" },
        },
        {
          id: "travelMinutes",
          label: "Travel Minutes",
          required: true,
          valueType: { type: "number", unit: "min" },
        },
        {
          id: "studyMinutes",
          label: "Study Minutes",
          required: true,
          valueType: { type: "number", unit: "min" },
        },
      ],
      outputs: [
        {
          id: "totalMinutes",
          label: "Total Minutes",
          valueType: { type: "number", unit: "min" },
        },
        {
          id: "travelShare",
          label: "Travel Share",
          valueType: { type: "number" },
        },
        {
          id: "learningMinutes",
          label: "Learning Minutes",
          valueType: { type: "number", unit: "min" },
        },
      ],
    },
  },
  calculate,
});
export const run = eveningClassTravelStudyTimeShareTool.execute;
export default eveningClassTravelStudyTimeShareTool;
