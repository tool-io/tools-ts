import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly scanLength: number;
  readonly suppliedScale: number;
  readonly modelLength: number;
};
export type Output = {
  readonly convertedScanLength: number;
  readonly residual: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    scanLength: { type: "number", minimum: 0 },
    suppliedScale: { type: "number", exclusiveMinimum: 0 },
    modelLength: { type: "number", minimum: 0 },
  },
  required: ["scanLength", "suppliedScale", "modelLength"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    convertedScanLength: { type: "number" },
    residual: { type: "number" },
  },
  required: ["convertedScanLength", "residual"],
} as const;
/** Compare supplied scan/model dimensions after explicit scale normalization. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { scanLength, suppliedScale, modelLength } = request;
  const compute = (): Output => {
    H.domain(scanLength >= 0 && modelLength >= 0);
    H.positive(suppliedScale);
    return {
      convertedScanLength: scanLength * suppliedScale,
      residual: scanLength * suppliedScale - modelLength,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { scanLength: 20, suppliedScale: 0.5, modelLength: 9 },
  output: { convertedScanLength: 10, residual: 1 },
} satisfies ToolExample<Input, Output>;
export const modelScanScaleResidualTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "orthodontics/model-scan-scale-residual",
    title: "Model Scan Scale Residual Tool",
    description:
      "Compare supplied scan/model dimensions after explicit scale normalization.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        scanLength: { type: "number", minimum: 0 },
        suppliedScale: { type: "number", exclusiveMinimum: 0 },
        modelLength: { type: "number", minimum: 0 },
      },
      required: ["scanLength", "suppliedScale", "modelLength"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        convertedScanLength: { type: "number" },
        residual: { type: "number" },
      },
      required: ["convertedScanLength", "residual"],
    },
    ports: {
      inputs: [
        {
          id: "scanLength",
          label: "Scan Length",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedScale",
          label: "Supplied Scale",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "modelLength",
          label: "Model Length",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "convertedScanLength",
          label: "Converted Scan Length",
          valueType: { type: "number" },
        },
        { id: "residual", label: "Residual", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = modelScanScaleResidualTool.execute;
export default modelScanScaleResidualTool;
