import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly notation: string; readonly datatypeIri: string };
export type Output = { readonly typedIdentity: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    notation: { type: "string", maxLength: 8192 },
    datatypeIri: { type: "string", maxLength: 8192 },
  },
  required: ["notation", "datatypeIri"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { typedIdentity: { type: "string", maxLength: 8192 } },
  required: ["typedIdentity"],
} as const;
/** Lossless SKOS notation lexical-form/datatype tuple; notation is not coerced to a number. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { notation, datatypeIri } = request;
  const compute = (): Output => {
    H.domain(
      notation.length > 0 && /^[A-Za-z][A-Za-z0-9+.-]*:/.test(datatypeIri),
    );
    return { typedIdentity: JSON.stringify([notation, datatypeIri]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { notation: "001.2", datatypeIri: "urn:example:classification" },
  output: { typedIdentity: '["001.2","urn:example:classification"]' },
} satisfies ToolExample<Input, Output>;
export const skosNotationDatatypeLiteralPairTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "information-science/skos-notation-datatype-literal-pair",
    title: "SKOS Notation Datatype Literal Pair Tool",
    description:
      "Lossless SKOS notation lexical-form/datatype tuple; notation is not coerced to a number.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        notation: { type: "string", maxLength: 8192 },
        datatypeIri: { type: "string", maxLength: 8192 },
      },
      required: ["notation", "datatypeIri"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { typedIdentity: { type: "string", maxLength: 8192 } },
      required: ["typedIdentity"],
    },
    ports: {
      inputs: [
        {
          id: "notation",
          label: "Notation",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "datatypeIri",
          label: "Datatype Iri",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "typedIdentity",
          label: "Typed Identity",
          valueType: { type: "string" },
        },
      ],
    },
  },
  calculate,
});
export const run = skosNotationDatatypeLiteralPairTool.execute;
export default skosNotationDatatypeLiteralPairTool;
