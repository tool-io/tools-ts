import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly statement: string; readonly role: string };
export type Output = { readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    statement: { type: "string", maxLength: 8192 },
    role: { type: "string", maxLength: 8192, enum: ["premise", "conclusion"] },
  },
  required: ["statement", "role"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { label: { type: "string", maxLength: 8192 } },
  required: ["label"],
} as const;
/** Render an explicitly assigned argument role without deciding logical validity. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { statement, role } = request;
  const compute = (): Output => {
    H.domain(statement.length > 0, "statement");
    H.domain(["premise", "conclusion"].includes(role), "role");
    return {
      label: (role === "premise" ? "Premise: " : "Conclusion: ") + statement,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { statement: "P implies Q", role: "premise" },
  output: { label: "Premise: P implies Q" },
} satisfies ToolExample<Input, Output>;
export const argumentPremiseConclusionLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "philosophy/argument-premise-conclusion-label",
    title: "Argument Premise Conclusion Label Tool",
    description:
      "Render an explicitly assigned argument role without deciding logical validity.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        statement: { type: "string", maxLength: 8192 },
        role: {
          type: "string",
          maxLength: 8192,
          enum: ["premise", "conclusion"],
        },
      },
      required: ["statement", "role"],
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
          id: "statement",
          label: "Statement",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "role",
          label: "Role",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "label", label: "Label", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = argumentPremiseConclusionLabelTool.execute;
export default argumentPremiseConclusionLabelTool;
