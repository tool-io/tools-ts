import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly sampleId: string;
  readonly reportedText: string;
  readonly belowQuantification: boolean;
};
export type Output = { readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sampleId: { type: "string", maxLength: 8192, minLength: 1 },
    reportedText: { type: "string", maxLength: 8192, minLength: 1 },
    belowQuantification: { type: "boolean" },
  },
  required: ["sampleId", "reportedText", "belowQuantification"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { label: { type: "string", maxLength: 8192 } },
  required: ["label"],
} as const;
/** Preserve explicit quantification status and result text without replacing censored values. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { sampleId, reportedText, belowQuantification } = request;
  const compute = (): Output => {
    H.domain(sampleId.length > 0 && reportedText.length > 0, "sampleId");
    return {
      label:
        sampleId +
        "; " +
        reportedText +
        (belowQuantification ? " [below quantification]" : " [quantified]"),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { sampleId: "S17", reportedText: "<0.5", belowQuantification: true },
  output: { label: "S17; <0.5 [below quantification]" },
} satisfies ToolExample<Input, Output>;
export const pkBelowQuantificationLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["pharmacokinetics", "pharmacy"],
      keywords: ["pharmacokinetics", "pharmacy"],
    },
    id: "pharmacokinetics/pk-below-quantification-label",
    title: "PK Below Quantification Label",
    description:
      "Preserve explicit quantification status and result text without replacing censored values.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        sampleId: { type: "string", maxLength: 8192, minLength: 1 },
        reportedText: { type: "string", maxLength: 8192, minLength: 1 },
        belowQuantification: { type: "boolean" },
      },
      required: ["sampleId", "reportedText", "belowQuantification"],
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
          id: "sampleId",
          label: "Sample Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "reportedText",
          label: "Reported Text",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "belowQuantification",
          label: "Below Quantification",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [{ id: "label", label: "Label", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = pkBelowQuantificationLabelTool.execute;
export default pkBelowQuantificationLabelTool;
