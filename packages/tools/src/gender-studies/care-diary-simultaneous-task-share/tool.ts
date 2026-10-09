import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly primaryCareMinutes: number;
  readonly secondaryCareMinutes: number;
  readonly overlapMinutes: number;
  readonly observedMinutes: number;
};
export type Output = {
  readonly unionCareMinutes: number;
  readonly unionShare: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    primaryCareMinutes: { type: "number", minimum: 0 },
    secondaryCareMinutes: { type: "number", minimum: 0 },
    overlapMinutes: { type: "number", minimum: 0 },
    observedMinutes: { type: "number", exclusiveMinimum: 0 },
  },
  required: [
    "primaryCareMinutes",
    "secondaryCareMinutes",
    "overlapMinutes",
    "observedMinutes",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    unionCareMinutes: { type: "number" },
    unionShare: { type: "number" },
  },
  required: ["unionCareMinutes", "unionShare"],
} as const;
/** Combine explicit overlapping care-task durations without double counting shared minutes or assigning care responsibility. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    primaryCareMinutes,
    secondaryCareMinutes,
    overlapMinutes,
    observedMinutes,
  } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isFinite(observedMinutes) && observedMinutes > 0,
      "observedMinutes",
    ),
      observedMinutes);
    H.domain(
      primaryCareMinutes >= 0 &&
        secondaryCareMinutes >= 0 &&
        overlapMinutes >= 0 &&
        overlapMinutes <= Math.min(primaryCareMinutes, secondaryCareMinutes),
      "primaryCareMinutes",
    );
    H.domain(
      primaryCareMinutes + secondaryCareMinutes - overlapMinutes <=
        observedMinutes,
      "primaryCareMinutes",
    );
    return {
      unionCareMinutes:
        primaryCareMinutes + secondaryCareMinutes - overlapMinutes,
      unionShare:
        (primaryCareMinutes + secondaryCareMinutes - overlapMinutes) /
        observedMinutes,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    primaryCareMinutes: 60,
    secondaryCareMinutes: 30,
    overlapMinutes: 20,
    observedMinutes: 120,
  },
  output: { unionCareMinutes: 70, unionShare: 0.5833333333333334 },
} satisfies ToolExample<Input, Output>;
export const careDiarySimultaneousTaskShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["gender-studies", "gender studies", "social sciences"],
      keywords: ["gender studies", "social sciences"],
    },
    id: "gender-studies/care-diary-simultaneous-task-share",
    title: "Care Diary Simultaneous Task Share",
    description:
      "Combine explicit overlapping care-task durations without double counting shared minutes or assigning care responsibility.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        primaryCareMinutes: { type: "number", minimum: 0 },
        secondaryCareMinutes: { type: "number", minimum: 0 },
        overlapMinutes: { type: "number", minimum: 0 },
        observedMinutes: { type: "number", exclusiveMinimum: 0 },
      },
      required: [
        "primaryCareMinutes",
        "secondaryCareMinutes",
        "overlapMinutes",
        "observedMinutes",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        unionCareMinutes: { type: "number" },
        unionShare: { type: "number" },
      },
      required: ["unionCareMinutes", "unionShare"],
    },
    ports: {
      inputs: [
        {
          id: "primaryCareMinutes",
          label: "Primary Care Minutes",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "secondaryCareMinutes",
          label: "Secondary Care Minutes",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "overlapMinutes",
          label: "Overlap Minutes",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "observedMinutes",
          label: "Observed Minutes",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "unionCareMinutes",
          label: "Union Care Minutes",
          valueType: { type: "number" },
        },
        {
          id: "unionShare",
          label: "Union Share",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = careDiarySimultaneousTaskShareTool.execute;
export default careDiarySimultaneousTaskShareTool;
