import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = { readonly text: string };
export type Output = {
  readonly leading: boolean;
  readonly trailing: boolean;
  readonly interiorIndices: readonly number[];
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
    leading: { type: "boolean" },
    trailing: { type: "boolean" },
    interiorIndices: {
      type: "array",
      maxItems: 256,
      items: { type: "integer" },
    },
  },
  required: ["leading", "trailing", "interiorIndices"],
} as const;
/** Compute text leading trailing bom distinction from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { text } = input;
  const compute = (): Output => {
    return {
      leading: text.startsWith("\ufeff"),
      trailing: text.endsWith("\ufeff"),
      interiorIndices: Array.from({ length: text.length }, (_, i) => i).filter(
        (i) => i > 0 && i < text.length - 1 && text[i] === "\ufeff",
      ),
    };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { text: "﻿a﻿" },
  output: { leading: true, trailing: true, interiorIndices: [] },
} satisfies ToolExample<Input, Output>;
export const textLeadingTrailingBomDistinctionTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "text/text-leading-trailing-bom-distinction",
  title: "Text Leading Trailing BOM Distinction Tool",
  description:
    "Compute text leading trailing bom distinction from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
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
      { id: "leading", label: "Leading", valueType: { type: "boolean" } },
      { id: "trailing", label: "Trailing", valueType: { type: "boolean" } },
      {
        id: "interiorIndices",
        label: "Interior Indices",
        valueType: { type: "list", items: { type: "integer" } },
      },
    ],
  },
});
export const run = textLeadingTrailingBomDistinctionTool.execute;
export default textLeadingTrailingBomDistinctionTool;
