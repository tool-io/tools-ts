import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly speedMetersPerSecond: number;
  readonly bodyLengthCm: number;
};
export type Output = {
  readonly bodyLengthsPerSecond: number;
  readonly timeForTenLengthsSeconds: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    speedMetersPerSecond: { type: "number", exclusiveMinimum: 0 },
    bodyLengthCm: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["speedMetersPerSecond", "bodyLengthCm"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    bodyLengthsPerSecond: { type: "number" },
    timeForTenLengthsSeconds: { type: "number" },
  },
  required: ["bodyLengthsPerSecond", "timeForTenLengthsSeconds"],
} as const;
/** Calculate fish swimming body lengths per second from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { speedMetersPerSecond, bodyLengthCm } = request;
  const compute = (): Output => {
    H.positive(speedMetersPerSecond);
    H.positive(bodyLengthCm);
    return {
      bodyLengthsPerSecond: (100 * speedMetersPerSecond) / bodyLengthCm,
      timeForTenLengthsSeconds: bodyLengthCm / (10 * speedMetersPerSecond),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { speedMetersPerSecond: 0.5, bodyLengthCm: 20 },
  output: { bodyLengthsPerSecond: 2.5, timeForTenLengthsSeconds: 4 },
} satisfies ToolExample<Input, Output>;
export const fishSwimmingBodyLengthsPerSecondTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "ichthyology/fish-swimming-body-lengths-per-second",
    title: "Fish Swimming Body Lengths Per Second Tool",
    description:
      "Calculate fish swimming body lengths per second from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        speedMetersPerSecond: { type: "number", exclusiveMinimum: 0 },
        bodyLengthCm: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["speedMetersPerSecond", "bodyLengthCm"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        bodyLengthsPerSecond: { type: "number" },
        timeForTenLengthsSeconds: { type: "number" },
      },
      required: ["bodyLengthsPerSecond", "timeForTenLengthsSeconds"],
    },
    ports: {
      inputs: [
        {
          id: "speedMetersPerSecond",
          label: "Speed Meters Per Second",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "bodyLengthCm",
          label: "Body Length Cm",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "bodyLengthsPerSecond",
          label: "Body Lengths Per Second",
          valueType: { type: "number" },
        },
        {
          id: "timeForTenLengthsSeconds",
          label: "Time For Ten Lengths Seconds",
          valueType: { type: "number", unit: "s" },
        },
      ],
    },
  },
  calculate,
});
export const run = fishSwimmingBodyLengthsPerSecondTool.execute;
export default fishSwimmingBodyLengthsPerSecondTool;
