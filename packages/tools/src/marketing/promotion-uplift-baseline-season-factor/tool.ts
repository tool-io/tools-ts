import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly observed: number;
  readonly baseline: number;
  readonly seasonalFactor: number;
};
export type Output = {
  readonly adjustedBaseline: number;
  readonly incremental: number;
  readonly uplift: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    observed: { type: "number", minimum: 0 },
    baseline: { type: "number", exclusiveMinimum: 0 },
    seasonalFactor: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["observed", "baseline", "seasonalFactor"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    adjustedBaseline: { type: "number" },
    incremental: { type: "number" },
    uplift: { type: "number" },
  },
  required: ["adjustedBaseline", "incremental", "uplift"],
} as const;
/** Calculate promotion uplift baseline season factor from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { observed, baseline, seasonalFactor } = request;
  const compute = (): Output => {
    H.domain(observed >= 0);
    H.positive(baseline);
    H.positive(seasonalFactor);
    return {
      adjustedBaseline: baseline * seasonalFactor,
      incremental: observed - baseline * seasonalFactor,
      uplift:
        (observed - baseline * seasonalFactor) / (baseline * seasonalFactor),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { observed: 150, baseline: 100, seasonalFactor: 1.2 },
  output: { adjustedBaseline: 120, incremental: 30, uplift: 0.25 },
} satisfies ToolExample<Input, Output>;
export const promotionUpliftBaselineSeasonFactorTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "marketing/promotion-uplift-baseline-season-factor",
      title: "Promotion Uplift Baseline Season Factor Tool",
      description:
        "Calculate promotion uplift baseline season factor from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          observed: { type: "number", minimum: 0 },
          baseline: { type: "number", exclusiveMinimum: 0 },
          seasonalFactor: { type: "number", exclusiveMinimum: 0 },
        },
        required: ["observed", "baseline", "seasonalFactor"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          adjustedBaseline: { type: "number" },
          incremental: { type: "number" },
          uplift: { type: "number" },
        },
        required: ["adjustedBaseline", "incremental", "uplift"],
      },
      ports: {
        inputs: [
          {
            id: "observed",
            label: "Observed",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "baseline",
            label: "Baseline",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "seasonalFactor",
            label: "Seasonal Factor",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "adjustedBaseline",
            label: "Adjusted Baseline",
            valueType: { type: "number" },
          },
          {
            id: "incremental",
            label: "Incremental",
            valueType: { type: "number" },
          },
          { id: "uplift", label: "Uplift", valueType: { type: "number" } },
        ],
      },
    },
    calculate,
  });
export const run = promotionUpliftBaselineSeasonFactorTool.execute;
export default promotionUpliftBaselineSeasonFactorTool;
