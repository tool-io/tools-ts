import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly conductance: number;
  readonly coefficient: number;
  readonly temperatureChange: number;
};
export type Output = {
  readonly conductance: number;
  readonly relativeChange: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    conductance: { type: "number", exclusiveMinimum: 0 },
    coefficient: { type: "number" },
    temperatureChange: { type: "number" },
  },
  required: ["conductance", "coefficient", "temperatureChange"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    conductance: { type: "number" },
    relativeChange: { type: "number" },
  },
  required: ["conductance", "relativeChange"],
} as const;
/** Apply a linear resistance temperature coefficient to the reciprocal conductance, not directly to conductance. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { conductance, coefficient, temperatureChange } = input;
  const compute = (): Output => {
    H.positive(conductance);
    const factor = 1 + coefficient * temperatureChange;
    H.positive(factor);
    const next = conductance / factor;
    return { conductance: next, relativeChange: next / conductance - 1 };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { conductance: 2, coefficient: 0.01, temperatureChange: 100 },
  output: { conductance: 1, relativeChange: -0.5 },
} satisfies ToolExample<Input, Output>;
export const conductanceTemperatureRelativeChangeTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "electricity/conductance-temperature-relative-change",
      title: "Conductance Temperature Relative Change Tool",
      description:
        "Apply a linear resistance temperature coefficient to the reciprocal conductance, not directly to conductance.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          conductance: { type: "number", exclusiveMinimum: 0 },
          coefficient: { type: "number" },
          temperatureChange: { type: "number" },
        },
        required: ["conductance", "coefficient", "temperatureChange"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          conductance: { type: "number" },
          relativeChange: { type: "number" },
        },
        required: ["conductance", "relativeChange"],
      },
      ports: {
        inputs: [
          {
            id: "conductance",
            label: "Conductance",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "coefficient",
            label: "Coefficient",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "temperatureChange",
            label: "Temperature Change",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "conductance",
            label: "Conductance",
            valueType: { type: "number" },
          },
          {
            id: "relativeChange",
            label: "Relative Change",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = conductanceTemperatureRelativeChangeTool.execute;
export default conductanceTemperatureRelativeChangeTool;
