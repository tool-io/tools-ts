import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly solventFraction: number;
  readonly totalVolume: number;
};
export type Output = {
  readonly solventVolume: number;
  readonly otherVolume: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    solventFraction: { type: "number", minimum: 0, maximum: 1 },
    totalVolume: { type: "number", minimum: 0 },
  },
  required: ["solventFraction", "totalVolume"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    solventVolume: { type: "number" },
    otherVolume: { type: "number" },
  },
  required: ["solventVolume", "otherVolume"],
} as const;
/** Split explicitly supplied formulation volumes without mixing contraction, safety or efficacy claims. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { solventFraction, totalVolume } = request;
  const compute = (): Output => {
    H.probability(solventFraction);
    H.domain(totalVolume >= 0);
    return {
      solventVolume: solventFraction * totalVolume,
      otherVolume: (1 - solventFraction) * totalVolume,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { solventFraction: 0.2, totalVolume: 100 },
  output: { solventVolume: 20, otherVolume: 80 },
} satisfies ToolExample<Input, Output>;
export const declaredSolventFractionFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "homeopathy/declared-solvent-fraction-factor",
    title: "Declared Solvent Fraction Factor Tool",
    description:
      "Split explicitly supplied formulation volumes without mixing contraction, safety or efficacy claims.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        solventFraction: { type: "number", minimum: 0, maximum: 1 },
        totalVolume: { type: "number", minimum: 0 },
      },
      required: ["solventFraction", "totalVolume"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        solventVolume: { type: "number" },
        otherVolume: { type: "number" },
      },
      required: ["solventVolume", "otherVolume"],
    },
    ports: {
      inputs: [
        {
          id: "solventFraction",
          label: "Solvent Fraction",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "totalVolume",
          label: "Total Volume",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "solventVolume",
          label: "Solvent Volume",
          valueType: { type: "number" },
        },
        {
          id: "otherVolume",
          label: "Other Volume",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = declaredSolventFractionFactorTool.execute;
export default declaredSolventFractionFactorTool;
