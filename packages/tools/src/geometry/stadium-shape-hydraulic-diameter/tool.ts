import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly radius: number;
  readonly straightLength: number;
};
export type Output = { readonly diameter: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    radius: { type: "number", exclusiveMinimum: 0 },
    straightLength: { type: "number", minimum: 0 },
  },
  required: ["radius", "straightLength"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { diameter: { type: "number" } },
  required: ["diameter"],
} as const;
/** Calculate stadium shape hydraulic diameter from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { radius, straightLength } = input;
  const compute = (): Output => {
    H.positive(radius);
    H.domain(straightLength >= 0);
    return {
      diameter:
        (4 * (Math.PI * radius * radius + 2 * radius * straightLength)) /
        (2 * Math.PI * radius + 2 * straightLength),
    };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { radius: 2, straightLength: 0 },
  output: { diameter: 4 },
} satisfies ToolExample<Input, Output>;
export const stadiumShapeHydraulicDiameterTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "geometry/stadium-shape-hydraulic-diameter",
    title: "Stadium Shape Hydraulic Diameter Tool",
    description:
      "Calculate stadium shape hydraulic diameter from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        radius: { type: "number", exclusiveMinimum: 0 },
        straightLength: { type: "number", minimum: 0 },
      },
      required: ["radius", "straightLength"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { diameter: { type: "number" } },
      required: ["diameter"],
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
          id: "straightLength",
          label: "Straight Length",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "diameter", label: "Diameter", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = stadiumShapeHydraulicDiameterTool.execute;
export default stadiumShapeHydraulicDiameterTool;
