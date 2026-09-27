import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly latitude: number };
export type Output = {
  readonly west: readonly number[];
  readonly east: readonly number[];
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { latitude: { type: "number", minimum: -90, maximum: 90 } },
  required: ["latitude"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    west: { type: "array", maxItems: 256, items: { type: "number" } },
    east: { type: "array", maxItems: 256, items: { type: "number" } },
  },
  required: ["west", "east"],
} as const;
/** Calculate geographic point antimeridian alias pair from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { latitude } = input;
  const compute = (): Output => {
    H.domain(latitude >= -90 && latitude <= 90);
    return { west: [-180, latitude], east: [180, latitude] };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { latitude: 45 },
  output: { west: [-180, 45], east: [180, 45] },
} satisfies ToolExample<Input, Output>;
export const geographicPointAntimeridianAliasPairTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "geography/geographic-point-antimeridian-alias-pair",
      title: "Geographic Point Antimeridian Alias Pair Tool",
      description:
        "Calculate geographic point antimeridian alias pair from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { latitude: { type: "number", minimum: -90, maximum: 90 } },
        required: ["latitude"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          west: { type: "array", maxItems: 256, items: { type: "number" } },
          east: { type: "array", maxItems: 256, items: { type: "number" } },
        },
        required: ["west", "east"],
      },
      ports: {
        inputs: [
          {
            id: "latitude",
            label: "Latitude",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "west",
            label: "West",
            valueType: { type: "list", items: { type: "number" } },
          },
          {
            id: "east",
            label: "East",
            valueType: { type: "list", items: { type: "number" } },
          },
        ],
      },
    },
    calculate,
  });
export const run = geographicPointAntimeridianAliasPairTool.execute;
export default geographicPointAntimeridianAliasPairTool;
