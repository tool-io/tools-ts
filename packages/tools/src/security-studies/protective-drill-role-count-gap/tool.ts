import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly filled: number; readonly required: number };
export type Output = { readonly gap: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    filled: { type: "integer", minimum: 0 },
    required: { type: "integer", minimum: 0 },
  },
  required: ["filled", "required"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { gap: { type: "integer" } },
  required: ["gap"],
} as const;
/** Compare supplied nonoperational drill role counts with an explicit target. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { filled, required } = request;
  const compute = (): Output => {
    H.integer(filled, 0);
    H.integer(required, 0);
    return { gap: filled - required };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { filled: 6, required: 8 },
  output: { gap: -2 },
} satisfies ToolExample<Input, Output>;
export const protectiveDrillRoleCountGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "security-studies/protective-drill-role-count-gap",
    title: "Protective Drill Role Count Gap Tool",
    description:
      "Compare supplied nonoperational drill role counts with an explicit target.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        filled: { type: "integer", minimum: 0 },
        required: { type: "integer", minimum: 0 },
      },
      required: ["filled", "required"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { gap: { type: "integer" } },
      required: ["gap"],
    },
    ports: {
      inputs: [
        {
          id: "filled",
          label: "Filled",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "required",
          label: "Required",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [{ id: "gap", label: "Gap", valueType: { type: "integer" } }],
    },
  },
  calculate,
});
export const run = protectiveDrillRoleCountGapTool.execute;
export default protectiveDrillRoleCountGapTool;
