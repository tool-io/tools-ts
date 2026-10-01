import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly name: string;
  readonly source: string;
  readonly series: string;
};
export type Output = { readonly key: string; readonly nameLength: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    name: { type: "string", maxLength: 8192 },
    source: { type: "string", maxLength: 8192 },
    series: { type: "string", maxLength: 8192 },
  },
  required: ["name", "source", "series"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    key: { type: "string", maxLength: 8192 },
    nameLength: { type: "integer" },
  },
  required: ["key", "nameLength"],
} as const;
/** Preserve a supplied public archive unit-name token and provenance without operational interpretation. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { name, source, series } = request;
  const compute = (): Output => {
    return {
      key: JSON.stringify([source, series, name]),
      nameLength: [...name].length,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { name: "unit-A", source: "museum", series: "series-2" },
  output: { key: '["museum","series-2","unit-A"]', nameLength: 6 },
} satisfies ToolExample<Input, Output>;
export const archiveUnitNameTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "military-science/archive-unit-name-token",
    title: "Archive Unit Name Token Tool",
    description:
      "Preserve a supplied public archive unit-name token and provenance without operational interpretation.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        name: { type: "string", maxLength: 8192 },
        source: { type: "string", maxLength: 8192 },
        series: { type: "string", maxLength: 8192 },
      },
      required: ["name", "source", "series"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        key: { type: "string", maxLength: 8192 },
        nameLength: { type: "integer" },
      },
      required: ["key", "nameLength"],
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
          id: "series",
          label: "Series",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        { id: "key", label: "Key", valueType: { type: "string" } },
        {
          id: "nameLength",
          label: "Name Length",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = archiveUnitNameTokenTool.execute;
export default archiveUnitNameTokenTool;
