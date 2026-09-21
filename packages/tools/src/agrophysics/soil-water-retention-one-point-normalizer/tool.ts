import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly waterContent: number;
  readonly residual: number;
  readonly saturated: number;
};
export type Output = { readonly effectiveSaturation: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    waterContent: { type: "number" },
    residual: { type: "number" },
    saturated: { type: "number" },
  },
  required: ["waterContent", "residual", "saturated"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { effectiveSaturation: { type: "number" } },
  required: ["effectiveSaturation"],
} as const;
/** Calculate soil water retention one point normalizer from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { waterContent, residual, saturated } = request;
  const compute = (): Output => {
    H.domain(
      saturated > residual &&
        waterContent >= residual &&
        waterContent <= saturated,
    );
    return {
      effectiveSaturation: (waterContent - residual) / (saturated - residual),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { waterContent: 0.25, residual: 0.1, saturated: 0.4 },
  output: { effectiveSaturation: 0.4999999999999999 },
} satisfies ToolExample<Input, Output>;
export const soilWaterRetentionOnePointNormalizerTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "agrophysics/soil-water-retention-one-point-normalizer",
      title: "Soil Water Retention One Point Normalizer Tool",
      description:
        "Calculate soil water retention one point normalizer from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          waterContent: { type: "number" },
          residual: { type: "number" },
          saturated: { type: "number" },
        },
        required: ["waterContent", "residual", "saturated"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { effectiveSaturation: { type: "number" } },
        required: ["effectiveSaturation"],
      },
      ports: {
        inputs: [
          {
            id: "waterContent",
            label: "Water Content",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "residual",
            label: "Residual",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "saturated",
            label: "Saturated",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "effectiveSaturation",
            label: "Effective Saturation",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = soilWaterRetentionOnePointNormalizerTool.execute;
export default soilWaterRetentionOnePointNormalizerTool;
