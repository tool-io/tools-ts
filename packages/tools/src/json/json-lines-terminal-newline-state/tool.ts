import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly text: string };
export type Output = {
  readonly terminated: boolean;
  readonly empty: boolean;
  readonly records: number;
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
    terminated: { type: "boolean" },
    empty: { type: "boolean" },
    records: { type: "integer" },
  },
  required: ["terminated", "empty", "records"],
} as const;
/** Calculate json lines terminal newline state from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { text } = input;
  const compute = (): Output => {
    H.domain(!text.includes("\r"));
    const terminated = text.endsWith("\n"),
      rows = text.length === 0 ? [] : text.split("\n");
    if (terminated) rows.pop();
    H.domain(rows.every((x) => x.length > 0));
    rows.forEach((x) => H.parseJson(x));
    return { terminated, empty: text.length === 0, records: rows.length };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { text: "1\n2\n" },
  output: { terminated: true, empty: false, records: 2 },
} satisfies ToolExample<Input, Output>;
export const jsonLinesTerminalNewlineStateTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "json/json-lines-terminal-newline-state",
    title: "JSON Lines Terminal Newline State Tool",
    description:
      "Calculate json lines terminal newline state from explicit caller-supplied inputs.",
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
        terminated: { type: "boolean" },
        empty: { type: "boolean" },
        records: { type: "integer" },
      },
      required: ["terminated", "empty", "records"],
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
          id: "terminated",
          label: "Terminated",
          valueType: { type: "boolean" },
        },
        { id: "empty", label: "Empty", valueType: { type: "boolean" } },
        { id: "records", label: "Records", valueType: { type: "integer" } },
      ],
    },
  },
  calculate,
});
export const run = jsonLinesTerminalNewlineStateTool.execute;
export default jsonLinesTerminalNewlineStateTool;
