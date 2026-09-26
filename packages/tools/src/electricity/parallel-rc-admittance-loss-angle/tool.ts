import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly resistance: number;
  readonly capacitance: number;
  readonly angularFrequency: number;
};
export type Output = {
  readonly conductance: number;
  readonly susceptance: number;
  readonly phaseRadians: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    resistance: { type: "number", exclusiveMinimum: 0 },
    capacitance: { type: "number", minimum: 0 },
    angularFrequency: { type: "number", minimum: 0 },
  },
  required: ["resistance", "capacitance", "angularFrequency"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    conductance: { type: "number" },
    susceptance: { type: "number" },
    phaseRadians: { type: "number" },
  },
  required: ["conductance", "susceptance", "phaseRadians"],
} as const;
/** Calculate parallel rc admittance loss angle from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { resistance, capacitance, angularFrequency } = request;
  const compute = (): Output => {
    H.positive(resistance);
    H.domain(capacitance >= 0 && angularFrequency >= 0);
    const conductance = 1 / resistance,
      susceptance = angularFrequency * capacitance;
    return {
      conductance,
      susceptance,
      phaseRadians: Math.atan2(susceptance, conductance),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { resistance: 2, capacitance: 0.25, angularFrequency: 2 },
  output: {
    conductance: 0.5,
    susceptance: 0.5,
    phaseRadians: 0.7853981633974483,
  },
} satisfies ToolExample<Input, Output>;
export const parallelRcAdmittanceLossAngleTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "electricity/parallel-rc-admittance-loss-angle",
    title: "Parallel RC Admittance Loss Angle Tool",
    description:
      "Calculate parallel rc admittance loss angle from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        resistance: { type: "number", exclusiveMinimum: 0 },
        capacitance: { type: "number", minimum: 0 },
        angularFrequency: { type: "number", minimum: 0 },
      },
      required: ["resistance", "capacitance", "angularFrequency"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        conductance: { type: "number" },
        susceptance: { type: "number" },
        phaseRadians: { type: "number" },
      },
      required: ["conductance", "susceptance", "phaseRadians"],
    },
    ports: {
      inputs: [
        {
          id: "resistance",
          label: "Resistance",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "capacitance",
          label: "Capacitance",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "angularFrequency",
          label: "Angular Frequency",
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
          id: "susceptance",
          label: "Susceptance",
          valueType: { type: "number" },
        },
        {
          id: "phaseRadians",
          label: "Phase Radians",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = parallelRcAdmittanceLossAngleTool.execute;
export default parallelRcAdmittanceLossAngleTool;
