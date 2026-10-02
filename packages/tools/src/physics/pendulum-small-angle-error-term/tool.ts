import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly amplitudeRadians: number };
export type Output = { readonly relativePeriodCorrection: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { amplitudeRadians: { type: "number" } },
  required: ["amplitudeRadians"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { relativePeriodCorrection: { type: "number" } },
  required: ["relativePeriodCorrection"],
} as const;
/** Return only the leading amplitude-squared correction to the small-angle simple-pendulum period. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { amplitudeRadians } = request;
  const compute = (): Output => {
    return {
      relativePeriodCorrection: (amplitudeRadians * amplitudeRadians) / 16,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { amplitudeRadians: 0.4 },
  output: { relativePeriodCorrection: 0.010000000000000002 },
} satisfies ToolExample<Input, Output>;
export const pendulumSmallAngleErrorTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "physics/pendulum-small-angle-error-term",
    title: "Pendulum Small Angle Error Term Tool",
    description:
      "Return only the leading amplitude-squared correction to the small-angle simple-pendulum period.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { amplitudeRadians: { type: "number" } },
      required: ["amplitudeRadians"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { relativePeriodCorrection: { type: "number" } },
      required: ["relativePeriodCorrection"],
    },
    ports: {
      inputs: [
        {
          id: "amplitudeRadians",
          label: "Amplitude Radians",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "relativePeriodCorrection",
          label: "Relative Period Correction",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = pendulumSmallAngleErrorTermTool.execute;
export default pendulumSmallAngleErrorTermTool;
