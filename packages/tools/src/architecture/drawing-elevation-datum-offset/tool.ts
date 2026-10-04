import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly drawingElevation: number;
  readonly drawingDatumAbsoluteElevation: number;
};
export type Output = { readonly absoluteElevation: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    drawingElevation: { type: "number" },
    drawingDatumAbsoluteElevation: { type: "number" },
  },
  required: ["drawingElevation", "drawingDatumAbsoluteElevation"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { absoluteElevation: { type: "number" } },
  required: ["absoluteElevation"],
} as const;
/** Place a drawing elevation on a shared absolute vertical datum using the supplied drawing-zero elevation. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { drawingElevation, drawingDatumAbsoluteElevation } = request;
  const compute = (): Output => {
    return {
      absoluteElevation: drawingElevation + drawingDatumAbsoluteElevation,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { drawingElevation: 2.5, drawingDatumAbsoluteElevation: 100 },
  output: { absoluteElevation: 102.5 },
} satisfies ToolExample<Input, Output>;
export const drawingElevationDatumOffsetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "architecture/drawing-elevation-datum-offset",
    title: "Drawing Elevation Datum Offset Tool",
    description:
      "Place a drawing elevation on a shared absolute vertical datum using the supplied drawing-zero elevation.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        drawingElevation: { type: "number" },
        drawingDatumAbsoluteElevation: { type: "number" },
      },
      required: ["drawingElevation", "drawingDatumAbsoluteElevation"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { absoluteElevation: { type: "number" } },
      required: ["absoluteElevation"],
    },
    ports: {
      inputs: [
        {
          id: "drawingElevation",
          label: "Drawing Elevation",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "drawingDatumAbsoluteElevation",
          label: "Drawing Datum Absolute Elevation",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "absoluteElevation",
          label: "Absolute Elevation",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = drawingElevationDatumOffsetTool.execute;
export default drawingElevationDatumOffsetTool;
