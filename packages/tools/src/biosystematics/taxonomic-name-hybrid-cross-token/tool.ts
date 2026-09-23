import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly name: string; readonly separator: string };
export type Output = { readonly first: string; readonly second: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    name: { type: "string", maxLength: 8192 },
    separator: { type: "string", maxLength: 8192 },
  },
  required: ["name", "separator"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    first: { type: "string", maxLength: 8192 },
    second: { type: "string", maxLength: 8192 },
  },
  required: ["first", "second"],
} as const;
/** Split one explicit hybrid-cross label without inferring parentage. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { name, separator } = request;
  const compute = (): Output => {
    H.domain(separator === " × " || separator === " x ", "separator");
    const parts = name.split(separator);
    H.domain(parts.length === 2 && parts.every((x) => x.length > 0), "name");
    return { first: parts[0], second: parts[1] };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { name: "Aus bus × Cus dus", separator: " × " },
  output: { first: "Aus bus", second: "Cus dus" },
} satisfies ToolExample<Input, Output>;
export const taxonomicNameHybridCrossTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "biosystematics/taxonomic-name-hybrid-cross-token",
    title: "Taxonomic Name Hybrid Cross Token Tool",
    description:
      "Split one explicit hybrid-cross label without inferring parentage.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        name: { type: "string", maxLength: 8192 },
        separator: { type: "string", maxLength: 8192 },
      },
      required: ["name", "separator"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        first: { type: "string", maxLength: 8192 },
        second: { type: "string", maxLength: 8192 },
      },
      required: ["first", "second"],
    },
    ports: {
      inputs: [
        {
          id: "name",
          label: "Name",
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
        { id: "first", label: "First", valueType: { type: "string" } },
        { id: "second", label: "Second", valueType: { type: "string" } },
      ],
    },
  },
  calculate,
});
export const run = taxonomicNameHybridCrossTokenTool.execute;
export default taxonomicNameHybridCrossTokenTool;
