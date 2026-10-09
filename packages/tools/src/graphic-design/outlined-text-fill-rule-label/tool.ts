import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly outlineId: string; readonly fillRule: string };
export type Output = { readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    outlineId: { type: "string", maxLength: 8192, minLength: 1 },
    fillRule: { type: "string", maxLength: 8192, enum: ["nonzero", "evenodd"] },
  },
  required: ["outlineId", "fillRule"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { label: { type: "string", maxLength: 8192 } },
  required: ["label"],
} as const;
/** Label an explicitly supplied outlined-text fill rule without modifying path geometry or rasterization. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { outlineId, fillRule } = request;
  const compute = (): Output => {
    H.domain(outlineId.length > 0, "outlineId");
    H.domain(["nonzero", "evenodd"].includes(fillRule), "fillRule");
    return { label: outlineId + " [" + fillRule + "]" };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { outlineId: "O17", fillRule: "nonzero" },
  output: { label: "O17 [nonzero]" },
} satisfies ToolExample<Input, Output>;
export const outlinedTextFillRuleLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "graphic-design/outlined-text-fill-rule-label",
    title: "Outlined Text Fill Rule Label Tool",
    description:
      "Label an explicitly supplied outlined-text fill rule without modifying path geometry or rasterization.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        outlineId: { type: "string", maxLength: 8192, minLength: 1 },
        fillRule: {
          type: "string",
          maxLength: 8192,
          enum: ["nonzero", "evenodd"],
        },
      },
      required: ["outlineId", "fillRule"],
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
          id: "outlineId",
          label: "Outline Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "fillRule",
          label: "Fill Rule",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "label", label: "Label", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = outlinedTextFillRuleLabelTool.execute;
export default outlinedTextFillRuleLabelTool;
