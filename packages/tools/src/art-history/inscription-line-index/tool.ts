import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly lines: readonly string[];
  readonly lineNumber: number;
  readonly oneBased: boolean;
};
export type Output = { readonly index: number; readonly line: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    lines: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    lineNumber: { type: "integer" },
    oneBased: { type: "boolean" },
  },
  required: ["lines", "lineNumber", "oneBased"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    index: { type: "integer" },
    line: { type: "string", maxLength: 8192 },
  },
  required: ["index", "line"],
} as const;
/** Read a supplied transcription line under an explicit indexing convention. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { lines, lineNumber, oneBased } = request;
  const compute = (): Output => {
    const index = lineNumber - (oneBased ? 1 : 0);
    H.integer(index, 0, lines.length - 1);
    return { index, line: lines[index] };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { lines: ["FIRST", "SECOND", "THIRD"], lineNumber: 2, oneBased: true },
  output: { index: 1, line: "SECOND" },
} satisfies ToolExample<Input, Output>;
export const inscriptionLineIndexTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "art-history/inscription-line-index",
    title: "Inscription Line Index Tool",
    description:
      "Read a supplied transcription line under an explicit indexing convention.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        lines: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        lineNumber: { type: "integer" },
        oneBased: { type: "boolean" },
      },
      required: ["lines", "lineNumber", "oneBased"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        index: { type: "integer" },
        line: { type: "string", maxLength: 8192 },
      },
      required: ["index", "line"],
    },
    ports: {
      inputs: [
        {
          id: "lines",
          label: "Lines",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "lineNumber",
          label: "Line Number",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "oneBased",
          label: "One Based",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        { id: "index", label: "Index", valueType: { type: "integer" } },
        { id: "line", label: "Line", valueType: { type: "string" } },
      ],
    },
  },
  calculate,
});
export const run = inscriptionLineIndexTool.execute;
export default inscriptionLineIndexTool;
