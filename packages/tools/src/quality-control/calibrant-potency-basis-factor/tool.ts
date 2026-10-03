import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly weighedMass: number;
  readonly suppliedPotencyFraction: number;
  readonly moistureFraction: number;
  readonly potencyOnDryBasis: boolean;
};
export type Output = { readonly activeEquivalent: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    weighedMass: { type: "number", minimum: 0 },
    suppliedPotencyFraction: { type: "number", minimum: 0, maximum: 1 },
    moistureFraction: { type: "number", minimum: 0, maximum: 1 },
    potencyOnDryBasis: { type: "boolean" },
  },
  required: [
    "weighedMass",
    "suppliedPotencyFraction",
    "moistureFraction",
    "potencyOnDryBasis",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { activeEquivalent: { type: "number" } },
  required: ["activeEquivalent"],
} as const;
/** Apply supplied calibrant potency with an explicit wet/dry basis; no potency value is looked up. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    weighedMass,
    suppliedPotencyFraction,
    moistureFraction,
    potencyOnDryBasis,
  } = request;
  const compute = (): Output => {
    H.domain(weighedMass >= 0);
    H.probability(suppliedPotencyFraction);
    H.probability(moistureFraction);
    return {
      activeEquivalent:
        weighedMass *
        suppliedPotencyFraction *
        (potencyOnDryBasis ? 1 - moistureFraction : 1),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    weighedMass: 10,
    suppliedPotencyFraction: 0.8,
    moistureFraction: 0.1,
    potencyOnDryBasis: true,
  },
  output: { activeEquivalent: 7.2 },
} satisfies ToolExample<Input, Output>;
export const calibrantPotencyBasisFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "quality-control/calibrant-potency-basis-factor",
    title: "Calibrant Potency Basis Factor Tool",
    description:
      "Apply supplied calibrant potency with an explicit wet/dry basis; no potency value is looked up.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        weighedMass: { type: "number", minimum: 0 },
        suppliedPotencyFraction: { type: "number", minimum: 0, maximum: 1 },
        moistureFraction: { type: "number", minimum: 0, maximum: 1 },
        potencyOnDryBasis: { type: "boolean" },
      },
      required: [
        "weighedMass",
        "suppliedPotencyFraction",
        "moistureFraction",
        "potencyOnDryBasis",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { activeEquivalent: { type: "number" } },
      required: ["activeEquivalent"],
    },
    ports: {
      inputs: [
        {
          id: "weighedMass",
          label: "Weighed Mass",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedPotencyFraction",
          label: "Supplied Potency Fraction",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "moistureFraction",
          label: "Moisture Fraction",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "potencyOnDryBasis",
          label: "Potency On Dry Basis",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "activeEquivalent",
          label: "Active Equivalent",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = calibrantPotencyBasisFactorTool.execute;
export default calibrantPotencyBasisFactorTool;
