import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly focalFoldChange: number;
  readonly referenceFoldChange: number;
};
export type Output = { readonly relativeFoldChange: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    focalFoldChange: { type: "number", minimum: 0 },
    referenceFoldChange: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["focalFoldChange", "referenceFoldChange"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { relativeFoldChange: { type: "number" } },
  required: ["relativeFoldChange"],
} as const;
/** Divide supplied focal and positive reference abundance fold changes for an explicit competition ratio without log-growth or selection inference. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { focalFoldChange, referenceFoldChange } = request;
  const compute = (): Output => {
    H.domain(focalFoldChange >= 0, "focalFoldChange");
    (H.domain(
      Number.isFinite(referenceFoldChange) && referenceFoldChange > 0,
      "referenceFoldChange",
    ),
      referenceFoldChange);
    return { relativeFoldChange: focalFoldChange / referenceFoldChange };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { focalFoldChange: 4, referenceFoldChange: 2 },
  output: { relativeFoldChange: 2 },
} satisfies ToolExample<Input, Output>;
export const fitnessAssayReferenceCompetitionRatioTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "evolutionary-biology/fitness-assay-reference-competition-ratio",
      title: "Fitness Assay Reference Competition Ratio Tool",
      description:
        "Divide supplied focal and positive reference abundance fold changes for an explicit competition ratio without log-growth or selection inference.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          focalFoldChange: { type: "number", minimum: 0 },
          referenceFoldChange: { type: "number", exclusiveMinimum: 0 },
        },
        required: ["focalFoldChange", "referenceFoldChange"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { relativeFoldChange: { type: "number" } },
        required: ["relativeFoldChange"],
      },
      ports: {
        inputs: [
          {
            id: "focalFoldChange",
            label: "Focal Fold Change",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "referenceFoldChange",
            label: "Reference Fold Change",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "relativeFoldChange",
            label: "Relative Fold Change",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = fitnessAssayReferenceCompetitionRatioTool.execute;
export default fitnessAssayReferenceCompetitionRatioTool;
