import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly voltage: number;
  readonly leakageResistance: number;
  readonly totalPower: number;
};
export type Output = {
  readonly leakagePower: number;
  readonly fraction: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    voltage: { type: "number" },
    leakageResistance: { type: "number", exclusiveMinimum: 0 },
    totalPower: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["voltage", "leakageResistance", "totalPower"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    leakagePower: { type: "number" },
    fraction: { type: "number" },
  },
  required: ["leakagePower", "fraction"],
} as const;
/** Compare ideal resistive leakage power with a supplied total power, without component safety assessment. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { voltage, leakageResistance, totalPower } = request;
  const compute = (): Output => {
    H.positive(leakageResistance);
    H.positive(totalPower);
    return {
      leakagePower: voltage ** 2 / leakageResistance,
      fraction: voltage ** 2 / leakageResistance / totalPower,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { voltage: 10, leakageResistance: 100, totalPower: 2 },
  output: { leakagePower: 1, fraction: 0.5 },
} satisfies ToolExample<Input, Output>;
export const capacitorLeakagePowerFractionTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "electricity/capacitor-leakage-power-fraction",
    title: "Capacitor Leakage Power Fraction Tool",
    description:
      "Compare ideal resistive leakage power with a supplied total power, without component safety assessment.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        voltage: { type: "number" },
        leakageResistance: { type: "number", exclusiveMinimum: 0 },
        totalPower: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["voltage", "leakageResistance", "totalPower"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        leakagePower: { type: "number" },
        fraction: { type: "number" },
      },
      required: ["leakagePower", "fraction"],
    },
    ports: {
      inputs: [
        {
          id: "voltage",
          label: "Voltage",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "leakageResistance",
          label: "Leakage Resistance",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "totalPower",
          label: "Total Power",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "leakagePower",
          label: "Leakage Power",
          valueType: { type: "number" },
        },
        { id: "fraction", label: "Fraction", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = capacitorLeakagePowerFractionTool.execute;
export default capacitorLeakagePowerFractionTool;
