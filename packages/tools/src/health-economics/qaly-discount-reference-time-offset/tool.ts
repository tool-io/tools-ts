import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly discountOriginYears: number;
  readonly outcomeTimeYears: number;
};
export type Output = { readonly signedGap: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    discountOriginYears: { type: "number" },
    outcomeTimeYears: { type: "number" },
  },
  required: ["discountOriginYears", "outcomeTimeYears"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { signedGap: { type: "number" } },
  required: ["signedGap"],
} as const;
/** Calculate supplied outcome time relative to an explicit QALY discount origin in matching year units without assigning utilities or a discount rate. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { discountOriginYears, outcomeTimeYears } = request;
  const compute = (): Output => {
    return { signedGap: outcomeTimeYears - discountOriginYears };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { discountOriginYears: 12, outcomeTimeYears: 17 },
  output: { signedGap: 5 },
} satisfies ToolExample<Input, Output>;
export const qalyDiscountReferenceTimeOffsetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "health-economics/qaly-discount-reference-time-offset",
    title: "QALY Discount Reference Time Offset Tool",
    description:
      "Calculate supplied outcome time relative to an explicit QALY discount origin in matching year units without assigning utilities or a discount rate.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        discountOriginYears: { type: "number" },
        outcomeTimeYears: { type: "number" },
      },
      required: ["discountOriginYears", "outcomeTimeYears"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { signedGap: { type: "number" } },
      required: ["signedGap"],
    },
    ports: {
      inputs: [
        {
          id: "discountOriginYears",
          label: "Discount Origin Years",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "outcomeTimeYears",
          label: "Outcome Time Years",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "signedGap", label: "Signed Gap", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = qalyDiscountReferenceTimeOffsetTool.execute;
export default qalyDiscountReferenceTimeOffsetTool;
