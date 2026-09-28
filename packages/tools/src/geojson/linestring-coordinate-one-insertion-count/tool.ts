import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly count: number; readonly index: number };
export type Output = { readonly newCount: number; readonly endpoint: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    count: { type: "integer", minimum: 2 },
    index: { type: "integer", minimum: 0 },
  },
  required: ["count", "index"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { newCount: { type: "integer" }, endpoint: { type: "boolean" } },
  required: ["newCount", "endpoint"],
} as const;
/** Calculate linestring coordinate one insertion count from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { count, index } = input;
  const compute = (): Output => {
    H.integer(count, 2);
    H.integer(index, 0, count);
    return { newCount: count + 1, endpoint: index === 0 || index === count };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { count: 4, index: 2 },
  output: { newCount: 5, endpoint: false },
} satisfies ToolExample<Input, Output>;
export const linestringCoordinateOneInsertionCountTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "geojson/linestring-coordinate-one-insertion-count",
      title: "Linestring Coordinate One Insertion Count Tool",
      description:
        "Calculate linestring coordinate one insertion count from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          count: { type: "integer", minimum: 2 },
          index: { type: "integer", minimum: 0 },
        },
        required: ["count", "index"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          newCount: { type: "integer" },
          endpoint: { type: "boolean" },
        },
        required: ["newCount", "endpoint"],
      },
      ports: {
        inputs: [
          {
            id: "count",
            label: "Count",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "index",
            label: "Index",
            required: true,
            valueType: { type: "integer" },
          },
        ],
        outputs: [
          {
            id: "newCount",
            label: "New Count",
            valueType: { type: "integer" },
          },
          { id: "endpoint", label: "Endpoint", valueType: { type: "boolean" } },
        ],
      },
    },
    calculate,
  });
export const run = linestringCoordinateOneInsertionCountTool.execute;
export default linestringCoordinateOneInsertionCountTool;
