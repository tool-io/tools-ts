import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly variable: string;
  readonly assignedTruth: boolean;
};
export type Output = { readonly literal: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    variable: { type: "string", maxLength: 8192, minLength: 1 },
    assignedTruth: { type: "boolean" },
  },
  required: ["variable", "assignedTruth"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { literal: { type: "string", maxLength: 8192 } },
  required: ["literal"],
} as const;
/** Format an explicit Boolean assignment as a literal without verifying that it is a counterexample. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { variable, assignedTruth } = request;
  const compute = (): Output => {
    H.domain(variable.length > 0, "variable");
    return { literal: (assignedTruth ? "" : "¬") + variable };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { variable: "P", assignedTruth: false },
  output: { literal: "¬P" },
} satisfies ToolExample<Input, Output>;
export const counterexampleAssignmentLiteralTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["philosophy"],
      keywords: ["philosophy"],
    },
    id: "philosophy/counterexample-assignment-literal",
    title: "Counterexample Assignment Literal",
    description:
      "Format an explicit Boolean assignment as a literal without verifying that it is a counterexample.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        variable: { type: "string", maxLength: 8192, minLength: 1 },
        assignedTruth: { type: "boolean" },
      },
      required: ["variable", "assignedTruth"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { literal: { type: "string", maxLength: 8192 } },
      required: ["literal"],
    },
    ports: {
      inputs: [
        {
          id: "variable",
          label: "Variable",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "assignedTruth",
          label: "Assigned Truth",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        { id: "literal", label: "Literal", valueType: { type: "string" } },
      ],
    },
  },
  calculate,
});
export const run = counterexampleAssignmentLiteralTool.execute;
export default counterexampleAssignmentLiteralTool;
