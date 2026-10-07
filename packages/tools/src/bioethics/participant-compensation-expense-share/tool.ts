import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly expenseReimbursement: number;
  readonly totalCompensation: number;
};
export type Output = { readonly fraction: number; readonly remainder: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    expenseReimbursement: { type: "number", minimum: 0 },
    totalCompensation: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["expenseReimbursement", "totalCompensation"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { fraction: { type: "number" }, remainder: { type: "number" } },
  required: ["fraction", "remainder"],
} as const;
/** Normalize explicit expense reimbursement to compatible total participant compensation without deciding ethical adequacy. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { expenseReimbursement, totalCompensation } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isFinite(totalCompensation) && totalCompensation > 0,
      "totalCompensation",
    ),
      totalCompensation);
    H.domain(
      expenseReimbursement >= 0 && expenseReimbursement <= totalCompensation,
      "expenseReimbursement",
    );
    return {
      fraction: expenseReimbursement / totalCompensation,
      remainder: totalCompensation - expenseReimbursement,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { expenseReimbursement: 30, totalCompensation: 120 },
  output: { fraction: 0.25, remainder: 90 },
} satisfies ToolExample<Input, Output>;
export const participantCompensationExpenseShareTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      discovery: {
        aliases: [],
        collections: ["data"],
        fields: ["bioethics", "research and quality management"],
        keywords: ["bioethics", "research and quality management"],
      },
      id: "bioethics/participant-compensation-expense-share",
      title: "Participant Compensation Expense Share",
      description:
        "Normalize explicit expense reimbursement to compatible total participant compensation without deciding ethical adequacy.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          expenseReimbursement: { type: "number", minimum: 0 },
          totalCompensation: { type: "number", exclusiveMinimum: 0 },
        },
        required: ["expenseReimbursement", "totalCompensation"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          fraction: { type: "number" },
          remainder: { type: "number" },
        },
        required: ["fraction", "remainder"],
      },
      ports: {
        inputs: [
          {
            id: "expenseReimbursement",
            label: "Expense Reimbursement",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "totalCompensation",
            label: "Total Compensation",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          { id: "fraction", label: "Fraction", valueType: { type: "number" } },
          {
            id: "remainder",
            label: "Remainder",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = participantCompensationExpenseShareTool.execute;
export default participantCompensationExpenseShareTool;
