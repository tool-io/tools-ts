import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly grossMass: number;
  readonly neutralizingFraction: number;
  readonly finenessFraction: number;
  readonly dryFraction: number;
};
export type Output = { readonly effectiveEquivalent: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    grossMass: { type: "number", minimum: 0 },
    neutralizingFraction: { type: "number", minimum: 0 },
    finenessFraction: { type: "number", minimum: 0, maximum: 1 },
    dryFraction: { type: "number", minimum: 0, maximum: 1 },
  },
  required: [
    "grossMass",
    "neutralizingFraction",
    "finenessFraction",
    "dryFraction",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { effectiveEquivalent: { type: "number" } },
  required: ["effectiveEquivalent"],
} as const;
/** Supplied material equivalent inventory, without selecting a soil application rate. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { grossMass, neutralizingFraction, finenessFraction, dryFraction } =
    request;
  const compute = (): Output => {
    H.domain(grossMass >= 0 && neutralizingFraction >= 0);
    H.probability(finenessFraction);
    H.probability(dryFraction);
    return {
      effectiveEquivalent:
        grossMass * neutralizingFraction * finenessFraction * dryFraction,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    grossMass: 1000,
    neutralizingFraction: 0.9,
    finenessFraction: 0.8,
    dryFraction: 0.95,
  },
  output: { effectiveEquivalent: 684 },
} satisfies ToolExample<Input, Output>;
export const limingMaterialNeutralizingValueFactorTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "agrochemistry/liming-material-neutralizing-value-factor",
      title: "Liming Material Neutralizing Value Factor Tool",
      description:
        "Supplied material equivalent inventory, without selecting a soil application rate.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          grossMass: { type: "number", minimum: 0 },
          neutralizingFraction: { type: "number", minimum: 0 },
          finenessFraction: { type: "number", minimum: 0, maximum: 1 },
          dryFraction: { type: "number", minimum: 0, maximum: 1 },
        },
        required: [
          "grossMass",
          "neutralizingFraction",
          "finenessFraction",
          "dryFraction",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { effectiveEquivalent: { type: "number" } },
        required: ["effectiveEquivalent"],
      },
      ports: {
        inputs: [
          {
            id: "grossMass",
            label: "Gross Mass",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "neutralizingFraction",
            label: "Neutralizing Fraction",
            required: true,
            valueType: { type: "number", unit: "1" },
          },
          {
            id: "finenessFraction",
            label: "Fineness Fraction",
            required: true,
            valueType: { type: "number", unit: "1" },
          },
          {
            id: "dryFraction",
            label: "Dry Fraction",
            required: true,
            valueType: { type: "number", unit: "1" },
          },
        ],
        outputs: [
          {
            id: "effectiveEquivalent",
            label: "Effective Equivalent",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = limingMaterialNeutralizingValueFactorTool.execute;
export default limingMaterialNeutralizingValueFactorTool;
