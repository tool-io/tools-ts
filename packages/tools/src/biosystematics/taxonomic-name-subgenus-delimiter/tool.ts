import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly name: string };
export type Output = {
  readonly genus: string;
  readonly subgenus: string;
  readonly epithet: string;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { name: { type: "string", maxLength: 8192 } },
  required: ["name"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    genus: { type: "string", maxLength: 8192 },
    subgenus: { type: "string", maxLength: 8192 },
    epithet: { type: "string", maxLength: 8192 },
  },
  required: ["genus", "subgenus", "epithet"],
} as const;
/** Parse an explicitly parenthesized subgenus in a documented ASCII name subset. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { name } = request;
  const compute = (): Output => {
    const match =
      /^([A-Z][a-z]+) \(([A-Z][a-z]+)\) ([a-z][a-z-]+)(?![\s\S])/.exec(name);
    H.domain(match, "name");
    return { genus: match[1], subgenus: match[2], epithet: match[3] };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { name: "Aus (Bus) cus" },
  output: { genus: "Aus", subgenus: "Bus", epithet: "cus" },
} satisfies ToolExample<Input, Output>;
export const taxonomicNameSubgenusDelimiterTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "biosystematics/taxonomic-name-subgenus-delimiter",
    title: "Taxonomic Name Subgenus Delimiter Tool",
    description:
      "Parse an explicitly parenthesized subgenus in a documented ASCII name subset.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { name: { type: "string", maxLength: 8192 } },
      required: ["name"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        genus: { type: "string", maxLength: 8192 },
        subgenus: { type: "string", maxLength: 8192 },
        epithet: { type: "string", maxLength: 8192 },
      },
      required: ["genus", "subgenus", "epithet"],
    },
    ports: {
      inputs: [
        {
          id: "name",
          label: "Name",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        { id: "genus", label: "Genus", valueType: { type: "string" } },
        { id: "subgenus", label: "Subgenus", valueType: { type: "string" } },
        { id: "epithet", label: "Epithet", valueType: { type: "string" } },
      ],
    },
  },
  calculate,
});
export const run = taxonomicNameSubgenusDelimiterTool.execute;
export default taxonomicNameSubgenusDelimiterTool;
