import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly frequencyRatio: number;
  readonly dampingRatio: number;
};
export type Output = { readonly amplitudeRatio: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    frequencyRatio: { type: "number", minimum: 0 },
    dampingRatio: { type: "number", minimum: 0 },
  },
  required: ["frequencyRatio", "dampingRatio"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { amplitudeRatio: { type: "number" } },
  required: ["amplitudeRatio"],
} as const;
/** Ideal moving-coil geophone velocity-response magnitude normalized to its high-frequency sensitivity. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { frequencyRatio, dampingRatio } = request;
  const compute = (): Output => {
    H.domain(
      frequencyRatio >= 0 &&
        dampingRatio >= 0 &&
        !(frequencyRatio === 1 && dampingRatio === 0),
    );
    const amplitudeRatio =
      frequencyRatio <= 1
        ? frequencyRatio ** 2 /
          2 /
          Math.hypot(
            (1 - frequencyRatio ** 2) / 2,
            dampingRatio * frequencyRatio,
          )
        : 0.5 /
          Math.hypot(
            ((1 / frequencyRatio) ** 2 - 1) / 2,
            dampingRatio / frequencyRatio,
          );
    return { amplitudeRatio };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { frequencyRatio: 1, dampingRatio: 0.5 },
  output: { amplitudeRatio: 1 },
} satisfies ToolExample<Input, Output>;
export const geophoneNaturalFrequencyResponseRatioTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "geophysics/geophone-natural-frequency-response-ratio",
      title: "Geophone Natural Frequency Response Ratio Tool",
      description:
        "Ideal moving-coil geophone velocity-response magnitude normalized to its high-frequency sensitivity.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          frequencyRatio: { type: "number", minimum: 0 },
          dampingRatio: { type: "number", minimum: 0 },
        },
        required: ["frequencyRatio", "dampingRatio"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { amplitudeRatio: { type: "number" } },
        required: ["amplitudeRatio"],
      },
      ports: {
        inputs: [
          {
            id: "frequencyRatio",
            label: "Frequency Ratio",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "dampingRatio",
            label: "Damping Ratio",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "amplitudeRatio",
            label: "Amplitude Ratio",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = geophoneNaturalFrequencyResponseRatioTool.execute;
export default geophoneNaturalFrequencyResponseRatioTool;
