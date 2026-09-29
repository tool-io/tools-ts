import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly tips: number;
  readonly depthPerTip: number;
  readonly includePartialTip: boolean;
};
export type Output = {
  readonly recordedDepth: number;
  readonly lowerDepth: number;
  readonly upperExclusiveDepth: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    tips: { type: "integer", minimum: 0 },
    depthPerTip: { type: "number", exclusiveMinimum: 0 },
    includePartialTip: { type: "boolean" },
  },
  required: ["tips", "depthPerTip", "includePartialTip"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    recordedDepth: { type: "number" },
    lowerDepth: { type: "number" },
    upperExclusiveDepth: { type: "number" },
  },
  required: ["recordedDepth", "lowerDepth", "upperExclusiveDepth"],
} as const;
/** Tipping-bucket accumulated completed tips with an optional unknown residual below one tip; excludes gauge catch and calibration uncertainty. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { tips, depthPerTip, includePartialTip } = request;
  const compute = (): Output => {
    H.integer(tips, 0);
    H.positive(depthPerTip);
    return {
      recordedDepth: tips * depthPerTip,
      lowerDepth: tips * depthPerTip,
      upperExclusiveDepth: (tips + (includePartialTip ? 1 : 0)) * depthPerTip,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { tips: 10, depthPerTip: 0.2, includePartialTip: true },
  output: { recordedDepth: 2, lowerDepth: 2, upperExclusiveDepth: 2.2 },
} satisfies ToolExample<Input, Output>;
export const rainfallTipResolutionUncertaintyBoundTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "hydrometeorology/rainfall-tip-resolution-uncertainty-bound",
      title: "Rainfall Tip Resolution Uncertainty Bound Tool",
      description:
        "Tipping-bucket accumulated completed tips with an optional unknown residual below one tip; excludes gauge catch and calibration uncertainty.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          tips: { type: "integer", minimum: 0 },
          depthPerTip: { type: "number", exclusiveMinimum: 0 },
          includePartialTip: { type: "boolean" },
        },
        required: ["tips", "depthPerTip", "includePartialTip"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          recordedDepth: { type: "number" },
          lowerDepth: { type: "number" },
          upperExclusiveDepth: { type: "number" },
        },
        required: ["recordedDepth", "lowerDepth", "upperExclusiveDepth"],
      },
      ports: {
        inputs: [
          {
            id: "tips",
            label: "Tips",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "depthPerTip",
            label: "Depth Per Tip",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "includePartialTip",
            label: "Include Partial Tip",
            required: true,
            valueType: { type: "boolean" },
          },
        ],
        outputs: [
          {
            id: "recordedDepth",
            label: "Recorded Depth",
            valueType: { type: "number" },
          },
          {
            id: "lowerDepth",
            label: "Lower Depth",
            valueType: { type: "number" },
          },
          {
            id: "upperExclusiveDepth",
            label: "Upper Exclusive Depth",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = rainfallTipResolutionUncertaintyBoundTool.execute;
export default rainfallTipResolutionUncertaintyBoundTool;
