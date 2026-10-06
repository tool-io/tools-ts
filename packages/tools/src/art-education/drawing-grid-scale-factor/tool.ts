import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly referenceCellLength: number;
  readonly drawingCellLength: number;
};
export type Output = {
  readonly linearScale: number;
  readonly areaScale: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    referenceCellLength: { type: "number", exclusiveMinimum: 0 },
    drawingCellLength: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["referenceCellLength", "drawingCellLength"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    linearScale: { type: "number" },
    areaScale: { type: "number" },
  },
  required: ["linearScale", "areaScale"],
} as const;
/** Describe linear and area scaling between corresponding drawing-grid cells. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { referenceCellLength, drawingCellLength } = request;
  const compute = (): Output => {
    (H.domain(referenceCellLength > 0, "referenceCellLength"),
      referenceCellLength);
    (H.domain(drawingCellLength > 0, "drawingCellLength"), drawingCellLength);
    return {
      linearScale: drawingCellLength / referenceCellLength,
      areaScale: (drawingCellLength / referenceCellLength) ** 2,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { referenceCellLength: 2, drawingCellLength: 6 },
  output: { linearScale: 3, areaScale: 9 },
} satisfies ToolExample<Input, Output>;
export const drawingGridScaleFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["art-education", "art education", "education"],
      keywords: ["art education", "education"],
    },
    id: "art-education/drawing-grid-scale-factor",
    title: "Drawing Grid Scale Factor",
    description:
      "Describe linear and area scaling between corresponding drawing-grid cells.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        referenceCellLength: { type: "number", exclusiveMinimum: 0 },
        drawingCellLength: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["referenceCellLength", "drawingCellLength"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        linearScale: { type: "number" },
        areaScale: { type: "number" },
      },
      required: ["linearScale", "areaScale"],
    },
    ports: {
      inputs: [
        {
          id: "referenceCellLength",
          label: "Reference Cell Length",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "drawingCellLength",
          label: "Drawing Cell Length",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "linearScale",
          label: "Linear Scale",
          valueType: { type: "number" },
        },
        { id: "areaScale", label: "Area Scale", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = drawingGridScaleFactorTool.execute;
export default drawingGridScaleFactorTool;
