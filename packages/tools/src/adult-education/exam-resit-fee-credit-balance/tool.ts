import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly resits: number;
  readonly feePerResit: number;
  readonly transferableCredit: number;
  readonly adminFee: number;
};
export type Output = {
  readonly grossFee: number;
  readonly creditUsed: number;
  readonly due: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    resits: { type: "integer", minimum: 0 },
    feePerResit: { type: "number", minimum: 0 },
    transferableCredit: { type: "number", minimum: 0 },
    adminFee: { type: "number", minimum: 0 },
  },
  required: ["resits", "feePerResit", "transferableCredit", "adminFee"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    grossFee: { type: "number" },
    creditUsed: { type: "number" },
    due: { type: "number" },
  },
  required: ["grossFee", "creditUsed", "due"],
} as const;
/** Calculate exam resit fee credit balance from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { resits, feePerResit, transferableCredit, adminFee } = request;
  const compute = (): Output => {
    H.integer(resits, 0);
    H.domain(feePerResit >= 0 && transferableCredit >= 0 && adminFee >= 0);
    return {
      grossFee: resits * feePerResit + adminFee,
      creditUsed: Math.min(transferableCredit, resits * feePerResit + adminFee),
      due: Math.max(0, resits * feePerResit + adminFee - transferableCredit),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { resits: 2, feePerResit: 50, transferableCredit: 30, adminFee: 10 },
  output: { grossFee: 110, creditUsed: 30, due: 80 },
} satisfies ToolExample<Input, Output>;
export const examResitFeeCreditBalanceTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "adult-education/exam-resit-fee-credit-balance",
    title: "Exam Resit Fee Credit Balance Tool",
    description:
      "Calculate exam resit fee credit balance from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        resits: { type: "integer", minimum: 0 },
        feePerResit: { type: "number", minimum: 0 },
        transferableCredit: { type: "number", minimum: 0 },
        adminFee: { type: "number", minimum: 0 },
      },
      required: ["resits", "feePerResit", "transferableCredit", "adminFee"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        grossFee: { type: "number" },
        creditUsed: { type: "number" },
        due: { type: "number" },
      },
      required: ["grossFee", "creditUsed", "due"],
    },
    ports: {
      inputs: [
        {
          id: "resits",
          label: "Resits",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "feePerResit",
          label: "Fee Per Resit",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "transferableCredit",
          label: "Transferable Credit",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "adminFee",
          label: "Admin Fee",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "grossFee", label: "Gross Fee", valueType: { type: "number" } },
        {
          id: "creditUsed",
          label: "Credit Used",
          valueType: { type: "number" },
        },
        { id: "due", label: "Due", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = examResitFeeCreditBalanceTool.execute;
export default examResitFeeCreditBalanceTool;
