import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly payment: number;
  readonly interest: number;
  readonly recordedPrincipal: number;
};
export type Output = {
  readonly impliedPrincipal: number;
  readonly residual: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    payment: { type: "number" },
    interest: { type: "number" },
    recordedPrincipal: { type: "number" },
  },
  required: ["payment", "interest", "recordedPrincipal"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    impliedPrincipal: { type: "number" },
    residual: { type: "number" },
  },
  required: ["impliedPrincipal", "residual"],
} as const;
/** Compare recorded rounded principal with payment minus interest without introducing a rounding policy. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { payment, interest, recordedPrincipal } = input;
  const compute = (): Output => {
    const impliedPrincipal = payment - interest;
    return { impliedPrincipal, residual: recordedPrincipal - impliedPrincipal };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { payment: 100, interest: 12.34, recordedPrincipal: 87.65 },
  output: { impliedPrincipal: 87.66, residual: -0.009999999999990905 },
} satisfies ToolExample<Input, Output>;
export const installmentRoundedPrincipalResidualTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "finance/installment-rounded-principal-residual",
      title: "Installment Rounded Principal Residual Tool",
      description:
        "Compare recorded rounded principal with payment minus interest without introducing a rounding policy.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          payment: { type: "number" },
          interest: { type: "number" },
          recordedPrincipal: { type: "number" },
        },
        required: ["payment", "interest", "recordedPrincipal"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          impliedPrincipal: { type: "number" },
          residual: { type: "number" },
        },
        required: ["impliedPrincipal", "residual"],
      },
      ports: {
        inputs: [
          {
            id: "payment",
            label: "Payment",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "interest",
            label: "Interest",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "recordedPrincipal",
            label: "Recorded Principal",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "impliedPrincipal",
            label: "Implied Principal",
            valueType: { type: "number" },
          },
          { id: "residual", label: "Residual", valueType: { type: "number" } },
        ],
      },
    },
    calculate,
  });
export const run = installmentRoundedPrincipalResidualTool.execute;
export default installmentRoundedPrincipalResidualTool;
