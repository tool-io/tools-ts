import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  codePoint,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = { readonly point: number };
export type Output = {
  readonly selector: boolean;
  readonly supplementary: boolean;
  readonly ordinal: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { point: { type: "integer" } },
  required: ["point"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    selector: { type: "boolean" },
    supplementary: { type: "boolean" },
    ordinal: { type: "integer" },
  },
  required: ["selector", "supplementary", "ordinal"],
} as const;
/** Compute unicode variation selector code point tag from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { point } = input;
  const compute = (): Output => {
    codePoint(point);
    const basic = point >= 0xfe00 && point <= 0xfe0f,
      supplementary = point >= 0xe0100 && point <= 0xe01ef;
    return {
      selector: basic || supplementary,
      supplementary,
      ordinal: basic
        ? point - 0xfe00 + 1
        : supplementary
          ? point - 0xe0100 + 17
          : 0,
    };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { point: 65039 },
  output: { selector: true, supplementary: false, ordinal: 16 },
} satisfies ToolExample<Input, Output>;
export const unicodeVariationSelectorCodePointTagTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "text/unicode-variation-selector-code-point-tag",
  title: "Unicode Variation Selector Code Point Tag Tool",
  description:
    "Compute unicode variation selector code point tag from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "point",
        label: "Point",
        required: true,
        valueType: { type: "integer" },
      },
    ],
    outputs: [
      { id: "selector", label: "Selector", valueType: { type: "boolean" } },
      {
        id: "supplementary",
        label: "Supplementary",
        valueType: { type: "boolean" },
      },
      { id: "ordinal", label: "Ordinal", valueType: { type: "integer" } },
    ],
  },
});
export const run = unicodeVariationSelectorCodePointTagTool.execute;
export default unicodeVariationSelectorCodePointTagTool;
