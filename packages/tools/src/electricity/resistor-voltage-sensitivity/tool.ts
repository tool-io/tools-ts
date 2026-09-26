import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly current: number; readonly resistance: number };
export type Output = {
  readonly voltage: number;
  readonly derivativeWithRespectToResistance: number;
  readonly derivativeWithRespectToCurrent: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    current: { type: "number" },
    resistance: { type: "number", minimum: 0 },
  },
  required: ["current", "resistance"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    voltage: { type: "number" },
    derivativeWithRespectToResistance: { type: "number" },
    derivativeWithRespectToCurrent: { type: "number" },
  },
  required: [
    "voltage",
    "derivativeWithRespectToResistance",
    "derivativeWithRespectToCurrent",
  ],
} as const;
/** Return supplied ideal Ohm-law voltage and its two local partial derivatives. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { current, resistance } = request;
  const compute = (): Output => {
    H.domain(resistance >= 0);
    return {
      voltage: current * resistance,
      derivativeWithRespectToResistance: current,
      derivativeWithRespectToCurrent: resistance,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { current: 2, resistance: 5 },
  output: {
    voltage: 10,
    derivativeWithRespectToResistance: 2,
    derivativeWithRespectToCurrent: 5,
  },
} satisfies ToolExample<Input, Output>;
export const resistorVoltageSensitivityTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "electricity/resistor-voltage-sensitivity",
    title: "Resistor Voltage Sensitivity Tool",
    description:
      "Return supplied ideal Ohm-law voltage and its two local partial derivatives.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        current: { type: "number" },
        resistance: { type: "number", minimum: 0 },
      },
      required: ["current", "resistance"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        voltage: { type: "number" },
        derivativeWithRespectToResistance: { type: "number" },
        derivativeWithRespectToCurrent: { type: "number" },
      },
      required: [
        "voltage",
        "derivativeWithRespectToResistance",
        "derivativeWithRespectToCurrent",
      ],
    },
    ports: {
      inputs: [
        {
          id: "current",
          label: "Current",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "resistance",
          label: "Resistance",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "voltage", label: "Voltage", valueType: { type: "number" } },
        {
          id: "derivativeWithRespectToResistance",
          label: "Derivative With Respect To Resistance",
          valueType: { type: "number" },
        },
        {
          id: "derivativeWithRespectToCurrent",
          label: "Derivative With Respect To Current",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = resistorVoltageSensitivityTool.execute;
export default resistorVoltageSensitivityTool;
