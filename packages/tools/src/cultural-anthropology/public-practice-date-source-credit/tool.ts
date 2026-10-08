import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly practiceLabel: string;
  readonly dateText: string;
  readonly sourceCredit: string;
};
export type Output = { readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    practiceLabel: { type: "string", maxLength: 8192, minLength: 1 },
    dateText: { type: "string", maxLength: 8192, minLength: 1 },
    sourceCredit: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["practiceLabel", "dateText", "sourceCredit"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { label: { type: "string", maxLength: 8192 } },
  required: ["label"],
} as const;
/** Label a caller-supplied public-practice reference with literal date and source credit without disclosing restricted practices. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { practiceLabel, dateText, sourceCredit } = request;
  const compute = (): Output => {
    H.domain(
      practiceLabel.length > 0 &&
        dateText.length > 0 &&
        sourceCredit.length > 0,
      "practiceLabel",
    );
    return {
      label: practiceLabel + " [" + dateText + "; " + sourceCredit + "]",
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    practiceLabel: "Public practice A",
    dateText: "2020",
    sourceCredit: "Source B",
  },
  output: { label: "Public practice A [2020; Source B]" },
} satisfies ToolExample<Input, Output>;
export const publicPracticeDateSourceCreditTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: [
        "cultural-anthropology",
        "cultural anthropology",
        "social sciences",
      ],
      keywords: ["cultural anthropology", "social sciences"],
    },
    id: "cultural-anthropology/public-practice-date-source-credit",
    title: "Public Practice Date Source Credit",
    description:
      "Label a caller-supplied public-practice reference with literal date and source credit without disclosing restricted practices.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        practiceLabel: { type: "string", maxLength: 8192, minLength: 1 },
        dateText: { type: "string", maxLength: 8192, minLength: 1 },
        sourceCredit: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["practiceLabel", "dateText", "sourceCredit"],
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
          id: "practiceLabel",
          label: "Practice Label",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "dateText",
          label: "Date Text",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "sourceCredit",
          label: "Source Credit",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "label", label: "Label", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = publicPracticeDateSourceCreditTool.execute;
export default publicPracticeDateSourceCreditTool;
