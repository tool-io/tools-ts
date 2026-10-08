import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly voucherId: string;
  readonly recordedSex: string;
};
export type Output = { readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    voucherId: { type: "string", maxLength: 8192, minLength: 1 },
    recordedSex: {
      type: "string",
      maxLength: 8192,
      enum: ["female", "male", "unknown", "uncertain", "not-assessed"],
    },
  },
  required: ["voucherId", "recordedSex"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { label: { type: "string", maxLength: 8192 } },
  required: ["label"],
} as const;
/** Preserve an explicitly recorded insect voucher sex status without biological inference. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { voucherId, recordedSex } = request;
  const compute = (): Output => {
    H.domain(voucherId.length > 0, "voucherId");
    H.domain(
      ["female", "male", "unknown", "uncertain", "not-assessed"].includes(
        recordedSex,
      ),
      "recordedSex",
    );
    return { label: voucherId + " [" + recordedSex + "]" };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { voucherId: "V17", recordedSex: "uncertain" },
  output: { label: "V17 [uncertain]" },
} satisfies ToolExample<Input, Output>;
export const insectVoucherSexUncertainTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "entomology/insect-voucher-sex-uncertain-token",
    title: "Insect Voucher Sex Uncertain Token Tool",
    description:
      "Preserve an explicitly recorded insect voucher sex status without biological inference.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        voucherId: { type: "string", maxLength: 8192, minLength: 1 },
        recordedSex: {
          type: "string",
          maxLength: 8192,
          enum: ["female", "male", "unknown", "uncertain", "not-assessed"],
        },
      },
      required: ["voucherId", "recordedSex"],
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
          id: "voucherId",
          label: "Voucher Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "recordedSex",
          label: "Recorded Sex",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "label", label: "Label", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = insectVoucherSexUncertainTokenTool.execute;
export default insectVoucherSexUncertainTokenTool;
