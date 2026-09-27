import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly likelihoodRatio: number;
  readonly weight: number;
  readonly logBase: number;
};
export type Output = { readonly logWeight: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    likelihoodRatio: { type: "number", exclusiveMinimum: 0 },
    weight: { type: "number", minimum: 0 },
    logBase: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["likelihoodRatio", "weight", "logBase"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { logWeight: { type: "number" } },
  required: ["logWeight"],
} as const;
/** Return a supplied weighted log likelihood ratio without establishing evidential independence. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { likelihoodRatio, weight, logBase } = request;
  const compute = (): Output => {
    H.positive(likelihoodRatio);
    H.domain(weight >= 0 && logBase > 0 && logBase !== 1);
    return {
      logWeight: (weight * Math.log(likelihoodRatio)) / Math.log(logBase),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { likelihoodRatio: 4, weight: 0.5, logBase: 2 },
  output: { logWeight: 1 },
} satisfies ToolExample<Input, Output>;
export const evidenceLogweightTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "epistemology/evidence-logweight-term",
    title: "Evidence Logweight Term Tool",
    description:
      "Return a supplied weighted log likelihood ratio without establishing evidential independence.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        likelihoodRatio: { type: "number", exclusiveMinimum: 0 },
        weight: { type: "number", minimum: 0 },
        logBase: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["likelihoodRatio", "weight", "logBase"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { logWeight: { type: "number" } },
      required: ["logWeight"],
    },
    ports: {
      inputs: [
        {
          id: "likelihoodRatio",
          label: "Likelihood Ratio",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "weight",
          label: "Weight",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "logBase",
          label: "Log Base",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "logWeight", label: "Log Weight", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = evidenceLogweightTermTool.execute;
export default evidenceLogweightTermTool;
