import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly position: readonly number[] };
export type Output = { readonly geometryJson: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    position: { type: "array", maxItems: 256, items: { type: "number" } },
  },
  required: ["position"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { geometryJson: { type: "string", maxLength: 8192 } },
  required: ["geometryJson"],
} as const;
/** Calculate multi point single position wrapper from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { position } = input;
  const compute = (): Output => {
    H.domain(position.length >= 2);
    return {
      geometryJson: JSON.stringify({
        type: "MultiPoint",
        coordinates: [position],
      }),
    };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { position: [12, 34] },
  output: { geometryJson: '{"type":"MultiPoint","coordinates":[[12,34]]}' },
} satisfies ToolExample<Input, Output>;
export const multiPointSinglePositionWrapperTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "geojson/multi-point-single-position-wrapper",
    title: "Multi Point Single Position Wrapper Tool",
    description:
      "Calculate multi point single position wrapper from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        position: { type: "array", maxItems: 256, items: { type: "number" } },
      },
      required: ["position"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { geometryJson: { type: "string", maxLength: 8192 } },
      required: ["geometryJson"],
    },
    ports: {
      inputs: [
        {
          id: "position",
          label: "Position",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
      ],
      outputs: [
        {
          id: "geometryJson",
          label: "Geometry Json",
          valueType: { type: "string" },
        },
      ],
    },
  },
  calculate,
});
export const run = multiPointSinglePositionWrapperTool.execute;
export default multiPointSinglePositionWrapperTool;
