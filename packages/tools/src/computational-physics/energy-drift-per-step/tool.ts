import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly initialEnergy: number;
  readonly finalEnergy: number;
  readonly stepCount: number;
};
export type Output = { readonly drift: number; readonly driftPerStep: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    initialEnergy: { type: "number" },
    finalEnergy: { type: "number" },
    stepCount: { type: "integer", minimum: 1 },
  },
  required: ["initialEnergy", "finalEnergy", "stepCount"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { drift: { type: "number" }, driftPerStep: { type: "number" } },
  required: ["drift", "driftPerStep"],
} as const;
/** Calculate energy drift per step from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { initialEnergy, finalEnergy, stepCount } = request;
  const compute = (): Output => {
    H.integer(stepCount, 1);
    return {
      drift: finalEnergy - initialEnergy,
      driftPerStep: (finalEnergy - initialEnergy) / stepCount,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { initialEnergy: 100, finalEnergy: 102, stepCount: 4 },
  output: { drift: 2, driftPerStep: 0.5 },
} satisfies ToolExample<Input, Output>;
export const energyDriftPerStepTool = H.defineSchemaCalculation<Input, Output>({
  ...{
    id: "computational-physics/energy-drift-per-step",
    title: "Energy Drift Per Step Tool",
    description:
      "Calculate energy drift per step from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        initialEnergy: { type: "number" },
        finalEnergy: { type: "number" },
        stepCount: { type: "integer", minimum: 1 },
      },
      required: ["initialEnergy", "finalEnergy", "stepCount"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        drift: { type: "number" },
        driftPerStep: { type: "number" },
      },
      required: ["drift", "driftPerStep"],
    },
    ports: {
      inputs: [
        {
          id: "initialEnergy",
          label: "Initial Energy",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "finalEnergy",
          label: "Final Energy",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "stepCount",
          label: "Step Count",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "drift", label: "Drift", valueType: { type: "number" } },
        {
          id: "driftPerStep",
          label: "Drift Per Step",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = energyDriftPerStepTool.execute;
export default energyDriftPerStepTool;
