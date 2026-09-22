import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly sourceCell: number;
  readonly sourceWidth: number;
  readonly targetWidth: number;
};
export type Output = { readonly scale: number; readonly targetCell: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sourceCell: { type: "number", minimum: 0 },
    sourceWidth: { type: "number", exclusiveMinimum: 0 },
    targetWidth: { type: "number", minimum: 0 },
  },
  required: ["sourceCell", "sourceWidth", "targetWidth"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { scale: { type: "number" }, targetCell: { type: "number" } },
  required: ["scale", "targetCell"],
} as const;
/** Calculate painting grid transfer square size from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { sourceCell, sourceWidth, targetWidth } = request;
  const compute = (): Output => {
    H.positive(sourceWidth);
    H.domain(sourceCell >= 0 && targetWidth >= 0);
    return {
      scale: targetWidth / sourceWidth,
      targetCell: (sourceCell * targetWidth) / sourceWidth,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { sourceCell: 2, sourceWidth: 20, targetWidth: 100 },
  output: { scale: 5, targetCell: 10 },
} satisfies ToolExample<Input, Output>;
export const paintingGridTransferSquareSizeTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "art-history/painting-grid-transfer-square-size",
    title: "Painting Grid Transfer Square Size Tool",
    description:
      "Calculate painting grid transfer square size from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        sourceCell: { type: "number", minimum: 0 },
        sourceWidth: { type: "number", exclusiveMinimum: 0 },
        targetWidth: { type: "number", minimum: 0 },
      },
      required: ["sourceCell", "sourceWidth", "targetWidth"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { scale: { type: "number" }, targetCell: { type: "number" } },
      required: ["scale", "targetCell"],
    },
    ports: {
      inputs: [
        {
          id: "sourceCell",
          label: "Source Cell",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "sourceWidth",
          label: "Source Width",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "targetWidth",
          label: "Target Width",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "scale", label: "Scale", valueType: { type: "number" } },
        {
          id: "targetCell",
          label: "Target Cell",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = paintingGridTransferSquareSizeTool.execute;
export default paintingGridTransferSquareSizeTool;
