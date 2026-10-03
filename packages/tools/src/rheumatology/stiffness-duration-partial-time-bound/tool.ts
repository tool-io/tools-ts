import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly startLower: number;
  readonly startUpper: number;
  readonly endLower: number;
  readonly endUpper: number;
};
export type Output = {
  readonly durationLower: number;
  readonly durationUpper: number;
  readonly overlapUncertainty: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    startLower: { type: "number" },
    startUpper: { type: "number" },
    endLower: { type: "number" },
    endUpper: { type: "number" },
  },
  required: ["startLower", "startUpper", "endLower", "endUpper"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    durationLower: { type: "number" },
    durationUpper: { type: "number" },
    overlapUncertainty: { type: "boolean" },
  },
  required: ["durationLower", "durationUpper", "overlapUncertainty"],
} as const;
/** Bound a supplied diary duration while respecting that end cannot precede start; no symptom severity interpretation. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { startLower, startUpper, endLower, endUpper } = request;
  const compute = (): Output => {
    H.domain(
      startLower <= startUpper &&
        endLower <= endUpper &&
        endUpper >= startLower,
    );
    return {
      durationLower: Math.max(0, endLower - startUpper),
      durationUpper: endUpper - startLower,
      overlapUncertainty: endLower < startUpper,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { startLower: 0, startUpper: 2, endLower: 10, endUpper: 12 },
  output: { durationLower: 8, durationUpper: 12, overlapUncertainty: false },
} satisfies ToolExample<Input, Output>;
export const stiffnessDurationPartialTimeBoundTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "rheumatology/stiffness-duration-partial-time-bound",
    title: "Stiffness Duration Partial Time Bound Tool",
    description:
      "Bound a supplied diary duration while respecting that end cannot precede start; no symptom severity interpretation.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        startLower: { type: "number" },
        startUpper: { type: "number" },
        endLower: { type: "number" },
        endUpper: { type: "number" },
      },
      required: ["startLower", "startUpper", "endLower", "endUpper"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        durationLower: { type: "number" },
        durationUpper: { type: "number" },
        overlapUncertainty: { type: "boolean" },
      },
      required: ["durationLower", "durationUpper", "overlapUncertainty"],
    },
    ports: {
      inputs: [
        {
          id: "startLower",
          label: "Start Lower",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "startUpper",
          label: "Start Upper",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "endLower",
          label: "End Lower",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "endUpper",
          label: "End Upper",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "durationLower",
          label: "Duration Lower",
          valueType: { type: "number" },
        },
        {
          id: "durationUpper",
          label: "Duration Upper",
          valueType: { type: "number" },
        },
        {
          id: "overlapUncertainty",
          label: "Overlap Uncertainty",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = stiffnessDurationPartialTimeBoundTool.execute;
export default stiffnessDurationPartialTimeBoundTool;
