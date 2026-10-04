import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly committeeCode: string;
  readonly reference: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    committeeCode: { type: "string", maxLength: 8192 },
    reference: { type: "string", maxLength: 8192 },
  },
  required: ["committeeCode", "reference"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Encode a committee namespace and approval reference as an unambiguous pair, without verifying approval. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { committeeCode, reference } = request;
  const compute = (): Output => {
    H.domain(
      committeeCode.trim().length > 0 && reference.trim().length > 0,
      "committeeCode",
    );
    return { token: JSON.stringify([committeeCode, reference]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { committeeCode: "REC-A", reference: "2026/017" },
  output: { token: '["REC-A","2026/017"]' },
} satisfies ToolExample<Input, Output>;
export const ethicsApprovalReferenceTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "bioethics/ethics-approval-reference-token",
    title: "Ethics Approval Reference Token Tool",
    description:
      "Encode a committee namespace and approval reference as an unambiguous pair, without verifying approval.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        committeeCode: { type: "string", maxLength: 8192 },
        reference: { type: "string", maxLength: 8192 },
      },
      required: ["committeeCode", "reference"],
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
          id: "committeeCode",
          label: "Committee Code",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "reference",
          label: "Reference",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = ethicsApprovalReferenceTokenTool.execute;
export default ethicsApprovalReferenceTokenTool;
