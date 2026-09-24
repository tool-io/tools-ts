import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly real: number;
  readonly imaginary: number;
  readonly wavenumber: number;
};
export type Output = {
  readonly derivativeReal: number;
  readonly derivativeImaginary: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    real: { type: "number" },
    imaginary: { type: "number" },
    wavenumber: { type: "number" },
  },
  required: ["real", "imaginary", "wavenumber"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    derivativeReal: { type: "number" },
    derivativeImaginary: { type: "number" },
  },
  required: ["derivativeReal", "derivativeImaginary"],
} as const;
/** Complex first derivative multiplies a coefficient by i*k under the exp(i*k*x) convention. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { real, imaginary, wavenumber } = request;
  const compute = (): Output => {
    return {
      derivativeReal: -wavenumber * imaginary,
      derivativeImaginary: wavenumber * real,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { real: 2, imaginary: 3, wavenumber: 4 },
  output: { derivativeReal: -12, derivativeImaginary: 8 },
} satisfies ToolExample<Input, Output>;
export const spectralDerivativeOneModeFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "computational-physics/spectral-derivative-one-mode-factor",
    title: "Spectral Derivative One Mode Factor Tool",
    description:
      "Complex first derivative multiplies a coefficient by i*k under the exp(i*k*x) convention.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        real: { type: "number" },
        imaginary: { type: "number" },
        wavenumber: { type: "number" },
      },
      required: ["real", "imaginary", "wavenumber"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        derivativeReal: { type: "number" },
        derivativeImaginary: { type: "number" },
      },
      required: ["derivativeReal", "derivativeImaginary"],
    },
    ports: {
      inputs: [
        {
          id: "real",
          label: "Real",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "imaginary",
          label: "Imaginary",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "wavenumber",
          label: "Wavenumber",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "derivativeReal",
          label: "Derivative Real",
          valueType: { type: "number" },
        },
        {
          id: "derivativeImaginary",
          label: "Derivative Imaginary",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = spectralDerivativeOneModeFactorTool.execute;
export default spectralDerivativeOneModeFactorTool;
