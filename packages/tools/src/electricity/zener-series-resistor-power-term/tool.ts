import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly supply: number;
  readonly zenerVoltage: number;
  readonly resistance: number;
};
export type Output = {
  readonly current: number;
  readonly resistorPower: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    supply: { type: "number" },
    zenerVoltage: { type: "number", minimum: 0 },
    resistance: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["supply", "zenerVoltage", "resistance"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    current: { type: "number" },
    resistorPower: { type: "number" },
  },
  required: ["current", "resistorPower"],
} as const;
/** Calculate zener series resistor power term from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { supply, zenerVoltage, resistance } = request;
  const compute = (): Output => {
    H.domain(supply >= zenerVoltage && zenerVoltage >= 0);
    H.positive(resistance);
    const drop = supply - zenerVoltage;
    return {
      current: drop / resistance,
      resistorPower: (drop * drop) / resistance,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { supply: 12, zenerVoltage: 5, resistance: 1000 },
  output: { current: 0.007, resistorPower: 0.049 },
} satisfies ToolExample<Input, Output>;
export const zenerSeriesResistorPowerTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "electricity/zener-series-resistor-power-term",
    title: "Zener Series Resistor Power Term Tool",
    description:
      "Calculate zener series resistor power term from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        supply: { type: "number" },
        zenerVoltage: { type: "number", minimum: 0 },
        resistance: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["supply", "zenerVoltage", "resistance"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        current: { type: "number" },
        resistorPower: { type: "number" },
      },
      required: ["current", "resistorPower"],
    },
    ports: {
      inputs: [
        {
          id: "supply",
          label: "Supply",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "zenerVoltage",
          label: "Zener Voltage",
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
        { id: "current", label: "Current", valueType: { type: "number" } },
        {
          id: "resistorPower",
          label: "Resistor Power",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = zenerSeriesResistorPowerTermTool.execute;
export default zenerSeriesResistorPowerTermTool;
