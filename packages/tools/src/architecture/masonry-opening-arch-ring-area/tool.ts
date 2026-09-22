import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly innerRadius: number;
  readonly thickness: number;
  readonly angleRadians: number;
};
export type Output = { readonly area: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    innerRadius: { type: "number", minimum: 0 },
    thickness: { type: "number", minimum: 0 },
    angleRadians: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["innerRadius", "thickness", "angleRadians"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { area: { type: "number" } },
  required: ["area"],
} as const;
/** Calculate masonry opening arch ring area from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { innerRadius, thickness, angleRadians } = request;
  const compute = (): Output => {
    H.domain(
      innerRadius >= 0 &&
        thickness >= 0 &&
        angleRadians > 0 &&
        angleRadians <= 2 * Math.PI,
    );
    return {
      area: (angleRadians * thickness * (2 * innerRadius + thickness)) / 2,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { innerRadius: 2, thickness: 0.5, angleRadians: 3.141592653589793 },
  output: { area: 3.5342917352885173 },
} satisfies ToolExample<Input, Output>;
export const masonryOpeningArchRingAreaTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "architecture/masonry-opening-arch-ring-area",
    title: "Masonry Opening Arch Ring Area Tool",
    description:
      "Calculate masonry opening arch ring area from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        innerRadius: { type: "number", minimum: 0 },
        thickness: { type: "number", minimum: 0 },
        angleRadians: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["innerRadius", "thickness", "angleRadians"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { area: { type: "number" } },
      required: ["area"],
    },
    ports: {
      inputs: [
        {
          id: "innerRadius",
          label: "Inner Radius",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "thickness",
          label: "Thickness",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "angleRadians",
          label: "Angle Radians",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [{ id: "area", label: "Area", valueType: { type: "number" } }],
    },
  },
  calculate,
});
export const run = masonryOpeningArchRingAreaTool.execute;
export default masonryOpeningArchRingAreaTool;
