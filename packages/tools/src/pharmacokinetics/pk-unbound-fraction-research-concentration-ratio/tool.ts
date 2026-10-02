import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly unbound: number;
  readonly total: number;
  readonly recovery: number;
};
export type Output = {
  readonly rawFraction: number;
  readonly recoveryAdjustedFraction: number;
  readonly boundConcentration: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    unbound: { type: "number", minimum: 0 },
    total: { type: "number", exclusiveMinimum: 0 },
    recovery: { type: "number", exclusiveMinimum: 0, maximum: 1 },
  },
  required: ["unbound", "total", "recovery"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    rawFraction: { type: "number" },
    recoveryAdjustedFraction: { type: "number" },
    boundConcentration: { type: "number" },
  },
  required: ["rawFraction", "recoveryAdjustedFraction", "boundConcentration"],
} as const;
/** Calculate pk unbound fraction research concentration ratio from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { unbound, total, recovery } = request;
  const compute = (): Output => {
    H.positive(total);
    H.domain(unbound >= 0 && unbound <= total && recovery > 0 && recovery <= 1);
    return {
      rawFraction: unbound / total,
      recoveryAdjustedFraction: unbound / (total * recovery),
      boundConcentration: total - unbound,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { unbound: 2, total: 10, recovery: 0.8 },
  output: {
    rawFraction: 0.2,
    recoveryAdjustedFraction: 0.25,
    boundConcentration: 8,
  },
} satisfies ToolExample<Input, Output>;
export const pkUnboundFractionResearchConcentrationRatioTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "pharmacokinetics/pk-unbound-fraction-research-concentration-ratio",
      title: "PK Unbound Fraction Research Concentration Ratio Tool",
      description:
        "Calculate pk unbound fraction research concentration ratio from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          unbound: { type: "number", minimum: 0 },
          total: { type: "number", exclusiveMinimum: 0 },
          recovery: { type: "number", exclusiveMinimum: 0, maximum: 1 },
        },
        required: ["unbound", "total", "recovery"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          rawFraction: { type: "number" },
          recoveryAdjustedFraction: { type: "number" },
          boundConcentration: { type: "number" },
        },
        required: [
          "rawFraction",
          "recoveryAdjustedFraction",
          "boundConcentration",
        ],
      },
      ports: {
        inputs: [
          {
            id: "unbound",
            label: "Unbound",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "total",
            label: "Total",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "recovery",
            label: "Recovery",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "rawFraction",
            label: "Raw Fraction",
            valueType: { type: "number" },
          },
          {
            id: "recoveryAdjustedFraction",
            label: "Recovery Adjusted Fraction",
            valueType: { type: "number" },
          },
          {
            id: "boundConcentration",
            label: "Bound Concentration",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = pkUnboundFractionResearchConcentrationRatioTool.execute;
export default pkUnboundFractionResearchConcentrationRatioTool;
