import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly targetDuration: number;
  readonly visibleDuration: number;
  readonly excludedDuration: number;
  readonly targetExcludedOverlap: number;
};
export type Output = {
  readonly eligibleVisible: number;
  readonly eligibleTarget: number;
  readonly share: number;
  readonly defined: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    targetDuration: { type: "number", minimum: 0 },
    visibleDuration: { type: "number", minimum: 0 },
    excludedDuration: { type: "number", minimum: 0 },
    targetExcludedOverlap: { type: "number", minimum: 0 },
  },
  required: [
    "targetDuration",
    "visibleDuration",
    "excludedDuration",
    "targetExcludedOverlap",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    eligibleVisible: { type: "number" },
    eligibleTarget: { type: "number" },
    share: { type: "number" },
    defined: { type: "boolean" },
  },
  required: ["eligibleVisible", "eligibleTarget", "share", "defined"],
} as const;
/** One pre-coded target-region trial duration over valid visible time with excluded overlap preserved; no preference inference. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    targetDuration,
    visibleDuration,
    excludedDuration,
    targetExcludedOverlap,
  } = request;
  const compute = (): Output => {
    H.domain(
      visibleDuration >= 0 &&
        excludedDuration >= 0 &&
        excludedDuration <= visibleDuration &&
        targetDuration >= 0 &&
        targetDuration <= visibleDuration &&
        targetExcludedOverlap >= 0 &&
        targetExcludedOverlap <= Math.min(targetDuration, excludedDuration) &&
        targetDuration - targetExcludedOverlap <=
          visibleDuration - excludedDuration,
    );
    return {
      eligibleVisible: visibleDuration - excludedDuration,
      eligibleTarget: targetDuration - targetExcludedOverlap,
      share:
        visibleDuration > excludedDuration
          ? (targetDuration - targetExcludedOverlap) /
            (visibleDuration - excludedDuration)
          : 0,
      defined: visibleDuration > excludedDuration,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    targetDuration: 30,
    visibleDuration: 100,
    excludedDuration: 20,
    targetExcludedOverlap: 10,
  },
  output: {
    eligibleVisible: 80,
    eligibleTarget: 20,
    share: 0.25,
    defined: true,
  },
} satisfies ToolExample<Input, Output>;
export const trialLookingTimeShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "developmental-psychology/trial-looking-time-share",
    title: "Trial Looking Time Share Tool",
    description:
      "One pre-coded target-region trial duration over valid visible time with excluded overlap preserved; no preference inference.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        targetDuration: { type: "number", minimum: 0 },
        visibleDuration: { type: "number", minimum: 0 },
        excludedDuration: { type: "number", minimum: 0 },
        targetExcludedOverlap: { type: "number", minimum: 0 },
      },
      required: [
        "targetDuration",
        "visibleDuration",
        "excludedDuration",
        "targetExcludedOverlap",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        eligibleVisible: { type: "number" },
        eligibleTarget: { type: "number" },
        share: { type: "number" },
        defined: { type: "boolean" },
      },
      required: ["eligibleVisible", "eligibleTarget", "share", "defined"],
    },
    ports: {
      inputs: [
        {
          id: "targetDuration",
          label: "Target Duration",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "visibleDuration",
          label: "Visible Duration",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "excludedDuration",
          label: "Excluded Duration",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "targetExcludedOverlap",
          label: "Target Excluded Overlap",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "eligibleVisible",
          label: "Eligible Visible",
          valueType: { type: "number" },
        },
        {
          id: "eligibleTarget",
          label: "Eligible Target",
          valueType: { type: "number" },
        },
        { id: "share", label: "Share", valueType: { type: "number" } },
        { id: "defined", label: "Defined", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = trialLookingTimeShareTool.execute;
export default trialLookingTimeShareTool;
