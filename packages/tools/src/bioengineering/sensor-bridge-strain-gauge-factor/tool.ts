import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly strain: number;
  readonly gaugeFactor: number;
  readonly excitation: number;
  readonly bridgeFactor: number;
};
export type Output = {
  readonly relativeResistanceChange: number;
  readonly outputVoltage: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    strain: { type: "number" },
    gaugeFactor: { type: "number", minimum: 0 },
    excitation: { type: "number", minimum: 0 },
    bridgeFactor: { type: "number" },
  },
  required: ["strain", "gaugeFactor", "excitation", "bridgeFactor"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    relativeResistanceChange: { type: "number" },
    outputVoltage: { type: "number" },
  },
  required: ["relativeResistanceChange", "outputVoltage"],
} as const;
/** Small-signal bridge approximation with an explicit wiring/sensitivity factor. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { strain, gaugeFactor, excitation, bridgeFactor } = request;
  const compute = (): Output => {
    H.domain(gaugeFactor >= 0 && excitation >= 0);
    return {
      relativeResistanceChange: gaugeFactor * strain,
      outputVoltage: excitation * bridgeFactor * gaugeFactor * strain,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { strain: 0.001, gaugeFactor: 2, excitation: 5, bridgeFactor: 0.25 },
  output: { relativeResistanceChange: 0.002, outputVoltage: 0.0025 },
} satisfies ToolExample<Input, Output>;
export const sensorBridgeStrainGaugeFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "bioengineering/sensor-bridge-strain-gauge-factor",
    title: "Sensor Bridge Strain Gauge Factor Tool",
    description:
      "Small-signal bridge approximation with an explicit wiring/sensitivity factor.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        strain: { type: "number" },
        gaugeFactor: { type: "number", minimum: 0 },
        excitation: { type: "number", minimum: 0 },
        bridgeFactor: { type: "number" },
      },
      required: ["strain", "gaugeFactor", "excitation", "bridgeFactor"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        relativeResistanceChange: { type: "number" },
        outputVoltage: { type: "number" },
      },
      required: ["relativeResistanceChange", "outputVoltage"],
    },
    ports: {
      inputs: [
        {
          id: "strain",
          label: "Strain",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "gaugeFactor",
          label: "Gauge Factor",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "excitation",
          label: "Excitation",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "bridgeFactor",
          label: "Bridge Factor",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "relativeResistanceChange",
          label: "Relative Resistance Change",
          valueType: { type: "number" },
        },
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
export const run = sensorBridgeStrainGaugeFactorTool.execute;
export default sensorBridgeStrainGaugeFactorTool;
