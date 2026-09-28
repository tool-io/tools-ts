import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly amplitude: number;
  readonly suppliedPolarity: number;
};
export type Output = { readonly correctedAmplitude: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    amplitude: { type: "number" },
    suppliedPolarity: { type: "integer" },
  },
  required: ["amplitude", "suppliedPolarity"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { correctedAmplitude: { type: "number" } },
  required: ["correctedAmplitude"],
} as const;
/** Apply an explicit channel polarity factor without identifying a seismic event. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { amplitude, suppliedPolarity } = request;
  const compute = (): Output => {
    H.domain(suppliedPolarity === 1 || suppliedPolarity === -1);
    return { correctedAmplitude: amplitude * suppliedPolarity };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { amplitude: 3, suppliedPolarity: -1 },
  output: { correctedAmplitude: -3 },
} satisfies ToolExample<Input, Output>;
export const seismicComponentPolarityFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "geophysics/seismic-component-polarity-factor",
    title: "Seismic Component Polarity Factor Tool",
    description:
      "Apply an explicit channel polarity factor without identifying a seismic event.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        amplitude: { type: "number" },
        suppliedPolarity: { type: "integer" },
      },
      required: ["amplitude", "suppliedPolarity"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { correctedAmplitude: { type: "number" } },
      required: ["correctedAmplitude"],
    },
    ports: {
      inputs: [
        {
          id: "amplitude",
          label: "Amplitude",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedPolarity",
          label: "Supplied Polarity",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "correctedAmplitude",
          label: "Corrected Amplitude",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = seismicComponentPolarityFactorTool.execute;
export default seismicComponentPolarityFactorTool;
