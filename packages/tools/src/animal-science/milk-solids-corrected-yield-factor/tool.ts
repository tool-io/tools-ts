import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly milkMass: number;
  readonly fatFraction: number;
  readonly proteinFraction: number;
  readonly referenceFat: number;
  readonly referenceProtein: number;
  readonly fatCoefficient: number;
  readonly proteinCoefficient: number;
};
export type Output = { readonly correctedYield: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    milkMass: { type: "number", minimum: 0 },
    fatFraction: { type: "number", minimum: 0, maximum: 1 },
    proteinFraction: { type: "number", minimum: 0, maximum: 1 },
    referenceFat: { type: "number", minimum: 0, maximum: 1 },
    referenceProtein: { type: "number", minimum: 0, maximum: 1 },
    fatCoefficient: { type: "number", minimum: 0 },
    proteinCoefficient: { type: "number", minimum: 0 },
  },
  required: [
    "milkMass",
    "fatFraction",
    "proteinFraction",
    "referenceFat",
    "referenceProtein",
    "fatCoefficient",
    "proteinCoefficient",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { correctedYield: { type: "number" } },
  required: ["correctedYield"],
} as const;
/** Caller-defined linear solids correction anchored at supplied reference composition; not an unnamed standardized corrected-milk formula. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    milkMass,
    fatFraction,
    proteinFraction,
    referenceFat,
    referenceProtein,
    fatCoefficient,
    proteinCoefficient,
  } = request;
  const compute = (): Output => {
    H.domain(milkMass >= 0 && fatCoefficient >= 0 && proteinCoefficient >= 0);
    H.probability(fatFraction);
    H.probability(proteinFraction);
    H.probability(referenceFat);
    H.probability(referenceProtein);
    return {
      correctedYield:
        milkMass *
        (1 +
          fatCoefficient * (fatFraction - referenceFat) +
          proteinCoefficient * (proteinFraction - referenceProtein)),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    milkMass: 100,
    fatFraction: 0.04,
    proteinFraction: 0.03,
    referenceFat: 0.03,
    referenceProtein: 0.03,
    fatCoefficient: 10,
    proteinCoefficient: 5,
  },
  output: { correctedYield: 110.00000000000001 },
} satisfies ToolExample<Input, Output>;
export const milkSolidsCorrectedYieldFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "animal-science/milk-solids-corrected-yield-factor",
    title: "Milk Solids Corrected Yield Factor Tool",
    description:
      "Caller-defined linear solids correction anchored at supplied reference composition; not an unnamed standardized corrected-milk formula.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        milkMass: { type: "number", minimum: 0 },
        fatFraction: { type: "number", minimum: 0, maximum: 1 },
        proteinFraction: { type: "number", minimum: 0, maximum: 1 },
        referenceFat: { type: "number", minimum: 0, maximum: 1 },
        referenceProtein: { type: "number", minimum: 0, maximum: 1 },
        fatCoefficient: { type: "number", minimum: 0 },
        proteinCoefficient: { type: "number", minimum: 0 },
      },
      required: [
        "milkMass",
        "fatFraction",
        "proteinFraction",
        "referenceFat",
        "referenceProtein",
        "fatCoefficient",
        "proteinCoefficient",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { correctedYield: { type: "number" } },
      required: ["correctedYield"],
    },
    ports: {
      inputs: [
        {
          id: "milkMass",
          label: "Milk Mass",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "fatFraction",
          label: "Fat Fraction",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "proteinFraction",
          label: "Protein Fraction",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "referenceFat",
          label: "Reference Fat",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "referenceProtein",
          label: "Reference Protein",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "fatCoefficient",
          label: "Fat Coefficient",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "proteinCoefficient",
          label: "Protein Coefficient",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "correctedYield",
          label: "Corrected Yield",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = milkSolidsCorrectedYieldFactorTool.execute;
export default milkSolidsCorrectedYieldFactorTool;
