import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly responseId: string; readonly status: string };
export type Output = { readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    responseId: { type: "string", maxLength: 8192, minLength: 1 },
    status: {
      type: "string",
      maxLength: 8192,
      enum: ["rated", "abstained", "missing", "not-applicable"],
    },
  },
  required: ["responseId", "status"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { label: { type: "string", maxLength: 8192 } },
  required: ["label"],
} as const;
/** Distinguish explicit confidence-rating abstention from missing or inapplicable responses without interpreting a scale. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { responseId, status } = request;
  const compute = (): Output => {
    H.domain(responseId.length > 0, "responseId");
    H.domain(
      ["rated", "abstained", "missing", "not-applicable"].includes(status),
      "status",
    );
    return { label: responseId + " [" + status + "]" };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { responseId: "R17", status: "abstained" },
  output: { label: "R17 [abstained]" },
} satisfies ToolExample<Input, Output>;
export const confidenceRatingAbstentionCodeTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "educational-psychology/confidence-rating-abstention-code",
    title: "Confidence Rating Abstention Code Tool",
    description:
      "Distinguish explicit confidence-rating abstention from missing or inapplicable responses without interpreting a scale.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        responseId: { type: "string", maxLength: 8192, minLength: 1 },
        status: {
          type: "string",
          maxLength: 8192,
          enum: ["rated", "abstained", "missing", "not-applicable"],
        },
      },
      required: ["responseId", "status"],
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
          id: "status",
          label: "Status",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "label", label: "Label", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = confidenceRatingAbstentionCodeTool.execute;
export default confidenceRatingAbstentionCodeTool;
