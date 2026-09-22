import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly temperatureKelvin: number;
  readonly suppliedVirtualFactor: number;
  readonly referenceKelvin: number;
};
export type Output = {
  readonly virtualTemperatureKelvin: number;
  readonly gapKelvin: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    temperatureKelvin: { type: "number", exclusiveMinimum: 0 },
    suppliedVirtualFactor: { type: "number", exclusiveMinimum: 0 },
    referenceKelvin: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["temperatureKelvin", "suppliedVirtualFactor", "referenceKelvin"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    virtualTemperatureKelvin: { type: "number" },
    gapKelvin: { type: "number" },
  },
  required: ["virtualTemperatureKelvin", "gapKelvin"],
} as const;
/** Apply a caller-computed virtual-temperature factor; no humidity approximation or constants are chosen. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { temperatureKelvin, suppliedVirtualFactor, referenceKelvin } = request;
  const compute = (): Output => {
    H.positive(temperatureKelvin);
    H.positive(suppliedVirtualFactor);
    H.positive(referenceKelvin);
    return {
      virtualTemperatureKelvin: temperatureKelvin * suppliedVirtualFactor,
      gapKelvin: temperatureKelvin * suppliedVirtualFactor - referenceKelvin,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    temperatureKelvin: 300,
    suppliedVirtualFactor: 1.02,
    referenceKelvin: 305,
  },
  output: { virtualTemperatureKelvin: 306, gapKelvin: 1 },
} satisfies ToolExample<Input, Output>;
export const virtualTemperatureReferenceGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "atmospheric-science/virtual-temperature-reference-gap",
    title: "Virtual Temperature Reference Gap Tool",
    description:
      "Apply a caller-computed virtual-temperature factor; no humidity approximation or constants are chosen.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        temperatureKelvin: { type: "number", exclusiveMinimum: 0 },
        suppliedVirtualFactor: { type: "number", exclusiveMinimum: 0 },
        referenceKelvin: { type: "number", exclusiveMinimum: 0 },
      },
      required: [
        "temperatureKelvin",
        "suppliedVirtualFactor",
        "referenceKelvin",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        virtualTemperatureKelvin: { type: "number" },
        gapKelvin: { type: "number" },
      },
      required: ["virtualTemperatureKelvin", "gapKelvin"],
    },
    ports: {
      inputs: [
        {
          id: "temperatureKelvin",
          label: "Temperature Kelvin",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedVirtualFactor",
          label: "Supplied Virtual Factor",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "referenceKelvin",
          label: "Reference Kelvin",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "virtualTemperatureKelvin",
          label: "Virtual Temperature Kelvin",
          valueType: { type: "number" },
        },
        { id: "gapKelvin", label: "Gap Kelvin", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = virtualTemperatureReferenceGapTool.execute;
export default virtualTemperatureReferenceGapTool;
