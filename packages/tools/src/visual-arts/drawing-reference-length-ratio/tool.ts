import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly drawingLength: number;
  readonly referenceLength: number;
};
export type Output = { readonly ratio: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    drawingLength: { type: "number", minimum: 0 },
    referenceLength: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["drawingLength", "referenceLength"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { ratio: { type: "number" } },
  required: ["ratio"],
} as const;
/** Compare corresponding measured drawing and reference lengths in the same units. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { drawingLength, referenceLength } = request;
  const compute = (): Output => {
    H.domain(drawingLength >= 0, "drawingLength");
    (H.domain(referenceLength > 0, "referenceLength"), referenceLength);
    return { ratio: drawingLength / referenceLength };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { drawingLength: 15, referenceLength: 60 },
  output: { ratio: 0.25 },
} satisfies ToolExample<Input, Output>;
export const drawingReferenceLengthRatioTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "visual-arts/drawing-reference-length-ratio",
    title: "Drawing Reference Length Ratio Tool",
    description:
      "Compare corresponding measured drawing and reference lengths in the same units.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        drawingLength: { type: "number", minimum: 0 },
        referenceLength: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["drawingLength", "referenceLength"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { ratio: { type: "number" } },
      required: ["ratio"],
    },
    ports: {
      inputs: [
        {
          id: "drawingLength",
          label: "Drawing Length",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "referenceLength",
          label: "Reference Length",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [{ id: "ratio", label: "Ratio", valueType: { type: "number" } }],
    },
  },
  calculate,
});
export const run = drawingReferenceLengthRatioTool.execute;
export default drawingReferenceLengthRatioTool;
