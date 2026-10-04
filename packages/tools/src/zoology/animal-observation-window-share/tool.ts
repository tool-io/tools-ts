import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly observedTime: number;
  readonly windowDuration: number;
  readonly unavailableTime: number;
};
export type Output = {
  readonly eligibleTime: number;
  readonly share: number;
  readonly defined: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    observedTime: { type: "number", minimum: 0 },
    windowDuration: { type: "number", minimum: 0 },
    unavailableTime: { type: "number", minimum: 0 },
  },
  required: ["observedTime", "windowDuration", "unavailableTime"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    eligibleTime: { type: "number" },
    share: { type: "number" },
    defined: { type: "boolean" },
  },
  required: ["eligibleTime", "share", "defined"],
} as const;
/** Audit supplied animal observation time coverage without classifying behavior. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { observedTime, windowDuration, unavailableTime } = request;
  const compute = (): Output => {
    H.domain(
      windowDuration >= 0 &&
        unavailableTime >= 0 &&
        unavailableTime <= windowDuration &&
        observedTime >= 0 &&
        observedTime <= windowDuration - unavailableTime,
    );
    return {
      eligibleTime: windowDuration - unavailableTime,
      share:
        windowDuration > unavailableTime
          ? observedTime / (windowDuration - unavailableTime)
          : 0,
      defined: windowDuration > unavailableTime,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { observedTime: 30, windowDuration: 60, unavailableTime: 20 },
  output: { eligibleTime: 40, share: 0.75, defined: true },
} satisfies ToolExample<Input, Output>;
export const animalObservationWindowShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "zoology/animal-observation-window-share",
    title: "Animal Observation Window Share Tool",
    description:
      "Audit supplied animal observation time coverage without classifying behavior.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        observedTime: { type: "number", minimum: 0 },
        windowDuration: { type: "number", minimum: 0 },
        unavailableTime: { type: "number", minimum: 0 },
      },
      required: ["observedTime", "windowDuration", "unavailableTime"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        eligibleTime: { type: "number" },
        share: { type: "number" },
        defined: { type: "boolean" },
      },
      required: ["eligibleTime", "share", "defined"],
    },
    ports: {
      inputs: [
        {
          id: "observedTime",
          label: "Observed Time",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "windowDuration",
          label: "Window Duration",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "unavailableTime",
          label: "Unavailable Time",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "eligibleTime",
          label: "Eligible Time",
          valueType: { type: "number" },
        },
        { id: "share", label: "Share", valueType: { type: "number" } },
        { id: "defined", label: "Defined", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = animalObservationWindowShareTool.execute;
export default animalObservationWindowShareTool;
