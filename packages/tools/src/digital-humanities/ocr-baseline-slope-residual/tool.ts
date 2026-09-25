import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstX: number;
  readonly firstY: number;
  readonly secondX: number;
  readonly secondY: number;
  readonly suppliedSlope: number;
};
export type Output = { readonly slope: number; readonly residual: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstX: { type: "number" },
    firstY: { type: "number" },
    secondX: { type: "number" },
    secondY: { type: "number" },
    suppliedSlope: { type: "number" },
  },
  required: ["firstX", "firstY", "secondX", "secondY", "suppliedSlope"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { slope: { type: "number" }, residual: { type: "number" } },
  required: ["slope", "residual"],
} as const;
/** Calculate ocr baseline slope residual from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstX, firstY, secondX, secondY, suppliedSlope } = request;
  const compute = (): Output => {
    H.domain(firstX !== secondX);
    return {
      slope: (secondY - firstY) / (secondX - firstX),
      residual: suppliedSlope - (secondY - firstY) / (secondX - firstX),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { firstX: 0, firstY: 2, secondX: 4, secondY: 4, suppliedSlope: 0.6 },
  output: { slope: 0.5, residual: 0.09999999999999998 },
} satisfies ToolExample<Input, Output>;
export const ocrBaselineSlopeResidualTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "digital-humanities/ocr-baseline-slope-residual",
    title: "OCR Baseline Slope Residual Tool",
    description:
      "Calculate ocr baseline slope residual from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstX: { type: "number" },
        firstY: { type: "number" },
        secondX: { type: "number" },
        secondY: { type: "number" },
        suppliedSlope: { type: "number" },
      },
      required: ["firstX", "firstY", "secondX", "secondY", "suppliedSlope"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { slope: { type: "number" }, residual: { type: "number" } },
      required: ["slope", "residual"],
    },
    ports: {
      inputs: [
        {
          id: "firstX",
          label: "First X",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "firstY",
          label: "First Y",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "secondX",
          label: "Second X",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "secondY",
          label: "Second Y",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedSlope",
          label: "Supplied Slope",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "slope", label: "Slope", valueType: { type: "number" } },
        { id: "residual", label: "Residual", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = ocrBaselineSlopeResidualTool.execute;
export default ocrBaselineSlopeResidualTool;
