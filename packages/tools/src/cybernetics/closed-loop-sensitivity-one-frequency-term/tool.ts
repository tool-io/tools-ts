import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly loopReal: number;
  readonly loopImaginary: number;
};
export type Output = {
  readonly sensitivityReal: number;
  readonly sensitivityImaginary: number;
  readonly magnitude: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    loopReal: { type: "number" },
    loopImaginary: { type: "number" },
  },
  required: ["loopReal", "loopImaginary"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sensitivityReal: { type: "number" },
    sensitivityImaginary: { type: "number" },
    magnitude: { type: "number" },
  },
  required: ["sensitivityReal", "sensitivityImaginary", "magnitude"],
} as const;
/** Negative-feedback sensitivity S=1/(1+L) at one supplied complex loop gain. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { loopReal, loopImaginary } = request;
  const compute = (): Output => {
    H.domain(loopReal !== -1 || loopImaginary !== 0);
    const a = 1 + loopReal,
      b = loopImaginary,
      scale = Math.max(Math.abs(a), Math.abs(b)),
      ar = a / scale,
      br = b / scale,
      denominator = ar * ar + br * br;
    return {
      sensitivityReal: ar / denominator / scale,
      sensitivityImaginary: -br / denominator / scale,
      magnitude: 1 / Math.hypot(ar, br) / scale,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { loopReal: 3, loopImaginary: 0 },
  output: { sensitivityReal: 0.25, sensitivityImaginary: 0, magnitude: 0.25 },
} satisfies ToolExample<Input, Output>;
export const closedLoopSensitivityOneFrequencyTermTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "cybernetics/closed-loop-sensitivity-one-frequency-term",
      title: "Closed Loop Sensitivity One Frequency Term Tool",
      description:
        "Negative-feedback sensitivity S=1/(1+L) at one supplied complex loop gain.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          loopReal: { type: "number" },
          loopImaginary: { type: "number" },
        },
        required: ["loopReal", "loopImaginary"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          sensitivityReal: { type: "number" },
          sensitivityImaginary: { type: "number" },
          magnitude: { type: "number" },
        },
        required: ["sensitivityReal", "sensitivityImaginary", "magnitude"],
      },
      ports: {
        inputs: [
          {
            id: "loopReal",
            label: "Loop Real",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "loopImaginary",
            label: "Loop Imaginary",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "sensitivityReal",
            label: "Sensitivity Real",
            valueType: { type: "number" },
          },
          {
            id: "sensitivityImaginary",
            label: "Sensitivity Imaginary",
            valueType: { type: "number" },
          },
          {
            id: "magnitude",
            label: "Magnitude",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = closedLoopSensitivityOneFrequencyTermTool.execute;
export default closedLoopSensitivityOneFrequencyTermTool;
