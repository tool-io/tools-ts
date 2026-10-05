import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly clauseCode: string; readonly status: string };
export type Output = { readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    clauseCode: { type: "string", maxLength: 8192 },
    status: {
      type: "string",
      maxLength: 8192,
      enum: ["pending", "in-progress", "completed", "disputed", "suspended"],
    },
  },
  required: ["clauseCode", "status"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { label: { type: "string", maxLength: 8192 } },
  required: ["label"],
} as const;
/** Render an explicitly recorded agreement-clause implementation status without independently assessing compliance. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { clauseCode, status } = request;
  const compute = (): Output => {
    H.domain(clauseCode.length > 0, "clauseCode");
    H.domain(
      ["pending", "in-progress", "completed", "disputed", "suspended"].includes(
        status,
      ),
      "status",
    );
    return { label: clauseCode + " [" + status + "]" };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { clauseCode: "C17", status: "in-progress" },
  output: { label: "C17 [in-progress]" },
} satisfies ToolExample<Input, Output>;
export const agreementClauseStatusLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "peace-studies/agreement-clause-status-label",
    title: "Agreement Clause Status Label Tool",
    description:
      "Render an explicitly recorded agreement-clause implementation status without independently assessing compliance.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        clauseCode: { type: "string", maxLength: 8192 },
        status: {
          type: "string",
          maxLength: 8192,
          enum: [
            "pending",
            "in-progress",
            "completed",
            "disputed",
            "suspended",
          ],
        },
      },
      required: ["clauseCode", "status"],
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
          id: "clauseCode",
          label: "Clause Code",
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
export const run = agreementClauseStatusLabelTool.execute;
export default agreementClauseStatusLabelTool;
