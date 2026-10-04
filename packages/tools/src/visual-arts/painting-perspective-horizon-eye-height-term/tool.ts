import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly eyeHeight: number;
  readonly pictureScale: number;
  readonly groundLine: number;
};
export type Output = { readonly horizon: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    eyeHeight: { type: "number", minimum: 0 },
    pictureScale: { type: "number", minimum: 0 },
    groundLine: { type: "number" },
  },
  required: ["eyeHeight", "pictureScale", "groundLine"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { horizon: { type: "number" } },
  required: ["horizon"],
} as const;
/** Level one-point picture with a vertical scale relative to a ground line at the picture plane. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { eyeHeight, pictureScale, groundLine } = request;
  const compute = (): Output => {
    H.domain(eyeHeight >= 0 && pictureScale >= 0);
    return { horizon: groundLine + eyeHeight * pictureScale };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { eyeHeight: 1.6, pictureScale: 100, groundLine: 20 },
  output: { horizon: 180 },
} satisfies ToolExample<Input, Output>;
export const paintingPerspectiveHorizonEyeHeightTermTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "visual-arts/painting-perspective-horizon-eye-height-term",
      title: "Painting Perspective Horizon Eye Height Term Tool",
      description:
        "Level one-point picture with a vertical scale relative to a ground line at the picture plane.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          eyeHeight: { type: "number", minimum: 0 },
          pictureScale: { type: "number", minimum: 0 },
          groundLine: { type: "number" },
        },
        required: ["eyeHeight", "pictureScale", "groundLine"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { horizon: { type: "number" } },
        required: ["horizon"],
      },
      ports: {
        inputs: [
          {
            id: "eyeHeight",
            label: "Eye Height",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "pictureScale",
            label: "Picture Scale",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "groundLine",
            label: "Ground Line",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          { id: "horizon", label: "Horizon", valueType: { type: "number" } },
        ],
      },
    },
    calculate,
  });
export const run = paintingPerspectiveHorizonEyeHeightTermTool.execute;
export default paintingPerspectiveHorizonEyeHeightTermTool;
