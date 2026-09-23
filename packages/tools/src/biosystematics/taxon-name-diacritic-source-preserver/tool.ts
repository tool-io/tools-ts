import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly name: string;
  readonly source: string;
  readonly edition: string;
};
export type Output = {
  readonly preserved: string;
  readonly sourceKey: string;
  readonly utf16Length: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    name: { type: "string", maxLength: 8192 },
    source: { type: "string", maxLength: 8192 },
    edition: { type: "string", maxLength: 8192 },
  },
  required: ["name", "source", "edition"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    preserved: { type: "string", maxLength: 8192 },
    sourceKey: { type: "string", maxLength: 8192 },
    utf16Length: { type: "integer" },
  },
  required: ["preserved", "sourceKey", "utf16Length"],
} as const;
/** Preserve source name spelling without removing diacritics or applying nomenclatural normalization. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { name, source, edition } = request;
  const compute = (): Output => {
    H.domain(name.length > 0 && source.length > 0 && edition.length > 0);
    return {
      preserved: name,
      sourceKey: JSON.stringify([source, edition, name]),
      utf16Length: name.length,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { name: "Aus böus", source: "catalog-A", edition: "v1" },
  output: {
    preserved: "Aus böus",
    sourceKey: '["catalog-A","v1","Aus böus"]',
    utf16Length: 8,
  },
} satisfies ToolExample<Input, Output>;
export const taxonNameDiacriticSourcePreserverTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "biosystematics/taxon-name-diacritic-source-preserver",
    title: "Taxon Name Diacritic Source Preserver Tool",
    description:
      "Preserve source name spelling without removing diacritics or applying nomenclatural normalization.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        name: { type: "string", maxLength: 8192 },
        source: { type: "string", maxLength: 8192 },
        edition: { type: "string", maxLength: 8192 },
      },
      required: ["name", "source", "edition"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        preserved: { type: "string", maxLength: 8192 },
        sourceKey: { type: "string", maxLength: 8192 },
        utf16Length: { type: "integer" },
      },
      required: ["preserved", "sourceKey", "utf16Length"],
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
          id: "source",
          label: "Source",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "edition",
          label: "Edition",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        { id: "preserved", label: "Preserved", valueType: { type: "string" } },
        { id: "sourceKey", label: "Source Key", valueType: { type: "string" } },
        {
          id: "utf16Length",
          label: "Utf16Length",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = taxonNameDiacriticSourcePreserverTool.execute;
export default taxonNameDiacriticSourcePreserverTool;
