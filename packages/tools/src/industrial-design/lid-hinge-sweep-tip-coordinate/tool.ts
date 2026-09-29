import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly radius: number;
  readonly angleRadians: number;
  readonly hingeX: number;
  readonly hingeY: number;
};
export type Output = { readonly x: number; readonly y: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    radius: { type: "number", minimum: 0 },
    angleRadians: { type: "number" },
    hingeX: { type: "number" },
    hingeY: { type: "number" },
  },
  required: ["radius", "angleRadians", "hingeX", "hingeY"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { x: { type: "number" }, y: { type: "number" } },
  required: ["x", "y"],
} as const;
/** Calculate lid hinge sweep tip coordinate from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { radius, angleRadians, hingeX, hingeY } = request;
  const compute = (): Output => {
    H.domain(radius >= 0);
    return {
      x: hingeX + radius * Math.cos(angleRadians),
      y: hingeY + radius * Math.sin(angleRadians),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { radius: 2, angleRadians: 0, hingeX: 1, hingeY: 3 },
  output: { x: 3, y: 3 },
} satisfies ToolExample<Input, Output>;
export const lidHingeSweepTipCoordinateTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "industrial-design/lid-hinge-sweep-tip-coordinate",
    title: "Lid Hinge Sweep Tip Coordinate Tool",
    description:
      "Calculate lid hinge sweep tip coordinate from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        radius: { type: "number", minimum: 0 },
        angleRadians: { type: "number" },
        hingeX: { type: "number" },
        hingeY: { type: "number" },
      },
      required: ["radius", "angleRadians", "hingeX", "hingeY"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { x: { type: "number" }, y: { type: "number" } },
      required: ["x", "y"],
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
          id: "angleRadians",
          label: "Angle Radians",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "hingeX",
          label: "Hinge X",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "hingeY",
          label: "Hinge Y",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "x", label: "X", valueType: { type: "number" } },
        { id: "y", label: "Y", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = lidHingeSweepTipCoordinateTool.execute;
export default lidHingeSweepTipCoordinateTool;
