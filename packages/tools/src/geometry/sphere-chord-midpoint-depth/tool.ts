import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly sphereRadius: number;
  readonly chordLength: number;
};
export type Output = { readonly depthFromSurface: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sphereRadius: { type: "number", exclusiveMinimum: 0 },
    chordLength: { type: "number", minimum: 0 },
  },
  required: ["sphereRadius", "chordLength"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { depthFromSurface: { type: "number" } },
  required: ["depthFromSurface"],
} as const;
/** Return the minor spherical-cap depth from the surface to a chord midpoint, using a cancellation-resistant sagitta expression. The minor cap ranges from zero to the radius. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { sphereRadius, chordLength } = request;
  const compute = (): Output => {
    (H.domain(sphereRadius > 0, "sphereRadius"), sphereRadius);
    H.domain(
      chordLength >= 0 && chordLength / 2 <= sphereRadius,
      "chordLength",
    );
    const ratio = chordLength / 2 / sphereRadius;
    return {
      depthFromSurface:
        (chordLength / 2) *
        (ratio / (1 + Math.sqrt((1 - ratio) * (1 + ratio)))),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { sphereRadius: 5, chordLength: 6 },
  output: { depthFromSurface: 1 },
} satisfies ToolExample<Input, Output>;
export const sphereChordMidpointDepthTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "geometry/sphere-chord-midpoint-depth",
    title: "Sphere Chord Midpoint Depth Tool",
    description:
      "Return the minor spherical-cap depth from the surface to a chord midpoint, using a cancellation-resistant sagitta expression. The minor cap ranges from zero to the radius.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        sphereRadius: { type: "number", exclusiveMinimum: 0 },
        chordLength: { type: "number", minimum: 0 },
      },
      required: ["sphereRadius", "chordLength"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { depthFromSurface: { type: "number" } },
      required: ["depthFromSurface"],
    },
    ports: {
      inputs: [
        {
          id: "sphereRadius",
          label: "Sphere Radius",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "chordLength",
          label: "Chord Length",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "depthFromSurface",
          label: "Depth From Surface",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = sphereChordMidpointDepthTool.execute;
export default sphereChordMidpointDepthTool;
