import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly fieldId: string;
  readonly recordedState: string;
};
export type Output = { readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    fieldId: { type: "string", maxLength: 8192, minLength: 1 },
    recordedState: {
      type: "string",
      maxLength: 8192,
      enum: ["blank", "unknown", "not-applicable", "fill", "other"],
    },
  },
  required: ["fieldId", "recordedState"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { label: { type: "string", maxLength: 8192 } },
  required: ["label"],
} as const;
/** Label an explicitly recorded MARC fixed-field state without treating field-specific blank and unknown codes as interchangeable. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { fieldId, recordedState } = request;
  const compute = (): Output => {
    H.domain(fieldId.length > 0, "fieldId");
    H.domain(
      ["blank", "unknown", "not-applicable", "fill", "other"].includes(
        recordedState,
      ),
      "recordedState",
    );
    return { label: fieldId + " [" + recordedState + "]" };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { fieldId: "F17", recordedState: "unknown" },
  output: { label: "F17 [unknown]" },
} satisfies ToolExample<Input, Output>;
export const marcFixedFieldBlankUnknownTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: [
        "library-science",
        "library science",
        "information and language sciences",
      ],
      keywords: ["library science", "information and language sciences"],
    },
    id: "library-science/marc-fixed-field-blank-unknown-token",
    title: "MARC Fixed Field Blank Unknown Token",
    description:
      "Label an explicitly recorded MARC fixed-field state without treating field-specific blank and unknown codes as interchangeable.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        fieldId: { type: "string", maxLength: 8192, minLength: 1 },
        recordedState: {
          type: "string",
          maxLength: 8192,
          enum: ["blank", "unknown", "not-applicable", "fill", "other"],
        },
      },
      required: ["fieldId", "recordedState"],
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
          id: "fieldId",
          label: "Field Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "recordedState",
          label: "Recorded State",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "label", label: "Label", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = marcFixedFieldBlankUnknownTokenTool.execute;
export default marcFixedFieldBlankUnknownTokenTool;
