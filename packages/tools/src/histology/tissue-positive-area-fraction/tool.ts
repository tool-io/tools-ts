import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly positiveArea: number;
  readonly evaluableTissueArea: number;
};
export type Output = {
  readonly positiveFraction: number;
  readonly otherArea: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    positiveArea: { type: "number", minimum: 0 },
    evaluableTissueArea: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["positiveArea", "evaluableTissueArea"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    positiveFraction: { type: "number" },
    otherArea: { type: "number" },
  },
  required: ["positiveFraction", "otherArea"],
} as const;
/** Normalize an explicitly annotated positive area to supplied evaluable tissue area without classifying tissue or selecting positivity thresholds. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { positiveArea, evaluableTissueArea } = request;
  const compute = (): Output => {
    (H.domain(evaluableTissueArea > 0, "evaluableTissueArea"),
      evaluableTissueArea);
    H.domain(
      positiveArea >= 0 && positiveArea <= evaluableTissueArea,
      "positiveArea",
    );
    return {
      positiveFraction: positiveArea / evaluableTissueArea,
      otherArea: evaluableTissueArea - positiveArea,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { positiveArea: 12, evaluableTissueArea: 80 },
  output: { positiveFraction: 0.15, otherArea: 68 },
} satisfies ToolExample<Input, Output>;
export const tissuePositiveAreaFractionTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["histology", "biology"],
      keywords: ["histology", "biology"],
    },
    id: "histology/tissue-positive-area-fraction",
    title: "Tissue Positive Area Fraction",
    description:
      "Normalize an explicitly annotated positive area to supplied evaluable tissue area without classifying tissue or selecting positivity thresholds.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        positiveArea: { type: "number", minimum: 0 },
        evaluableTissueArea: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["positiveArea", "evaluableTissueArea"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        positiveFraction: { type: "number" },
        otherArea: { type: "number" },
      },
      required: ["positiveFraction", "otherArea"],
    },
    ports: {
      inputs: [
        {
          id: "positiveArea",
          label: "Positive Area",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "evaluableTissueArea",
          label: "Evaluable Tissue Area",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "positiveFraction",
          label: "Positive Fraction",
          valueType: { type: "number" },
        },
        { id: "otherArea", label: "Other Area", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = tissuePositiveAreaFractionTool.execute;
export default tissuePositiveAreaFractionTool;
