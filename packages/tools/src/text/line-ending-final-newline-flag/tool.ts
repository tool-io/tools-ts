import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly text: string };
export type Output = {
  readonly hasFinalNewline: boolean;
  readonly ending: string;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { text: { type: "string", maxLength: 8192 } },
  required: ["text"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    hasFinalNewline: { type: "boolean" },
    ending: { type: "string", maxLength: 8192 },
  },
  required: ["hasFinalNewline", "ending"],
} as const;
/** Identify the final CRLF, LF, or CR newline sequence without normalizing the text. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { text } = request;
  const compute = (): Output => {
    return {
      hasFinalNewline: /[\r\n](?![\s\S])/.test(text),
      ending: text.endsWith("\r\n")
        ? "CRLF"
        : text.endsWith("\n")
          ? "LF"
          : text.endsWith("\r")
            ? "CR"
            : "none",
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { text: "alpha\r\n" },
  output: { hasFinalNewline: true, ending: "CRLF" },
} satisfies ToolExample<Input, Output>;
export const lineEndingFinalNewlineFlagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "text/line-ending-final-newline-flag",
    title: "Line Ending Final Newline Flag Tool",
    description:
      "Identify the final CRLF, LF, or CR newline sequence without normalizing the text.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { text: { type: "string", maxLength: 8192 } },
      required: ["text"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        hasFinalNewline: { type: "boolean" },
        ending: { type: "string", maxLength: 8192 },
      },
      required: ["hasFinalNewline", "ending"],
    },
    ports: {
      inputs: [
        {
          id: "text",
          label: "Text",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "hasFinalNewline",
          label: "Has Final Newline",
          valueType: { type: "boolean" },
        },
        { id: "ending", label: "Ending", valueType: { type: "string" } },
      ],
    },
  },
  calculate,
});
export const run = lineEndingFinalNewlineFlagTool.execute;
export default lineEndingFinalNewlineFlagTool;
