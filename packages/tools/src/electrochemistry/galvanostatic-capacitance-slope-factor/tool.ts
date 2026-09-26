import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly currentMagnitude: number;
  readonly voltageSlopeMagnitude: number;
  readonly activeMass: number;
};
export type Output = {
  readonly capacitance: number;
  readonly specificCapacitance: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    currentMagnitude: { type: "number", minimum: 0 },
    voltageSlopeMagnitude: { type: "number", exclusiveMinimum: 0 },
    activeMass: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["currentMagnitude", "voltageSlopeMagnitude", "activeMass"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    capacitance: { type: "number" },
    specificCapacitance: { type: "number" },
  },
  required: ["capacitance", "specificCapacitance"],
} as const;
/** Ideal linear galvanostatic C=|I|/|dV/dt| after excluding an instantaneous ohmic drop. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { currentMagnitude, voltageSlopeMagnitude, activeMass } = request;
  const compute = (): Output => {
    H.domain(currentMagnitude >= 0);
    H.positive(voltageSlopeMagnitude);
    H.positive(activeMass);
    return {
      capacitance: currentMagnitude / voltageSlopeMagnitude,
      specificCapacitance:
        currentMagnitude / (voltageSlopeMagnitude * activeMass),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { currentMagnitude: 2, voltageSlopeMagnitude: 0.1, activeMass: 4 },
  output: { capacitance: 20, specificCapacitance: 5 },
} satisfies ToolExample<Input, Output>;
export const galvanostaticCapacitanceSlopeFactorTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "electrochemistry/galvanostatic-capacitance-slope-factor",
      title: "Galvanostatic Capacitance Slope Factor Tool",
      description:
        "Ideal linear galvanostatic C=|I|/|dV/dt| after excluding an instantaneous ohmic drop.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          currentMagnitude: { type: "number", minimum: 0 },
          voltageSlopeMagnitude: { type: "number", exclusiveMinimum: 0 },
          activeMass: { type: "number", exclusiveMinimum: 0 },
        },
        required: ["currentMagnitude", "voltageSlopeMagnitude", "activeMass"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          capacitance: { type: "number" },
          specificCapacitance: { type: "number" },
        },
        required: ["capacitance", "specificCapacitance"],
      },
      ports: {
        inputs: [
          {
            id: "currentMagnitude",
            label: "Current Magnitude",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "voltageSlopeMagnitude",
            label: "Voltage Slope Magnitude",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "activeMass",
            label: "Active Mass",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "capacitance",
            label: "Capacitance",
            valueType: { type: "number" },
          },
          {
            id: "specificCapacitance",
            label: "Specific Capacitance",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = galvanostaticCapacitanceSlopeFactorTool.execute;
export default galvanostaticCapacitanceSlopeFactorTool;
