import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly canvasHeight: number;
  readonly horizonFromTop: number;
};
export type Output = { readonly horizonFraction: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    canvasHeight: { type: "number", exclusiveMinimum: 0 },
    horizonFromTop: { type: "number" },
  },
  required: ["canvasHeight", "horizonFromTop"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { horizonFraction: { type: "number" } },
  required: ["horizonFraction"],
} as const;
/** Normalize a supplied drawing horizon coordinate by positive canvas height, allowing horizons outside the canvas. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { canvasHeight, horizonFromTop } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isFinite(canvasHeight) && canvasHeight > 0,
      "canvasHeight",
    ),
      canvasHeight);
    return { horizonFraction: horizonFromTop / canvasHeight };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { canvasHeight: 100, horizonFromTop: 40 },
  output: { horizonFraction: 0.4 },
} satisfies ToolExample<Input, Output>;
export const drawingExerciseHorizonReferenceLineTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      discovery: {
        aliases: [],
        collections: ["learn"],
        fields: ["art-education", "art education", "education"],
        keywords: ["art education", "education"],
      },
      id: "art-education/drawing-exercise-horizon-reference-line",
      title: "Drawing Exercise Horizon Reference Line",
      description:
        "Normalize a supplied drawing horizon coordinate by positive canvas height, allowing horizons outside the canvas.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          canvasHeight: { type: "number", exclusiveMinimum: 0 },
          horizonFromTop: { type: "number" },
        },
        required: ["canvasHeight", "horizonFromTop"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { horizonFraction: { type: "number" } },
        required: ["horizonFraction"],
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
            id: "horizonFromTop",
            label: "Horizon From Top",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "horizonFraction",
            label: "Horizon Fraction",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = drawingExerciseHorizonReferenceLineTool.execute;
export default drawingExerciseHorizonReferenceLineTool;
