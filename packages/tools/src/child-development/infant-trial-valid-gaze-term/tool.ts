import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly gazeDuration: number;
  readonly trialDuration: number;
  readonly occludedDuration: number;
  readonly excludeOccluded: boolean;
};
export type Output = {
  readonly denominator: number;
  readonly observedGazeShare: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    gazeDuration: { type: "number", minimum: 0 },
    trialDuration: { type: "number" },
    occludedDuration: { type: "number", minimum: 0 },
    excludeOccluded: { type: "boolean" },
  },
  required: [
    "gazeDuration",
    "trialDuration",
    "occludedDuration",
    "excludeOccluded",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    denominator: { type: "number" },
    observedGazeShare: { type: "number" },
  },
  required: ["denominator", "observedGazeShare"],
} as const;
/** Supplied research gaze-duration denominator; no developmental or clinical inference. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { gazeDuration, trialDuration, occludedDuration, excludeOccluded } =
    request;
  const compute = (): Output => {
    H.domain(
      gazeDuration >= 0 &&
        occludedDuration >= 0 &&
        trialDuration > occludedDuration &&
        gazeDuration <= trialDuration - occludedDuration,
    );
    return {
      denominator: trialDuration - (excludeOccluded ? occludedDuration : 0),
      observedGazeShare:
        gazeDuration /
        (trialDuration - (excludeOccluded ? occludedDuration : 0)),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    gazeDuration: 3,
    trialDuration: 10,
    occludedDuration: 4,
    excludeOccluded: true,
  },
  output: { denominator: 6, observedGazeShare: 0.5 },
} satisfies ToolExample<Input, Output>;
export const infantTrialValidGazeTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "child-development/infant-trial-valid-gaze-term",
    title: "Infant Trial Valid Gaze Term Tool",
    description:
      "Supplied research gaze-duration denominator; no developmental or clinical inference.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        gazeDuration: { type: "number", minimum: 0 },
        trialDuration: { type: "number" },
        occludedDuration: { type: "number", minimum: 0 },
        excludeOccluded: { type: "boolean" },
      },
      required: [
        "gazeDuration",
        "trialDuration",
        "occludedDuration",
        "excludeOccluded",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        denominator: { type: "number" },
        observedGazeShare: { type: "number" },
      },
      required: ["denominator", "observedGazeShare"],
    },
    ports: {
      inputs: [
        {
          id: "gazeDuration",
          label: "Gaze Duration",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "trialDuration",
          label: "Trial Duration",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "occludedDuration",
          label: "Occluded Duration",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "excludeOccluded",
          label: "Exclude Occluded",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "denominator",
          label: "Denominator",
          valueType: { type: "number" },
        },
        {
          id: "observedGazeShare",
          label: "Observed Gaze Share",
          valueType: { type: "number", unit: "1" },
        },
      ],
    },
  },
  calculate,
});
export const run = infantTrialValidGazeTermTool.execute;
export default infantTrialValidGazeTermTool;
