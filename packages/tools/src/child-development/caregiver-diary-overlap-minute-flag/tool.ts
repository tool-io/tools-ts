import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstStartMinute: number;
  readonly firstEndMinute: number;
  readonly secondStartMinute: number;
  readonly secondEndMinute: number;
};
export type Output = {
  readonly overlapMinutes: number;
  readonly hasOverlap: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstStartMinute: { type: "number" },
    firstEndMinute: { type: "number" },
    secondStartMinute: { type: "number" },
    secondEndMinute: { type: "number" },
  },
  required: [
    "firstStartMinute",
    "firstEndMinute",
    "secondStartMinute",
    "secondEndMinute",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    overlapMinutes: { type: "number" },
    hasOverlap: { type: "boolean" },
  },
  required: ["overlapMinutes", "hasOverlap"],
} as const;
/** Flag positive-duration overlap in supplied half-open caregiver diary minute intervals without interpreting caregiving behavior. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    firstStartMinute,
    firstEndMinute,
    secondStartMinute,
    secondEndMinute,
  } = request;
  const compute = (): Output => {
    H.domain(firstEndMinute >= firstStartMinute, "firstEndMinute");
    H.domain(secondEndMinute >= secondStartMinute, "secondEndMinute");
    return (() => {
      const overlapMinutes = Math.max(
        0,
        Math.min(firstEndMinute, secondEndMinute) -
          Math.max(firstStartMinute, secondStartMinute),
      );
      return { overlapMinutes, hasOverlap: overlapMinutes > 0 };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    firstStartMinute: 10,
    firstEndMinute: 30,
    secondStartMinute: 20,
    secondEndMinute: 40,
  },
  output: { overlapMinutes: 10, hasOverlap: true },
} satisfies ToolExample<Input, Output>;
export const caregiverDiaryOverlapMinuteFlagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["child-development", "child development", "psychology"],
      keywords: ["child development", "psychology"],
    },
    id: "child-development/caregiver-diary-overlap-minute-flag",
    title: "Caregiver Diary Overlap Minute Flag",
    description:
      "Flag positive-duration overlap in supplied half-open caregiver diary minute intervals without interpreting caregiving behavior.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstStartMinute: { type: "number" },
        firstEndMinute: { type: "number" },
        secondStartMinute: { type: "number" },
        secondEndMinute: { type: "number" },
      },
      required: [
        "firstStartMinute",
        "firstEndMinute",
        "secondStartMinute",
        "secondEndMinute",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        overlapMinutes: { type: "number" },
        hasOverlap: { type: "boolean" },
      },
      required: ["overlapMinutes", "hasOverlap"],
    },
    ports: {
      inputs: [
        {
          id: "firstStartMinute",
          label: "First Start Minute",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "firstEndMinute",
          label: "First End Minute",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "secondStartMinute",
          label: "Second Start Minute",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "secondEndMinute",
          label: "Second End Minute",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "overlapMinutes",
          label: "Overlap Minutes",
          valueType: { type: "number" },
        },
        {
          id: "hasOverlap",
          label: "Has Overlap",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = caregiverDiaryOverlapMinuteFlagTool.execute;
export default caregiverDiaryOverlapMinuteFlagTool;
