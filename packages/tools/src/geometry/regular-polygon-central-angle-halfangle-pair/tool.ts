import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly sides: number };
export type Output = {
  readonly centralRadians: number;
  readonly halfRadians: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { sides: { type: "integer", minimum: 3 } },
  required: ["sides"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    centralRadians: { type: "number" },
    halfRadians: { type: "number" },
  },
  required: ["centralRadians", "halfRadians"],
} as const;
/** Calculate regular polygon central angle halfangle pair from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { sides } = input;
  const compute = (): Output => {
    H.integer(sides, 3);
    return {
      centralRadians: (2 * Math.PI) / sides,
      halfRadians: Math.PI / sides,
    };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { sides: 6 },
  output: {
    centralRadians: 1.0471975511965976,
    halfRadians: 0.5235987755982988,
  },
} satisfies ToolExample<Input, Output>;
export const regularPolygonCentralAngleHalfanglePairTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "geometry/regular-polygon-central-angle-halfangle-pair",
      title: "Regular Polygon Central Angle Halfangle Pair Tool",
      description:
        "Calculate regular polygon central angle halfangle pair from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { sides: { type: "integer", minimum: 3 } },
        required: ["sides"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          centralRadians: { type: "number" },
          halfRadians: { type: "number" },
        },
        required: ["centralRadians", "halfRadians"],
      },
      ports: {
        inputs: [
          {
            id: "sides",
            label: "Sides",
            required: true,
            valueType: { type: "integer" },
          },
        ],
        outputs: [
          {
            id: "centralRadians",
            label: "Central Radians",
            valueType: { type: "number" },
          },
          {
            id: "halfRadians",
            label: "Half Radians",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = regularPolygonCentralAngleHalfanglePairTool.execute;
export default regularPolygonCentralAngleHalfanglePairTool;
