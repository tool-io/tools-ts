import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly observed: number;
  readonly baselineMean: number;
  readonly baselineSd: number;
  readonly exposure: number;
};
export type Output = {
  readonly residual: number;
  readonly standardizedResidual: number;
  readonly observedRate: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    observed: { type: "number" },
    baselineMean: { type: "number" },
    baselineSd: { type: "number", exclusiveMinimum: 0 },
    exposure: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["observed", "baselineMean", "baselineSd", "exposure"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    residual: { type: "number" },
    standardizedResidual: { type: "number" },
    observedRate: { type: "number" },
  },
  required: ["residual", "standardizedResidual", "observedRate"],
} as const;
/** Research residual relative to supplied baseline statistics, without diagnosis or intervention advice. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { observed, baselineMean, baselineSd, exposure } = request;
  const compute = (): Output => {
    H.positive(baselineSd);
    H.positive(exposure);
    return {
      residual: observed - baselineMean,
      standardizedResidual: (observed - baselineMean) / baselineSd,
      observedRate: observed / exposure,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { observed: 12, baselineMean: 10, baselineSd: 2, exposure: 3 },
  output: { residual: 2, standardizedResidual: 1, observedRate: 4 },
} satisfies ToolExample<Input, Output>;
export const behavioralBaselineOneSessionResidualTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "behavioral-science/behavioral-baseline-one-session-residual",
      title: "Behavioral Baseline One Session Residual Tool",
      description:
        "Research residual relative to supplied baseline statistics, without diagnosis or intervention advice.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          observed: { type: "number" },
          baselineMean: { type: "number" },
          baselineSd: { type: "number", exclusiveMinimum: 0 },
          exposure: { type: "number", exclusiveMinimum: 0 },
        },
        required: ["observed", "baselineMean", "baselineSd", "exposure"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          residual: { type: "number" },
          standardizedResidual: { type: "number" },
          observedRate: { type: "number" },
        },
        required: ["residual", "standardizedResidual", "observedRate"],
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
            id: "baselineMean",
            label: "Baseline Mean",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "baselineSd",
            label: "Baseline Sd",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "exposure",
            label: "Exposure",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          { id: "residual", label: "Residual", valueType: { type: "number" } },
          {
            id: "standardizedResidual",
            label: "Standardized Residual",
            valueType: { type: "number" },
          },
          {
            id: "observedRate",
            label: "Observed Rate",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = behavioralBaselineOneSessionResidualTool.execute;
export default behavioralBaselineOneSessionResidualTool;
