import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly measured: number; readonly reference: number };
export type Output = { readonly gap: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { measured: { type: "number" }, reference: { type: "number" } },
  required: ["measured", "reference"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { gap: { type: "number" } },
  required: ["gap"],
} as const;
/** Compare supplied research-image channel values in one declared encoding without skin diagnosis. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { measured, reference } = request;
  const compute = (): Output => {
    return { gap: measured - reference };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { measured: 120, reference: 100 },
  output: { gap: 20 },
} satisfies ToolExample<Input, Output>;
export const skinImageReferenceChannelGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "dermatology/skin-image-reference-channel-gap",
    title: "Skin Image Reference Channel Gap Tool",
    description:
      "Compare supplied research-image channel values in one declared encoding without skin diagnosis.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        measured: { type: "number" },
        reference: { type: "number" },
      },
      required: ["measured", "reference"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { gap: { type: "number" } },
      required: ["gap"],
    },
    ports: {
      inputs: [
        {
          id: "measured",
          label: "Measured",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "reference",
          label: "Reference",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [{ id: "gap", label: "Gap", valueType: { type: "number" } }],
    },
  },
  calculate,
});
export const run = skinImageReferenceChannelGapTool.execute;
export default skinImageReferenceChannelGapTool;
