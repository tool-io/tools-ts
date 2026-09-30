import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly height: number;
  readonly horizontalPerVertical: number;
  readonly faceCount: number;
};
export type Output = {
  readonly oneFaceOffset: number;
  readonly totalWidthReduction: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    height: { type: "number", minimum: 0 },
    horizontalPerVertical: { type: "number", minimum: 0 },
    faceCount: { type: "integer", minimum: 1, maximum: 2 },
  },
  required: ["height", "horizontalPerVertical", "faceCount"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    oneFaceOffset: { type: "number" },
    totalWidthReduction: { type: "number" },
  },
  required: ["oneFaceOffset", "totalWidthReduction"],
} as const;
/** Calculate dry stone wall batter offset from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { height, horizontalPerVertical, faceCount } = request;
  const compute = (): Output => {
    H.domain(height >= 0 && horizontalPerVertical >= 0);
    H.integer(faceCount, 1, 2);
    return {
      oneFaceOffset: height * horizontalPerVertical,
      totalWidthReduction: faceCount * height * horizontalPerVertical,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { height: 2, horizontalPerVertical: 0.1, faceCount: 2 },
  output: { oneFaceOffset: 0.2, totalWidthReduction: 0.4 },
} satisfies ToolExample<Input, Output>;
export const dryStoneWallBatterOffsetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "landscape-architecture/dry-stone-wall-batter-offset",
    title: "Dry Stone Wall Batter Offset Tool",
    description:
      "Calculate dry stone wall batter offset from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        height: { type: "number", minimum: 0 },
        horizontalPerVertical: { type: "number", minimum: 0 },
        faceCount: { type: "integer", minimum: 1, maximum: 2 },
      },
      required: ["height", "horizontalPerVertical", "faceCount"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        oneFaceOffset: { type: "number" },
        totalWidthReduction: { type: "number" },
      },
      required: ["oneFaceOffset", "totalWidthReduction"],
    },
    ports: {
      inputs: [
        {
          id: "height",
          label: "Height",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "horizontalPerVertical",
          label: "Horizontal Per Vertical",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "faceCount",
          label: "Face Count",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "oneFaceOffset",
          label: "One Face Offset",
          valueType: { type: "number" },
        },
        {
          id: "totalWidthReduction",
          label: "Total Width Reduction",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = dryStoneWallBatterOffsetTool.execute;
export default dryStoneWallBatterOffsetTool;
