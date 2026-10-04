import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly width: number;
  readonly height: number;
  readonly depth: number;
  readonly backStapleAllowance: number;
};
export type Output = {
  readonly cutWidth: number;
  readonly cutHeight: number;
  readonly area: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    width: { type: "number", minimum: 0 },
    height: { type: "number", minimum: 0 },
    depth: { type: "number", minimum: 0 },
    backStapleAllowance: { type: "number", minimum: 0 },
  },
  required: ["width", "height", "depth", "backStapleAllowance"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    cutWidth: { type: "number" },
    cutHeight: { type: "number" },
    area: { type: "number" },
  },
  required: ["cutWidth", "cutHeight", "area"],
} as const;
/** Calculate canvas stretcher foldover material budget from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { width, height, depth, backStapleAllowance } = request;
  const compute = (): Output => {
    H.domain(
      width >= 0 && height >= 0 && depth >= 0 && backStapleAllowance >= 0,
    );
    return {
      cutWidth: width + 2 * (depth + backStapleAllowance),
      cutHeight: height + 2 * (depth + backStapleAllowance),
      area:
        (width + 2 * (depth + backStapleAllowance)) *
        (height + 2 * (depth + backStapleAllowance)),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { width: 40, height: 50, depth: 2, backStapleAllowance: 3 },
  output: { cutWidth: 50, cutHeight: 60, area: 3000 },
} satisfies ToolExample<Input, Output>;
export const canvasStretcherFoldoverMaterialBudgetTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "visual-arts/canvas-stretcher-foldover-material-budget",
      title: "Canvas Stretcher Foldover Material Budget Tool",
      description:
        "Calculate canvas stretcher foldover material budget from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          width: { type: "number", minimum: 0 },
          height: { type: "number", minimum: 0 },
          depth: { type: "number", minimum: 0 },
          backStapleAllowance: { type: "number", minimum: 0 },
        },
        required: ["width", "height", "depth", "backStapleAllowance"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          cutWidth: { type: "number" },
          cutHeight: { type: "number" },
          area: { type: "number" },
        },
        required: ["cutWidth", "cutHeight", "area"],
      },
      ports: {
        inputs: [
          {
            id: "width",
            label: "Width",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "height",
            label: "Height",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "depth",
            label: "Depth",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "backStapleAllowance",
            label: "Back Staple Allowance",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          { id: "cutWidth", label: "Cut Width", valueType: { type: "number" } },
          {
            id: "cutHeight",
            label: "Cut Height",
            valueType: { type: "number" },
          },
          { id: "area", label: "Area", valueType: { type: "number" } },
        ],
      },
    },
    calculate,
  });
export const run = canvasStretcherFoldoverMaterialBudgetTool.execute;
export default canvasStretcherFoldoverMaterialBudgetTool;
