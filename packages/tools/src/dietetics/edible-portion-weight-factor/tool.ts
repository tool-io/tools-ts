import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly asPurchasedMass: number;
  readonly edibleFraction: number;
};
export type Output = {
  readonly edibleMass: number;
  readonly excludedMass: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    asPurchasedMass: { type: "number", minimum: 0 },
    edibleFraction: { type: "number", minimum: 0, maximum: 1 },
  },
  required: ["asPurchasedMass", "edibleFraction"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    edibleMass: { type: "number" },
    excludedMass: { type: "number" },
  },
  required: ["edibleMass", "excludedMass"],
} as const;
/** Apply an explicitly supplied edible-portion fraction to purchased mass without estimating yield from a food identity. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { asPurchasedMass, edibleFraction } = request;
  const compute = (): Output => {
    H.domain(asPurchasedMass >= 0, "asPurchasedMass");
    (H.domain(edibleFraction >= 0 && edibleFraction <= 1, "edibleFraction"),
      edibleFraction);
    return {
      edibleMass: asPurchasedMass * edibleFraction,
      excludedMass: asPurchasedMass * (1 - edibleFraction),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { asPurchasedMass: 500, edibleFraction: 0.8 },
  output: { edibleMass: 400, excludedMass: 99.99999999999997 },
} satisfies ToolExample<Input, Output>;
export const ediblePortionWeightFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["dietetics", "health and medicine"],
      keywords: ["dietetics", "health and medicine"],
    },
    id: "dietetics/edible-portion-weight-factor",
    title: "Edible Portion Weight Factor",
    description:
      "Apply an explicitly supplied edible-portion fraction to purchased mass without estimating yield from a food identity.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        asPurchasedMass: { type: "number", minimum: 0 },
        edibleFraction: { type: "number", minimum: 0, maximum: 1 },
      },
      required: ["asPurchasedMass", "edibleFraction"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        edibleMass: { type: "number" },
        excludedMass: { type: "number" },
      },
      required: ["edibleMass", "excludedMass"],
    },
    ports: {
      inputs: [
        {
          id: "asPurchasedMass",
          label: "As Purchased Mass",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "edibleFraction",
          label: "Edible Fraction",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "edibleMass",
          label: "Edible Mass",
          valueType: { type: "number" },
        },
        {
          id: "excludedMass",
          label: "Excluded Mass",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = ediblePortionWeightFactorTool.execute;
export default ediblePortionWeightFactorTool;
