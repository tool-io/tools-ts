import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly reference: string; readonly separator: string };
export type Output = { readonly locus: string; readonly lineToken: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    reference: { type: "string", maxLength: 8192 },
    separator: { type: "string", maxLength: 8192 },
  },
  required: ["reference", "separator"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    locus: { type: "string", maxLength: 8192 },
    lineToken: { type: "string", maxLength: 8192 },
  },
  required: ["locus", "lineToken"],
} as const;
/** Split a supplied textual locus/line reference without parsing XML or imposing an edition grammar. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { reference, separator } = request;
  const compute = (): Output => {
    H.domain(separator.length > 0);
    const i = reference.lastIndexOf(separator);
    H.domain(i > 0 && i + separator.length < reference.length);
    return {
      locus: reference.slice(0, i),
      lineToken: reference.slice(i + separator.length),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { reference: "f12r:l3", separator: ":" },
  output: { locus: "f12r", lineToken: "l3" },
} satisfies ToolExample<Input, Output>;
export const teiLocusLineTokenTool = H.defineSchemaCalculation<Input, Output>({
  ...{
    id: "digital-humanities/tei-locus-line-token",
    title: "TEI Locus Line Token Tool",
    description:
      "Split a supplied textual locus/line reference without parsing XML or imposing an edition grammar.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        reference: { type: "string", maxLength: 8192 },
        separator: { type: "string", maxLength: 8192 },
      },
      required: ["reference", "separator"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        locus: { type: "string", maxLength: 8192 },
        lineToken: { type: "string", maxLength: 8192 },
      },
      required: ["locus", "lineToken"],
    },
    ports: {
      inputs: [
        {
          id: "reference",
          label: "Reference",
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
        { id: "locus", label: "Locus", valueType: { type: "string" } },
        { id: "lineToken", label: "Line Token", valueType: { type: "string" } },
      ],
    },
  },
  calculate,
});
export const run = teiLocusLineTokenTool.execute;
export default teiLocusLineTokenTool;
