import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly voucherId: string;
  readonly suppliedPreservative: string;
  readonly labelSource: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    voucherId: { type: "string", maxLength: 8192, minLength: 1 },
    suppliedPreservative: { type: "string", maxLength: 8192, minLength: 1 },
    labelSource: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["voucherId", "suppliedPreservative", "labelSource"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Record an explicitly supplied fish-voucher preservative transcription without preservation recommendations or composition inference. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { voucherId, suppliedPreservative, labelSource } = request;
  const compute = (): Output => {
    H.domain(voucherId.length > 0, "voucherId");
    H.domain(suppliedPreservative.length > 0, "suppliedPreservative");
    H.domain(labelSource.length > 0, "labelSource");
    return {
      token: JSON.stringify([voucherId, suppliedPreservative, labelSource]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    voucherId: "V17",
    suppliedPreservative: "solution A",
    labelSource: "record R4",
  },
  output: { token: '["V17","solution A","record R4"]' },
} satisfies ToolExample<Input, Output>;
export const ichthyologicalVoucherPreservativeLabelTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "ichthyology/ichthyological-voucher-preservative-label",
      title: "Ichthyological Voucher Preservative Label Tool",
      description:
        "Record an explicitly supplied fish-voucher preservative transcription without preservation recommendations or composition inference.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          voucherId: { type: "string", maxLength: 8192, minLength: 1 },
          suppliedPreservative: {
            type: "string",
            maxLength: 8192,
            minLength: 1,
          },
          labelSource: { type: "string", maxLength: 8192, minLength: 1 },
        },
        required: ["voucherId", "suppliedPreservative", "labelSource"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { token: { type: "string", maxLength: 8192 } },
        required: ["token"],
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
            id: "suppliedPreservative",
            label: "Supplied Preservative",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "labelSource",
            label: "Label Source",
            required: true,
            valueType: { type: "string" },
          },
        ],
        outputs: [
          { id: "token", label: "Token", valueType: { type: "string" } },
        ],
      },
    },
    calculate,
  });
export const run = ichthyologicalVoucherPreservativeLabelTool.execute;
export default ichthyologicalVoucherPreservativeLabelTool;
