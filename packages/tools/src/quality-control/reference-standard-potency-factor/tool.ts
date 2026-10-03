import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly weighedMass: number;
  readonly suppliedPotencyFraction: number;
  readonly referencePotencyFraction: number;
};
export type Output = {
  readonly activeEquivalent: number;
  readonly referenceEquivalentMass: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    weighedMass: { type: "number", minimum: 0 },
    suppliedPotencyFraction: { type: "number", minimum: 0, maximum: 1 },
    referencePotencyFraction: {
      type: "number",
      exclusiveMinimum: 0,
      maximum: 1,
    },
  },
  required: [
    "weighedMass",
    "suppliedPotencyFraction",
    "referencePotencyFraction",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    activeEquivalent: { type: "number" },
    referenceEquivalentMass: { type: "number" },
  },
  required: ["activeEquivalent", "referenceEquivalentMass"],
} as const;
/** Compare supplied mass-basis reference-standard potency fractions without assigning assay purity or preparation instructions. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { weighedMass, suppliedPotencyFraction, referencePotencyFraction } =
    request;
  const compute = (): Output => {
    H.domain(weighedMass >= 0);
    H.probability(suppliedPotencyFraction);
    H.domain(referencePotencyFraction > 0 && referencePotencyFraction <= 1);
    return {
      activeEquivalent: weighedMass * suppliedPotencyFraction,
      referenceEquivalentMass:
        (weighedMass * suppliedPotencyFraction) / referencePotencyFraction,
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
    referencePotencyFraction: 0.5,
  },
  output: { activeEquivalent: 8, referenceEquivalentMass: 16 },
} satisfies ToolExample<Input, Output>;
export const referenceStandardPotencyFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "quality-control/reference-standard-potency-factor",
    title: "Reference Standard Potency Factor Tool",
    description:
      "Compare supplied mass-basis reference-standard potency fractions without assigning assay purity or preparation instructions.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        weighedMass: { type: "number", minimum: 0 },
        suppliedPotencyFraction: { type: "number", minimum: 0, maximum: 1 },
        referencePotencyFraction: {
          type: "number",
          exclusiveMinimum: 0,
          maximum: 1,
        },
      },
      required: [
        "weighedMass",
        "suppliedPotencyFraction",
        "referencePotencyFraction",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        activeEquivalent: { type: "number" },
        referenceEquivalentMass: { type: "number" },
      },
      required: ["activeEquivalent", "referenceEquivalentMass"],
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
          id: "referencePotencyFraction",
          label: "Reference Potency Fraction",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "activeEquivalent",
          label: "Active Equivalent",
          valueType: { type: "number" },
        },
        {
          id: "referenceEquivalentMass",
          label: "Reference Equivalent Mass",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = referenceStandardPotencyFactorTool.execute;
export default referenceStandardPotencyFactorTool;
