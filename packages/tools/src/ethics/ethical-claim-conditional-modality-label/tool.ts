import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly claimId: string; readonly modality: string };
export type Output = { readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    claimId: { type: "string", maxLength: 8192, minLength: 1 },
    modality: {
      type: "string",
      maxLength: 8192,
      enum: [
        "conditional",
        "required",
        "permitted",
        "prohibited",
        "unspecified",
      ],
    },
  },
  required: ["claimId", "modality"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { label: { type: "string", maxLength: 8192 } },
  required: ["label"],
} as const;
/** Label an explicitly annotated claim modality without evaluating its ethical force. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { claimId, modality } = request;
  const compute = (): Output => {
    H.domain(claimId.length > 0, "claimId");
    H.domain(
      [
        "conditional",
        "required",
        "permitted",
        "prohibited",
        "unspecified",
      ].includes(modality),
      "modality",
    );
    return { label: claimId + " [" + modality + "]" };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { claimId: "CL17", modality: "conditional" },
  output: { label: "CL17 [conditional]" },
} satisfies ToolExample<Input, Output>;
export const ethicalClaimConditionalModalityLabelTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      discovery: {
        aliases: [],
        collections: ["learn"],
        fields: ["ethics", "philosophy"],
        keywords: ["ethics", "philosophy"],
      },
      id: "ethics/ethical-claim-conditional-modality-label",
      title: "Ethical Claim Conditional Modality Label",
      description:
        "Label an explicitly annotated claim modality without evaluating its ethical force.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          claimId: { type: "string", maxLength: 8192, minLength: 1 },
          modality: {
            type: "string",
            maxLength: 8192,
            enum: [
              "conditional",
              "required",
              "permitted",
              "prohibited",
              "unspecified",
            ],
          },
        },
        required: ["claimId", "modality"],
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
            id: "claimId",
            label: "Claim Id",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "modality",
            label: "Modality",
            required: true,
            valueType: { type: "string" },
          },
        ],
        outputs: [
          { id: "label", label: "Label", valueType: { type: "string" } },
        ],
      },
    },
    calculate,
  });
export const run = ethicalClaimConditionalModalityLabelTool.execute;
export default ethicalClaimConditionalModalityLabelTool;
