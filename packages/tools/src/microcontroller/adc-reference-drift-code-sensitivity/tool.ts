import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly inputVoltage: number;
  readonly referenceVoltage: number;
  readonly maximumCode: number;
};
export type Output = {
  readonly idealCode: number;
  readonly referenceDerivative: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    inputVoltage: { type: "number", minimum: 0 },
    referenceVoltage: { type: "number", exclusiveMinimum: 0 },
    maximumCode: { type: "integer", minimum: 1 },
  },
  required: ["inputVoltage", "referenceVoltage", "maximumCode"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    idealCode: { type: "number" },
    referenceDerivative: { type: "number" },
  },
  required: ["idealCode", "referenceDerivative"],
} as const;
/** Continuous ideal ADC-code sensitivity to reference voltage, excluding quantization and saturation changes. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { inputVoltage, referenceVoltage, maximumCode } = request;
  const compute = (): Output => {
    H.positive(referenceVoltage);
    H.domain(inputVoltage >= 0 && inputVoltage <= referenceVoltage);
    H.integer(maximumCode, 1);
    return {
      idealCode: maximumCode * (inputVoltage / referenceVoltage),
      referenceDerivative:
        (-maximumCode * (inputVoltage / referenceVoltage)) / referenceVoltage,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { inputVoltage: 1, referenceVoltage: 2, maximumCode: 1023 },
  output: { idealCode: 511.5, referenceDerivative: -255.75 },
} satisfies ToolExample<Input, Output>;
export const adcReferenceDriftCodeSensitivityTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "microcontroller/adc-reference-drift-code-sensitivity",
    title: "ADC Reference Drift Code Sensitivity Tool",
    description:
      "Continuous ideal ADC-code sensitivity to reference voltage, excluding quantization and saturation changes.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        inputVoltage: { type: "number", minimum: 0 },
        referenceVoltage: { type: "number", exclusiveMinimum: 0 },
        maximumCode: { type: "integer", minimum: 1 },
      },
      required: ["inputVoltage", "referenceVoltage", "maximumCode"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        idealCode: { type: "number" },
        referenceDerivative: { type: "number" },
      },
      required: ["idealCode", "referenceDerivative"],
    },
    ports: {
      inputs: [
        {
          id: "inputVoltage",
          label: "Input Voltage",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "referenceVoltage",
          label: "Reference Voltage",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "maximumCode",
          label: "Maximum Code",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "idealCode", label: "Ideal Code", valueType: { type: "number" } },
        {
          id: "referenceDerivative",
          label: "Reference Derivative",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = adcReferenceDriftCodeSensitivityTool.execute;
export default adcReferenceDriftCodeSensitivityTool;
