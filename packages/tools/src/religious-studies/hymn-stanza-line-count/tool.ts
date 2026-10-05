import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly stanza: string };
export type Output = { readonly lineCount: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { stanza: { type: "string", maxLength: 8192 } },
  required: ["stanza"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { lineCount: { type: "integer" } },
  required: ["lineCount"],
} as const;
/** Count physical stanza lines, treating one final newline as a terminator rather than an extra line; blank internal lines count. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { stanza } = request;
  const compute = (): Output => {
    const normalized = stanza.replace(/\r\n?/g, "\n");
    const lines = normalized.split("\n");
    if (lines[lines.length - 1] === "") lines.pop();
    return { lineCount: normalized === "" ? 0 : lines.length };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { stanza: "First line\nSecond line\n" },
  output: { lineCount: 2 },
} satisfies ToolExample<Input, Output>;
export const hymnStanzaLineCountTool = H.defineSchemaCalculation<Input, Output>(
  {
    ...{
      id: "religious-studies/hymn-stanza-line-count",
      title: "Hymn Stanza Line Count Tool",
      description:
        "Count physical stanza lines, treating one final newline as a terminator rather than an extra line; blank internal lines count.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { stanza: { type: "string", maxLength: 8192 } },
        required: ["stanza"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { lineCount: { type: "integer" } },
        required: ["lineCount"],
      },
      ports: {
        inputs: [
          {
            id: "stanza",
            label: "Stanza",
            required: true,
            valueType: { type: "string" },
          },
        ],
        outputs: [
          {
            id: "lineCount",
            label: "Line Count",
            valueType: { type: "integer" },
          },
        ],
      },
    },
    calculate,
  },
);
export const run = hymnStanzaLineCountTool.execute;
export default hymnStanzaLineCountTool;
