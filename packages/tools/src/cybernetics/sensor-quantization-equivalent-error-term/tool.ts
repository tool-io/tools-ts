import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly stepSize: number; readonly gain: number };
export type Output = {
  readonly outputHalfWidth: number;
  readonly outputUniformSd: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    stepSize: { type: "number", minimum: 0 },
    gain: { type: "number" },
  },
  required: ["stepSize", "gain"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    outputHalfWidth: { type: "number" },
    outputUniformSd: { type: "number" },
  },
  required: ["outputHalfWidth", "outputUniformSd"],
} as const;
/** Uniform rounding-error approximation propagated through a supplied scalar gain. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { stepSize, gain } = request;
  const compute = (): Output => {
    H.domain(stepSize >= 0);
    return {
      outputHalfWidth: (Math.abs(gain) * stepSize) / 2,
      outputUniformSd: (Math.abs(gain) * stepSize) / Math.sqrt(12),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { stepSize: 2, gain: 3 },
  output: { outputHalfWidth: 3, outputUniformSd: 1.7320508075688774 },
} satisfies ToolExample<Input, Output>;
export const sensorQuantizationEquivalentErrorTermTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "cybernetics/sensor-quantization-equivalent-error-term",
      title: "Sensor Quantization Equivalent Error Term Tool",
      description:
        "Uniform rounding-error approximation propagated through a supplied scalar gain.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          stepSize: { type: "number", minimum: 0 },
          gain: { type: "number" },
        },
        required: ["stepSize", "gain"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          outputHalfWidth: { type: "number" },
          outputUniformSd: { type: "number" },
        },
        required: ["outputHalfWidth", "outputUniformSd"],
      },
      ports: {
        inputs: [
          {
            id: "stepSize",
            label: "Step Size",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "gain",
            label: "Gain",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "outputHalfWidth",
            label: "Output Half Width",
            valueType: { type: "number" },
          },
          {
            id: "outputUniformSd",
            label: "Output Uniform Sd",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = sensorQuantizationEquivalentErrorTermTool.execute;
export default sensorQuantizationEquivalentErrorTermTool;
