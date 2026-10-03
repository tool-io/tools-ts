import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly observedVolume: number;
  readonly conversionFactor: number;
  readonly factorUncertainty: number;
};
export type Output = {
  readonly convertedVolume: number;
  readonly uncertaintyFromFactor: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    observedVolume: { type: "number" },
    conversionFactor: { type: "number", exclusiveMinimum: 0 },
    factorUncertainty: { type: "number", minimum: 0 },
  },
  required: ["observedVolume", "conversionFactor", "factorUncertainty"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    convertedVolume: { type: "number" },
    uncertaintyFromFactor: { type: "number" },
  },
  required: ["convertedVolume", "uncertaintyFromFactor"],
} as const;
/** Apply an independently supplied BTPS factor and its standard uncertainty contribution, without deriving gas-condition corrections or interpreting a lung measurement. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { observedVolume, conversionFactor, factorUncertainty } = request;
  const compute = (): Output => {
    H.positive(conversionFactor);
    H.domain(factorUncertainty >= 0);
    return {
      convertedVolume: observedVolume * conversionFactor,
      uncertaintyFromFactor: Math.abs(observedVolume) * factorUncertainty,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { observedVolume: 3, conversionFactor: 1.1, factorUncertainty: 0.02 },
  output: { convertedVolume: 3.3000000000000003, uncertaintyFromFactor: 0.06 },
} satisfies ToolExample<Input, Output>;
export const lungVolumeBtpsSuppliedFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "pulmonology/lung-volume-btps-supplied-factor",
    title: "Lung Volume BTPS Supplied Factor Tool",
    description:
      "Apply an independently supplied BTPS factor and its standard uncertainty contribution, without deriving gas-condition corrections or interpreting a lung measurement.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        observedVolume: { type: "number" },
        conversionFactor: { type: "number", exclusiveMinimum: 0 },
        factorUncertainty: { type: "number", minimum: 0 },
      },
      required: ["observedVolume", "conversionFactor", "factorUncertainty"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        convertedVolume: { type: "number" },
        uncertaintyFromFactor: { type: "number" },
      },
      required: ["convertedVolume", "uncertaintyFromFactor"],
    },
    ports: {
      inputs: [
        {
          id: "observedVolume",
          label: "Observed Volume",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "conversionFactor",
          label: "Conversion Factor",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "factorUncertainty",
          label: "Factor Uncertainty",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "convertedVolume",
          label: "Converted Volume",
          valueType: { type: "number" },
        },
        {
          id: "uncertaintyFromFactor",
          label: "Uncertainty From Factor",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = lungVolumeBtpsSuppliedFactorTool.execute;
export default lungVolumeBtpsSuppliedFactorTool;
