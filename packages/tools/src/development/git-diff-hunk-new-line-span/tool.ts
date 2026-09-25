import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly header: string };
export type Output = {
  readonly start: number;
  readonly count: number;
  readonly endExclusive: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { header: { type: "string", maxLength: 8192 } },
  required: ["header"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    start: { type: "integer" },
    count: { type: "integer" },
    endExclusive: { type: "integer" },
  },
  required: ["start", "count", "endExclusive"],
} as const;
/** Calculate git diff hunk new line span from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { header } = input;
  const compute = (): Output => {
    const r = /^@@ -\d+(?:,\d+)? \+(\d+)(?:,(\d+))? @@(?: .*|)(?![\s\S])/.exec(
      header,
    );
    H.domain(r !== null);
    const start = Number(r[1]),
      count = Number(r[2] ?? "1");
    H.integer(start, 0);
    H.integer(count, 0);
    return { start, count, endExclusive: start + count };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { header: "@@ -1,3 +5,4 @@" },
  output: { start: 5, count: 4, endExclusive: 9 },
} satisfies ToolExample<Input, Output>;
export const gitDiffHunkNewLineSpanTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "development/git-diff-hunk-new-line-span",
    title: "Git Diff Hunk New Line Span Tool",
    description:
      "Calculate git diff hunk new line span from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { header: { type: "string", maxLength: 8192 } },
      required: ["header"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        start: { type: "integer" },
        count: { type: "integer" },
        endExclusive: { type: "integer" },
      },
      required: ["start", "count", "endExclusive"],
    },
    ports: {
      inputs: [
        {
          id: "header",
          label: "Header",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        { id: "start", label: "Start", valueType: { type: "integer" } },
        { id: "count", label: "Count", valueType: { type: "integer" } },
        {
          id: "endExclusive",
          label: "End Exclusive",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = gitDiffHunkNewLineSpanTool.execute;
export default gitDiffHunkNewLineSpanTool;
