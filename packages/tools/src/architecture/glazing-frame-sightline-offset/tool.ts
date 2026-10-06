import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly frameEdgeCoordinate: number;
  readonly visibleGlazingEdgeCoordinate: number;
};
export type Output = { readonly signedGap: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    frameEdgeCoordinate: { type: "number" },
    visibleGlazingEdgeCoordinate: { type: "number" },
  },
  required: ["frameEdgeCoordinate", "visibleGlazingEdgeCoordinate"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { signedGap: { type: "number" } },
  required: ["signedGap"],
} as const;
/** Subtract an explicit frame-edge coordinate from the visible glazing edge on the same section axis. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { frameEdgeCoordinate, visibleGlazingEdgeCoordinate } = request;
  const compute = (): Output => {
    return { signedGap: visibleGlazingEdgeCoordinate - frameEdgeCoordinate };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { frameEdgeCoordinate: 12, visibleGlazingEdgeCoordinate: 17 },
  output: { signedGap: 5 },
} satisfies ToolExample<Input, Output>;
export const glazingFrameSightlineOffsetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["architecture", "arts and design"],
      keywords: ["architecture", "arts and design"],
    },
    id: "architecture/glazing-frame-sightline-offset",
    title: "Glazing Frame Sightline Offset",
    description:
      "Subtract an explicit frame-edge coordinate from the visible glazing edge on the same section axis.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        frameEdgeCoordinate: { type: "number" },
        visibleGlazingEdgeCoordinate: { type: "number" },
      },
      required: ["frameEdgeCoordinate", "visibleGlazingEdgeCoordinate"],
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
          id: "frameEdgeCoordinate",
          label: "Frame Edge Coordinate",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "visibleGlazingEdgeCoordinate",
          label: "Visible Glazing Edge Coordinate",
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
export const run = glazingFrameSightlineOffsetTool.execute;
export default glazingFrameSightlineOffsetTool;
