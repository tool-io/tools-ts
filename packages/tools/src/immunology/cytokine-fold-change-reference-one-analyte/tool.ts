import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly stimulated: number;
  readonly baseline: number;
  readonly blank: number;
  readonly dilutionRatio: number;
};
export type Output = {
  readonly correctedFold: number;
  readonly log2Fold: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    stimulated: { type: "number" },
    baseline: { type: "number" },
    blank: { type: "number" },
    dilutionRatio: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["stimulated", "baseline", "blank", "dilutionRatio"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    correctedFold: { type: "number" },
    log2Fold: { type: "number" },
  },
  required: ["correctedFold", "log2Fold"],
} as const;
/** Positive blank-corrected signal fold change with a supplied stimulated-to-baseline dilution factor; no immune-response classification. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { stimulated, baseline, blank, dilutionRatio } = request;
  const compute = (): Output => {
    H.domain(stimulated > blank && baseline > blank);
    H.positive(dilutionRatio);
    return {
      correctedFold:
        ((stimulated - blank) * dilutionRatio) / (baseline - blank),
      log2Fold: Math.log2(
        ((stimulated - blank) * dilutionRatio) / (baseline - blank),
      ),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { stimulated: 50, baseline: 20, blank: 10, dilutionRatio: 1 },
  output: { correctedFold: 4, log2Fold: 2 },
} satisfies ToolExample<Input, Output>;
export const cytokineFoldChangeReferenceOneAnalyteTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "immunology/cytokine-fold-change-reference-one-analyte",
      title: "Cytokine Fold Change Reference One Analyte Tool",
      description:
        "Positive blank-corrected signal fold change with a supplied stimulated-to-baseline dilution factor; no immune-response classification.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          stimulated: { type: "number" },
          baseline: { type: "number" },
          blank: { type: "number" },
          dilutionRatio: { type: "number", exclusiveMinimum: 0 },
        },
        required: ["stimulated", "baseline", "blank", "dilutionRatio"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          correctedFold: { type: "number" },
          log2Fold: { type: "number" },
        },
        required: ["correctedFold", "log2Fold"],
      },
      ports: {
        inputs: [
          {
            id: "stimulated",
            label: "Stimulated",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "baseline",
            label: "Baseline",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "blank",
            label: "Blank",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "dilutionRatio",
            label: "Dilution Ratio",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "correctedFold",
            label: "Corrected Fold",
            valueType: { type: "number" },
          },
          { id: "log2Fold", label: "Log2Fold", valueType: { type: "number" } },
        ],
      },
    },
    calculate,
  });
export const run = cytokineFoldChangeReferenceOneAnalyteTool.execute;
export default cytokineFoldChangeReferenceOneAnalyteTool;
