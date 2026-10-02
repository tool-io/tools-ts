import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly clauseAt: number; readonly agreementAt: number };
export type Output = { readonly offset: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { clauseAt: { type: "number" }, agreementAt: { type: "number" } },
  required: ["clauseAt", "agreementAt"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { offset: { type: "number" } },
  required: ["offset"],
} as const;
/** Compare supplied public agreement date coordinates without interpreting legal effect. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { clauseAt, agreementAt } = request;
  const compute = (): Output => {
    return { offset: clauseAt - agreementAt };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { clauseAt: 120, agreementAt: 100 },
  output: { offset: 20 },
} satisfies ToolExample<Input, Output>;
export const agreementClauseDateOffsetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "peace-studies/agreement-clause-date-offset",
    title: "Agreement Clause Date Offset Tool",
    description:
      "Compare supplied public agreement date coordinates without interpreting legal effect.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        clauseAt: { type: "number" },
        agreementAt: { type: "number" },
      },
      required: ["clauseAt", "agreementAt"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { offset: { type: "number" } },
      required: ["offset"],
    },
    ports: {
      inputs: [
        {
          id: "clauseAt",
          label: "Clause At",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "agreementAt",
          label: "Agreement At",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "offset", label: "Offset", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = agreementClauseDateOffsetTool.execute;
export default agreementClauseDateOffsetTool;
