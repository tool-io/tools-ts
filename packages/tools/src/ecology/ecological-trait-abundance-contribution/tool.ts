import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly traitValue: number;
  readonly taxonAbundance: number;
  readonly totalAbundance: number;
};
export type Output = {
  readonly relativeAbundance: number;
  readonly weightedTraitContribution: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    traitValue: { type: "number" },
    taxonAbundance: { type: "number", minimum: 0 },
    totalAbundance: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["traitValue", "taxonAbundance", "totalAbundance"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    relativeAbundance: { type: "number" },
    weightedTraitContribution: { type: "number" },
  },
  required: ["relativeAbundance", "weightedTraitContribution"],
} as const;
/** Return one explicit abundance-weighted trait contribution without aggregating or imputing other taxa. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { traitValue, taxonAbundance, totalAbundance } = request;
  const compute = (): Output => {
    (H.domain(totalAbundance > 0, "totalAbundance"), totalAbundance);
    H.domain(
      taxonAbundance >= 0 && taxonAbundance <= totalAbundance,
      "taxonAbundance",
    );
    return {
      relativeAbundance: taxonAbundance / totalAbundance,
      weightedTraitContribution: (traitValue * taxonAbundance) / totalAbundance,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { traitValue: 12, taxonAbundance: 20, totalAbundance: 100 },
  output: { relativeAbundance: 0.2, weightedTraitContribution: 2.4 },
} satisfies ToolExample<Input, Output>;
export const ecologicalTraitAbundanceContributionTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      discovery: {
        aliases: [],
        collections: ["data", "learn"],
        fields: ["ecology", "biology"],
        keywords: ["ecology", "biology"],
      },
      id: "ecology/ecological-trait-abundance-contribution",
      title: "Ecological Trait Abundance Contribution",
      description:
        "Return one explicit abundance-weighted trait contribution without aggregating or imputing other taxa.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          traitValue: { type: "number" },
          taxonAbundance: { type: "number", minimum: 0 },
          totalAbundance: { type: "number", exclusiveMinimum: 0 },
        },
        required: ["traitValue", "taxonAbundance", "totalAbundance"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          relativeAbundance: { type: "number" },
          weightedTraitContribution: { type: "number" },
        },
        required: ["relativeAbundance", "weightedTraitContribution"],
      },
      ports: {
        inputs: [
          {
            id: "traitValue",
            label: "Trait Value",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "taxonAbundance",
            label: "Taxon Abundance",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "totalAbundance",
            label: "Total Abundance",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "relativeAbundance",
            label: "Relative Abundance",
            valueType: { type: "number" },
          },
          {
            id: "weightedTraitContribution",
            label: "Weighted Trait Contribution",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = ecologicalTraitAbundanceContributionTool.execute;
export default ecologicalTraitAbundanceContributionTool;
