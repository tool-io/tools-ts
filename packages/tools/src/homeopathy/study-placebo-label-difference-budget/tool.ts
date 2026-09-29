import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly enrolled: number;
  readonly activeLabel: number;
  readonly placeboLabel: number;
  readonly duplicateLabels: number;
};
export type Output = {
  readonly uniqueLabeled: number;
  readonly unlabeled: number;
  readonly labelDifference: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    enrolled: { type: "integer", minimum: 0 },
    activeLabel: { type: "integer", minimum: 0 },
    placeboLabel: { type: "integer", minimum: 0 },
    duplicateLabels: { type: "integer", minimum: 0 },
  },
  required: ["enrolled", "activeLabel", "placeboLabel", "duplicateLabels"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    uniqueLabeled: { type: "integer" },
    unlabeled: { type: "integer" },
    labelDifference: { type: "integer" },
  },
  required: ["uniqueLabeled", "unlabeled", "labelDifference"],
} as const;
/** Audit supplied study allocation labels and duplication without inferring blinding quality or treatment effects. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { enrolled, activeLabel, placeboLabel, duplicateLabels } = request;
  const compute = (): Output => {
    H.integer(enrolled, 0);
    H.integer(activeLabel, 0, enrolled);
    H.integer(placeboLabel, 0, enrolled);
    H.integer(duplicateLabels, 0, Math.min(activeLabel, placeboLabel));
    H.domain(activeLabel + placeboLabel - duplicateLabels <= enrolled);
    return {
      uniqueLabeled: activeLabel + placeboLabel - duplicateLabels,
      unlabeled: enrolled - activeLabel - placeboLabel + duplicateLabels,
      labelDifference: activeLabel - placeboLabel,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    enrolled: 100,
    activeLabel: 50,
    placeboLabel: 45,
    duplicateLabels: 5,
  },
  output: { uniqueLabeled: 90, unlabeled: 10, labelDifference: 5 },
} satisfies ToolExample<Input, Output>;
export const studyPlaceboLabelDifferenceBudgetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "homeopathy/study-placebo-label-difference-budget",
    title: "Study Placebo Label Difference Budget Tool",
    description:
      "Audit supplied study allocation labels and duplication without inferring blinding quality or treatment effects.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        enrolled: { type: "integer", minimum: 0 },
        activeLabel: { type: "integer", minimum: 0 },
        placeboLabel: { type: "integer", minimum: 0 },
        duplicateLabels: { type: "integer", minimum: 0 },
      },
      required: ["enrolled", "activeLabel", "placeboLabel", "duplicateLabels"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        uniqueLabeled: { type: "integer" },
        unlabeled: { type: "integer" },
        labelDifference: { type: "integer" },
      },
      required: ["uniqueLabeled", "unlabeled", "labelDifference"],
    },
    ports: {
      inputs: [
        {
          id: "enrolled",
          label: "Enrolled",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "activeLabel",
          label: "Active Label",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "placeboLabel",
          label: "Placebo Label",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "duplicateLabels",
          label: "Duplicate Labels",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "uniqueLabeled",
          label: "Unique Labeled",
          valueType: { type: "integer" },
        },
        { id: "unlabeled", label: "Unlabeled", valueType: { type: "integer" } },
        {
          id: "labelDifference",
          label: "Label Difference",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = studyPlaceboLabelDifferenceBudgetTool.execute;
export default studyPlaceboLabelDifferenceBudgetTool;
