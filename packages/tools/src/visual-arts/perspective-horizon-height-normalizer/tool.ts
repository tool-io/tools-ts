import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly horizonY: number;
  readonly canvasTopY: number;
  readonly canvasHeight: number;
};
export type Output = { readonly normalizedHorizonY: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    horizonY: { type: "number" },
    canvasTopY: { type: "number" },
    canvasHeight: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["horizonY", "canvasTopY", "canvasHeight"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { normalizedHorizonY: { type: "number" } },
  required: ["normalizedHorizonY"],
} as const;
/** Normalize a horizon's downward-positive canvas y-coordinate relative to canvas top and height, allowing horizons outside the canvas. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { horizonY, canvasTopY, canvasHeight } = request;
  const compute = (): Output => {
    (H.domain(canvasHeight > 0, "canvasHeight"), canvasHeight);
    return { normalizedHorizonY: (horizonY - canvasTopY) / canvasHeight };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { horizonY: 75, canvasTopY: 0, canvasHeight: 100 },
  output: { normalizedHorizonY: 0.75 },
} satisfies ToolExample<Input, Output>;
export const perspectiveHorizonHeightNormalizerTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "visual-arts/perspective-horizon-height-normalizer",
    title: "Perspective Horizon Height Normalizer Tool",
    description:
      "Normalize a horizon's downward-positive canvas y-coordinate relative to canvas top and height, allowing horizons outside the canvas.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        horizonY: { type: "number" },
        canvasTopY: { type: "number" },
        canvasHeight: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["horizonY", "canvasTopY", "canvasHeight"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { normalizedHorizonY: { type: "number" } },
      required: ["normalizedHorizonY"],
    },
    ports: {
      inputs: [
        {
          id: "horizonY",
          label: "Horizon Y",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "canvasTopY",
          label: "Canvas Top Y",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "canvasHeight",
          label: "Canvas Height",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "normalizedHorizonY",
          label: "Normalized Horizon Y",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = perspectiveHorizonHeightNormalizerTool.execute;
export default perspectiveHorizonHeightNormalizerTool;
