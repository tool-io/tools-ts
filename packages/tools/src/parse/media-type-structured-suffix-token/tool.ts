import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly subtype: string };
export type Output = {
  readonly base: string;
  readonly suffix: string;
  readonly present: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { subtype: { type: "string", maxLength: 8192 } },
  required: ["subtype"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    base: { type: "string", maxLength: 8192 },
    suffix: { type: "string", maxLength: 8192 },
    present: { type: "boolean" },
  },
  required: ["base", "suffix", "present"],
} as const;
/** Calculate media type structured suffix token from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { subtype } = request;
  const compute = (): Output => {
    H.domain(/^[A-Za-z0-9!#$&^_.+-]+(?![\s\S])/.test(subtype));
    const i = subtype.lastIndexOf("+");
    H.domain(i !== 0 && i !== subtype.length - 1);
    return {
      base: i < 0 ? subtype : subtype.slice(0, i),
      suffix: i < 0 ? "" : subtype.slice(i + 1),
      present: i >= 0,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { subtype: "problem+json" },
  output: { base: "problem", suffix: "json", present: true },
} satisfies ToolExample<Input, Output>;
export const mediaTypeStructuredSuffixTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "parse/media-type-structured-suffix-token",
    title: "Media Type Structured Suffix Token Tool",
    description:
      "Calculate media type structured suffix token from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { subtype: { type: "string", maxLength: 8192 } },
      required: ["subtype"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        base: { type: "string", maxLength: 8192 },
        suffix: { type: "string", maxLength: 8192 },
        present: { type: "boolean" },
      },
      required: ["base", "suffix", "present"],
    },
    ports: {
      inputs: [
        {
          id: "subtype",
          label: "Subtype",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        { id: "base", label: "Base", valueType: { type: "string" } },
        { id: "suffix", label: "Suffix", valueType: { type: "string" } },
        { id: "present", label: "Present", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = mediaTypeStructuredSuffixTokenTool.execute;
export default mediaTypeStructuredSuffixTokenTool;
