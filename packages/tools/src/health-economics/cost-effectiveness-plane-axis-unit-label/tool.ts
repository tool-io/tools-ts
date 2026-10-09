import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly analysisId: string;
  readonly incrementalEffectUnit: string;
  readonly incrementalCostCurrency: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    analysisId: { type: "string", maxLength: 8192, minLength: 1 },
    incrementalEffectUnit: { type: "string", maxLength: 8192, minLength: 1 },
    incrementalCostCurrency: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["analysisId", "incrementalEffectUnit", "incrementalCostCurrency"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Record explicit cost-effectiveness plane effect and cost units without classifying an intervention or threshold. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { analysisId, incrementalEffectUnit, incrementalCostCurrency } =
    request;
  const compute = (): Output => {
    H.domain(analysisId.length > 0, "analysisId");
    H.domain(incrementalEffectUnit.length > 0, "incrementalEffectUnit");
    H.domain(incrementalCostCurrency.length > 0, "incrementalCostCurrency");
    return {
      token: JSON.stringify([
        analysisId,
        incrementalEffectUnit,
        incrementalCostCurrency,
      ]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    analysisId: "A17",
    incrementalEffectUnit: "QALY",
    incrementalCostCurrency: "USD 2025",
  },
  output: { token: '["A17","QALY","USD 2025"]' },
} satisfies ToolExample<Input, Output>;
export const costEffectivenessPlaneAxisUnitLabelTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "health-economics/cost-effectiveness-plane-axis-unit-label",
      title: "Cost Effectiveness Plane Axis Unit Label Tool",
      description:
        "Record explicit cost-effectiveness plane effect and cost units without classifying an intervention or threshold.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          analysisId: { type: "string", maxLength: 8192, minLength: 1 },
          incrementalEffectUnit: {
            type: "string",
            maxLength: 8192,
            minLength: 1,
          },
          incrementalCostCurrency: {
            type: "string",
            maxLength: 8192,
            minLength: 1,
          },
        },
        required: [
          "analysisId",
          "incrementalEffectUnit",
          "incrementalCostCurrency",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { token: { type: "string", maxLength: 8192 } },
        required: ["token"],
      },
      ports: {
        inputs: [
          {
            id: "analysisId",
            label: "Analysis Id",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "incrementalEffectUnit",
            label: "Incremental Effect Unit",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "incrementalCostCurrency",
            label: "Incremental Cost Currency",
            required: true,
            valueType: { type: "string" },
          },
        ],
        outputs: [
          { id: "token", label: "Token", valueType: { type: "string" } },
        ],
      },
    },
    calculate,
  });
export const run = costEffectivenessPlaneAxisUnitLabelTool.execute;
export default costEffectivenessPlaneAxisUnitLabelTool;
