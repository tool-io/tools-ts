import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly lexical: string; readonly datatype: string };
export type Output = { readonly valid: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    lexical: { type: "string", maxLength: 8192 },
    datatype: {
      type: "string",
      maxLength: 8192,
      enum: ["integer", "decimal", "boolean"],
    },
  },
  required: ["lexical", "datatype"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { valid: { type: "boolean" } },
  required: ["valid"],
} as const;
/** Lexical-shape check for selected XML Schema integer, decimal and boolean primitives; preserves lexical spelling and does not apply a whitespace facet. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { lexical, datatype } = request;
  const compute = (): Output => {
    H.domain(["integer", "decimal", "boolean"].includes(datatype));
    const valid =
      datatype === "integer"
        ? /^[+-]?\d+(?![\s\S])/.test(lexical)
        : datatype === "decimal"
          ? /^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?![\s\S])/.test(lexical)
          : ["true", "false", "1", "0"].includes(lexical);
    return { valid };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { lexical: "1e3", datatype: "decimal" },
  output: { valid: false },
} satisfies ToolExample<Input, Output>;
export const rdfDatatypeLexicalBoundaryCheckTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "information-science/rdf-datatype-lexical-boundary-check",
    title: "RDF Datatype Lexical Boundary Check Tool",
    description:
      "Lexical-shape check for selected XML Schema integer, decimal and boolean primitives; preserves lexical spelling and does not apply a whitespace facet.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        lexical: { type: "string", maxLength: 8192 },
        datatype: {
          type: "string",
          maxLength: 8192,
          enum: ["integer", "decimal", "boolean"],
        },
      },
      required: ["lexical", "datatype"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { valid: { type: "boolean" } },
      required: ["valid"],
    },
    ports: {
      inputs: [
        {
          id: "lexical",
          label: "Lexical",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "datatype",
          label: "Datatype",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        { id: "valid", label: "Valid", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = rdfDatatypeLexicalBoundaryCheckTool.execute;
export default rdfDatatypeLexicalBoundaryCheckTool;
