import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly careMinutes: number;
  readonly observedMinutes: number;
  readonly excludedMinutes: number;
};
export type Output = {
  readonly eligibleMinutes: number;
  readonly careFraction: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    careMinutes: { type: "number", minimum: 0 },
    observedMinutes: { type: "number" },
    excludedMinutes: { type: "number", minimum: 0 },
  },
  required: ["careMinutes", "observedMinutes", "excludedMinutes"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    eligibleMinutes: { type: "number" },
    careFraction: { type: "number" },
  },
  required: ["eligibleMinutes", "careFraction"],
} as const;
/** Normalize explicitly recorded care minutes by observed diary time after supplied exclusions. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { careMinutes, observedMinutes, excludedMinutes } = request;
  const compute = (): Output => {
    H.domain(
      observedMinutes > excludedMinutes &&
        excludedMinutes >= 0 &&
        careMinutes >= 0 &&
        careMinutes <= observedMinutes - excludedMinutes,
      "observedMinutes",
    );
    return {
      eligibleMinutes: observedMinutes - excludedMinutes,
      careFraction: careMinutes / (observedMinutes - excludedMinutes),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { careMinutes: 120, observedMinutes: 480, excludedMinutes: 80 },
  output: { eligibleMinutes: 400, careFraction: 0.3 },
} satisfies ToolExample<Input, Output>;
export const careWorkDiaryMinuteShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["gerontology", "health and medicine"],
      keywords: ["gerontology", "health and medicine"],
    },
    id: "gerontology/care-work-diary-minute-share",
    title: "Care Work Diary Minute Share",
    description:
      "Normalize explicitly recorded care minutes by observed diary time after supplied exclusions.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        careMinutes: { type: "number", minimum: 0 },
        observedMinutes: { type: "number" },
        excludedMinutes: { type: "number", minimum: 0 },
      },
      required: ["careMinutes", "observedMinutes", "excludedMinutes"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        eligibleMinutes: { type: "number" },
        careFraction: { type: "number" },
      },
      required: ["eligibleMinutes", "careFraction"],
    },
    ports: {
      inputs: [
        {
          id: "careMinutes",
          label: "Care Minutes",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "observedMinutes",
          label: "Observed Minutes",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "excludedMinutes",
          label: "Excluded Minutes",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "eligibleMinutes",
          label: "Eligible Minutes",
          valueType: { type: "number" },
        },
        {
          id: "careFraction",
          label: "Care Fraction",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = careWorkDiaryMinuteShareTool.execute;
export default careWorkDiaryMinuteShareTool;
