import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly resistance: number;
  readonly inductance: number;
  readonly angularFrequency: number;
};
export type Output = {
  readonly reactance: number;
  readonly magnitude: number;
  readonly phaseRadians: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    resistance: { type: "number", minimum: 0 },
    inductance: { type: "number", minimum: 0 },
    angularFrequency: { type: "number", minimum: 0 },
  },
  required: ["resistance", "inductance", "angularFrequency"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    reactance: { type: "number" },
    magnitude: { type: "number" },
    phaseRadians: { type: "number" },
  },
  required: ["reactance", "magnitude", "phaseRadians"],
} as const;
/** Calculate series rl impedance phase component from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { resistance, inductance, angularFrequency } = request;
  const compute = (): Output => {
    H.domain(resistance >= 0 && inductance >= 0 && angularFrequency >= 0);
    const reactance = angularFrequency * inductance;
    H.domain(resistance > 0 || reactance > 0);
    return {
      reactance,
      magnitude: Math.hypot(resistance, reactance),
      phaseRadians: Math.atan2(reactance, resistance),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { resistance: 3, inductance: 2, angularFrequency: 2 },
  output: { reactance: 4, magnitude: 5, phaseRadians: 0.9272952180016122 },
} satisfies ToolExample<Input, Output>;
export const seriesRlImpedancePhaseComponentTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "electricity/series-rl-impedance-phase-component",
    title: "Series Rl Impedance Phase Component Tool",
    description:
      "Calculate series rl impedance phase component from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        resistance: { type: "number", minimum: 0 },
        inductance: { type: "number", minimum: 0 },
        angularFrequency: { type: "number", minimum: 0 },
      },
      required: ["resistance", "inductance", "angularFrequency"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        reactance: { type: "number" },
        magnitude: { type: "number" },
        phaseRadians: { type: "number" },
      },
      required: ["reactance", "magnitude", "phaseRadians"],
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
          id: "inductance",
          label: "Inductance",
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
        { id: "reactance", label: "Reactance", valueType: { type: "number" } },
        { id: "magnitude", label: "Magnitude", valueType: { type: "number" } },
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
export const run = seriesRlImpedancePhaseComponentTool.execute;
export default seriesRlImpedancePhaseComponentTool;
