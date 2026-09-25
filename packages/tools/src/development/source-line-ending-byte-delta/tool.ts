import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly text: string; readonly convertToCrLf: boolean };
export type Output = {
  readonly lineBreaks: number;
  readonly byteDelta: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    text: { type: "string", maxLength: 8192 },
    convertToCrLf: { type: "boolean" },
  },
  required: ["text", "convertToCrLf"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    lineBreaks: { type: "integer" },
    byteDelta: { type: "integer" },
  },
  required: ["lineBreaks", "byteDelta"],
} as const;
/** Count the UTF-8 byte change when normalizing CRLF/LF breaks; lone carriage returns are preserved. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { text, convertToCrLf } = request;
  const compute = (): Output => {
    const crlf = (text.match(/\r\n/g) ?? []).length,
      loneLf = (text.match(/(?<!\r)\n/g) ?? []).length;
    return {
      lineBreaks: crlf + loneLf,
      byteDelta: convertToCrLf ? loneLf : -crlf,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { text: "a\nb\r\nc", convertToCrLf: true },
  output: { lineBreaks: 2, byteDelta: 1 },
} satisfies ToolExample<Input, Output>;
export const sourceLineEndingByteDeltaTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "development/source-line-ending-byte-delta",
    title: "Source Line Ending Byte Delta Tool",
    description:
      "Count the UTF-8 byte change when normalizing CRLF/LF breaks; lone carriage returns are preserved.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        text: { type: "string", maxLength: 8192 },
        convertToCrLf: { type: "boolean" },
      },
      required: ["text", "convertToCrLf"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        lineBreaks: { type: "integer" },
        byteDelta: { type: "integer" },
      },
      required: ["lineBreaks", "byteDelta"],
    },
    ports: {
      inputs: [
        {
          id: "text",
          label: "Text",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "convertToCrLf",
          label: "Convert To Cr Lf",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "lineBreaks",
          label: "Line Breaks",
          valueType: { type: "integer" },
        },
        {
          id: "byteDelta",
          label: "Byte Delta",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = sourceLineEndingByteDeltaTool.execute;
export default sourceLineEndingByteDeltaTool;
