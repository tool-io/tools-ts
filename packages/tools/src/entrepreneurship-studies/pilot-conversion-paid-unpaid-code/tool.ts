import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly pilotId: string; readonly status: string };
export type Output = { readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    pilotId: { type: "string", maxLength: 8192, minLength: 1 },
    status: {
      type: "string",
      maxLength: 8192,
      enum: ["paid", "unpaid", "mixed", "unknown"],
    },
  },
  required: ["pilotId", "status"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { label: { type: "string", maxLength: 8192 } },
  required: ["label"],
} as const;
/** Label an explicitly supplied pilot payment status without treating it as customer validation. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { pilotId, status } = request;
  const compute = (): Output => {
    H.domain(pilotId.length > 0, "pilotId");
    H.domain(["paid", "unpaid", "mixed", "unknown"].includes(status), "status");
    return { label: pilotId + " [" + status + "]" };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { pilotId: "P17", status: "paid" },
  output: { label: "P17 [paid]" },
} satisfies ToolExample<Input, Output>;
export const pilotConversionPaidUnpaidCodeTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "entrepreneurship-studies/pilot-conversion-paid-unpaid-code",
    title: "Pilot Conversion Paid Unpaid Code Tool",
    description:
      "Label an explicitly supplied pilot payment status without treating it as customer validation.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        pilotId: { type: "string", maxLength: 8192, minLength: 1 },
        status: {
          type: "string",
          maxLength: 8192,
          enum: ["paid", "unpaid", "mixed", "unknown"],
        },
      },
      required: ["pilotId", "status"],
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
          id: "pilotId",
          label: "Pilot Id",
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
export const run = pilotConversionPaidUnpaidCodeTool.execute;
export default pilotConversionPaidUnpaidCodeTool;
