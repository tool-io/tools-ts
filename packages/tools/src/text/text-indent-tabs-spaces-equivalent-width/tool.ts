import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly indent: string;
  readonly tabWidth: number;
  readonly startColumn: number;
};
export type Output = { readonly columns: number; readonly endColumn: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    indent: { type: "string", maxLength: 8192 },
    tabWidth: { type: "integer", minimum: 1, maximum: 32 },
    startColumn: { type: "integer", minimum: 0 },
  },
  required: ["indent", "tabWidth", "startColumn"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { columns: { type: "integer" }, endColumn: { type: "integer" } },
  required: ["columns", "endColumn"],
} as const;
/** Calculate text indent tabs spaces equivalent width from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { indent, tabWidth, startColumn } = request;
  const compute = (): Output => {
    H.domain(/^[ \t]*(?![\s\S])/.test(indent));
    H.integer(tabWidth, 1, 32);
    H.integer(startColumn, 0);
    let endColumn = startColumn;
    for (const c of indent)
      endColumn += c === " " ? 1 : tabWidth - (endColumn % tabWidth);
    return { columns: endColumn - startColumn, endColumn };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { indent: " \t ", tabWidth: 4, startColumn: 0 },
  output: { columns: 5, endColumn: 5 },
} satisfies ToolExample<Input, Output>;
export const textIndentTabsSpacesEquivalentWidthTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "text/text-indent-tabs-spaces-equivalent-width",
      title: "Text Indent Tabs Spaces Equivalent Width Tool",
      description:
        "Calculate text indent tabs spaces equivalent width from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          indent: { type: "string", maxLength: 8192 },
          tabWidth: { type: "integer", minimum: 1, maximum: 32 },
          startColumn: { type: "integer", minimum: 0 },
        },
        required: ["indent", "tabWidth", "startColumn"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          columns: { type: "integer" },
          endColumn: { type: "integer" },
        },
        required: ["columns", "endColumn"],
      },
      ports: {
        inputs: [
          {
            id: "indent",
            label: "Indent",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "tabWidth",
            label: "Tab Width",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "startColumn",
            label: "Start Column",
            required: true,
            valueType: { type: "integer" },
          },
        ],
        outputs: [
          { id: "columns", label: "Columns", valueType: { type: "integer" } },
          {
            id: "endColumn",
            label: "End Column",
            valueType: { type: "integer" },
          },
        ],
      },
    },
    calculate,
  });
export const run = textIndentTabsSpacesEquivalentWidthTool.execute;
export default textIndentTabsSpacesEquivalentWidthTool;
