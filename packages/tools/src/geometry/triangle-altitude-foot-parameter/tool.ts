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
  readonly parameter: number;
  readonly footX: number;
  readonly footY: number;
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
    parameter: { type: "number" },
    footX: { type: "number" },
    footY: { type: "number" },
  },
  required: ["parameter", "footX", "footY"],
} as const;
/** Project a supplied triangle vertex onto the opposite side’s infinite line; parameters outside [0,1] are retained. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { ax, ay, bx, by, cx, cy } = request;
  const compute = (): Output => {
    H.domain(bx !== cx || by !== cy);
    const scale = Math.max(
        Math.abs(ax),
        Math.abs(ay),
        Math.abs(bx),
        Math.abs(by),
        Math.abs(cx),
        Math.abs(cy),
      ),
      dx = cx / scale - bx / scale,
      dy = cy / scale - by / scale,
      dscale = Math.max(Math.abs(dx), Math.abs(dy));
    H.domain(
      dscale > 0,
      "cx",
      "The side direction must be numerically representable.",
    );
    const u = dx / dscale,
      v = dy / dscale,
      norm = Math.hypot(u, v),
      ux = u / norm,
      uy = v / norm,
      px = ax / scale - bx / scale,
      py = ay / scale - by / scale,
      parameter =
        ((ux === 0 ? 0 : (px / dscale) * ux) +
          (uy === 0 ? 0 : (py / dscale) * uy)) /
        norm,
      perpendicular = -px * uy + py * ux;
    return {
      parameter,
      footX: ax + perpendicular * uy * scale,
      footY: ay - perpendicular * ux * scale,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { ax: 1, ay: 3, bx: 0, by: 0, cx: 4, cy: 0 },
  output: { parameter: 0.25, footX: 1, footY: 0 },
} satisfies ToolExample<Input, Output>;
export const triangleAltitudeFootParameterTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "geometry/triangle-altitude-foot-parameter",
    title: "Triangle Altitude Foot Parameter Tool",
    description:
      "Project a supplied triangle vertex onto the opposite side’s infinite line; parameters outside [0,1] are retained.",
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
        parameter: { type: "number" },
        footX: { type: "number" },
        footY: { type: "number" },
      },
      required: ["parameter", "footX", "footY"],
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
        { id: "parameter", label: "Parameter", valueType: { type: "number" } },
        { id: "footX", label: "Foot X", valueType: { type: "number" } },
        { id: "footY", label: "Foot Y", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = triangleAltitudeFootParameterTool.execute;
export default triangleAltitudeFootParameterTool;
