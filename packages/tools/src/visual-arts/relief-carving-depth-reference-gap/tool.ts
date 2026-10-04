import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly stockThickness: number;
  readonly carvingDepth: number;
  readonly desiredBacking: number;
};
export type Output = {
  readonly remainingBacking: number;
  readonly margin: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    stockThickness: { type: "number" },
    carvingDepth: { type: "number", minimum: 0 },
    desiredBacking: { type: "number", minimum: 0 },
  },
  required: ["stockThickness", "carvingDepth", "desiredBacking"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    remainingBacking: { type: "number" },
    margin: { type: "number" },
  },
  required: ["remainingBacking", "margin"],
} as const;
/** Calculate relief carving depth reference gap from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { stockThickness, carvingDepth, desiredBacking } = request;
  const compute = (): Output => {
    H.domain(
      carvingDepth >= 0 &&
        stockThickness >= carvingDepth &&
        desiredBacking >= 0,
    );
    return {
      remainingBacking: stockThickness - carvingDepth,
      margin: stockThickness - carvingDepth - desiredBacking,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { stockThickness: 30, carvingDepth: 10, desiredBacking: 15 },
  output: { remainingBacking: 20, margin: 5 },
} satisfies ToolExample<Input, Output>;
export const reliefCarvingDepthReferenceGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "visual-arts/relief-carving-depth-reference-gap",
    title: "Relief Carving Depth Reference Gap Tool",
    description:
      "Calculate relief carving depth reference gap from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        stockThickness: { type: "number" },
        carvingDepth: { type: "number", minimum: 0 },
        desiredBacking: { type: "number", minimum: 0 },
      },
      required: ["stockThickness", "carvingDepth", "desiredBacking"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        remainingBacking: { type: "number" },
        margin: { type: "number" },
      },
      required: ["remainingBacking", "margin"],
    },
    ports: {
      inputs: [
        {
          id: "stockThickness",
          label: "Stock Thickness",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "carvingDepth",
          label: "Carving Depth",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "desiredBacking",
          label: "Desired Backing",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "remainingBacking",
          label: "Remaining Backing",
          valueType: { type: "number" },
        },
        { id: "margin", label: "Margin", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = reliefCarvingDepthReferenceGapTool.execute;
export default reliefCarvingDepthReferenceGapTool;
