import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly mass: number;
  readonly purityFraction: number;
  readonly finenessFraction: number;
};
export type Output = {
  readonly effectiveEquivalent: number;
  readonly crossTermLoss: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    mass: { type: "number", minimum: 0 },
    purityFraction: { type: "number", minimum: 0, maximum: 1 },
    finenessFraction: { type: "number", minimum: 0, maximum: 1 },
  },
  required: ["mass", "purityFraction", "finenessFraction"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    effectiveEquivalent: { type: "number" },
    crossTermLoss: { type: "number" },
  },
  required: ["effectiveEquivalent", "crossTermLoss"],
} as const;
/** Multiply independently supplied mass-effectiveness factors, exposing the joint loss term without a liming recommendation. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { mass, purityFraction, finenessFraction } = request;
  const compute = (): Output => {
    H.domain(mass >= 0);
    H.probability(purityFraction);
    H.probability(finenessFraction);
    return {
      effectiveEquivalent: mass * purityFraction * finenessFraction,
      crossTermLoss: mass * (1 - purityFraction) * (1 - finenessFraction),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { mass: 100, purityFraction: 0.8, finenessFraction: 0.5 },
  output: { effectiveEquivalent: 40, crossTermLoss: 9.999999999999998 },
} satisfies ToolExample<Input, Output>;
export const limePurityFinenessCrossTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "agrochemistry/lime-purity-fineness-cross-term",
    title: "Lime Purity Fineness Cross Term Tool",
    description:
      "Multiply independently supplied mass-effectiveness factors, exposing the joint loss term without a liming recommendation.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        mass: { type: "number", minimum: 0 },
        purityFraction: { type: "number", minimum: 0, maximum: 1 },
        finenessFraction: { type: "number", minimum: 0, maximum: 1 },
      },
      required: ["mass", "purityFraction", "finenessFraction"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        effectiveEquivalent: { type: "number" },
        crossTermLoss: { type: "number" },
      },
      required: ["effectiveEquivalent", "crossTermLoss"],
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
          id: "purityFraction",
          label: "Purity Fraction",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "finenessFraction",
          label: "Fineness Fraction",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "effectiveEquivalent",
          label: "Effective Equivalent",
          valueType: { type: "number" },
        },
        {
          id: "crossTermLoss",
          label: "Cross Term Loss",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = limePurityFinenessCrossTermTool.execute;
export default limePurityFinenessCrossTermTool;
