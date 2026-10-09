import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly ax: number;
  readonly ay: number;
  readonly bx: number;
  readonly by: number;
  readonly cx: number;
  readonly cy: number;
};
export type Output = {
  readonly orientedDoubleArea: number;
  readonly orientation: number;
};
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
  },
  required: ["ax", "ay", "bx", "by", "cx", "cy"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    orientedDoubleArea: { type: "number" },
    orientation: { type: "integer" },
  },
  required: ["orientedDoubleArea", "orientation"],
} as const;
/** Calculate the explicit planar triangle cross product and orientation sign under binary64 arithmetic. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { ax, ay, bx, by, cx, cy } = request;
  const compute = (): Output => {
    return (() => {
      const orientedDoubleArea = (bx - ax) * (cy - ay) - (by - ay) * (cx - ax);
      return { orientedDoubleArea, orientation: Math.sign(orientedDoubleArea) };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { ax: 0, ay: 0, bx: 4, by: 0, cx: 1, cy: 3 },
  output: { orientedDoubleArea: 12, orientation: 1 },
} satisfies ToolExample<Input, Output>;
export const triangleOrientedDoubleAreaSignTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["geometry", "mathematics"],
      keywords: ["geometry", "mathematics"],
    },
    id: "geometry/triangle-oriented-double-area-sign",
    title: "Triangle Oriented Double Area Sign",
    description:
      "Calculate the explicit planar triangle cross product and orientation sign under binary64 arithmetic.",
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
      },
      required: ["ax", "ay", "bx", "by", "cx", "cy"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        orientedDoubleArea: { type: "number" },
        orientation: { type: "integer" },
      },
      required: ["orientedDoubleArea", "orientation"],
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
      ],
      outputs: [
        {
          id: "orientedDoubleArea",
          label: "Oriented Double Area",
          valueType: { type: "number" },
        },
        {
          id: "orientation",
          label: "Orientation",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = triangleOrientedDoubleAreaSignTool.execute;
export default triangleOrientedDoubleAreaSignTool;
