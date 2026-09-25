import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly current: number;
  readonly resistance: number;
  readonly thermalConductance: number;
};
export type Output = {
  readonly power: number;
  readonly estimatedTemperatureRise: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    current: { type: "number" },
    resistance: { type: "number", minimum: 0 },
    thermalConductance: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["current", "resistance", "thermalConductance"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    power: { type: "number" },
    estimatedTemperatureRise: { type: "number" },
  },
  required: ["power", "estimatedTemperatureRise"],
} as const;
/** Local steady I squared*R self-heating with a supplied linear thermal conductance. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { current, resistance, thermalConductance } = request;
  const compute = (): Output => {
    H.domain(resistance >= 0);
    H.positive(thermalConductance);
    return {
      power: current ** 2 * resistance,
      estimatedTemperatureRise:
        (current ** 2 * resistance) / thermalConductance,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { current: 0.001, resistance: 100, thermalConductance: 0.01 },
  output: {
    power: 0.00009999999999999999,
    estimatedTemperatureRise: 0.009999999999999998,
  },
} satisfies ToolExample<Input, Output>;
export const cryogenicSensorSelfHeatingPowerTermTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "cryogenics/cryogenic-sensor-self-heating-power-term",
      title: "Cryogenic Sensor Self Heating Power Term Tool",
      description:
        "Local steady I squared*R self-heating with a supplied linear thermal conductance.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          current: { type: "number" },
          resistance: { type: "number", minimum: 0 },
          thermalConductance: { type: "number", exclusiveMinimum: 0 },
        },
        required: ["current", "resistance", "thermalConductance"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          power: { type: "number" },
          estimatedTemperatureRise: { type: "number" },
        },
        required: ["power", "estimatedTemperatureRise"],
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
          {
            id: "thermalConductance",
            label: "Thermal Conductance",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          { id: "power", label: "Power", valueType: { type: "number" } },
          {
            id: "estimatedTemperatureRise",
            label: "Estimated Temperature Rise",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = cryogenicSensorSelfHeatingPowerTermTool.execute;
export default cryogenicSensorSelfHeatingPowerTermTool;
