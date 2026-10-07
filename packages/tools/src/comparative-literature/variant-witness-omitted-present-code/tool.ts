import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly witnessId: string; readonly status: string };
export type Output = { readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    witnessId: { type: "string", maxLength: 8192, minLength: 1 },
    status: {
      type: "string",
      maxLength: 8192,
      enum: ["omitted", "present", "uncertain"],
    },
  },
  required: ["witnessId", "status"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { label: { type: "string", maxLength: 8192 } },
  required: ["label"],
} as const;
/** Label whether an explicitly identified textual witness is recorded as omitting or retaining a variant. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { witnessId, status } = request;
  const compute = (): Output => {
    H.domain(witnessId.length > 0, "witnessId");
    H.domain(["omitted", "present", "uncertain"].includes(status), "status");
    return { label: witnessId + " [" + status + "]" };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { witnessId: "W17", status: "omitted" },
  output: { label: "W17 [omitted]" },
} satisfies ToolExample<Input, Output>;
export const variantWitnessOmittedPresentCodeTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: [
        "comparative-literature",
        "comparative literature",
        "humanities",
      ],
      keywords: ["comparative literature", "humanities"],
    },
    id: "comparative-literature/variant-witness-omitted-present-code",
    title: "Variant Witness Omitted Present Code",
    description:
      "Label whether an explicitly identified textual witness is recorded as omitting or retaining a variant.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        witnessId: { type: "string", maxLength: 8192, minLength: 1 },
        status: {
          type: "string",
          maxLength: 8192,
          enum: ["omitted", "present", "uncertain"],
        },
      },
      required: ["witnessId", "status"],
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
          id: "witnessId",
          label: "Witness Id",
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
export const run = variantWitnessOmittedPresentCodeTool.execute;
export default variantWitnessOmittedPresentCodeTool;
