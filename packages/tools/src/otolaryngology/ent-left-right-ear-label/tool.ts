import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly recordId: string; readonly earSide: string };
export type Output = { readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    recordId: { type: "string", maxLength: 8192, minLength: 1 },
    earSide: {
      type: "string",
      maxLength: 8192,
      enum: ["left", "right", "bilateral", "unspecified"],
    },
  },
  required: ["recordId", "earSide"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { label: { type: "string", maxLength: 8192 } },
  required: ["label"],
} as const;
/** Attach explicitly recorded ear laterality without inferring a diagnosis or test-side convention. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { recordId, earSide } = request;
  const compute = (): Output => {
    H.domain(recordId.length > 0, "recordId");
    H.domain(
      ["left", "right", "bilateral", "unspecified"].includes(earSide),
      "earSide",
    );
    return { label: recordId + " [" + earSide + " ear]" };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { recordId: "ENT17", earSide: "right" },
  output: { label: "ENT17 [right ear]" },
} satisfies ToolExample<Input, Output>;
export const entLeftRightEarLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["otolaryngology", "health and medicine"],
      keywords: ["otolaryngology", "health and medicine"],
    },
    id: "otolaryngology/ent-left-right-ear-label",
    title: "Ent Left Right Ear Label",
    description:
      "Attach explicitly recorded ear laterality without inferring a diagnosis or test-side convention.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        recordId: { type: "string", maxLength: 8192, minLength: 1 },
        earSide: {
          type: "string",
          maxLength: 8192,
          enum: ["left", "right", "bilateral", "unspecified"],
        },
      },
      required: ["recordId", "earSide"],
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
          id: "earSide",
          label: "Ear Side",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "label", label: "Label", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = entLeftRightEarLabelTool.execute;
export default entLeftRightEarLabelTool;
