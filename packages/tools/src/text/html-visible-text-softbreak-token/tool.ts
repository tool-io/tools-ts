import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly token: string };
export type Output = { readonly recognized: boolean; readonly text: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    recognized: { type: "boolean" },
    text: { type: "string", maxLength: 8192 },
  },
  required: ["recognized", "text"],
} as const;
/** Recognize only a bare HTML br token as a visible-text line break, without parsing an HTML document. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { token } = request;
  const compute = (): Output => {
    const recognized = /^<br\s*\/?>(?![\s\S])/i.test(token);
    return { recognized, text: recognized ? "\n" : "" };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { token: "<br/>" },
  output: { recognized: true, text: "\n" },
} satisfies ToolExample<Input, Output>;
export const htmlVisibleTextSoftbreakTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "text/html-visible-text-softbreak-token",
    title: "Html Visible Text Softbreak Token Tool",
    description:
      "Recognize only a bare HTML br token as a visible-text line break, without parsing an HTML document.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { token: { type: "string", maxLength: 8192 } },
      required: ["token"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        recognized: { type: "boolean" },
        text: { type: "string", maxLength: 8192 },
      },
      required: ["recognized", "text"],
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
        {
          id: "recognized",
          label: "Recognized",
          valueType: { type: "boolean" },
        },
        { id: "text", label: "Text", valueType: { type: "string" } },
      ],
    },
  },
  calculate,
});
export const run = htmlVisibleTextSoftbreakTokenTool.execute;
export default htmlVisibleTextSoftbreakTokenTool;
