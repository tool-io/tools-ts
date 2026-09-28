import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly position: readonly number[];
  readonly indexes: readonly number[];
};
export type Output = { readonly position: readonly number[] };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    position: { type: "array", maxItems: 256, items: { type: "number" } },
    indexes: { type: "array", maxItems: 256, items: { type: "integer" } },
  },
  required: ["position", "indexes"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    position: { type: "array", maxItems: 256, items: { type: "number" } },
  },
  required: ["position"],
} as const;
/** Calculate coordinate position ordinate projection from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { position, indexes } = request;
  const compute = (): Output => {
    H.domain(position.length >= 2 && indexes.length >= 2);
    indexes.forEach((i) => H.integer(i, 0, position.length - 1));
    return { position: indexes.map((i) => position[i]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { position: [12, 34, 5], indexes: [0, 1] },
  output: { position: [12, 34] },
} satisfies ToolExample<Input, Output>;
export const coordinatePositionOrdinateProjectionTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "geojson/coordinate-position-ordinate-projection",
      title: "Coordinate Position Ordinate Projection Tool",
      description:
        "Calculate coordinate position ordinate projection from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          position: { type: "array", maxItems: 256, items: { type: "number" } },
          indexes: { type: "array", maxItems: 256, items: { type: "integer" } },
        },
        required: ["position", "indexes"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          position: { type: "array", maxItems: 256, items: { type: "number" } },
        },
        required: ["position"],
      },
      ports: {
        inputs: [
          {
            id: "position",
            label: "Position",
            required: true,
            valueType: { type: "list", items: { type: "number" } },
          },
          {
            id: "indexes",
            label: "Indexes",
            required: true,
            valueType: { type: "list", items: { type: "integer" } },
          },
        ],
        outputs: [
          {
            id: "position",
            label: "Position",
            valueType: { type: "list", items: { type: "number" } },
          },
        ],
      },
    },
    calculate,
  });
export const run = coordinatePositionOrdinateProjectionTool.execute;
export default coordinatePositionOrdinateProjectionTool;
