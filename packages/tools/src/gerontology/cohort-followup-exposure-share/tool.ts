import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly followedTime: number;
  readonly eligibleTime: number;
  readonly excludedTime: number;
};
export type Output = { readonly denominator: number; readonly share: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    followedTime: { type: "number", minimum: 0 },
    eligibleTime: { type: "number" },
    excludedTime: { type: "number", minimum: 0 },
  },
  required: ["followedTime", "eligibleTime", "excludedTime"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { denominator: { type: "number" }, share: { type: "number" } },
  required: ["denominator", "share"],
} as const;
/** Calculate cohort followup exposure share from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { followedTime, eligibleTime, excludedTime } = request;
  const compute = (): Output => {
    H.domain(
      eligibleTime > excludedTime &&
        excludedTime >= 0 &&
        followedTime >= 0 &&
        followedTime <= eligibleTime - excludedTime,
    );
    return {
      denominator: eligibleTime - excludedTime,
      share: followedTime / (eligibleTime - excludedTime),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { followedTime: 60, eligibleTime: 100, excludedTime: 20 },
  output: { denominator: 80, share: 0.75 },
} satisfies ToolExample<Input, Output>;
export const cohortFollowupExposureShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "gerontology/cohort-followup-exposure-share",
    title: "Cohort Followup Exposure Share Tool",
    description:
      "Calculate cohort followup exposure share from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        followedTime: { type: "number", minimum: 0 },
        eligibleTime: { type: "number" },
        excludedTime: { type: "number", minimum: 0 },
      },
      required: ["followedTime", "eligibleTime", "excludedTime"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        denominator: { type: "number" },
        share: { type: "number" },
      },
      required: ["denominator", "share"],
    },
    ports: {
      inputs: [
        {
          id: "followedTime",
          label: "Followed Time",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "eligibleTime",
          label: "Eligible Time",
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
          id: "denominator",
          label: "Denominator",
          valueType: { type: "number" },
        },
        { id: "share", label: "Share", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = cohortFollowupExposureShareTool.execute;
export default cohortFollowupExposureShareTool;
