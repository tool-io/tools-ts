import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly scalar: number };
export type Output = {
  readonly tag: boolean;
  readonly ascii: number;
  readonly cancel: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { scalar: { type: "integer" } },
  required: ["scalar"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    tag: { type: "boolean" },
    ascii: { type: "integer" },
    cancel: { type: "boolean" },
  },
  required: ["tag", "ascii", "cancel"],
} as const;
/** Calculate unicode tag character value from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { scalar } = request;
  const compute = (): Output => {
    H.codePoint(scalar);
    const tag = scalar >= 917536 && scalar <= 917630;
    return { tag, ascii: tag ? scalar - 917504 : 0, cancel: scalar === 917631 };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { scalar: 917601 },
  output: { tag: true, ascii: 97, cancel: false },
} satisfies ToolExample<Input, Output>;
export const unicodeTagCharacterValueTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "text/unicode-tag-character-value",
    title: "Unicode Tag Character Value Tool",
    description:
      "Calculate unicode tag character value from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { scalar: { type: "integer" } },
      required: ["scalar"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        tag: { type: "boolean" },
        ascii: { type: "integer" },
        cancel: { type: "boolean" },
      },
      required: ["tag", "ascii", "cancel"],
    },
    ports: {
      inputs: [
        {
          id: "scalar",
          label: "Scalar",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "tag", label: "Tag", valueType: { type: "boolean" } },
        { id: "ascii", label: "Ascii", valueType: { type: "integer" } },
        { id: "cancel", label: "Cancel", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = unicodeTagCharacterValueTool.execute;
export default unicodeTagCharacterValueTool;
