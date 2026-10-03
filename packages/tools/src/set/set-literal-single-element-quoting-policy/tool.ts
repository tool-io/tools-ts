import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = { readonly element: string };
export type Output = { readonly literal: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { element: { type: "string", maxLength: 8192 } },
  required: ["element"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { literal: { type: "string", maxLength: 8192 } },
  required: ["literal"],
} as const;
/** Compute set literal single element quoting policy from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { element } = input;
  const compute = (): Output => {
    return { literal: "{" + JSON.stringify(element) + "}" };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { element: "a,b" },
  output: { literal: '{"a,b"}' },
} satisfies ToolExample<Input, Output>;
export const setLiteralSingleElementQuotingPolicyTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "set/set-literal-single-element-quoting-policy",
  title: "Set Literal Single Element Quoting Policy Tool",
  description:
    "Compute set literal single element quoting policy from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "element",
        label: "Element",
        required: true,
        valueType: { type: "string" },
      },
    ],
    outputs: [
      { id: "literal", label: "Literal", valueType: { type: "string" } },
    ],
  },
});
export const run = setLiteralSingleElementQuotingPolicyTool.execute;
export default setLiteralSingleElementQuotingPolicyTool;
