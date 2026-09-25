import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly initialMass: number;
  readonly initialSolidsFraction: number;
  readonly cookedMass: number;
  readonly measuredCookedSolids: number;
};
export type Output = {
  readonly predictedSolids: number;
  readonly measuredSolids: number;
  readonly solidsResidual: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    initialMass: { type: "number", minimum: 0 },
    initialSolidsFraction: { type: "number", minimum: 0, maximum: 1 },
    cookedMass: { type: "number", minimum: 0 },
    measuredCookedSolids: { type: "number", minimum: 0, maximum: 1 },
  },
  required: [
    "initialMass",
    "initialSolidsFraction",
    "cookedMass",
    "measuredCookedSolids",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    predictedSolids: { type: "number" },
    measuredSolids: { type: "number" },
    solidsResidual: { type: "number" },
  },
  required: ["predictedSolids", "measuredSolids", "solidsResidual"],
} as const;
/** Supplied solids mass reconciliation; no nutrient retention or dietary recommendation is inferred. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    initialMass,
    initialSolidsFraction,
    cookedMass,
    measuredCookedSolids,
  } = request;
  const compute = (): Output => {
    H.domain(initialMass >= 0 && cookedMass >= 0);
    H.probability(initialSolidsFraction);
    H.probability(measuredCookedSolids);
    return {
      predictedSolids: initialMass * initialSolidsFraction,
      measuredSolids: cookedMass * measuredCookedSolids,
      solidsResidual:
        cookedMass * measuredCookedSolids - initialMass * initialSolidsFraction,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    initialMass: 100,
    initialSolidsFraction: 0.2,
    cookedMass: 80,
    measuredCookedSolids: 0.25,
  },
  output: { predictedSolids: 20, measuredSolids: 20, solidsResidual: 0 },
} satisfies ToolExample<Input, Output>;
export const cookedRecipeEvaporationSolidsGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "dietetics/cooked-recipe-evaporation-solids-gap",
    title: "Cooked Recipe Evaporation Solids Gap Tool",
    description:
      "Supplied solids mass reconciliation; no nutrient retention or dietary recommendation is inferred.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        initialMass: { type: "number", minimum: 0 },
        initialSolidsFraction: { type: "number", minimum: 0, maximum: 1 },
        cookedMass: { type: "number", minimum: 0 },
        measuredCookedSolids: { type: "number", minimum: 0, maximum: 1 },
      },
      required: [
        "initialMass",
        "initialSolidsFraction",
        "cookedMass",
        "measuredCookedSolids",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        predictedSolids: { type: "number" },
        measuredSolids: { type: "number" },
        solidsResidual: { type: "number" },
      },
      required: ["predictedSolids", "measuredSolids", "solidsResidual"],
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
          id: "initialSolidsFraction",
          label: "Initial Solids Fraction",
          required: true,
          valueType: { type: "number", unit: "1" },
        },
        {
          id: "cookedMass",
          label: "Cooked Mass",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "measuredCookedSolids",
          label: "Measured Cooked Solids",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "predictedSolids",
          label: "Predicted Solids",
          valueType: { type: "number" },
        },
        {
          id: "measuredSolids",
          label: "Measured Solids",
          valueType: { type: "number" },
        },
        {
          id: "solidsResidual",
          label: "Solids Residual",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = cookedRecipeEvaporationSolidsGapTool.execute;
export default cookedRecipeEvaporationSolidsGapTool;
