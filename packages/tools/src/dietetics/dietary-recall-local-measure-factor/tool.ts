import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly reportedMeasures: number;
  readonly gramsPerLocalMeasure: number;
};
export type Output = { readonly estimatedGrams: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    reportedMeasures: { type: "number", minimum: 0 },
    gramsPerLocalMeasure: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["reportedMeasures", "gramsPerLocalMeasure"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { estimatedGrams: { type: "number" } },
  required: ["estimatedGrams"],
} as const;
/** Convert an explicitly reported local food measure using a supplied grams-per-measure factor without inferring a household measure’s size. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { reportedMeasures, gramsPerLocalMeasure } = request;
  const compute = (): Output => {
    H.domain(reportedMeasures >= 0, "reportedMeasures");
    (H.domain(gramsPerLocalMeasure > 0, "gramsPerLocalMeasure"),
      gramsPerLocalMeasure);
    return { estimatedGrams: reportedMeasures * gramsPerLocalMeasure };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { reportedMeasures: 1.5, gramsPerLocalMeasure: 80 },
  output: { estimatedGrams: 120 },
} satisfies ToolExample<Input, Output>;
export const dietaryRecallLocalMeasureFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["dietetics", "health and medicine"],
      keywords: ["dietetics", "health and medicine"],
    },
    id: "dietetics/dietary-recall-local-measure-factor",
    title: "Dietary Recall Local Measure Factor",
    description:
      "Convert an explicitly reported local food measure using a supplied grams-per-measure factor without inferring a household measure’s size.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        reportedMeasures: { type: "number", minimum: 0 },
        gramsPerLocalMeasure: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["reportedMeasures", "gramsPerLocalMeasure"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { estimatedGrams: { type: "number" } },
      required: ["estimatedGrams"],
    },
    ports: {
      inputs: [
        {
          id: "reportedMeasures",
          label: "Reported Measures",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "gramsPerLocalMeasure",
          label: "Grams Per Local Measure",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "estimatedGrams",
          label: "Estimated Grams",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = dietaryRecallLocalMeasureFactorTool.execute;
export default dietaryRecallLocalMeasureFactorTool;
