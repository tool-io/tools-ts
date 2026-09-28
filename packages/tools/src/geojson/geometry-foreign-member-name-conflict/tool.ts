import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly name: string };
export type Output = { readonly reserved: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    name: {
      type: "string",
      maxLength: 8192,
    },
  },
  required: ["name"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { reserved: { type: "boolean" } },
  required: ["reserved"],
} as const;
/** Calculate geometry foreign member name conflict from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { name } = input;
  const compute = (): Output => {
    return {
      reserved: [
        "type",
        "coordinates",
        "geometries",
        "bbox",
        "geometry",
        "properties",
        "features",
      ].includes(name),
    };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { name: "coordinates" },
  output: { reserved: true },
} satisfies ToolExample<Input, Output>;
export const geometryForeignMemberNameConflictTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "geojson/geometry-foreign-member-name-conflict",
    title: "Geometry Foreign Member Name Conflict Tool",
    description:
      "Calculate geometry foreign member name conflict from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        name: {
          type: "string",
          maxLength: 8192,
        },
      },
      required: ["name"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { reserved: { type: "boolean" } },
      required: ["reserved"],
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
        { id: "reserved", label: "Reserved", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = geometryForeignMemberNameConflictTool.execute;
export default geometryForeignMemberNameConflictTool;
