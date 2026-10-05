import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly text: string };
export type Output = { readonly layoutValid: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { text: { type: "string", maxLength: 8192 } },
  required: ["text"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { layoutValid: { type: "boolean" } },
  required: ["layoutValid"],
} as const;
/** Check only the printed ISSN eight-character layout with a hyphen after digit four; this does not validate the checksum. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { text } = request;
  const compute = (): Output => {
    return { layoutValid: /^[0-9]{4}-[0-9]{3}[0-9X](?![\s\S])/.test(text) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { text: "1234-567X" },
  output: { layoutValid: true },
} satisfies ToolExample<Input, Output>;
export const issnHyphenPositionCheckTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "validate/issn-hyphen-position-check",
    title: "ISSN Hyphen Position Check Tool",
    description:
      "Check only the printed ISSN eight-character layout with a hyphen after digit four; this does not validate the checksum.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { text: { type: "string", maxLength: 8192 } },
      required: ["text"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { layoutValid: { type: "boolean" } },
      required: ["layoutValid"],
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
          id: "layoutValid",
          label: "Layout Valid",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = issnHyphenPositionCheckTool.execute;
export default issnHyphenPositionCheckTool;
