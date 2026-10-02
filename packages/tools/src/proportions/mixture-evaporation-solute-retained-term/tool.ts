import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly initialMass: number;
  readonly soluteMass: number;
  readonly evaporated: number;
};
export type Output = {
  readonly finalMass: number;
  readonly concentration: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    initialMass: { type: "number", exclusiveMinimum: 0 },
    soluteMass: { type: "number", minimum: 0 },
    evaporated: { type: "number", minimum: 0 },
  },
  required: ["initialMass", "soluteMass", "evaporated"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    finalMass: { type: "number" },
    concentration: { type: "number" },
  },
  required: ["finalMass", "concentration"],
} as const;
/** Calculate mixture evaporation solute retained term from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { initialMass, soluteMass, evaporated } = request;
  const compute = (): Output => {
    H.positive(initialMass);
    H.domain(
      soluteMass >= 0 &&
        soluteMass <= initialMass &&
        evaporated >= 0 &&
        evaporated <= initialMass - soluteMass,
    );
    const finalMass = initialMass - evaporated;
    H.positive(finalMass);
    return { finalMass, concentration: soluteMass / finalMass };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { initialMass: 100, soluteMass: 20, evaporated: 20 },
  output: { finalMass: 80, concentration: 0.25 },
} satisfies ToolExample<Input, Output>;
export const mixtureEvaporationSoluteRetainedTermTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "proportions/mixture-evaporation-solute-retained-term",
      title: "Mixture Evaporation Solute Retained Term Tool",
      description:
        "Calculate mixture evaporation solute retained term from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          initialMass: { type: "number", exclusiveMinimum: 0 },
          soluteMass: { type: "number", minimum: 0 },
          evaporated: { type: "number", minimum: 0 },
        },
        required: ["initialMass", "soluteMass", "evaporated"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          finalMass: { type: "number" },
          concentration: { type: "number" },
        },
        required: ["finalMass", "concentration"],
      },
      ports: {
        inputs: [
          {
            id: "initialMass",
            label: "Initial Mass",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "soluteMass",
            label: "Solute Mass",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "evaporated",
            label: "Evaporated",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "finalMass",
            label: "Final Mass",
            valueType: { type: "number" },
          },
          {
            id: "concentration",
            label: "Concentration",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = mixtureEvaporationSoluteRetainedTermTool.execute;
export default mixtureEvaporationSoluteRetainedTermTool;
