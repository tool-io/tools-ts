import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly canvasHeight: number;
  readonly tiltFromVertical: number;
};
export type Output = {
  readonly verticalHeight: number;
  readonly backwardDepth: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    canvasHeight: { type: "number", minimum: 0 },
    tiltFromVertical: { type: "number", minimum: 0 },
  },
  required: ["canvasHeight", "tiltFromVertical"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    verticalHeight: { type: "number" },
    backwardDepth: { type: "number" },
  },
  required: ["verticalHeight", "backwardDepth"],
} as const;
/** Calculate easel canvas tilt projected height from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { canvasHeight, tiltFromVertical } = request;
  const compute = (): Output => {
    H.domain(
      canvasHeight >= 0 &&
        tiltFromVertical >= 0 &&
        tiltFromVertical <= Math.PI / 2,
    );
    return {
      verticalHeight: canvasHeight * Math.cos(tiltFromVertical),
      backwardDepth: canvasHeight * Math.sin(tiltFromVertical),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { canvasHeight: 2, tiltFromVertical: 0.5235987755982988 },
  output: {
    verticalHeight: 1.7320508075688774,
    backwardDepth: 0.9999999999999999,
  },
} satisfies ToolExample<Input, Output>;
export const easelCanvasTiltProjectedHeightTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "visual-arts/easel-canvas-tilt-projected-height",
    title: "Easel Canvas Tilt Projected Height Tool",
    description:
      "Calculate easel canvas tilt projected height from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        canvasHeight: { type: "number", minimum: 0 },
        tiltFromVertical: { type: "number", minimum: 0 },
      },
      required: ["canvasHeight", "tiltFromVertical"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        verticalHeight: { type: "number" },
        backwardDepth: { type: "number" },
      },
      required: ["verticalHeight", "backwardDepth"],
    },
    ports: {
      inputs: [
        {
          id: "canvasHeight",
          label: "Canvas Height",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "tiltFromVertical",
          label: "Tilt From Vertical",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "verticalHeight",
          label: "Vertical Height",
          valueType: { type: "number" },
        },
        {
          id: "backwardDepth",
          label: "Backward Depth",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = easelCanvasTiltProjectedHeightTool.execute;
export default easelCanvasTiltProjectedHeightTool;
