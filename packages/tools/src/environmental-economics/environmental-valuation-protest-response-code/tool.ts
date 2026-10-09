import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly responseId: string;
  readonly responseCode: string;
};
export type Output = { readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    responseId: { type: "string", maxLength: 8192, minLength: 1 },
    responseCode: {
      type: "string",
      maxLength: 8192,
      enum: ["substantive", "protest", "uncertain", "missing"],
    },
  },
  required: ["responseId", "responseCode"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { label: { type: "string", maxLength: 8192 } },
  required: ["label"],
} as const;
/** Preserve an explicitly assigned environmental valuation response code without classifying text or excluding observations. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { responseId, responseCode } = request;
  const compute = (): Output => {
    H.domain(responseId.length > 0, "responseId");
    H.domain(
      ["substantive", "protest", "uncertain", "missing"].includes(responseCode),
      "responseCode",
    );
    return { label: responseId + " [" + responseCode + "]" };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { responseId: "R17", responseCode: "protest" },
  output: { label: "R17 [protest]" },
} satisfies ToolExample<Input, Output>;
export const environmentalValuationProtestResponseCodeTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "environmental-economics/environmental-valuation-protest-response-code",
      title: "Environmental Valuation Protest Response Code Tool",
      description:
        "Preserve an explicitly assigned environmental valuation response code without classifying text or excluding observations.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          responseId: { type: "string", maxLength: 8192, minLength: 1 },
          responseCode: {
            type: "string",
            maxLength: 8192,
            enum: ["substantive", "protest", "uncertain", "missing"],
          },
        },
        required: ["responseId", "responseCode"],
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
            id: "responseId",
            label: "Response Id",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "responseCode",
            label: "Response Code",
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
export const run = environmentalValuationProtestResponseCodeTool.execute;
export default environmentalValuationProtestResponseCodeTool;
