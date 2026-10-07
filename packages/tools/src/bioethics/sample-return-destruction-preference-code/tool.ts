import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly recordId: string;
  readonly recordedPreference: string;
};
export type Output = { readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    recordId: { type: "string", maxLength: 8192, minLength: 1 },
    recordedPreference: {
      type: "string",
      maxLength: 8192,
      enum: ["return", "destroy", "retain", "unspecified"],
    },
  },
  required: ["recordId", "recordedPreference"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { label: { type: "string", maxLength: 8192 } },
  required: ["label"],
} as const;
/** Label an explicit sample disposition preference without executing disposition or determining authorization. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { recordId, recordedPreference } = request;
  const compute = (): Output => {
    H.domain(recordId.length > 0, "recordId");
    H.domain(
      ["return", "destroy", "retain", "unspecified"].includes(
        recordedPreference,
      ),
      "recordedPreference",
    );
    return { label: recordId + " [" + recordedPreference + "]" };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { recordId: "S17", recordedPreference: "return" },
  output: { label: "S17 [return]" },
} satisfies ToolExample<Input, Output>;
export const sampleReturnDestructionPreferenceCodeTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      discovery: {
        aliases: [],
        collections: ["data"],
        fields: ["bioethics", "research and quality management"],
        keywords: ["bioethics", "research and quality management"],
      },
      id: "bioethics/sample-return-destruction-preference-code",
      title: "Sample Return Destruction Preference Code",
      description:
        "Label an explicit sample disposition preference without executing disposition or determining authorization.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          recordId: { type: "string", maxLength: 8192, minLength: 1 },
          recordedPreference: {
            type: "string",
            maxLength: 8192,
            enum: ["return", "destroy", "retain", "unspecified"],
          },
        },
        required: ["recordId", "recordedPreference"],
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
            id: "recordedPreference",
            label: "Recorded Preference",
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
export const run = sampleReturnDestructionPreferenceCodeTool.execute;
export default sampleReturnDestructionPreferenceCodeTool;
