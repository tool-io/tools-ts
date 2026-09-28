import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  domain,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = {
  readonly coordinates: readonly number[];
  readonly keepAltitude: boolean;
};
export type Output = {
  readonly coordinates: readonly number[];
  readonly removed: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    coordinates: { type: "array", maxItems: 256, items: { type: "number" } },
    keepAltitude: { type: "boolean" },
  },
  required: ["coordinates", "keepAltitude"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    coordinates: { type: "array", maxItems: 256, items: { type: "number" } },
    removed: { type: "integer" },
  },
  required: ["coordinates", "removed"],
} as const;
/** Compute point coordinate extra ordinate policy from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { coordinates, keepAltitude } = input;
  const compute = (): Output => {
    domain(coordinates.length >= 2);
    const count = keepAltitude ? Math.min(3, coordinates.length) : 2;
    return {
      coordinates: coordinates.slice(0, count),
      removed: coordinates.length - count,
    };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { coordinates: [10, 20, 30, 40], keepAltitude: true },
  output: { coordinates: [10, 20, 30], removed: 1 },
} satisfies ToolExample<Input, Output>;
export const pointCoordinateExtraOrdinatePolicyTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "geojson/point-coordinate-extra-ordinate-policy",
  title: "Point Coordinate Extra Ordinate Policy Tool",
  description:
    "Compute point coordinate extra ordinate policy from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "coordinates",
        label: "Coordinates",
        required: true,
        valueType: { type: "list", items: { type: "number" } },
      },
      {
        id: "keepAltitude",
        label: "Keep Altitude",
        required: true,
        valueType: { type: "boolean" },
      },
    ],
    outputs: [
      {
        id: "coordinates",
        label: "Coordinates",
        valueType: { type: "list", items: { type: "number" } },
      },
      { id: "removed", label: "Removed", valueType: { type: "integer" } },
    ],
  },
});
export const run = pointCoordinateExtraOrdinatePolicyTool.execute;
export default pointCoordinateExtraOrdinatePolicyTool;
