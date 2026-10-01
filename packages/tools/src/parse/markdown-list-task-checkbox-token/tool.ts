import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly token: string };
export type Output = { readonly checked: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { checked: { type: "boolean" } },
  required: ["checked"],
} as const;
/** Calculate markdown list task checkbox token from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { token } = request;
  const compute = (): Output => {
    H.domain(/^\[[ xX]\](?![\s\S])/.test(token));
    return { checked: token[1] !== " " };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { token: "[x]" },
  output: { checked: true },
} satisfies ToolExample<Input, Output>;
export const markdownListTaskCheckboxTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "parse/markdown-list-task-checkbox-token",
    title: "Markdown List Task Checkbox Token Tool",
    description:
      "Calculate markdown list task checkbox token from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { token: { type: "string", maxLength: 8192 } },
      required: ["token"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { checked: { type: "boolean" } },
      required: ["checked"],
    },
    ports: {
      inputs: [
        {
          id: "token",
          label: "Token",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        { id: "checked", label: "Checked", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = markdownListTaskCheckboxTokenTool.execute;
export default markdownListTaskCheckboxTokenTool;
