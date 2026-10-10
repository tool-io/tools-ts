import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly referenceSurfaceCoordinate: number;
  readonly hingeLeafSurfaceCoordinate: number;
};
export type Output = { readonly signedGap: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    referenceSurfaceCoordinate: { type: "number" },
    hingeLeafSurfaceCoordinate: { type: "number" },
  },
  required: ["referenceSurfaceCoordinate", "hingeLeafSurfaceCoordinate"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { signedGap: { type: "number" } },
  required: ["signedGap"],
} as const;
/** Subtract an explicit reference surface coordinate from a hinge-leaf surface on the same section axis. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { referenceSurfaceCoordinate, hingeLeafSurfaceCoordinate } = request;
  const compute = (): Output => {
    return {
      signedGap: hingeLeafSurfaceCoordinate - referenceSurfaceCoordinate,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { referenceSurfaceCoordinate: 12, hingeLeafSurfaceCoordinate: 17 },
  output: { signedGap: 5 },
} satisfies ToolExample<Input, Output>;
export const hingeLeafFlushOffsetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["industrial-design", "industrial design", "arts and design"],
      keywords: ["industrial design", "arts and design"],
    },
    id: "industrial-design/hinge-leaf-flush-offset",
    title: "Hinge Leaf Flush Offset",
    description:
      "Subtract an explicit reference surface coordinate from a hinge-leaf surface on the same section axis.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        referenceSurfaceCoordinate: { type: "number" },
        hingeLeafSurfaceCoordinate: { type: "number" },
      },
      required: ["referenceSurfaceCoordinate", "hingeLeafSurfaceCoordinate"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { signedGap: { type: "number" } },
      required: ["signedGap"],
    },
    ports: {
      inputs: [
        {
          id: "referenceSurfaceCoordinate",
          label: "Reference Surface Coordinate",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "hingeLeafSurfaceCoordinate",
          label: "Hinge Leaf Surface Coordinate",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "signedGap", label: "Signed Gap", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = hingeLeafFlushOffsetTool.execute;
export default hingeLeafFlushOffsetTool;
