import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly ax: number;
  readonly ay: number;
  readonly bx: number;
  readonly by: number;
  readonly cx: number;
  readonly cy: number;
  readonly referenceArea: number;
};
export type Output = { readonly area: number; readonly residual: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    ax: { type: "number" },
    ay: { type: "number" },
    bx: { type: "number" },
    by: { type: "number" },
    cx: { type: "number" },
    cy: { type: "number" },
    referenceArea: { type: "number", minimum: 0 },
  },
  required: ["ax", "ay", "bx", "by", "cx", "cy", "referenceArea"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { area: { type: "number" }, residual: { type: "number" } },
  required: ["area", "residual"],
} as const;
/** Compare a planar research-marker triangle area with an explicit reference. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { ax, ay, bx, by, cx, cy, referenceArea } = request;
  const compute = (): Output => {
    H.domain(referenceArea >= 0);
    return {
      area: Math.abs((bx - ax) * (cy - ay) - (by - ay) * (cx - ax)) / 2,
      residual:
        Math.abs((bx - ax) * (cy - ay) - (by - ay) * (cx - ax)) / 2 -
        referenceArea,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { ax: 0, ay: 0, bx: 4, by: 0, cx: 0, cy: 3, referenceArea: 5 },
  output: { area: 6, residual: 1 },
} satisfies ToolExample<Input, Output>;
export const markerTriangleAreaResidualTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "biomechanics/marker-triangle-area-residual",
    title: "Marker Triangle Area Residual Tool",
    description:
      "Compare a planar research-marker triangle area with an explicit reference.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        ax: { type: "number" },
        ay: { type: "number" },
        bx: { type: "number" },
        by: { type: "number" },
        cx: { type: "number" },
        cy: { type: "number" },
        referenceArea: { type: "number", minimum: 0 },
      },
      required: ["ax", "ay", "bx", "by", "cx", "cy", "referenceArea"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { area: { type: "number" }, residual: { type: "number" } },
      required: ["area", "residual"],
    },
    ports: {
      inputs: [
        {
          id: "ax",
          label: "Ax",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "ay",
          label: "Ay",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "bx",
          label: "Bx",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "by",
          label: "By",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "cx",
          label: "Cx",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "cy",
          label: "Cy",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "referenceArea",
          label: "Reference Area",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "area", label: "Area", valueType: { type: "number" } },
        { id: "residual", label: "Residual", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = markerTriangleAreaResidualTool.execute;
export default markerTriangleAreaResidualTool;
