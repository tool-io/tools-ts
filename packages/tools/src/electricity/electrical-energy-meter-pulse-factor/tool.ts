import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly pulses: number; readonly pulsesPerKwh: number };
export type Output = { readonly kilowattHours: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    pulses: { type: "integer", minimum: 0 },
    pulsesPerKwh: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["pulses", "pulsesPerKwh"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { kilowattHours: { type: "number" } },
  required: ["kilowattHours"],
} as const;
/** Calculate electrical energy meter pulse factor from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { pulses, pulsesPerKwh } = request;
  const compute = (): Output => {
    H.integer(pulses, 0);
    H.positive(pulsesPerKwh);
    return { kilowattHours: pulses / pulsesPerKwh };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { pulses: 250, pulsesPerKwh: 1000 },
  output: { kilowattHours: 0.25 },
} satisfies ToolExample<Input, Output>;
export const electricalEnergyMeterPulseFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "electricity/electrical-energy-meter-pulse-factor",
    title: "Electrical Energy Meter Pulse Factor Tool",
    description:
      "Calculate electrical energy meter pulse factor from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        pulses: { type: "integer", minimum: 0 },
        pulsesPerKwh: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["pulses", "pulsesPerKwh"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { kilowattHours: { type: "number" } },
      required: ["kilowattHours"],
    },
    ports: {
      inputs: [
        {
          id: "pulses",
          label: "Pulses",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "pulsesPerKwh",
          label: "Pulses Per Kwh",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "kilowattHours",
          label: "Kilowatt Hours",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = electricalEnergyMeterPulseFactorTool.execute;
export default electricalEnergyMeterPulseFactorTool;
