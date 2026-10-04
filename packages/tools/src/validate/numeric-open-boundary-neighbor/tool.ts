import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly boundary: number; readonly direction: string };
export type Output = {
  readonly neighbor: number;
  readonly representable: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    boundary: { type: "number" },
    direction: { type: "string", maxLength: 8192, enum: ["above", "below"] },
  },
  required: ["boundary", "direction"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    neighbor: { type: "number" },
    representable: { type: "boolean" },
  },
  required: ["neighbor", "representable"],
} as const;
/** Return the adjacent finite binary64 value, with an explicit false flag when the next value would be infinite. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { boundary, direction } = request;
  const compute = (): Output => {
    H.domain(["above", "below"].includes(direction));
    const buffer = new ArrayBuffer(8),
      view = new DataView(buffer);
    view.setFloat64(0, boundary);
    let bits = view.getBigUint64(0);
    if (boundary === 0)
      return {
        neighbor: direction === "above" ? Number.MIN_VALUE : -Number.MIN_VALUE,
        representable: true,
      };
    bits += (direction === "above") === boundary > 0 ? 1n : -1n;
    view.setBigUint64(0, bits);
    const next = view.getFloat64(0);
    return {
      neighbor: Number.isFinite(next) ? next : boundary,
      representable: Number.isFinite(next),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { boundary: 1, direction: "above" },
  output: { neighbor: 1.0000000000000002, representable: true },
} satisfies ToolExample<Input, Output>;
export const numericOpenBoundaryNeighborTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "validate/numeric-open-boundary-neighbor",
    title: "Numeric Open Boundary Neighbor Tool",
    description:
      "Return the adjacent finite binary64 value, with an explicit false flag when the next value would be infinite.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        boundary: { type: "number" },
        direction: {
          type: "string",
          maxLength: 8192,
          enum: ["above", "below"],
        },
      },
      required: ["boundary", "direction"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        neighbor: { type: "number" },
        representable: { type: "boolean" },
      },
      required: ["neighbor", "representable"],
    },
    ports: {
      inputs: [
        {
          id: "boundary",
          label: "Boundary",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "direction",
          label: "Direction",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        { id: "neighbor", label: "Neighbor", valueType: { type: "number" } },
        {
          id: "representable",
          label: "Representable",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = numericOpenBoundaryNeighborTool.execute;
export default numericOpenBoundaryNeighborTool;
