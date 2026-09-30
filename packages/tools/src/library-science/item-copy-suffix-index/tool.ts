import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly label: string; readonly separator: string };
export type Output = { readonly base: string; readonly copyIndex: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    label: { type: "string", maxLength: 8192 },
    separator: { type: "string", maxLength: 8192 },
  },
  required: ["label", "separator"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    base: { type: "string", maxLength: 8192 },
    copyIndex: { type: "integer" },
  },
  required: ["base", "copyIndex"],
} as const;
/** Calculate item copy suffix index from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { label, separator } = request;
  const compute = (): Output => {
    H.domain(separator.length > 0);
    const i = label.lastIndexOf(separator);
    H.domain(i > 0);
    const suffix = label.slice(i + separator.length);
    H.domain(/^[1-9]\d*(?![\s\S])/.test(suffix));
    const copyIndex = Number(suffix);
    H.integer(copyIndex, 1);
    return { base: label.slice(0, i), copyIndex };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { label: "BOOK/c3", separator: "/c" },
  output: { base: "BOOK", copyIndex: 3 },
} satisfies ToolExample<Input, Output>;
export const itemCopySuffixIndexTool = H.defineSchemaCalculation<Input, Output>(
  {
    ...{
      id: "library-science/item-copy-suffix-index",
      title: "Item Copy Suffix Index Tool",
      description:
        "Calculate item copy suffix index from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          label: { type: "string", maxLength: 8192 },
          separator: { type: "string", maxLength: 8192 },
        },
        required: ["label", "separator"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          base: { type: "string", maxLength: 8192 },
          copyIndex: { type: "integer" },
        },
        required: ["base", "copyIndex"],
      },
      ports: {
        inputs: [
          {
            id: "label",
            label: "Label",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "separator",
            label: "Separator",
            required: true,
            valueType: { type: "string" },
          },
        ],
        outputs: [
          { id: "base", label: "Base", valueType: { type: "string" } },
          {
            id: "copyIndex",
            label: "Copy Index",
            valueType: { type: "integer" },
          },
        ],
      },
    },
    calculate,
  },
);
export const run = itemCopySuffixIndexTool.execute;
export default itemCopySuffixIndexTool;
