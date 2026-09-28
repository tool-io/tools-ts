import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly radius: number; readonly sides: number };
export type Output = { readonly sagitta: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    radius: { type: "number", exclusiveMinimum: 0 },
    sides: { type: "integer", minimum: 3 },
  },
  required: ["radius", "sides"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { sagitta: { type: "number" } },
  required: ["sagitta"],
} as const;
/** Calculate regular polygon side sagitta from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { radius, sides } = input;
  const compute = (): Output => {
    H.positive(radius);
    H.integer(sides, 3);
    return { sagitta: 2 * radius * Math.sin(Math.PI / (2 * sides)) ** 2 };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { radius: 2, sides: 3 },
  output: { sagitta: 0.9999999999999998 },
} satisfies ToolExample<Input, Output>;
export const regularPolygonSideSagittaTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "geometry/regular-polygon-side-sagitta",
    title: "Regular Polygon Side Sagitta Tool",
    description:
      "Calculate regular polygon side sagitta from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        radius: { type: "number", exclusiveMinimum: 0 },
        sides: { type: "integer", minimum: 3 },
      },
      required: ["radius", "sides"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { sagitta: { type: "number" } },
      required: ["sagitta"],
    },
    ports: {
      inputs: [
        {
          id: "radius",
          label: "Radius",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "sides",
          label: "Sides",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "sagitta", label: "Sagitta", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = regularPolygonSideSagittaTool.execute;
export default regularPolygonSideSagittaTool;
