import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly supply: number;
  readonly r1: number;
  readonly r2: number;
  readonly r3: number;
  readonly r4: number;
};
export type Output = { readonly outputVoltage: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    supply: { type: "number" },
    r1: { type: "number", exclusiveMinimum: 0 },
    r2: { type: "number", exclusiveMinimum: 0 },
    r3: { type: "number", exclusiveMinimum: 0 },
    r4: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["supply", "r1", "r2", "r3", "r4"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { outputVoltage: { type: "number" } },
  required: ["outputVoltage"],
} as const;
/** Subtract the two ideal unloaded resistor-divider midpoints under the explicitly ordered bridge arms. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { supply, r1, r2, r3, r4 } = request;
  const compute = (): Output => {
    H.positive(r1);
    H.positive(r2);
    H.positive(r3);
    H.positive(r4);
    return { outputVoltage: supply * (r2 / (r1 + r2) - r4 / (r3 + r4)) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { supply: 10, r1: 1, r2: 3, r3: 2, r4: 2 },
  output: { outputVoltage: 2.5 },
} satisfies ToolExample<Input, Output>;
export const sensorBridgeImbalanceVoltageTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "bioengineering/sensor-bridge-imbalance-voltage",
    title: "Sensor Bridge Imbalance Voltage Tool",
    description:
      "Subtract the two ideal unloaded resistor-divider midpoints under the explicitly ordered bridge arms.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        supply: { type: "number" },
        r1: { type: "number", exclusiveMinimum: 0 },
        r2: { type: "number", exclusiveMinimum: 0 },
        r3: { type: "number", exclusiveMinimum: 0 },
        r4: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["supply", "r1", "r2", "r3", "r4"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { outputVoltage: { type: "number" } },
      required: ["outputVoltage"],
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
          id: "r1",
          label: "R1",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "r2",
          label: "R2",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "r3",
          label: "R3",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "r4",
          label: "R4",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "outputVoltage",
          label: "Output Voltage",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = sensorBridgeImbalanceVoltageTool.execute;
export default sensorBridgeImbalanceVoltageTool;
