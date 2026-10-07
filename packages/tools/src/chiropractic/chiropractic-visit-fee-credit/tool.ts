import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly visitFee: number;
  readonly creditedAmount: number;
};
export type Output = { readonly netFee: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    visitFee: { type: "number", minimum: 0 },
    creditedAmount: { type: "number", minimum: 0 },
  },
  required: ["visitFee", "creditedAmount"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { netFee: { type: "number" } },
  required: ["netFee"],
} as const;
/** Subtract an explicit credit from a visit fee in the same currency, preserving an over-credit. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { visitFee, creditedAmount } = request;
  const compute = (): Output => {
    H.domain(visitFee >= 0 && creditedAmount >= 0, "visitFee");
    return { netFee: visitFee - creditedAmount };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { visitFee: 80, creditedAmount: 15 },
  output: { netFee: 65 },
} satisfies ToolExample<Input, Output>;
export const chiropracticVisitFeeCreditTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["chiropractic", "health and medicine"],
      keywords: ["chiropractic", "health and medicine"],
    },
    id: "chiropractic/chiropractic-visit-fee-credit",
    title: "Chiropractic Visit Fee Credit",
    description:
      "Subtract an explicit credit from a visit fee in the same currency, preserving an over-credit.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        visitFee: { type: "number", minimum: 0 },
        creditedAmount: { type: "number", minimum: 0 },
      },
      required: ["visitFee", "creditedAmount"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { netFee: { type: "number" } },
      required: ["netFee"],
    },
    ports: {
      inputs: [
        {
          id: "visitFee",
          label: "Visit Fee",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "creditedAmount",
          label: "Credited Amount",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "netFee", label: "Net Fee", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = chiropracticVisitFeeCreditTool.execute;
export default chiropracticVisitFeeCreditTool;
