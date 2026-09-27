import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly copies: number;
  readonly ploidy: number;
  readonly population: number;
};
export type Output = {
  readonly frequency: number;
  readonly fixationProbability: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    copies: { type: "integer", minimum: 0 },
    ploidy: { type: "integer", minimum: 1 },
    population: { type: "integer", minimum: 1 },
  },
  required: ["copies", "ploidy", "population"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    frequency: { type: "number" },
    fixationProbability: { type: "number" },
  },
  required: ["frequency", "fixationProbability"],
} as const;
/** Neutral fixation probability equals starting allele frequency in a closed ideal population. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { copies, ploidy, population } = request;
  const compute = (): Output => {
    H.integer(ploidy, 1);
    H.integer(population, 1);
    H.integer(copies, 0, ploidy * population);
    return {
      frequency: copies / (ploidy * population),
      fixationProbability: copies / (ploidy * population),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { copies: 1, ploidy: 2, population: 100 },
  output: { frequency: 0.005, fixationProbability: 0.005 },
} satisfies ToolExample<Input, Output>;
export const fixationProbabilityNeutralCopyTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "evolutionary-biology/fixation-probability-neutral-copy-term",
    title: "Fixation Probability Neutral Copy Term Tool",
    description:
      "Neutral fixation probability equals starting allele frequency in a closed ideal population.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        copies: { type: "integer", minimum: 0 },
        ploidy: { type: "integer", minimum: 1 },
        population: { type: "integer", minimum: 1 },
      },
      required: ["copies", "ploidy", "population"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        frequency: { type: "number" },
        fixationProbability: { type: "number" },
      },
      required: ["frequency", "fixationProbability"],
    },
    ports: {
      inputs: [
        {
          id: "copies",
          label: "Copies",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "ploidy",
          label: "Ploidy",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "population",
          label: "Population",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "frequency", label: "Frequency", valueType: { type: "number" } },
        {
          id: "fixationProbability",
          label: "Fixation Probability",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = fixationProbabilityNeutralCopyTermTool.execute;
export default fixationProbabilityNeutralCopyTermTool;
