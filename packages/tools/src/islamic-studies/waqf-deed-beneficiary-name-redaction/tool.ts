import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly beneficiaryName: string;
  readonly publishName: boolean;
  readonly suppliedMask: string;
};
export type Output = { readonly displayName: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    beneficiaryName: { type: "string", maxLength: 8192 },
    publishName: { type: "boolean" },
    suppliedMask: { type: "string", maxLength: 8192 },
  },
  required: ["beneficiaryName", "publishName", "suppliedMask"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { displayName: { type: "string", maxLength: 8192 } },
  required: ["displayName"],
} as const;
/** Choose an explicit waqf beneficiary name or supplied mask under a caller-provided publication flag without interpreting legal rights. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { beneficiaryName, publishName, suppliedMask } = request;
  const compute = (): Output => {
    return { displayName: publishName ? beneficiaryName : suppliedMask };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    beneficiaryName: "Name A",
    publishName: false,
    suppliedMask: "Beneficiary 17",
  },
  output: { displayName: "Beneficiary 17" },
} satisfies ToolExample<Input, Output>;
export const waqfDeedBeneficiaryNameRedactionTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "islamic-studies/waqf-deed-beneficiary-name-redaction",
    title: "Waqf Deed Beneficiary Name Redaction Tool",
    description:
      "Choose an explicit waqf beneficiary name or supplied mask under a caller-provided publication flag without interpreting legal rights.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        beneficiaryName: { type: "string", maxLength: 8192 },
        publishName: { type: "boolean" },
        suppliedMask: { type: "string", maxLength: 8192 },
      },
      required: ["beneficiaryName", "publishName", "suppliedMask"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { displayName: { type: "string", maxLength: 8192 } },
      required: ["displayName"],
    },
    ports: {
      inputs: [
        {
          id: "beneficiaryName",
          label: "Beneficiary Name",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "publishName",
          label: "Publish Name",
          required: true,
          valueType: { type: "boolean" },
        },
        {
          id: "suppliedMask",
          label: "Supplied Mask",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "displayName",
          label: "Display Name",
          valueType: { type: "string" },
        },
      ],
    },
  },
  calculate,
});
export const run = waqfDeedBeneficiaryNameRedactionTool.execute;
export default waqfDeedBeneficiaryNameRedactionTool;
