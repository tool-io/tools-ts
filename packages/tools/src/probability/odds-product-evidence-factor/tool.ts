import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly priorOdds: number;
  readonly suppliedLikelihoodRatios: readonly number[];
};
export type Output = {
  readonly posteriorOdds: number;
  readonly evidenceFactor: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    priorOdds: { type: "number", minimum: 0 },
    suppliedLikelihoodRatios: {
      type: "array",
      maxItems: 256,
      items: { type: "number" },
    },
  },
  required: ["priorOdds", "suppliedLikelihoodRatios"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    posteriorOdds: { type: "number" },
    evidenceFactor: { type: "number" },
  },
  required: ["posteriorOdds", "evidenceFactor"],
} as const;
/** Multiply supplied sequential conditional likelihood ratios; independence is required if ratios were instead computed marginally. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { priorOdds, suppliedLikelihoodRatios } = request;
  const compute = (): Output => {
    H.domain(priorOdds >= 0 && suppliedLikelihoodRatios.every((x) => x >= 0));
    return {
      posteriorOdds:
        priorOdds * suppliedLikelihoodRatios.reduce((a, b) => a * b, 1),
      evidenceFactor: suppliedLikelihoodRatios.reduce((a, b) => a * b, 1),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { priorOdds: 2, suppliedLikelihoodRatios: [3, 0.5] },
  output: { posteriorOdds: 3, evidenceFactor: 1.5 },
} satisfies ToolExample<Input, Output>;
export const oddsProductEvidenceFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "probability/odds-product-evidence-factor",
    title: "Odds Product Evidence Factor Tool",
    description:
      "Multiply supplied sequential conditional likelihood ratios; independence is required if ratios were instead computed marginally.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        priorOdds: { type: "number", minimum: 0 },
        suppliedLikelihoodRatios: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
      },
      required: ["priorOdds", "suppliedLikelihoodRatios"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        posteriorOdds: { type: "number" },
        evidenceFactor: { type: "number" },
      },
      required: ["posteriorOdds", "evidenceFactor"],
    },
    ports: {
      inputs: [
        {
          id: "priorOdds",
          label: "Prior Odds",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedLikelihoodRatios",
          label: "Supplied Likelihood Ratios",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
      ],
      outputs: [
        {
          id: "posteriorOdds",
          label: "Posterior Odds",
          valueType: { type: "number" },
        },
        {
          id: "evidenceFactor",
          label: "Evidence Factor",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = oddsProductEvidenceFactorTool.execute;
export default oddsProductEvidenceFactorTool;
