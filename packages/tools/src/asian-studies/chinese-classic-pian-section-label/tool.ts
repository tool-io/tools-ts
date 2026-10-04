import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly workTitle: string;
  readonly pianNumber: number;
  readonly sectionNumber: number;
};
export type Output = { readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    workTitle: { type: "string", maxLength: 8192 },
    pianNumber: { type: "integer", minimum: 1 },
    sectionNumber: { type: "integer", minimum: 1 },
  },
  required: ["workTitle", "pianNumber", "sectionNumber"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { label: { type: "string", maxLength: 8192 } },
  required: ["label"],
} as const;
/** Format explicitly supplied pian and section numbers without assuming an edition's internal division. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { workTitle, pianNumber, sectionNumber } = request;
  const compute = (): Output => {
    H.domain(workTitle.length > 0, "workTitle");
    (H.domain(
      Number.isSafeInteger(pianNumber) &&
        pianNumber >= 1 &&
        pianNumber <= Number.MAX_SAFE_INTEGER,
      "pianNumber",
    ),
      pianNumber);
    (H.domain(
      Number.isSafeInteger(sectionNumber) &&
        sectionNumber >= 1 &&
        sectionNumber <= Number.MAX_SAFE_INTEGER,
      "sectionNumber",
    ),
      sectionNumber);
    return { label: workTitle + " 篇" + pianNumber + " §" + sectionNumber };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { workTitle: "經典", pianNumber: 3, sectionNumber: 2 },
  output: { label: "經典 篇3 §2" },
} satisfies ToolExample<Input, Output>;
export const chineseClassicPianSectionLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "asian-studies/chinese-classic-pian-section-label",
    title: "Chinese Classic Pian Section Label Tool",
    description:
      "Format explicitly supplied pian and section numbers without assuming an edition's internal division.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        workTitle: { type: "string", maxLength: 8192 },
        pianNumber: { type: "integer", minimum: 1 },
        sectionNumber: { type: "integer", minimum: 1 },
      },
      required: ["workTitle", "pianNumber", "sectionNumber"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { label: { type: "string", maxLength: 8192 } },
      required: ["label"],
    },
    ports: {
      inputs: [
        {
          id: "workTitle",
          label: "Work Title",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "pianNumber",
          label: "Pian Number",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "sectionNumber",
          label: "Section Number",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [{ id: "label", label: "Label", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = chineseClassicPianSectionLabelTool.execute;
export default chineseClassicPianSectionLabelTool;
