import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly mass: number;
  readonly purity: number;
  readonly equivalenceFactor: number;
};
export type Output = {
  readonly pureMass: number;
  readonly equivalentMass: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    mass: { type: "number", minimum: 0 },
    purity: { type: "number", minimum: 0, maximum: 1 },
    equivalenceFactor: { type: "number", minimum: 0 },
  },
  required: ["mass", "purity", "equivalenceFactor"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    pureMass: { type: "number" },
    equivalentMass: { type: "number" },
  },
  required: ["pureMass", "equivalentMass"],
} as const;
/** Calculate purity adjusted equivalent mass term from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { mass, purity, equivalenceFactor } = request;
  const compute = (): Output => {
    H.domain(mass >= 0 && equivalenceFactor >= 0);
    H.probability(purity);
    const pureMass = mass * purity;
    return { pureMass, equivalentMass: pureMass * equivalenceFactor };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { mass: 100, purity: 0.8, equivalenceFactor: 2 },
  output: { pureMass: 80, equivalentMass: 160 },
} satisfies ToolExample<Input, Output>;
export const purityAdjustedEquivalentMassTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "proportions/purity-adjusted-equivalent-mass-term",
    title: "Purity Adjusted Equivalent Mass Term Tool",
    description:
      "Calculate purity adjusted equivalent mass term from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        mass: { type: "number", minimum: 0 },
        purity: { type: "number", minimum: 0, maximum: 1 },
        equivalenceFactor: { type: "number", minimum: 0 },
      },
      required: ["mass", "purity", "equivalenceFactor"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        pureMass: { type: "number" },
        equivalentMass: { type: "number" },
      },
      required: ["pureMass", "equivalentMass"],
    },
    ports: {
      inputs: [
        {
          id: "mass",
          label: "Mass",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "purity",
          label: "Purity",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "equivalenceFactor",
          label: "Equivalence Factor",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "pureMass", label: "Pure Mass", valueType: { type: "number" } },
        {
          id: "equivalentMass",
          label: "Equivalent Mass",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = purityAdjustedEquivalentMassTermTool.execute;
export default purityAdjustedEquivalentMassTermTool;
