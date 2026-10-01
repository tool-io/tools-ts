import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly observationTime: number;
  readonly anchorTime: number;
  readonly suppliedClockOffset: number;
};
export type Output = { readonly relativeTime: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    observationTime: { type: "number" },
    anchorTime: { type: "number" },
    suppliedClockOffset: { type: "number" },
  },
  required: ["observationTime", "anchorTime", "suppliedClockOffset"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { relativeTime: { type: "number" } },
  required: ["relativeTime"],
} as const;
/** Normalize one supplied trial observation timestamp relative to an explicit research anchor. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { observationTime, anchorTime, suppliedClockOffset } = request;
  const compute = (): Output => {
    return { relativeTime: observationTime - suppliedClockOffset - anchorTime };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { observationTime: 120, anchorTime: 100, suppliedClockOffset: 5 },
  output: { relativeTime: 15 },
} satisfies ToolExample<Input, Output>;
export const trialObservationTimeOffsetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "oncology/trial-observation-time-offset",
    title: "Trial Observation Time Offset Tool",
    description:
      "Normalize one supplied trial observation timestamp relative to an explicit research anchor.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        observationTime: { type: "number" },
        anchorTime: { type: "number" },
        suppliedClockOffset: { type: "number" },
      },
      required: ["observationTime", "anchorTime", "suppliedClockOffset"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { relativeTime: { type: "number" } },
      required: ["relativeTime"],
    },
    ports: {
      inputs: [
        {
          id: "observationTime",
          label: "Observation Time",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "anchorTime",
          label: "Anchor Time",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedClockOffset",
          label: "Supplied Clock Offset",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "relativeTime",
          label: "Relative Time",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = trialObservationTimeOffsetTool.execute;
export default trialObservationTimeOffsetTool;
