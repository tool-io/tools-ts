import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly sourceTerm: string;
  readonly variantTerm: string;
  readonly sourceReference: string;
};
export type Output = { readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sourceTerm: { type: "string", maxLength: 8192, minLength: 1 },
    variantTerm: { type: "string", maxLength: 8192, minLength: 1 },
    sourceReference: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["sourceTerm", "variantTerm", "sourceReference"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { label: { type: "string", maxLength: 8192 } },
  required: ["label"],
} as const;
/** Pair explicitly supplied theoretical-term variants with a source reference without asserting conceptual equivalence. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { sourceTerm, variantTerm, sourceReference } = request;
  const compute = (): Output => {
    H.domain(
      sourceTerm.length > 0 &&
        variantTerm.length > 0 &&
        sourceReference.length > 0,
      "sourceTerm",
    );
    return {
      label:
        JSON.stringify(sourceTerm) +
        " / " +
        JSON.stringify(variantTerm) +
        " [" +
        sourceReference +
        "]",
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    sourceTerm: "term A",
    variantTerm: "variant A",
    sourceReference: "Text 17",
  },
  output: { label: '"term A" / "variant A" [Text 17]' },
} satisfies ToolExample<Input, Output>;
export const theoreticalTermSourceVariantPairTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["critical-theory", "critical theory", "humanities"],
      keywords: ["critical theory", "humanities"],
    },
    id: "critical-theory/theoretical-term-source-variant-pair",
    title: "Theoretical Term Source Variant Pair",
    description:
      "Pair explicitly supplied theoretical-term variants with a source reference without asserting conceptual equivalence.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        sourceTerm: { type: "string", maxLength: 8192, minLength: 1 },
        variantTerm: { type: "string", maxLength: 8192, minLength: 1 },
        sourceReference: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["sourceTerm", "variantTerm", "sourceReference"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { label: { type: "string", maxLength: 8192 } },
      required: ["label"],
    },
    ports: {
      inputs: [
        {
          id: "sourceTerm",
          label: "Source Term",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "variantTerm",
          label: "Variant Term",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "sourceReference",
          label: "Source Reference",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "label", label: "Label", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = theoreticalTermSourceVariantPairTool.execute;
export default theoreticalTermSourceVariantPairTool;
