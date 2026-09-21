import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly retainedMass: number;
  readonly sandMass: number;
  readonly initialMass: number;
  readonly initialSand: number;
};
export type Output = { readonly correctedFraction: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    retainedMass: { type: "number" },
    sandMass: { type: "number", minimum: 0 },
    initialMass: { type: "number" },
    initialSand: { type: "number", minimum: 0 },
  },
  required: ["retainedMass", "sandMass", "initialMass", "initialSand"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { correctedFraction: { type: "number" } },
  required: ["correctedFraction"],
} as const;
/** Calculate aggregate wet stability mass share from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { retainedMass, sandMass, initialMass, initialSand } = request;
  const compute = (): Output => {
    H.domain(
      initialMass > initialSand &&
        initialSand >= 0 &&
        retainedMass >= sandMass &&
        sandMass >= 0 &&
        retainedMass - sandMass <= initialMass - initialSand,
    );
    return {
      correctedFraction:
        (retainedMass - sandMass) / (initialMass - initialSand),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { retainedMass: 30, sandMass: 5, initialMass: 50, initialSand: 10 },
  output: { correctedFraction: 0.625 },
} satisfies ToolExample<Input, Output>;
export const aggregateWetStabilityMassShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "agrophysics/aggregate-wet-stability-mass-share",
    title: "Aggregate Wet Stability Mass Share Tool",
    description:
      "Calculate aggregate wet stability mass share from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        retainedMass: { type: "number" },
        sandMass: { type: "number", minimum: 0 },
        initialMass: { type: "number" },
        initialSand: { type: "number", minimum: 0 },
      },
      required: ["retainedMass", "sandMass", "initialMass", "initialSand"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { correctedFraction: { type: "number" } },
      required: ["correctedFraction"],
    },
    ports: {
      inputs: [
        {
          id: "retainedMass",
          label: "Retained Mass",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "sandMass",
          label: "Sand Mass",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "initialMass",
          label: "Initial Mass",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "initialSand",
          label: "Initial Sand",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "correctedFraction",
          label: "Corrected Fraction",
          valueType: { type: "number", unit: "1" },
        },
      ],
    },
  },
  calculate,
});
export const run = aggregateWetStabilityMassShareTool.execute;
export default aggregateWetStabilityMassShareTool;
