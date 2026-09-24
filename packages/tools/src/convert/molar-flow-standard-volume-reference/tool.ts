import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly molesPerSecond: number;
  readonly pressure: number;
  readonly temperature: number;
  readonly gasConstant: number;
};
export type Output = { readonly volumePerSecond: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    molesPerSecond: { type: "number", minimum: 0 },
    pressure: { type: "number", exclusiveMinimum: 0 },
    temperature: { type: "number", exclusiveMinimum: 0 },
    gasConstant: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["molesPerSecond", "pressure", "temperature", "gasConstant"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { volumePerSecond: { type: "number" } },
  required: ["volumePerSecond"],
} as const;
/** Convert molar flow to ideal-gas volume flow at explicit reference pressure and absolute temperature. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { molesPerSecond, pressure, temperature, gasConstant } = request;
  const compute = (): Output => {
    H.domain(molesPerSecond >= 0);
    H.positive(pressure);
    H.positive(temperature);
    H.positive(gasConstant);
    return {
      volumePerSecond: (molesPerSecond * gasConstant * temperature) / pressure,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    molesPerSecond: 2,
    pressure: 100000,
    temperature: 300,
    gasConstant: 8.314462618,
  },
  output: { volumePerSecond: 0.04988677570800001 },
} satisfies ToolExample<Input, Output>;
export const molarFlowStandardVolumeReferenceTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "convert/molar-flow-standard-volume-reference",
    title: "Molar Flow Standard Volume Reference Tool",
    description:
      "Convert molar flow to ideal-gas volume flow at explicit reference pressure and absolute temperature.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        molesPerSecond: { type: "number", minimum: 0 },
        pressure: { type: "number", exclusiveMinimum: 0 },
        temperature: { type: "number", exclusiveMinimum: 0 },
        gasConstant: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["molesPerSecond", "pressure", "temperature", "gasConstant"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { volumePerSecond: { type: "number" } },
      required: ["volumePerSecond"],
    },
    ports: {
      inputs: [
        {
          id: "molesPerSecond",
          label: "Moles Per Second",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "pressure",
          label: "Pressure",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "temperature",
          label: "Temperature",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "gasConstant",
          label: "Gas Constant",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "volumePerSecond",
          label: "Volume Per Second",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = molarFlowStandardVolumeReferenceTool.execute;
export default molarFlowStandardVolumeReferenceTool;
