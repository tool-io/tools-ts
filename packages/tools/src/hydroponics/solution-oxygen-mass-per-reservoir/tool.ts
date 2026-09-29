import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly concentration: number;
  readonly volume: number;
  readonly concentrationToMassPerVolume: number;
};
export type Output = { readonly oxygenMass: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    concentration: { type: "number", minimum: 0 },
    volume: { type: "number", minimum: 0 },
    concentrationToMassPerVolume: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["concentration", "volume", "concentrationToMassPerVolume"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { oxygenMass: { type: "number" } },
  required: ["oxygenMass"],
} as const;
/** Calculate solution oxygen mass per reservoir from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { concentration, volume, concentrationToMassPerVolume } = request;
  const compute = (): Output => {
    H.domain(concentration >= 0 && volume >= 0);
    H.positive(concentrationToMassPerVolume);
    return {
      oxygenMass: concentration * volume * concentrationToMassPerVolume,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { concentration: 8, volume: 100, concentrationToMassPerVolume: 0.001 },
  output: { oxygenMass: 0.8 },
} satisfies ToolExample<Input, Output>;
export const solutionOxygenMassPerReservoirTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "hydroponics/solution-oxygen-mass-per-reservoir",
    title: "Solution Oxygen Mass Per Reservoir Tool",
    description:
      "Calculate solution oxygen mass per reservoir from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        concentration: { type: "number", minimum: 0 },
        volume: { type: "number", minimum: 0 },
        concentrationToMassPerVolume: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["concentration", "volume", "concentrationToMassPerVolume"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { oxygenMass: { type: "number" } },
      required: ["oxygenMass"],
    },
    ports: {
      inputs: [
        {
          id: "concentration",
          label: "Concentration",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "volume",
          label: "Volume",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "concentrationToMassPerVolume",
          label: "Concentration To Mass Per Volume",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "oxygenMass",
          label: "Oxygen Mass",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = solutionOxygenMassPerReservoirTool.execute;
export default solutionOxygenMassPerReservoirTool;
