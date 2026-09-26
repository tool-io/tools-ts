import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly capacitance: number;
  readonly initialVoltage: number;
  readonly finalVoltage: number;
  readonly suppliedWork: number;
};
export type Output = {
  readonly energyChange: number;
  readonly residual: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    capacitance: { type: "number", exclusiveMinimum: 0 },
    initialVoltage: { type: "number" },
    finalVoltage: { type: "number" },
    suppliedWork: { type: "number" },
  },
  required: ["capacitance", "initialVoltage", "finalVoltage", "suppliedWork"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    energyChange: { type: "number" },
    residual: { type: "number" },
  },
  required: ["energyChange", "residual"],
} as const;
/** Compare supplied work with the capacitor stored-energy change. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { capacitance, initialVoltage, finalVoltage, suppliedWork } = request;
  const compute = (): Output => {
    H.positive(capacitance);
    return {
      energyChange:
        (capacitance *
          (finalVoltage - initialVoltage) *
          (finalVoltage + initialVoltage)) /
        2,
      residual:
        suppliedWork -
        (capacitance *
          (finalVoltage - initialVoltage) *
          (finalVoltage + initialVoltage)) /
          2,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    capacitance: 2,
    initialVoltage: 1,
    finalVoltage: 3,
    suppliedWork: 10,
  },
  output: { energyChange: 8, residual: 2 },
} satisfies ToolExample<Input, Output>;
export const capacitorChargeStepEnergyResidualTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "electricity/capacitor-charge-step-energy-residual",
    title: "Capacitor Charge Step Energy Residual Tool",
    description:
      "Compare supplied work with the capacitor stored-energy change.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        capacitance: { type: "number", exclusiveMinimum: 0 },
        initialVoltage: { type: "number" },
        finalVoltage: { type: "number" },
        suppliedWork: { type: "number" },
      },
      required: [
        "capacitance",
        "initialVoltage",
        "finalVoltage",
        "suppliedWork",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        energyChange: { type: "number" },
        residual: { type: "number" },
      },
      required: ["energyChange", "residual"],
    },
    ports: {
      inputs: [
        {
          id: "capacitance",
          label: "Capacitance",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "initialVoltage",
          label: "Initial Voltage",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "finalVoltage",
          label: "Final Voltage",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedWork",
          label: "Supplied Work",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "energyChange",
          label: "Energy Change",
          valueType: { type: "number" },
        },
        { id: "residual", label: "Residual", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = capacitorChargeStepEnergyResidualTool.execute;
export default capacitorChargeStepEnergyResidualTool;
