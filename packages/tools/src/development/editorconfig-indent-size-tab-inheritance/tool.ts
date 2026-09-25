import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly indentSize: string; readonly tabWidth: number };
export type Output = { readonly columns: number; readonly inherited: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    indentSize: { type: "string", maxLength: 8192 },
    tabWidth: { type: "integer", minimum: 1, maximum: 256 },
  },
  required: ["indentSize", "tabWidth"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { columns: { type: "integer" }, inherited: { type: "boolean" } },
  required: ["columns", "inherited"],
} as const;
/** Calculate editorconfig indent size tab inheritance from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { indentSize, tabWidth } = input;
  const compute = (): Output => {
    H.integer(tabWidth, 1, 256);
    H.domain(indentSize === "tab" || /^[1-9]\d*(?![\s\S])/.test(indentSize));
    const inherited = indentSize === "tab",
      columns = inherited ? tabWidth : Number(indentSize);
    H.integer(columns, 1, 256);
    return { columns, inherited };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { indentSize: "tab", tabWidth: 8 },
  output: { columns: 8, inherited: true },
} satisfies ToolExample<Input, Output>;
export const editorconfigIndentSizeTabInheritanceTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "development/editorconfig-indent-size-tab-inheritance",
      title: "EditorConfig Indent Size Tab Inheritance Tool",
      description:
        "Calculate editorconfig indent size tab inheritance from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          indentSize: { type: "string", maxLength: 8192 },
          tabWidth: { type: "integer", minimum: 1, maximum: 256 },
        },
        required: ["indentSize", "tabWidth"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          columns: { type: "integer" },
          inherited: { type: "boolean" },
        },
        required: ["columns", "inherited"],
      },
      ports: {
        inputs: [
          {
            id: "indentSize",
            label: "Indent Size",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "tabWidth",
            label: "Tab Width",
            required: true,
            valueType: { type: "integer" },
          },
        ],
        outputs: [
          { id: "columns", label: "Columns", valueType: { type: "integer" } },
          {
            id: "inherited",
            label: "Inherited",
            valueType: { type: "boolean" },
          },
        ],
      },
    },
    calculate,
  });
export const run = editorconfigIndentSizeTabInheritanceTool.execute;
export default editorconfigIndentSizeTabInheritanceTool;
