import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly documentId: string;
  readonly mentionNumber: number;
  readonly clusterCode: string;
};
export type Output = { readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    documentId: { type: "string", maxLength: 8192, minLength: 1 },
    mentionNumber: { type: "integer", minimum: 1 },
    clusterCode: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["documentId", "mentionNumber", "clusterCode"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { label: { type: "string", maxLength: 8192 } },
  required: ["label"],
} as const;
/** Label an explicitly assigned coreference mention and cluster without resolving referents. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { documentId, mentionNumber, clusterCode } = request;
  const compute = (): Output => {
    H.domain(documentId.length > 0 && clusterCode.length > 0, "documentId");
    (H.domain(
      Number.isSafeInteger(mentionNumber) &&
        mentionNumber >= 1 &&
        mentionNumber <= Number.MAX_SAFE_INTEGER,
      "mentionNumber",
    ),
      mentionNumber);
    return {
      label: documentId + "#m" + mentionNumber + " [" + clusterCode + "]",
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { documentId: "D17", mentionNumber: 3, clusterCode: "C2" },
  output: { label: "D17#m3 [C2]" },
} satisfies ToolExample<Input, Output>;
export const coreferenceMentionNumberLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: [
        "computational-linguistics",
        "computational linguistics",
        "information and language sciences",
      ],
      keywords: [
        "computational linguistics",
        "information and language sciences",
      ],
    },
    id: "computational-linguistics/coreference-mention-number-label",
    title: "Coreference Mention Number Label",
    description:
      "Label an explicitly assigned coreference mention and cluster without resolving referents.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        documentId: { type: "string", maxLength: 8192, minLength: 1 },
        mentionNumber: { type: "integer", minimum: 1 },
        clusterCode: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["documentId", "mentionNumber", "clusterCode"],
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
          id: "documentId",
          label: "Document Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "mentionNumber",
          label: "Mention Number",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "clusterCode",
          label: "Cluster Code",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "label", label: "Label", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = coreferenceMentionNumberLabelTool.execute;
export default coreferenceMentionNumberLabelTool;
