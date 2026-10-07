import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly targetCount: number;
  readonly recruitedCount: number;
};
export type Output = {
  readonly remainingCount: number;
  readonly surplusCount: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    targetCount: { type: "integer", minimum: 0 },
    recruitedCount: { type: "integer", minimum: 0 },
  },
  required: ["targetCount", "recruitedCount"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    remainingCount: { type: "integer" },
    surplusCount: { type: "integer" },
  },
  required: ["remainingCount", "surplusCount"],
} as const;
/** Compare explicit site recruitment and target counts without choosing a recruitment target. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { targetCount, recruitedCount } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isSafeInteger(targetCount) &&
        targetCount >= 0 &&
        targetCount <= Number.MAX_SAFE_INTEGER,
      "targetCount",
    ),
      targetCount);
    (H.domain(
      Number.isSafeInteger(recruitedCount) &&
        recruitedCount >= 0 &&
        recruitedCount <= Number.MAX_SAFE_INTEGER,
      "recruitedCount",
    ),
      recruitedCount);
    return {
      remainingCount: Math.max(0, targetCount - recruitedCount),
      surplusCount: Math.max(0, recruitedCount - targetCount),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { targetCount: 50, recruitedCount: 38 },
  output: { remainingCount: 12, surplusCount: 0 },
} satisfies ToolExample<Input, Output>;
export const trialRecruitmentSiteTargetGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: [
        "clinical-trials",
        "clinical trials",
        "research and quality management",
      ],
      keywords: ["clinical trials", "research and quality management"],
    },
    id: "clinical-trials/trial-recruitment-site-target-gap",
    title: "Trial Recruitment Site Target Gap",
    description:
      "Compare explicit site recruitment and target counts without choosing a recruitment target.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        targetCount: { type: "integer", minimum: 0 },
        recruitedCount: { type: "integer", minimum: 0 },
      },
      required: ["targetCount", "recruitedCount"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        remainingCount: { type: "integer" },
        surplusCount: { type: "integer" },
      },
      required: ["remainingCount", "surplusCount"],
    },
    ports: {
      inputs: [
        {
          id: "targetCount",
          label: "Target Count",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "recruitedCount",
          label: "Recruited Count",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "remainingCount",
          label: "Remaining Count",
          valueType: { type: "integer" },
        },
        {
          id: "surplusCount",
          label: "Surplus Count",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = trialRecruitmentSiteTargetGapTool.execute;
export default trialRecruitmentSiteTargetGapTool;
