import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly predictedLabels: readonly string[];
  readonly actualLabels: readonly string[];
};
export type Output = {
  readonly extraPredictedLabels: readonly string[];
  readonly extraCount: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    predictedLabels: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    actualLabels: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["predictedLabels", "actualLabels"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    extraPredictedLabels: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    extraCount: { type: "integer" },
  },
  required: ["extraPredictedLabels", "extraCount"],
} as const;
/** Return unique explicitly predicted labels absent from the actual-label set while preserving prediction order. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { predictedLabels, actualLabels } = request;
  const compute = (): Output => {
    return (() => {
      const extraPredictedLabels = [...new Set(predictedLabels)].filter(
        (label) => !actualLabels.includes(label),
      );
      return { extraPredictedLabels, extraCount: extraPredictedLabels.length };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { predictedLabels: ["A", "B", "B", "C"], actualLabels: ["B", "D"] },
  output: { extraPredictedLabels: ["A", "C"], extraCount: 2 },
} satisfies ToolExample<Input, Output>;
export const multilabelItemExcessPredictionCountTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      discovery: {
        aliases: [],
        collections: ["ai", "data"],
        fields: [
          "classification",
          "classification metrics",
          "computer science",
        ],
        keywords: ["classification metrics", "computer science"],
      },
      id: "classification/multilabel-item-excess-prediction-count",
      title: "Multilabel Item Excess Prediction Count",
      description:
        "Return unique explicitly predicted labels absent from the actual-label set while preserving prediction order.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          predictedLabels: {
            type: "array",
            maxItems: 256,
            items: { type: "string", maxLength: 8192 },
          },
          actualLabels: {
            type: "array",
            maxItems: 256,
            items: { type: "string", maxLength: 8192 },
          },
        },
        required: ["predictedLabels", "actualLabels"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          extraPredictedLabels: {
            type: "array",
            maxItems: 256,
            items: { type: "string", maxLength: 8192 },
          },
          extraCount: { type: "integer" },
        },
        required: ["extraPredictedLabels", "extraCount"],
      },
      ports: {
        inputs: [
          {
            id: "predictedLabels",
            label: "Predicted Labels",
            required: true,
            valueType: { type: "list", items: { type: "string" } },
          },
          {
            id: "actualLabels",
            label: "Actual Labels",
            required: true,
            valueType: { type: "list", items: { type: "string" } },
          },
        ],
        outputs: [
          {
            id: "extraPredictedLabels",
            label: "Extra Predicted Labels",
            valueType: { type: "list", items: { type: "string" } },
          },
          {
            id: "extraCount",
            label: "Extra Count",
            valueType: { type: "integer" },
          },
        ],
      },
    },
    calculate,
  });
export const run = multilabelItemExcessPredictionCountTool.execute;
export default multilabelItemExcessPredictionCountTool;
