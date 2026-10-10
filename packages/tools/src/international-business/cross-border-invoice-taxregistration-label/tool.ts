import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly invoiceId: string;
  readonly suppliedRegistrationId: string;
  readonly jurisdictionSource: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    invoiceId: { type: "string", maxLength: 8192, minLength: 1 },
    suppliedRegistrationId: { type: "string", maxLength: 8192, minLength: 1 },
    jurisdictionSource: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["invoiceId", "suppliedRegistrationId", "jurisdictionSource"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Record explicit cross-border invoice tax-registration metadata without validating registration or selecting tax treatment. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { invoiceId, suppliedRegistrationId, jurisdictionSource } = request;
  const compute = (): Output => {
    H.domain(invoiceId.length > 0, "invoiceId");
    H.domain(suppliedRegistrationId.length > 0, "suppliedRegistrationId");
    H.domain(jurisdictionSource.length > 0, "jurisdictionSource");
    return {
      token: JSON.stringify([
        invoiceId,
        suppliedRegistrationId,
        jurisdictionSource,
      ]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    invoiceId: "I17",
    suppliedRegistrationId: "REG004",
    jurisdictionSource: "source J4",
  },
  output: { token: '["I17","REG004","source J4"]' },
} satisfies ToolExample<Input, Output>;
export const crossBorderInvoiceTaxregistrationLabelTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "international-business/cross-border-invoice-taxregistration-label",
      title: "Cross Border Invoice Taxregistration Label Tool",
      description:
        "Record explicit cross-border invoice tax-registration metadata without validating registration or selecting tax treatment.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          invoiceId: { type: "string", maxLength: 8192, minLength: 1 },
          suppliedRegistrationId: {
            type: "string",
            maxLength: 8192,
            minLength: 1,
          },
          jurisdictionSource: { type: "string", maxLength: 8192, minLength: 1 },
        },
        required: ["invoiceId", "suppliedRegistrationId", "jurisdictionSource"],
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
            id: "invoiceId",
            label: "Invoice Id",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "suppliedRegistrationId",
            label: "Supplied Registration Id",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "jurisdictionSource",
            label: "Jurisdiction Source",
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
export const run = crossBorderInvoiceTaxregistrationLabelTool.execute;
export default crossBorderInvoiceTaxregistrationLabelTool;
