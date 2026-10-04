import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly activityMicromolesPerMinute: number;
  readonly durationMinutes: number;
};
export type Output = { readonly amountMicromoles: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    activityMicromolesPerMinute: { type: "number", minimum: 0 },
    durationMinutes: { type: "number", minimum: 0 },
  },
  required: ["activityMicromolesPerMinute", "durationMinutes"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { amountMicromoles: { type: "number" } },
  required: ["amountMicromoles"],
} as const;
/** Convert a constant recorded activity in micromoles per minute into amount over a supplied interval; no kinetic extrapolation beyond that assumption. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { activityMicromolesPerMinute, durationMinutes } = request;
  const compute = (): Output => {
    H.domain(
      activityMicromolesPerMinute >= 0 && durationMinutes >= 0,
      "activityMicromolesPerMinute",
    );
    return { amountMicromoles: activityMicromolesPerMinute * durationMinutes };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { activityMicromolesPerMinute: 2.5, durationMinutes: 4 },
  output: { amountMicromoles: 10 },
} satisfies ToolExample<Input, Output>;
export const enzymeUnitReactionDurationCrosswalkTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "biotechnology/enzyme-unit-reaction-duration-crosswalk",
      title: "Enzyme Unit Reaction Duration Crosswalk Tool",
      description:
        "Convert a constant recorded activity in micromoles per minute into amount over a supplied interval; no kinetic extrapolation beyond that assumption.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          activityMicromolesPerMinute: { type: "number", minimum: 0 },
          durationMinutes: { type: "number", minimum: 0 },
        },
        required: ["activityMicromolesPerMinute", "durationMinutes"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { amountMicromoles: { type: "number" } },
        required: ["amountMicromoles"],
      },
      ports: {
        inputs: [
          {
            id: "activityMicromolesPerMinute",
            label: "Activity Micromoles Per Minute",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "durationMinutes",
            label: "Duration Minutes",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "amountMicromoles",
            label: "Amount Micromoles",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = enzymeUnitReactionDurationCrosswalkTool.execute;
export default enzymeUnitReactionDurationCrosswalkTool;
