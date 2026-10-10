import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly recordId: string;
  readonly recordedAction: string;
};
export type Output = { readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    recordId: { type: "string", maxLength: 8192, minLength: 1 },
    recordedAction: {
      type: "string",
      maxLength: 8192,
      enum: ["accession", "ratification", "signature", "other", "unspecified"],
    },
  },
  required: ["recordId", "recordedAction"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { label: { type: "string", maxLength: 8192 } },
  required: ["label"],
} as const;
/** Label an explicitly recorded treaty action without determining international legal status. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { recordId, recordedAction } = request;
  const compute = (): Output => {
    H.domain(recordId.length > 0, "recordId");
    H.domain(
      [
        "accession",
        "ratification",
        "signature",
        "other",
        "unspecified",
      ].includes(recordedAction),
      "recordedAction",
    );
    return { label: recordId + " [" + recordedAction + "]" };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { recordId: "R17", recordedAction: "accession" },
  output: { label: "R17 [accession]" },
} satisfies ToolExample<Input, Output>;
export const treatyAccessionVersusRatificationCodeTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      discovery: {
        aliases: [],
        collections: ["learn"],
        fields: [
          "international-relations",
          "international relations",
          "social sciences",
        ],
        keywords: ["international relations", "social sciences"],
      },
      id: "international-relations/treaty-accession-versus-ratification-code",
      title: "Treaty Accession Versus Ratification Code",
      description:
        "Label an explicitly recorded treaty action without determining international legal status.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          recordId: { type: "string", maxLength: 8192, minLength: 1 },
          recordedAction: {
            type: "string",
            maxLength: 8192,
            enum: [
              "accession",
              "ratification",
              "signature",
              "other",
              "unspecified",
            ],
          },
        },
        required: ["recordId", "recordedAction"],
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
            id: "recordId",
            label: "Record Id",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "recordedAction",
            label: "Recorded Action",
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
export const run = treatyAccessionVersusRatificationCodeTool.execute;
export default treatyAccessionVersusRatificationCodeTool;
